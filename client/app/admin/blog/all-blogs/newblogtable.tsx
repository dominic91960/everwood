"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { columns, Blog, ActionCell } from "./columns";
import { DataTable } from "./DataTable";

const AdminDashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter] = useState("all");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  

  // Enhanced filtering logic
  const filteredBlogs: Blog[] = blogs.filter((blog: Blog) => {
    // Status filter
    const statusMatches =
      statusFilter === "all" || 
      blog.status.toLowerCase() === statusFilter.toLowerCase();

    // Title search
    const titleMatches = 
      searchTerm === "" ||
      (blog.title && blog.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return statusMatches && titleMatches;
  });

  const handleDeleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(blog => blog.id !== id));
  };

  const customColumns = columns.map(col =>
    col.id === "actions"
      ? {
          ...col,
          cell: (props: { row: { original: Blog } }) => (
            <ActionCell
              row={props.row}
              handleDeleteBlog={handleDeleteBlog}
            />
          ),
        }
      : col
  );

  return (
    <div>
      <div className="container mx-auto">
        {/* Blogs Table with Sorting & Search */}
        <div className="mt-6 rounded-2xl bg-white shadow-[0px_10px_60px_rgba(226,236,249,0.5)] p-6 sm:gap-0">
          <div className="grid gap-4 sm:mb-6 sm:items-center sm:justify-between  sm:gap-2 md:flex flex-wrap">
            <div>
              <h1 className="font-bold text-[28px] sm:text-[24px] md:text-[26px] lg:text-[28px] 2xl:text-[22px] ml-[10px]">
                All News
              </h1>
            </div>

            <div className="grid gap-4 sm:flex mr-[140px] sm:gap-4">
              {/* Search Input - searches titles */}
              <div className="relative ">
                <input
                  type="text"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[220px] rounded-2xl bg-[#F9FBFF] p-2 px-3 pl-10 md:w-[250px] lg:w-[280px] xl:w-[285px] 2xl:w-[305px]"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
              </div>

              {/* Status Filter */}
              {/* <div className="relative bg-[#F9FBFF] rounded-2xl mt-[7px]">
                <label className="text-[12px]">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 text-[12px] bg-[#F9FBFF]"
                >
                  <option value="all">All</option>
                  <option value="Published" className="text-[#00AC4F] font-poppins">Published</option>
                  <option value="Draft" className="text-[#0F5FC2] font-poppins">Draft</option>
                  <option value="Archived" className="text-[#D0004B] font-poppins">Archived</option>
                </select>
              </div> */}
            </div>
          </div>

          <div className="mt-[10px] sm:mt-0">
            <DataTable 
              columns={customColumns} 
              data={filteredBlogs} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;