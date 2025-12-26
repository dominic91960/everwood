"use client";

import { useAuthStore } from "@/store/auth-store";
import { RiEyeLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteCustomerModal from "./DeleteCustomerModal";
import Image from "next/image";

// Define Customer type
type Customer = {
  id: string;
  customerImage: string;
  customerName: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  shippingInfo: any;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "Image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <Image
          src={row.original.customerImage}
          alt={row.original.customerName}
          className="h-10 w-10 rounded-full object-cover"
          width={40}
          height={40}
        />
      );
    },
  },
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }) => {
      return row.original.customerName;
    },
  },
  {
    accessorKey: "Phone",
    header: "Phone",
    cell: ({ row }) => {
      return row.original.phone;
    },
  },
  {
    accessorKey: "Email",
    header: "Email",
    cell: ({ row }) => {
      return row.original.email;
    },
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const { authToken } = useAuthStore();
      const router = useRouter();
      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        try {
          setIsDeleting(true);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/${row.original.id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${authToken}` },
            },
          );

          if (response.ok) {
            // Close modal
            setIsDeleteModalOpen(false);
            // Trigger refresh of customer table
            window.dispatchEvent(new CustomEvent("customerDeleted"));
            // Show success message (you can add a toast notification here)
          } else {
            console.error("Failed to delete customer");
            // Show error message
          }
        } catch (error) {
          console.error("Error deleting customer:", error);
          // Show error message
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <>
          <div className="ml-[-25px] flex space-x-0">
            <Button
              onClick={() =>
                router.push(
                  `/admin/customer/all-customer/view-customer/${row.original.id}`,
                )
              }
              className="rounded bg-transparent p-2 hover:bg-transparent focus:bg-transparent"
              aria-label="View customer details"
            >
              <RiEyeLine size={20} className="text-white" />
            </Button>
            <Button
              onClick={() =>
                router.push(
                  `/admin/customer/all-customer/edit-customer/${row.original.id}`,
                )
              }
              className="rounded bg-transparent p-2 hover:bg-transparent focus:bg-transparent"
              aria-label="Edit customer details"
            >
              <FiEdit size={20} className="text-white" />
            </Button>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              className="rounded bg-transparent p-2 hover:bg-transparent focus:bg-transparent"
              aria-label="Delete customer"
            >
              <FiTrash2 size={20} className="text-white" />
            </Button>
          </div>

          {/* Delete Confirmation Modal */}
          <DeleteCustomerModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            customerName={row.original.customerName}
            isLoading={isDeleting}
          />
        </>
      );
    },
  },
];
