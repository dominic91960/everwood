"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Thumbnail from "./Thumbnail";
// import TagInput from "./components/TagInput";
// import CategoryInput from "./components/CategoryInput";
// import SEOSettings from "./components/SEOSettings";
import AddButton from './AddButton';
import api from "@/lib/api";

// interface BlogData {
//   title: string;
//   content: string;
//   tags: string[];
//   categories: string[];
//   type: string;
//   location?: string;
//   time?: string;
//   thumbnail?: string;
//   mode: "DRAFT" | "PUBLISHED";
//   seoTitle: string;
//   metaDescription: string;
//   metaKeywords: string[];
// }

function QuillEditor() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories] = useState<string[]>([]);
  const [contentType] = useState("BLOG");
  const [eventLocation, setEventLocation] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [mode, setMode] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [seoData] = useState({
    seoTitle: "",
    metaDescription: "",
    metaKeywords: [] as string[],
  });
  const [blogDate, setBlogDate] = useState("");

  // Quill configuration with full toolbar (direct quill usage)
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<any>(null);

  const quillModules = {
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
  } as const;

  const quillFormats = [
    "header", "bold", "italic", "underline", "strike", "blockquote",
    "code-block", "list", "indent", "link", "image", "video",
    "color", "background", "script", "font", "size", "align", "direction"
  ];

  // Initialize Quill and handle content changes (client-only)
  useEffect(() => {
    setIsMounted(true);
    
    let isCancelled = false;
    
    const initQuill = async () => {
      if (typeof window !== 'undefined' && editorRef.current && !quillInstanceRef.current && !isCancelled) {
        try {
          // Dynamically import Quill only on client side
          const Quill = (await import("quill")).default;
          // CSS is already loaded globally
          
          if (!isCancelled && editorRef.current) {
            quillInstanceRef.current = new Quill(editorRef.current, {
              theme: "snow",
              modules: quillModules as any,
              formats: quillFormats as any,
            });
            
            quillInstanceRef.current.on("text-change", () => {
              if (quillInstanceRef.current) {
                setContent(quillInstanceRef.current.root.innerHTML);
              }
            });
          }
        } catch (error) {
          console.error("Failed to initialize Quill:", error);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initQuill();
    }, 100);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let uploadedImageUrl = "";
    
    try {
      if (!title.trim()) {
        throw new Error('Blog title is required');
      }
      
      if (!content.trim()) {
        throw new Error('Blog content is required');
      }
      
      if (!thumbnailUrl) {
        throw new Error('Thumbnail image is required');
      }

      uploadedImageUrl = thumbnailUrl;

      const payload = {
        title,
        content,
        tags: selectedTags,
        categories: selectedCategories,
        type: contentType,
        location: contentType === "EVENTS" ? eventLocation : undefined,
        time: blogDate ? new Date(blogDate).toISOString() : (contentType === "EVENTS" ? eventTime : undefined),
        thumbnail: uploadedImageUrl,
        mode,
        seoTitle: seoData.seoTitle,
        metaDescription: seoData.metaDescription,
        metaKeywords: seoData.metaKeywords,
      };
      
      // Remove undefined fields (for non-events), but keep empty arrays for tags
      Object.keys(payload).forEach(
        (key) => {
          const typedKey = key as keyof typeof payload;
          if (payload[typedKey] === undefined) {
            delete payload[typedKey];
          }
        }
      );
      
      // Ensure tags is always an array (even if empty)
      if (!payload.tags) {
        payload.tags = [];
      }
      
      console.log('Submitting blog payload:', payload);
      console.log('Selected tags:', selectedTags);

      // Call the API to create the blog post
      const response = await api.content.create(payload);
      console.log('Blog created successfully:', response);
      
      alert('Blog post created successfully!');
      router.push("/admin/blog/all-blogs");
    } catch (error: unknown) {
      console.error("Operation failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving content.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto container max-w-7xl py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="space-y-6 lg:col-span-2 bg-white shadow-[0px_10px_60px_rgba(226,236,249,0.5)] rounded-3xl">
          {contentType === "EVENT" && (
            <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Event Location"
                className="w-full rounded-lg border p-3"
              />
              <input
                type="datetime-local"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>
          )}

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h1 className="mb-8 font-bold text-[22px] text-[#201F31]">Add News & Update</h1>
            <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">News Title</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-3xl border-[#4796A9] border p-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={blogDate}
                onChange={(e) => setBlogDate(e.target.value)}
                className="w-full rounded-3xl border-[#4796A9] border p-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">Thumbnail Image</h2>
            <Thumbnail
              onThumbnailUpload={setThumbnailUrl}
              initialThumbnail={thumbnailUrl}
            />
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">Description</h2>
            <div className="overflow-hidden rounded-lg border">
              {isMounted ? (
                <div ref={editorRef} style={{ height: "500px" }} />
              ) : (
                <div style={{ height: "500px" }} className="flex items-center justify-center text-gray-500">
                  Loading editor...
                </div>
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
                onChange={(e) => setMode(e.target.value as typeof mode)}
                className="w-full rounded-3xl border p-1 bg-transparent border-[#4796A9] pl-[3%]"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>

              <AddButton
                identifier="gallery-upload"
                buttonText={isSubmitting ? "Saving..." : "Add Blog"}
                className="w-full "
                onClick={handleSubmit}
              />
            </div>
          </div>

          {/* <CategoryInput
            onCategoriesChange={setSelectedCategories}
            initialCategories={selectedCategories}
          /> */}

          {/* Tag Dropdown */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-[17px] font-semibold text-[#201F31]">Tags</h2>
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

// Export with SSR disabled to avoid "document is not defined" error
export default dynamic(() => Promise.resolve(QuillEditor), {
  ssr: false,
  loading: () => (
    <div className="mx-auto container max-w-7xl py-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading editor...</p>
      </div>
    </div>
  ),
});
