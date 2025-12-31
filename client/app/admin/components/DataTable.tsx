"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8, // Adjust number of rows per page
  });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    state: { pagination },
    onPaginationChange: setPagination,
  });

  const totalPages = table.getPageCount();
  const currentPage = pagination.pageIndex;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 6) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0); // First page
      if (currentPage > 2) pages.push("...");
      for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1); // Last page
    }
    return pages;
  };

  return (
    <div className="rounded-md border-none">
      {/* Scrollable Table for Mobile */}
      <div className="overflow-auto">
        <Table className="w-full min-w-[600px] border-none table-fixed">
          <TableHeader className="border-none">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="border-none py-2 px-4 text-sm md:text-base whitespace-nowrap truncate">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="border-none">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow key={row.id} className="border-none">
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      className={`border-none py-2 px-4 text-xs md:text-sm truncate ${
                        rowIndex % 2 === 0 ? "bg-[#D5EEE2]" : "bg-white"
                      } ${
                        cellIndex === 0
                          ? "rounded-l-3xl"
                          : cellIndex === row.getVisibleCells().length - 1
                          ? "rounded-r-3xl"
                          : ""
                      }`}
                      title={String(flexRender(cell.column.columnDef.cell, cell.getContext()))} // Tooltip for overflow text
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center border-none">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-end">
        <div className="flex gap-1 md:gap-2">
          <button
            className="rounded-full w-6 h-6 md:w-8 md:h-8 text-xs md:text-sm flex items-center justify-center text-black transition bg-[#F5F5F5] border border-[#EEEEEE] disabled:opacity-50"
            onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
            disabled={currentPage === 0}
          >
            {"<"}
          </button>

          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-gray-500 text-xs md:text-sm">
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`rounded-full w-6 h-6 md:w-8 md:h-8 text-xs md:text-sm flex items-center justify-center transition ${
                  page === currentPage
                    ? "bg-[#2CAB6D] text-white"
                    : "bg-[#EEEEEE] text-black hover:bg-gray-300"
                }`}
                onClick={() => setPagination((prev) => ({ ...prev, pageIndex: page as number }))}>
                {typeof page === "number" ? page + 1 : page}
              </button>
            )
          )}

          <button
            className="rounded-full w-6 h-6 md:w-8 md:h-8 text-xs md:text-sm flex items-center justify-center text-black transition bg-[#F5F5F5] border border-[#EEEEEE] disabled:opacity-50"
            onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            disabled={currentPage === totalPages - 1}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
