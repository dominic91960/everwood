"use client";

import { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useSearchParams, useRouter, usePathname, useParams } from "next/navigation";
import api from "@/lib/api";
import Thumbnail from "./Thumbnail";

import AddButton from './AddButton';

interface BlogData {
  id?: string;
  title: string;
  content: string;
  tags: string[];
  categories: string[];
  type: string;
  location?: string;
  time?: string;
  thumbnail?: string;
  mode: "DRAFT" | "PUBLISHED";
  seoTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

export default function QuillEditor() {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("isEdit") === "true";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const contentId = (params as { id?: string })?.id || "";

  // Form states
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [contentType, setContentType] = useState("BLOG");
  const [eventLocation, setEventLocation] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [mode, setMode] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [seoData, setSeoData] = useState({
    seoTitle: "",
    metaDescription: "",
    metaKeywords: [] as string[],
  });
  const [blogDate, setBlogDate] = useState("");

  // Quill configuration with full toolbar
  const { quill, quillRef } = useQuill({
    modules: {
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
        [{ direction: "rtl" }]
      ]
    },
    formats: [
      "header", "bold", "italic", "underline", "strike", "blockquote",
      "code-block", "list", "indent", "link", "image", "video",
      "color", "background", "script", "font", "size", "align", "direction"
    ]
  });

