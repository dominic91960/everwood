"use client";
import { RiEyeLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define User type
type Role = {
  id: string;
  
  role: string;
};

export const columns: ColumnDef<Role>[] = [
  
  {
    accessorKey: "role",
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

     

      return (
        <div className="ml-[-15px] flex space-x-0">
          {/* <Button
           
          
            className="rounded p-2 bg-transparent hover:bg-transparent focus:bg-transparent"
            aria-label="View customer details"
          >
            <RiEyeLine size={20} className="text-white" />
          </Button> */}
          <Button
            onClick={() => router.push(`/admin/Customer/All-Customer/edit-customer/${row.original.id}`)}
            className="rounded p-2 bg-transparent hover:bg-transparent focus:bg-transparent"
            aria-label="Edit customer details"
          >
            <FiEdit size={20} className="text-white" />
          </Button>
          <Button
           
          
            className="rounded p-2 bg-transparent hover:bg-transparent focus:bg-transparent"
            aria-label="Delete customer"
          >
            <FiTrash2 size={20} className="text-white" />
          </Button>
        </div>
      );
    },
  },
];
