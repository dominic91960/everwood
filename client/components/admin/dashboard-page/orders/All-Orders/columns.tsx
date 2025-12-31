"use client";
import { RiEyeLine } from "react-icons/ri";
import { FiTrash2 } from "react-icons/fi";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

// Define Order type
export type Order = {
  id: string; // Display ID (e.g., "#ABC123")
  fullId: string; // Full MongoDB _id for API calls
  customer: string;
  productName: string;
  amount: string;
  orderDate: string;
  paymentMethod: string;
  status:
    | "pending-payment"
    | "paid"
    | "processing"
    | "shipped"
    | "completed"
    | "cancelled";
};

// Action Buttons Component
const ActionButtons = ({
  onViewClick,
  onDeleteClick,
}: {
  orderId: string;
  onViewClick: () => void;
  onDeleteClick: () => void;
}) => {
  return (
    <div className="ml-[-25px] flex space-x-0">
      <Button
        onClick={onViewClick}
        className="rounded bg-transparent p-2 hover:bg-transparent focus:bg-transparent"
        aria-label="View order details"
      >
        <RiEyeLine size={20} className="text-white" />
      </Button>
      <Button
        onClick={onDeleteClick}
        className="rounded bg-transparent p-2 hover:bg-transparent focus:bg-transparent"
        aria-label="Delete order"
      >
        <FiTrash2 size={20} className="text-white" />
      </Button>
    </div>
  );
};

// Export the original columns for backward compatibility
export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      return <div className="text-primary font-medium">{row.original.id}</div>;
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      return row.original.customer;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return row.original.amount;
    },
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => {
      return row.original.orderDate;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const paymentMethod = row.original.paymentMethod;

      // Normalize payment method for display
      const getDisplayText = (method: string) => {
        switch (method.toLowerCase()) {
          case "cod":
          case "cash on delivery":
            return "Cash on Delivery";
          case "card-payment":
          case "credit card":
          case "card":
            return "Card Payment";
          case "bank-transfer":
          case "bank transfer":
          case "bank":
            return "Bank Transfer";
          default:
            return method;
        }
      };

      const displayText = getDisplayText(paymentMethod);

      return (
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            displayText === "Card Payment"
              ? "bg-blue-100 text-blue-800"
              : displayText === "Bank Transfer"
                ? "bg-green-100 text-green-800"
                : displayText === "Cash on Delivery"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-purple-100 text-purple-800"
          }`}
        >
          {displayText}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`rounded-full px-2 py-1 text-sm capitalize ${
            status === "completed"
              ? "text-green-600"
              : status === "cancelled"
                ? "text-red-600"
                : "text-yellow-600"
          }`}
        >
          {status.replace("-", " ")}
        </span>
      );
    },
  },
  // {
  //   id: "actions",
  //   header: "Action",
  //   cell: ({ row }) => {
  //     return (
  //       <ActionButtons
  //         orderId={row.original.id}
  //         onViewClick={() => {}}
  //         onDeleteClick={() => {}}
  //       />
  //     );
  //   },
  // },
];
