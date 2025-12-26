"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import api from "@/lib/api/blog-api";
import { BlogPost } from "@/lib/types";

interface BlogProps {
  selectedCategory?: string;
}

function Blog({ selectedCategory = "All" }: BlogProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch only published blogs
        const response = await api.article.list({
          status: "published",
        });
        setBlogs(response);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="margin-y">
        <div className="subtitle pb-8">Our Blogs</div>
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="margin-y">
        <div className="subtitle pb-8">Our Blogs</div>
        <div className="flex justify-center items-center py-12">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Filter blogs based on selected category
  const filteredBlogs = blogs.filter((blog) => {
    if (selectedCategory === "All") {
      return true;
    }
    // Check if blog has the selected tag
    return blog.tags && blog.tags.some((tag) => tag.name === selectedCategory);
  });

  const handleBlogClick = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  if (blogs.length === 0) {
    return (
      <div className="margin-y">
        <div className="subtitle pb-8">Our Blogs</div>
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">No blogs available yet.</p>
        </div>
      </div>
    );
  }

  if (filteredBlogs.length === 0) {
    return (
      <div className="margin-y">
        <div className="subtitle pb-8">Our Blogs</div>
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">No blogs found in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="margin-y">
      <div>
        <div className="subtitle pb-8">Our Blogs</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="rounded-2xl overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
              onClick={() => handleBlogClick(blog)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleBlogClick(blog);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="relative">
                <Image
                  src={blog.thumbnail || "/image/Blog/Blog1.png"}
                  alt={blog.title}
                  className="w-full h-64 object-cover"
                  width={400}
                  height={256}
                />
                {blog.tags && blog.tags.length > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-button px-4 py-2 rounded-full text-sm font-medium">
                      {blog.tags[0].name}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2">
                <h3 className="text-2xl font-bold text-black mb-3">
                  {blog.title}
                </h3>
                <p className="text-gray-500 description mb-2 line-clamp-3">
                  {blog.description}
                </p>
                <p className="text-gray-400 text-sm">
                  {formatDate(blog.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && selectedBlog && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm  flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 " onClick={handleCloseModal} />
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-button bg-gray-100 hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold transition-colors duration-200"
              aria-label="Close blog details"
            >
              ×
            </button>
            <div className="overflow-hidden rounded-t-3xl">
              <Image
                src={selectedBlog.thumbnail || "/image/Blog/Blog1.png"}
                alt={selectedBlog.title}
                className="w-full h-72 object-cover"
                width={800}
                height={288}
              />
            </div>
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-3xl font-bold text-black">
                  {selectedBlog.title}
                </h2>
                <span className="text-gray-400 text-sm">
                  {formatDate(selectedBlog.createdAt)}
                </span>
              </div>
              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedBlog.tags.map(({ _id, name }) => (
                    <span
                      key={_id}
                      className="bg-button text-white px-3 py-1 rounded-full text-xs uppercase tracking-wide"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
              <div
                className="prose max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
