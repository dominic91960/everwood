"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { RiEyeLine, RiDeleteBinLine, RiEditLine } from "react-icons/ri";
import React from "react";
import { useRouter } from "next/navigation";
import DeletePopup from "./DeletePopup";
import Image from "next/image";
import api from "@/lib/api";

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
export const ActionCell = ({ row, handleDeleteBlog }: { row: { original: Blog }, handleDeleteBlog?: (id: string) => Promise<void> }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleViewClick = (id: string) => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("selectedBlog", JSON.stringify(row.original));
      }
    } catch {}
    router.push(`/admin/blog/all-blogs/view-blog/${id}?isEdit=false`);
  };
  const handleEditClick = (id: string) => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("selectedBlog", JSON.stringify(row.original));
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
        await api.content.delete(row.original.id);
      }
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete blog:', error);
      // Optional: surface a toast/alert here
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <div className="flex flex-wrap items-center gap-2 ml-[-10px]">
      <Button variant="outline" onClick={() => handleViewClick(row.original.id)} className="!bg-transparent !border-none hover:!bg-transparent hover:!border-none flex-shrink-0"><RiEyeLine size={20} /></Button>
      <Button variant="outline" onClick={() => handleEditClick(row.original.id)} className="!bg-transparent !border-none hover:!bg-transparent hover:!border-none flex-shrink-0"><RiEditLine size={20} /></Button>
      <Button variant="outline" onClick={handleDeleteClick} className="!bg-transparent !border-none hover:!bg-transparent hover:!border-none flex-shrink-0"><RiDeleteBinLine size={20} /></Button>
      <DeletePopup open={open} onClose={handleClose} onConfirm={handleConfirmDelete} loading={loading} />
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
      <div className="w-16 h-16 rounded-lg overflow-hidden">
        <Image 
          src={row.original.thumbnailImage} 
          alt={row.original.title}
          width={64}
          height={64}
          className="w-full h-full object-cover"
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
          className="line-clamp-3 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: typeof content === 'string' ? content : '' }}
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span>{row.original.status}</span>
    ),
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