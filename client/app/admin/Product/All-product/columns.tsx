"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { RiEyeLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { TProduct } from "@/types/product";

// Action Buttons Component
const ActionButtons = ({
  productId,
  productType,
  productName,
  onDelete,
}: {
  productId: string;
  productType: "simple" | "variable";
  productName: string;
  onDelete: (
    productId: string,
    productType: "simple" | "variable",
    productName: string
  ) => void;
}) => {
  const router = useRouter();

  const handleViewClick = () => {
    router.push(`/admin/product/all-product/view-product/${productId}`);
  };

  const handleEditClick = () => {
    router.push(`/admin/product/all-product/edit-product/${productId}`);
  };

  const handleDeleteClick = () => {
    onDelete(productId, productType, productName);
  };

  return (
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
  );
};

export const createColumns = (
  onDelete: (
    productId: string,
    productType: "simple" | "variable",
    productName: string
  ) => void
): ColumnDef<TProduct>[] => [
  {
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => {
      return row.original.title;
    },
  },
  {
    accessorKey: "productImage",
    header: "Product Image",
    cell: ({ row }) => {
      const image =
        row.original.type === "simple"
          ? row.original.productImages[0]
          : row.original.baseImages[0];
      return (
        <Image
          src={image}
          alt={row.original.title}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    },
  },
  {
    accessorKey: "productType",
    header: "Product Type",
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.type}</span>;
    },
  },
  // {
  //   accessorKey: "stock",
  //   header: "Stock",
  //   cell: ({ row }) => {
  //     const stock =
  //       row.original.type === "simple" ? row.original.quantity : "Out of Stock";
  //     return (
  //       <span
  //         className={
  //           stock === "Out of Stock"
  //             ? "text-red-500 font-semibold"
  //             : "text-green-400"
  //         }
  //       >
  //         {stock}
  //       </span>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "price",
  //   header: "Price",
  //   cell: ({ row }) => {
  //     return row.original.price;
  //   },
  // },
  {
    accessorKey: "publish",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "public":
            return "text-green-400 bg-green-400/20";
          case "draft":
            return "text-yellow-400 bg-yellow-400/20";
          case "private":
            return "text-red-400 bg-red-400/20";
          default:
            return "text-blue-400 bg-blue-400/20";
        }
      };

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <ActionButtons
          productId={row.original._id}
          productType={row.original.type}
          productName={row.original.title}
          onDelete={onDelete}
        />
      );
    },
  },
];
