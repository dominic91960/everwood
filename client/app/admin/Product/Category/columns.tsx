"use client";
import { RiEyeLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

// Define Category type to match components
type Category = {
  id: string;
  categoryName: string;
  description: string;
};

interface ColumnsProps {
  onViewCategory: (category: Category) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
}

export const createColumns = ({ onViewCategory, onEditCategory, onDeleteCategory }: ColumnsProps): ColumnDef<Category>[] => [
  
  {
    accessorKey: "categoryName",
    header: "Category Name",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-white">
          {row.original.categoryName}
        </div>
      );
    },
  },
  
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="text-gray-300 max-w-xs truncate">
          {row.original.description}
        </div>
      );
    },
  },
  
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const handleViewClick = () => {
        onViewCategory(row.original);
      };

      const handleEditClick = () => {
        onEditCategory(row.original);
      };

      const handleDeleteClick = () => {
        onDeleteCategory(row.original);
      };

      return (
        <div className="ml-[-25px] flex space-x-0">
          <Button
            onClick={handleViewClick}
            className="rounded p-2 bg-transparent hover:bg-transparent focus:bg-transparent"
            aria-label="View category details"
          >
            <RiEyeLine size={20} className="text-white" />
          </Button>
          <Button
            onClick={handleEditClick}
            className="rounded p-2 bg-transparent hover:bg-transparent focus:bg-transparent"
            aria-label="Edit category details"
          >
            <FiEdit size={20} className="text-white" />
          </Button>
          <Button
            onClick={handleDeleteClick}
            className="rounded p-2 bg-transparent hover:bg-transparent focus:bg-transparent"
            aria-label="Delete category"
          >
            <FiTrash2 size={20} className="text-white" />
          </Button>
        </div>
      );
    },
  },
];