  // Fetch blog data from API and populate from sessionStorage
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!contentId) return;
      
      try {
        // Fetch from API first to get all data including tags
        const blogData = await api.content.getById(contentId);
        setTitle(blogData.title || "");
        setContent(blogData.content || "");
        setThumbnailUrl(blogData.thumbnail || "");
        setSelectedTags(blogData.tags || []);
        setSelectedCategories(blogData.categories || []);
        setMode(blogData.mode || "DRAFT");
        
        if (blogData.time) {
          const date = new Date(blogData.time);
          if (!isNaN(date.getTime())) {
            setBlogDate(date.toISOString().split("T")[0]);
          }
        }
        
        if (blogData.seoTitle) setSeoData(prev => ({ ...prev, seoTitle: blogData.seoTitle }));
        if (blogData.metaDescription) setSeoData(prev => ({ ...prev, metaDescription: blogData.metaDescription }));
        if (blogData.metaKeywords) setSeoData(prev => ({ ...prev, metaKeywords: blogData.metaKeywords }));
      } catch (error) {
        console.error("Failed to fetch blog data:", error);
        // Fallback to sessionStorage if API fails
        try {
          if (typeof window !== "undefined") {
            const raw = window.sessionStorage.getItem("selectedBlog");
            if (raw) {
              const b = JSON.parse(raw) as { title?: string; content?: string; thumbnailImage?: string; date?: string };
              setTitle(b.title || "");
              setContent(b.content || "");
              setThumbnailUrl(b.thumbnailImage || "");
              const rawDate = b.date || "";
              let normalizedDate = "";
              if (rawDate) {
                const yyyyMmDdRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (yyyyMmDdRegex.test(rawDate)) {
                  normalizedDate = rawDate;
                } else {
                  const parsed = new Date(rawDate);
                  if (!isNaN(parsed.getTime())) {
                    normalizedDate = parsed.toISOString().split("T")[0];
                  }
                }
              }
              setBlogDate(normalizedDate);
            }
          }
        } catch {}
      }
    };

    fetchBlogData();
  }, [contentId]);

  // Ensure Quill editor always displays the content
  useEffect(() => {
    if (quill && content !== quill.root.innerHTML) {
      quill.root.innerHTML = content;
    }
  }, [quill, content]);

  // Ensure Quill editor in edit mode always syncs content to state
  useEffect(() => {
    if (isEdit && quill) {
      const handler = () => {
        setContent(quill.root.innerHTML);
      };
      quill.on("text-change", handler);
      return () => {
        quill.off("text-change", handler);
      };
    }
  }, [isEdit, quill]);

  // No backend submit
  const handleUpdate = async () => {
    if (!contentId) return;
    try {
      setIsSubmitting(true);
      const payload: any = {
        title,
        content,
        tags: selectedTags,
        categories: selectedCategories,
        type: contentType,
        location: eventLocation || undefined,
        // Prefer specific event time; else use blog date if provided
        time: eventTime || blogDate || undefined,
        thumbnail: thumbnailUrl || undefined,
        mode,
        seoTitle: seoData.seoTitle || undefined,
        metaDescription: seoData.metaDescription || undefined,
        metaKeywords: seoData.metaKeywords || undefined,
      };
      await api.content.update(String(contentId), payload);
      alert("Blog updated successfully.");
    } catch (e) {
      console.error(e);
      alert("Failed to update blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // No backend loading/error UI

  return (
    <div className="mx-auto container max-w-7xl py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="space-y-6 lg:col-span-2 bg-white shadow-[0px_10px_60px_rgba(226,236,249,0.5)] rounded-3xl">
          {contentType === "EVENTS" && (
            <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <input
                type="text"
                value={eventLocation}
                onChange={isEdit ? (e) => setEventLocation(e.target.value) : undefined}
                placeholder="Event Location"
                className="w-full rounded-lg border p-3"
                disabled={!isEdit}
              />
              <input
                type="datetime-local"
                value={eventTime}
                onChange={isEdit ? (e) => setEventTime(e.target.value) : undefined}
                className="w-full rounded-lg border p-3"
                disabled={!isEdit}
              />
            </div>
          )}

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h1 className="mb-8 font-bold text-[22px] text-[#201F31]">{isEdit ? "Edit News & Update" : "View News"}</h1>
            <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">News Title</h2>
            <input
              type="text"
              value={title}
              onChange={isEdit ? (e) => setTitle(e.target.value) : undefined}
              className="w-full rounded-3xl border-[#4796A9] border p-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              required
              disabled={!isEdit}
            />
            {/* Date input field */}
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={blogDate}
                onChange={isEdit ? (e) => setBlogDate(e.target.value) : undefined}
                className="w-full rounded-3xl border-[#4796A9] border p-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                disabled={!isEdit}
              />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">Thumbnail Image</h2>
            <Thumbnail
              onThumbnailUpload={isEdit ? setThumbnailUrl : () => {}}
              initialThumbnail={thumbnailUrl}
            />
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">Description</h2>
            <div className="overflow-hidden rounded-lg border">
              {isEdit ? (
                <div ref={quillRef} style={{ height: "500px" }} />
              ) : (
                <div
                  style={{ minHeight: 200, padding: 16 }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-[17px] text-[#201F31] font-semibold">Publish</h2>
            <div className="space-y-6">
              <select
                value={mode}
                onChange={isEdit ? (e) => setMode(e.target.value as typeof mode) : undefined}
                className="w-full rounded-3xl border p-1 bg-transparent border-[#4796A9] pl-[3%]"
                disabled={!isEdit}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>

              {/* Update button in edit mode */}
              {isEdit ? (
                <AddButton
                  identifier="update-blog-btn"
                  buttonText={isSubmitting ? "Updating..." : "Update"}
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                />
              ) : (
                <AddButton
                  identifier="edit-blog-btn"
                  buttonText="Edit"
                  onClick={() => router.push(`${pathname}?isEdit=true`)}
                />
              )}
            </div>
          </div>

          {/* <CategoryInput
            onCategoriesChange={setSelectedCategories}
            initialCategories={selectedCategories}
          /> */}

          {/* Tag Display/Edit */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">Tags</h2>
            {isEdit ? (
              <div>
                <select
                  value={selectedTags[0] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setSelectedTags([value]);
                    } else {
                      setSelectedTags([]);
                    }
                  }}
                  className="w-full rounded-3xl border p-1 bg-transparent border-[#4796A9] pl-[3%] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a tag</option>
                  <option value="Living">Living</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Wardrobes">Wardrobes</option>
                </select>
                {selectedTags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                      >
                        {tag}
                        <button
                          onClick={() => setSelectedTags([])}
                          className="ml-2 text-blue-800 hover:text-blue-900 focus:outline-none"
                        >
                          ✖
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {selectedTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-200 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No tags available</p>
                )}
              </div>
            )}
          </div>

          {/* <SEOSettings
            seoTitle={seoData.seoTitle}
            metaDescription={seoData.metaDescription}
            metaKeywords={seoData.metaKeywords}
            onSeoTitleChange={(value) =>
              setSeoData((prev) => ({ ...prev, seoTitle: value }))
            }
            onMetaDescriptionChange={(value) =>
              setSeoData((prev) => ({ ...prev, metaDescription: value }))
            }
            onMetaKeywordsChange={(keywords) =>
              setSeoData((prev) => ({ ...prev, metaKeywords: keywords }))
            }
            isEdit={true}
          /> */}
        </div>
      </div>
    </div>
  );
}
