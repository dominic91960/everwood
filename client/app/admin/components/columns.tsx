"use client";
import { RiEyeLine } from "react-icons/ri";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Define Student type
type Student = {
  id: string;
  studentFirstName: string;
  studentLastName: string;
  classApplyingFor: string;
  parentPhone: string;
  parentEmail: string;
  status: "Pending" | "Accepted" | "Declined";
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "studentFirstName",
    header: "Student Name",
    cell: ({ row }) => {
      const firstName = row.original.studentFirstName || "";
      const lastName = row.original.studentLastName || "";
      return `${firstName} ${lastName}`;
    },
  },
  {
    accessorKey: "classApplyingFor",
    header: "Class Type",
    cell: ({ row }) => {
      const classMap: Record<string, string> = {
        "18_24_MONTHS": "Month(18-24)",
        TODDLER: "Toddler(2-3)",
        PRE_K1: "Pre K1(3-4)",
        SECOND_YEAR: "2nd Year(4-5)",
        THIRD_YEAR: "Kindergarten(5-6)",
      };
      return (
        classMap[row.original.classApplyingFor] || row.original.classApplyingFor
      );
    },
  },
  {
    accessorKey: "parentPhone",
    header: "Phone Number",
  },
  {
    accessorKey: "parentEmail",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const [isUpdating, setIsUpdating] = useState(false);
      const currentStatus = row.original.status;

      const statusColor: Record<Student["status"], string> = {
        Pending: "text-[#0F5FC2]",
        Declined: "text-[#D0004B]",
        Accepted: "text-[#00AC4F]",
      };

      const handleStatusChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
      ) => {
        const newStatus = event.target.value as Student["status"];
        // Status change logic can be added here if needed
      };

      return (
        <select
          value={currentStatus}
          onChange={handleStatusChange}
          disabled={isUpdating}
          className={`rounded bg-transparent py-1 text-sm ${statusColor[currentStatus]} px-2`}
        >
          <option value="Pending" className="text-[#0F5FC2]">
            Pending
          </option>
          <option value="Accepted" className="text-[#00AC4F]">
            Accepted
          </option>
          <option value="Declined" className="text-[#D0004B]">
            Declined
          </option>
        </select>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const handleViewClick = () => {
        // View action - can be implemented later
        console.log("View student:", row.original);
      };

      return (
        <div className="ml-[-10px] flex space-x-2">
          <Button
            variant="ghost"
            onClick={handleViewClick}
            className="rounded p-2 hover:bg-gray-100"
            aria-label="View student details"
          >
            <RiEyeLine size={20} className="text-gray-600" />
          </Button>
        </div>
      );
    },
  },
];
