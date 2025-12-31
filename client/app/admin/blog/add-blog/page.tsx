"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Thumbnail from "./Thumbnail";
import AddButton from "./AddButton";
import api from "@/lib/api/blog-api";
import { BlogPostPayload, BlogPostCategory, BlogPostTag } from "@/lib/types";

function QuillEditor() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<BlogPostCategory[]>([]);
  const [tags, setTags] = useState<BlogPostTag[]>([]);

  // Form states
  const [blogPostData, setBlogPostData] = useState<BlogPostPayload>({
    title: "",
    description: "",
    thumbnailFile: null,
    content: "",
    category: "",
    tags: [],
    isFeatured: false,
    status: "draft",
  });

  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<any>(null);

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
        ["link", "image", "video"],
        ["clean"],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ direction: "rtl" }],
      ],
    }),
    []
  );

  const quillFormats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code-block",
      "list",
      "indent",
      "link",
      "image",
      "video",
      "color",
      "background",
      "script",
      "font",
      "size",
      "align",
      "direction",
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoryResponse = await api.category.list();
        setCategories(categoryResponse);

        const tagResponse = await api.tag.list();
        setTags(tagResponse);

        const Quill = (await import("quill")).default;
        if (editorRef.current && !quillInstanceRef.current) {
          quillInstanceRef.current = new Quill(editorRef.current, {
            theme: "snow",
            modules: quillModules,
            formats: quillFormats,
          });

          quillInstanceRef.current.on("text-change", () => {
            if (quillInstanceRef.current) {
              const content = quillInstanceRef.current.root.innerHTML;
              setBlogPostData((prev) => ({
                ...prev,
                content,
              }));
            }
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      if (quillInstanceRef.current) quillInstanceRef.current = null;
    };
  }, [quillModules, quillFormats]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (!blogPostData.title.trim()) throw new Error("Blog title is required");
      else if (!blogPostData.description.trim())
        throw new Error("Blog description is required");
      else if (!blogPostData.thumbnailFile)
        throw new Error("Blog thumbnail image is required");
      else if (!blogPostData.content.trim())
        throw new Error("Blog content is required");
      else if (!blogPostData.category)
        throw new Error("Please select a blog category");
      else if (blogPostData.tags.length === 0)
        throw new Error("Please select blog tags");

      const formData = new FormData();
      formData.append("title", blogPostData.title);
      formData.append("description", blogPostData.description);
      formData.append("thumbnail", blogPostData.thumbnailFile);
      formData.append("content", blogPostData.content);
      formData.append("category", blogPostData.category);
      formData.append("tags", JSON.stringify(blogPostData.tags));
      formData.append("isFeatured", blogPostData.isFeatured.toString());
      formData.append("status", blogPostData.status);

      await api.article.create(formData);
      alert("Blog post created successfully!");
      router.push("/admin/blog/all-blogs");
    } catch (error: unknown) {
      console.error("Operation failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while saving content.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <>
        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 p-4 text-red-700">
            Error: {error}
          </div>
        )}

        {!error && loading && (
          <div className="mb-4 rounded border border-blue-400 bg-blue-100 p-4 text-blue-700">
            Loading...
          </div>
        )}

        {!error && !loading && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content Column */}
            <div className="space-y-6 rounded-3xl bg-white shadow-[0px_10px_60px_rgba(226,236,249,0.5)] lg:col-span-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h1 className="mb-8 text-[22px] font-bold text-[#201F31]">
                  Add blog & Update
                </h1>
                <label
                  htmlFor="blog-title"
                  className="mb-4 text-[17px] font-semibold text-[#201F31]"
                >
                  Blog Title
                </label>
                <input
                  id="blog-title"
                  name="blog-title"
                  type="text"
                  value={blogPostData?.title}
                  onChange={(e) =>
                    setBlogPostData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-3xl border border-[#4796A9] p-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="mt-4">
                  <label
                    htmlFor="blog-description"
                    className="mb-4 text-[17px] font-semibold text-[#201F31]"
                  >
                    Blog Description
                  </label>
                  <textarea
                    id="blog-description"
                    name="blog-description"
                    value={blogPostData?.description}
                    onChange={(e) =>
                      setBlogPostData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full rounded-3xl border border-[#4796A9] p-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">
                  Thumbnail Image
                </h2>
                <Thumbnail
                  onChange={(file) =>
                    setBlogPostData((prev) => ({
                      ...prev,
                      thumbnailFile: file,
                    }))
                  }
                />
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">
                  Content
                </h2>
                <div className="overflow-hidden rounded-lg border">
                  <div ref={editorRef} style={{ height: "500px" }} />
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">
                  Publish
                </h2>
                <div className="space-y-6">
                  <select
                    value={blogPostData?.status}
                    onChange={(e) =>
                      setBlogPostData((prev) => ({
                        ...prev,
                        status: e.target.value as "draft" | "published",
                      }))
                    }
                    className="w-full rounded-3xl border border-[#4796A9] bg-transparent p-1 pl-[3%]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>

                  <AddButton
                    identifier="gallery-upload"
                    buttonText={isSubmitting ? "Saving..." : "Add Blog"}
                    className="w-full"
                    onClick={handleSubmit}
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">
                  Category
                </h2>
                {categories.length > 0 && (
                  <select
                    value={blogPostData.category}
                    onChange={(e) =>
                      setBlogPostData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full rounded-3xl border border-[#4796A9] bg-transparent p-1 pl-[3%] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select a tag</option>
                    {categories.map(({ _id, name }) => (
                      <option key={_id} value={_id}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}
                {categories.length === 0 && <div>No categories found</div>}
              </div>

              {/* Tag Dropdown */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">
                  Tags
                </h2>
                {tags.length > 0 && (
                  <select
                    value={blogPostData.tags[0]}
                    onChange={(e) =>
                      setBlogPostData((prev) => ({
                        ...prev,
                        tags: [e.target.value],
                      }))
                    }
                    className="w-full rounded-3xl border border-[#4796A9] bg-transparent p-1 pl-[3%] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select a tag</option>
                    {tags.map(({ _id, name }) => (
                      <option key={_id} value={_id}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}
                {tags.length === 0 && <div>No tags found</div>}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

// Export with SSR disabled to avoid "document is not defined" error
export default dynamic(() => Promise.resolve(QuillEditor), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto flex min-h-screen max-w-7xl items-center justify-center py-8">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading editor...</p>
      </div>
    </div>
  ),
});
