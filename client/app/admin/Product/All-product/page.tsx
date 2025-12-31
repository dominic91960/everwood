"use client";

import { useState, useEffect } from "react";
import { DataTable } from "./DataTable";
import { createColumns } from "./columns";
import { FaSearch } from "react-icons/fa";
import { productApi } from "@/lib/api/productApi";
import { TProduct } from "@/types/product";
import DeleteUserModal from "./DeleteUserModal";

import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

const AllProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: "",
    productType: "simple",
    productName: "",
    isLoading: false,
  });

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productApi.getProducts();
      setProducts(productsData);
      setError(null);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Listen for new product additions (you can use localStorage or a custom event)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Product added event received, refreshing products...");
      fetchProducts();
    };

    // Listen for storage changes (when add product form resets)
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event when product is added
    window.addEventListener("productAdded", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("productAdded", handleStorageChange);
    };
  }, []);

  // Handle delete product
  const handleDeleteProduct = (
    productId: string,
    productType: "simple" | "variable",
    productName: string
  ) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productType,
      productName,
      isLoading: false,
    });
  };

  // Confirm delete product
  const confirmDeleteProduct = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, isLoading: true }));

      if (deleteModal.productType === "simple")
        await productApi.deleteSimpleProduct(deleteModal.productId);
      else await productApi.deleteVariableProduct(deleteModal.productId);

      setProducts((prev) =>
        prev.filter((product) => product._id !== deleteModal.productId)
      );
      setDeleteModal({
        isOpen: false,
        productId: "",
        productType: "simple",
        productName: "",
        isLoading: false,
      });

      toast.success("Product deleted successfully");
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast.error(message);
    } finally {
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      productId: "",
      productType: "simple",
      productName: "",
      isLoading: false,
    });
  };

  // Enhanced filtering logic
  const filteredProducts = products.filter((product) => {
    // Product name search
    const nameMatches =
      searchTerm === "" ||
      (product.title &&
        product.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return nameMatches;
  });

  // Create columns with delete handler
  const columns = createColumns(handleDeleteProduct);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto">
        {/* Student Table with Sorting & Search */}
        <div className="mt-6 rounded-2xl sm:gap-0">
          <div className="grid flex-wrap gap-4 sm:mb-6 sm:items-center sm:justify-between sm:gap-2 md:flex">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-[28px] font-bold sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px]">
                  Products
                </h1>
                <span className="text-[17px] font-semibold sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[20px] mt-2">
                  All products
                </span>
              </div>
            </div>

            <div className=" grid flex-wrap gap-4 sm:flex sm:gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search For..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[220px] rounded-3xl border border-gray-300 bg-white px-3 py-3 pl-10 text-[14px] text-gray-900 placeholder:text-gray-400 md:w-[250px] lg:w-[280px] xl:w-[285px] 2xl:w-[285px]"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-[14px] text-gray-400 xl:-translate-y-1" />
              </div>
            </div>
          </div>

          <div className="mt-2.5 sm:mt-0">
            <DataTable columns={columns} data={filteredProducts} />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteUserModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteProduct}
        userName={deleteModal.productName}
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default AllProductsTable;
