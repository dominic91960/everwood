"use client";
import { RiEyeLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteUserModal from "./DeleteUserModal";

// Define User type
type User = {
  id: string;
  userImage: string;
  userName: string;
  email: string;
  role: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "Image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <img
          src={row.original.userImage}
          alt={row.original.userName}
          className="h-10 w-10 rounded-full object-cover"
        />
      );
    },
  },
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }) => {
      return row.original.userName;
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
    accessorKey: "Role",
    header: "Role",
    cell: ({ row }) => {
      return row.original.role;
    },
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
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
            },
          );

          if (response.ok) {
            // Close modal
            setIsDeleteModalOpen(false);
            // Trigger refresh of user table
            window.dispatchEvent(new CustomEvent("userDeleted"));
            // Show success message (you can add a toast notification here)
          } else {
            console.error("Failed to delete user");
            // Show error message
          }
        } catch (error) {
          console.error("Error deleting user:", error);
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
                router.push(`/admin/user/all-user/view-user/${row.original.id}`)
              }
              className="rounded bg-transparent p-2 hover:bg-transparent focus:bg-transparent"
              aria-label="View user details"
            >
              <RiEyeLine size={20} className="text-white" />
            </Button>
            <Button
              onClick={() =>
                router.push(`/admin/user/all-user/edit-user/${row.original.id}`)
              }
              className="rounded bg-transparent p-2 hover:bg-transparent focus:bg-transparent"
              aria-label="Edit user details"
            >
              <FiEdit size={20} className="text-white" />
            </Button>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              className="rounded bg-transparent p-2 hover:bg-transparent focus:bg-transparent"
              aria-label="Delete user"
            >
              <FiTrash2 size={20} className="text-white" />
            </Button>
          </div>

          {/* Delete Confirmation Modal */}
          <DeleteUserModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            userName={row.original.userName}
            isLoading={isDeleting}
          />
        </>
      );
    },
  },
];
