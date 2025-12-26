"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./all-orders/data-table";
import { Order, columns } from "./all-orders/columns";
import { FaSearch } from "react-icons/fa";
import { RiEyeLine } from "react-icons/ri";
import { FiTrash2 } from "react-icons/fi";
import ViewOrderDetails from "./view-order/ViewOrderDetails";
import DeleteOrderModal from "./all-orders/DeleteOrderModal";
import { orderApi, Order as ApiOrder } from "@/lib/api/orderApi";
import { toast } from "sonner";

// Orders Table with Delete Modal Component
const OrdersTableWithDelete = ({
  data,
  onViewClick,
  onDeleteConfirm,
}: {
  data: Order[];
  onViewClick: (order: Order) => void;
  onDeleteConfirm: (orderId: string) => void;
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDeleteConfirm(orderToDelete);
      setShowDeleteModal(false);
      setOrderToDelete("");
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setOrderToDelete("");
  };

  // Create columns with handlers
  const columnsWithHandlers = columns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }: any) => (
          <div className="ml-[-25px] flex space-x-0">
            <button
              onClick={() => onViewClick(row.original)}
              className="rounded bg-transparent p-2 hover:bg-transparent focus:bg-transparent"
              aria-label="View order details"
            >
              <RiEyeLine size={20} className="text-white" />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original.id)}
              className="rounded bg-transparent p-2 hover:bg-transparent focus:bg-transparent"
              aria-label="Delete order"
            >
              <FiTrash2 size={20} className="text-white" />
            </button>
          </div>
        ),
      };
    }
    return col;
  });

  return (
    <>
      <DataTable columns={columnsWithHandlers} data={data} />
      <DeleteOrderModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        orderId={orderToDelete}
        isLoading={isDeleting}
      />
    </>
  );
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [showViewOrder, setShowViewOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiOrders = await orderApi.getOrders();

      // Transform API orders to match the UI format
      const transformedOrders: Order[] = apiOrders.map(
        (apiOrder: ApiOrder) => ({
          id: `#${apiOrder._id.slice(-6).toUpperCase()}`,
          fullId: apiOrder._id, // Store the full MongoDB _id for API calls
          customer: `${apiOrder.shippingInfo.firstName} ${apiOrder.shippingInfo.lastName}`,
          productName:
            apiOrder.products.length > 0
              ? apiOrder.products[0].product.title
              : "No products",
          amount: `$${apiOrder.grandTotal.toFixed(2)}`,
          orderDate: new Date(apiOrder.createdAt).toLocaleDateString("en-GB"),
          paymentMethod: apiOrder.paymentMethod || "Unknown",
          status: apiOrder.status,
        })
      );

      setOrders(transformedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Enhanced filtering logic
  const filteredOrders = orders.filter((order) => {
    // Search across multiple fields
    const searchLower = searchTerm.toLowerCase();
    const customerMatches = order.customer.toLowerCase().includes(searchLower);
    const productMatches = order.productName
      .toLowerCase()
      .includes(searchLower);
    const orderIdMatches = order.id.toLowerCase().includes(searchLower);
    // Search payment method by both original value and display text
    const getPaymentDisplayText = (method: string) => {
      switch (method.toLowerCase()) {
        case "cod":
          return "cash on delivery";
        case "card-payment":
          return "card payment";
        case "bank-transfer":
          return "bank transfer";
        default:
          return method.toLowerCase();
      }
    };

    const paymentMatches =
      order.paymentMethod.toLowerCase().includes(searchLower) ||
      getPaymentDisplayText(order.paymentMethod).includes(searchLower);

    // Status filter
    const statusMatches = statusFilter === "" || order.status === statusFilter;

    // Payment method filter - match dropdown values with stored original values
    const paymentMethodMatches =
      paymentFilter === "" ||
      (paymentFilter === "card-payment" &&
        order.paymentMethod === "card-payment") ||
      (paymentFilter === "bank-transfer" &&
        order.paymentMethod === "bank-transfer") ||
      (paymentFilter === "cod" && order.paymentMethod === "cod");

    const searchMatches =
      searchTerm === "" ||
      customerMatches ||
      productMatches ||
      orderIdMatches ||
      paymentMatches;

    return searchMatches && statusMatches && paymentMethodMatches;
  });

  // Handle view order click
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowViewOrder(true);
  };

  // Handle close popup
  const handleCloseViewOrder = () => {
    setShowViewOrder(false);
    setSelectedOrder(null);
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId: string) => {
    try {
      // Find the order to get the fullId
      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      await orderApi.deleteOrder(order.fullId);
      toast.success("Order deleted successfully");
      // Refresh the orders list
      await fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete order");
    }
  };

  // Refresh orders function
  const refreshOrders = () => {
    fetchOrders();
  };

  return (
    <div>
      <div className="container mx-auto">
        {/* Orders Table with Sorting & Search */}
        <div className="mt-6 rounded-2xl sm:gap-0">
          <div className="grid flex-wrap gap-4 sm:mb-6 sm:items-center sm:justify-between sm:gap-2 md:flex">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-[28px] font-bold text-[#E5E5E5] sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px]">
                  Orders
                </h1>
                <span className="mt-2 text-[17px] font-semibold text-[#E5E5E5] sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[20px]">
                  All orders
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:flex sm:flex-row sm:gap-4">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-[150px] cursor-pointer appearance-none rounded-3xl border border-[#FFFFFF33]/20 bg-[#0B1739] px-4 py-3 text-[14px] text-white transition-all duration-200 hover:border-[#AEB9E1]/30 focus:border-[#AEB9E1]/50 focus:ring-2 focus:ring-[#AEB9E1]/50 focus:outline-none"
                >
                  <option value="" className="bg-[#0B1739] py-2 text-white">
                    All Status
                  </option>
                  <option
                    value="Delivered"
                    className="bg-[#0B1739] py-2 text-white"
                  >
                    Delivered
                  </option>
                  <option
                    value="Pending"
                    className="bg-[#0B1739] py-2 text-white"
                  >
                    Pending
                  </option>
                  <option
                    value="Cancelled"
                    className="bg-[#0B1739] py-2 text-white"
                  >
                    Cancelled
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-[#AEB9E1] transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Payment Filter */}
              <div className="relative">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-[180px] cursor-pointer appearance-none rounded-3xl border border-[#FFFFFF33]/20 bg-[#0B1739] px-4 py-3 text-[14px] text-white transition-all duration-200 hover:border-[#AEB9E1]/30 focus:border-[#AEB9E1]/50 focus:ring-2 focus:ring-[#AEB9E1]/50 focus:outline-none"
                >
                  <option value="" className="bg-[#0B1739] py-2 text-white">
                    All Payments
                  </option>
                  <option
                    value="card-payment"
                    className="bg-[#0B1739] py-2 text-white"
                  >
                    Card Payment
                  </option>
                  <option
                    value="bank-transfer"
                    className="bg-[#0B1739] py-2 text-white"
                  >
                    Bank Transfer
                  </option>
                  <option value="cod" className="bg-[#0B1739] py-2 text-white">
                    Cash on Delivery
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-[#AEB9E1] transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search For..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[220px] rounded-3xl border-[#FFFFFF33]/20 bg-[#0B1739] px-3 py-3 pl-10 text-[14px] text-white md:w-[250px] lg:w-[280px] xl:w-[285px] 2xl:w-[285px]"
                />
                <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-[14px] text-[#AEB9E1] xl:-translate-y-1" />
              </div>
            </div>
          </div>

          <div className="mt-[10px] sm:mt-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-white">Loading orders...</div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 text-red-500">{error}</div>
                <button
                  onClick={refreshOrders}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : (
              <OrdersTableWithDelete
                data={filteredOrders}
                onViewClick={handleViewOrder}
                onDeleteConfirm={handleDeleteOrder}
              />
            )}
          </div>
        </div>
      </div>

      {/* View Order Details Popup */}
      {showViewOrder && selectedOrder && (
        <ViewOrderDetails
          onClose={handleCloseViewOrder}
          order={selectedOrder}
          onSuccess={refreshOrders}
        />
      )}
    </div>
  );
}
