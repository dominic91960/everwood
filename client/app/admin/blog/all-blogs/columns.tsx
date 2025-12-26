"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { RiEyeLine, RiDeleteBinLine, RiEditLine } from "react-icons/ri";
import React from "react";
import { useRouter } from "next/navigation";
import DeletePopup from "./DeletePopup";
import Image from "next/image";
import api from "@/lib/api/blog-api";
import { BlogPost } from "@/lib/types";

// ActionCell component
export const ActionCell = ({
  row,
  handleDeleteBlog,
}: {
  row: { original: BlogPost };
  handleDeleteBlog?: (id: string) => Promise<void>;
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleViewClick = (id: string) => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "selectedBlog",
          JSON.stringify(row.original)
        );
      }
    } catch {}
    router.push(`/admin/blog/all-blogs/view-blog/${id}?isEdit=false`);
  };
  const handleEditClick = (id: string) => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "selectedBlog",
          JSON.stringify(row.original)
        );
      }
    } catch {}
    router.push(`/admin/blog/all-blogs/view-blog/${id}?isEdit=true`);
  };
  const handleDeleteClick = () => setOpen(true);

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      if (handleDeleteBlog) {
        await handleDeleteBlog(row.original._id);
      } else {
        await api.article.delete(row.original._id);
      }
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete blog:", error);
      // Optional: surface a toast/alert here
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <div className="-ml-2.5 flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        onClick={() => handleViewClick(row.original._id)}
        className="shrink-0 border-none! bg-transparent! hover:border-none! hover:bg-transparent!"
      >
        <RiEyeLine size={20} />
      </Button>
      <Button
        variant="outline"
        onClick={() => handleEditClick(row.original._id)}
        className="shrink-0 border-none! bg-transparent! hover:border-none! hover:bg-transparent!"
      >
        <RiEditLine size={20} />
      </Button>
      <Button
        variant="outline"
        onClick={handleDeleteClick}
        className="shrink-0 border-none! bg-transparent! hover:border-none! hover:bg-transparent!"
      >
        <RiDeleteBinLine size={20} />
      </Button>
      <DeletePopup
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
};

// Define table columns
export const columns: ColumnDef<BlogPost>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "thumbnailImage",
    header: "Thumbnail Image",
    cell: ({ row }) => (
      <Image
        src={row.original.thumbnail}
        alt=""
        width={64}
        height={64}
        className="h-16 w-16 object-contain rounded-lg border border-black/20"
      />
    ),
  },
  {
    accessorKey: "content",
    header: "Description",
    cell: ({ row }) => <span>{row.original.description}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span>{row.original.status}</span>,
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
