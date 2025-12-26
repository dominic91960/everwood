"use client";
import { RiEyeLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditCouponModal from "./EditCouponModal";
import VeiwCouponModal from "./VeiwCouponModal";
import DeleteUserModal from "./DeleteUserModal";
import { couponApi } from "@/lib/api/couponApi";

// Define Product type
type Product = {
  id: string;
  discount: string;
  couponTitle: string;
  code: string;
  CouponType: string;
  startDate: string;
  endDate: string;
  status: string;
  value: number;
  originalCoupon?: any;
};

// Action Buttons Component
const ActionButtons = ({ 
  productId, 
  onCouponUpdated,
  couponTitle
}: { 
  productId: string;
  onCouponUpdated?: () => void;
  couponTitle?: string;
}) => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleViewClick = () => {
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  const handleCouponUpdated = () => {
    onCouponUpdated?.();
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await couponApi.deleteCoupon(productId);
      onCouponUpdated?.();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting coupon:', err);
      alert('Failed to delete coupon');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="ml-[-25px] flex space-x-0">
        <Button
          onClick={handleViewClick}
          className="rounded p-2 bg-transparent hover:bg-transparent focus:bg-transparent"
          aria-label="View product details"
        >
          <RiEyeLine size={20} className="text-white" />
        </Button>
        <Button
          onClick={handleEditClick}
          className="rounded p-2 bg-transparent hover:bg-transparent focus:bg-transparent"
          aria-label="Edit product details"
        >
          <FiEdit size={20} className="text-white" />
        </Button>
        <Button
          onClick={handleDeleteClick}
          className="rounded p-2 bg-transparent hover:bg-transparent focus:bg-transparent"
          aria-label="Delete product"
        >
          <FiTrash2 size={20} className="text-white" />
        </Button>
      </div>
      
      {/* Edit Coupon Modal */}
      <EditCouponModal 
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal}
        couponId={productId}
        onCouponUpdated={handleCouponUpdated}
      />

      {/* View Coupon Modal */}
      <VeiwCouponModal 
        isOpen={isViewModalOpen} 
        onClose={handleCloseViewModal}
        couponId={productId}
      />

      {/* Delete Coupon Modal */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={couponTitle || "this coupon"}
        itemType="coupon"
        isLoading={isDeleting}
      />
    </>
  );
};

export const createColumns = (onCouponUpdated?: () => void): ColumnDef<Product>[] => [
  {
    accessorKey: "Discount",
    header: "Discount",
    cell: ({ row }) => {
      return row.original.discount;
    },
  },
  {
    accessorKey: "Coupon title",
    header: "Coupon title",
    cell: ({ row }) => {
      const couponTitle = row.original.couponTitle;
      return (
        <span className={couponTitle === "Out of stock" ? "text-red-500" : ""}>
          {couponTitle}
        </span>
      );
    },
  },
  {
    accessorKey: "code",
    header: "code",
    cell: ({ row }) => {
      return row.original.code;
    },
  },
  {
    accessorKey: "Coupon Type",
    header: "Coupon Type",
    cell: ({ row }) => {
      return row.original.CouponType;
    },
  },
  {
    accessorKey: "Start Date",
    header: "Start Date",
    cell: ({ row }) => {
      return row.original.startDate;
    },
  },
  {
    accessorKey: "End Date",
    header: "End Date",
    cell: ({ row }) => {
      return row.original.endDate;
    },
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isActive = status === "Active";
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isActive 
            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return <ActionButtons 
        productId={row.original.id} 
        onCouponUpdated={onCouponUpdated}
        couponTitle={row.original.couponTitle}
      />;
    },
  },
];
