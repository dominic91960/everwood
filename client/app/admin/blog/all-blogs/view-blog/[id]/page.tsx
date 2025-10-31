"use client";

import { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Thumbnail from "./Thumbnail";

import AddButton from './AddButton';
import axiosInstance from "@/lib/axios-instance";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const isEdit = searchParams.get("isEdit") === "true";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      "code-block", "list", "bullet", "indent", "link", "image", "video",
      "color", "background", "script", "font", "size", "align", "direction"
    ]
  });

  // Fetch blog data by id
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const id = params?.id as string;
        const response = await axiosInstance.get(`/contents/${id}`);
        const data: BlogData = response.data;
        setTitle(data.title || "");
        setSelectedTags(data.tags || []);
        setSelectedCategories(data.categories || []);
        setContentType(data.type || "BLOG");
        setEventLocation(data.location || "");
        setEventTime(data.time ? new Date(data.time).toISOString().slice(0, 16) : "");
        setContent(data.content || "");
        setThumbnailUrl(data.thumbnail || "");
        setMode(data.mode || "DRAFT");
        setSeoData({
          seoTitle: data.seoTitle || "",
          metaDescription: data.metaDescription || "",
          metaKeywords: data.metaKeywords || [],
        });
        setBlogDate(data.time ? new Date(data.time).toISOString().split('T')[0] : "");
      } catch {
        setError("Failed to load blog data.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();

  }, [params?.id]);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const id = params?.id as string;
      const payload: BlogData & { time?: string } = {
        title,
        content,
        tags: selectedTags,
        categories: selectedCategories,
        type: contentType,
        location: contentType === "EVENTS" ? eventLocation : undefined,
        time: blogDate ? new Date(blogDate).toISOString() : (contentType === "EVENTS" ? eventTime : undefined),
        thumbnail: thumbnailUrl,
        mode,
        seoTitle: seoData.seoTitle,
        metaDescription: seoData.metaDescription,
        metaKeywords: seoData.metaKeywords,
      };
      // Remove undefined fields
      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
      );
      await axiosInstance.put(`/contents/${id}`, cleanedPayload);
      router.push("/admin/blog/all-blogs");
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data &&
        typeof error.response.data.error === 'string' 
        ? error.response.data.error 
        : 'An error occurred while saving content.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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

              {isEdit && (
                <AddButton
                  identifier="gallery-upload"
                  buttonText={isSubmitting ? "Saving..." : "Save Changes"}
                  className="w-full "
                  onClick={handleSubmit}
                />
              )}
            </div>
          </div>

          {/* <CategoryInput
            onCategoriesChange={setSelectedCategories}
            initialCategories={selectedCategories}
          />

          <TagInput
            onTagsChange={setSelectedTags}
            initialTags={selectedTags}
            placeholder="Add tags..."
            isEdit={false}
          /> */}

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
