"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { RiEyeLine, RiDeleteBinLine, RiEditLine } from "react-icons/ri";
import React from "react";
import { useRouter } from "next/navigation";
import DeletePopup from "./DeletePopup";
import Image from "next/image";
import api from "@/lib/api/blog-api";

export type Blog = {
  id: string;
  title: string;
  thumbnailImage: string;
  startTime: string;
  date: string;
  status: "Published" | "Draft" | "Archived";
  content: string;
};

// ActionCell component
export const ActionCell = ({
  row,
  handleDeleteBlog,
}: {
  row: { original: Blog };
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
          JSON.stringify(row.original),
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
          JSON.stringify(row.original),
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
        await handleDeleteBlog(row.original.id);
      } else {
        await api.article.delete(row.original.id);
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
    <div className="ml-[-10px] flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        onClick={() => handleViewClick(row.original.id)}
        className="flex-shrink-0 !border-none !bg-transparent hover:!border-none hover:!bg-transparent"
      >
        <RiEyeLine size={20} />
      </Button>
      <Button
        variant="outline"
        onClick={() => handleEditClick(row.original.id)}
        className="flex-shrink-0 !border-none !bg-transparent hover:!border-none hover:!bg-transparent"
      >
        <RiEditLine size={20} />
      </Button>
      <Button
        variant="outline"
        onClick={handleDeleteClick}
        className="flex-shrink-0 !border-none !bg-transparent hover:!border-none hover:!bg-transparent"
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
export const columns: ColumnDef<Blog>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "thumbnailImage",
    header: "Thumbnail Image",
    cell: ({ row }) => (
      <div className="h-16 w-16 overflow-hidden rounded-lg">
        <Image
          src={row.original.thumbnailImage}
          alt={row.original.title}
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "content",
    header: "Description",
    cell: ({ row }) => {
      const content = row.original.content;
      return (
        <div
          className="prose line-clamp-3 max-w-none"
          dangerouslySetInnerHTML={{
            __html: typeof content === "string" ? content : "",
          }}
        />
      );
    },
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
