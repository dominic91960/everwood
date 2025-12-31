"use client";

import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { columns, ActionCell } from "./columns";
import { DataTable } from "./DataTable";
import api from "@/lib/api/blog-api";
import { BlogPost } from "@/lib/types";

const AdminDashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter] = useState("all");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.article.list();
        setBlogs(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Enhanced filtering logic
  const filteredBlogs: BlogPost[] = blogs.filter((blog: BlogPost) => {
    // Status filter
    const statusMatches =
      statusFilter === "all" ||
      blog.status.toLowerCase() === statusFilter.toLowerCase();

    // Title search
    const titleMatches =
      searchTerm === "" ||
      (blog.title &&
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return statusMatches && titleMatches;
  });

  const handleDeleteBlog = async (id: string) => {
    try {
      await api.article.delete(id);
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog. Please try again.");
    }
  };

  const customColumns = columns.map((col) =>
    col.id === "actions"
      ? {
          ...col,
          cell: (props: { row: { original: BlogPost } }) => (
            <ActionCell row={props.row} handleDeleteBlog={handleDeleteBlog} />
          ),
        }
      : col
  );

  return (
    <div>
      <div className="container mx-auto">
        {/* Blogs Table with Sorting & Search */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-[0px_10px_60px_rgba(226,236,249,0.5)] sm:gap-0">
          {error && (
            <div className="mb-4 rounded border border-red-400 bg-red-100 p-4 text-red-700">
              Error: {error}
            </div>
          )}

          <div className="grid flex-wrap gap-4 sm:mb-6 sm:items-center sm:justify-between sm:gap-2 md:flex">
            <div>
              <h1 className="ml-2.5 text-[28px] font-bold sm:text-[24px] md:text-[26px] lg:text-[28px] 2xl:text-[22px]">
                All Blogs {loading ? "(Loading...)" : `(${blogs.length})`}
              </h1>
            </div>

            <div className="mr-[140px] grid gap-4 sm:flex sm:gap-4">
              {/* Search Input - searches titles */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[220px] rounded-2xl bg-[#F9FBFF] p-2 px-3 pl-10 md:w-[250px] lg:w-[280px] xl:w-[285px] 2xl:w-[305px]"
                />
                <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-black" />
              </div>
            </div>
          </div>

          <div className="mt-2.5 sm:mt-0">
            <DataTable columns={customColumns} data={filteredBlogs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
