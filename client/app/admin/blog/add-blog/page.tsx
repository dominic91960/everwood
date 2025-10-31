"use client";

import { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";
import Thumbnail from "./Thumbnail";
// import TagInput from "./components/TagInput";
// import CategoryInput from "./components/CategoryInput";
// import SEOSettings from "./components/SEOSettings";
import AddButton from './AddButton';

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

export default function QuillEditor() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [selectedTags] = useState<string[]>([]);
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
    "code-block", "list", "bullet", "indent", "link", "image", "video",
    "color", "background", "script", "font", "size", "align", "direction"
  ];

  // Initialize Quill and handle content changes (client-only)
  useEffect(() => {
    if (editorRef.current && !quillInstanceRef.current) {
      quillInstanceRef.current = new Quill(editorRef.current as unknown as HTMLElement, {
        theme: "snow",
        modules: quillModules as any,
        formats: quillFormats as any,
      });
      quillInstanceRef.current.on("text-change", () => {
        setContent(quillInstanceRef.current!.root.innerHTML);
      });
    }
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let uploadedImageUrl = "";
    
    try {
      
      
      if (!thumbnailUrl) {
        throw new Error('Thumbnail image is required');
      }

      // Client-only: use currently selected local thumbnail URL
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
      
      // Remove undefined fields (for non-events)
      Object.keys(payload).forEach(
        (key) => {
          const typedKey = key as keyof typeof payload;
          if (payload[typedKey] === undefined) {
            delete payload[typedKey];
          }
        }
      );
      
      console.log('Blog payload (client-only):', payload);

      // Client-only: navigate after local validation/upload
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
              <div ref={editorRef} style={{ height: "500px" }} />
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

          {/* <TagInput
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
