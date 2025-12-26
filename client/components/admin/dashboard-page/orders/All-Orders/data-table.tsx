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
      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages - 2, currentPage + 1);
        i++
      ) {
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
        <Table className="w-full min-w-[800px] table-fixed overflow-hidden rounded-[2em] border-none">
          <TableHeader className="bg-primary/20 [&:hover]:bg-primary/20 border-none [&_*]:hover:bg-transparent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header: any, index: number) => (
                  <TableHead
                    key={header.id}
                    className={`truncate border-none px-4 py-6 text-sm font-medium whitespace-nowrap text-white md:text-base`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="border-none">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  className="border-none hover:bg-transparent"
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      className={`truncate border-none px-4 py-4 text-xs text-white md:text-sm ${
                        rowIndex % 2 === 0 ? "bg-[#081028]/20" : "bg-primary/20"
                      }`}
                      title={String(
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        ),
                      )} // Tooltip for overflow text
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="border-none text-center"
                >
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
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#EEEEEE] bg-[#31406D] text-xs text-white transition disabled:opacity-50 md:h-8 md:w-8 md:text-sm"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex - 1,
              }))
            }
            disabled={currentPage === 0}
          >
            {"<"}
          </button>

          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={index}
                className="flex h-6 w-6 items-center justify-center text-xs text-gray-500 md:h-8 md:w-8 md:text-sm"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition md:h-8 md:w-8 md:text-sm ${
                  page === currentPage
                    ? "bg-[#FFFFFF] text-black"
                    : "bg-[#0B1739] text-white"
                }`}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: page as number,
                  }))
                }
              >
                {typeof page === "number" ? page + 1 : page}
              </button>
            ),
          )}

          <button
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#EEEEEE] bg-[#31406D] text-xs text-white transition disabled:opacity-50 md:h-8 md:w-8 md:text-sm"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
              }))
            }
            disabled={currentPage === totalPages - 1}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
