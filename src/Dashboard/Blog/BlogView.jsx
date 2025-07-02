import { useParams } from "react-router-dom";
import useDataQuery from "../../utils/useDataQuery";

// Utility for reading time (copy logic from user-facing side if you want)
function getReadingTimeFromHtml(html = "") {
  if (!html) return { text: "0 min read", minutes: 0, words: 0 };
  // Strip HTML tags and count words
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200)); // 200 wpm
  return { text: `${minutes} min read`, minutes, words };
}

const BlogView = () => {
  const { id } = useParams();
  const { data = {} } = useDataQuery(
    ["blogView", id],
    `/api/blogs/${id}`,
    !!id
  );
  const blogData = data?.blog;

  if (!blogData) return <p className="text-center mt-6">Loading blog...</p>;

  // Parse images and tags
  let images = [];
  try {
    images = JSON.parse(blogData.images || "[]").filter((img) => img.show);
  } catch {
    images = [];
  }
  let tags = [];
  try {
    tags = JSON.parse(blogData.tags || "[]");
  } catch {
    tags = [];
  }

  // Reading time
  const readingTime = getReadingTimeFromHtml(blogData.content || "");

  // Dates
  const createdDate = blogData.created_at
    ? new Date(blogData.created_at).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="max-w-3xl mx-auto p-4 text-white">
      <div className="mb-2 text-xs text-gray-400">
        ID: <span className="font-mono">{blogData.id}</span>
        {"  "}• Created: {createdDate}
        {blogData.updated_at &&
          ` • Updated: ${new Date(blogData.updated_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`}
      </div>
      <h1 className="text-3xl font-bold mb-2">{blogData?.title}</h1>
      <div className="text-gray-400 mb-2 flex flex-wrap gap-2 items-center">
        <span>
          By <strong>{blogData?.author}</strong>
        </span>
        <span className="text-xs bg-gray-700 rounded px-2 py-0.5">
          {blogData?.blog_type}
        </span>
        <span className="text-xs">{readingTime.text}</span>
      </div>
      {/* Images */}
      {images.length > 0 && (
        <div
          className={`grid grid-cols-1 ${
            images.length > 1 ? "md:grid-cols-2" : ""
          } gap-3 mb-6`}
        >
          {images.map((image, idx) => (
            <img
              key={idx}
              src={`${import.meta.env.VITE_OPEN_APIURL}${image.filePath}`}
              alt={blogData.title}
              className="rounded-sm w-full aspect-[16/10] object-cover"
            />
          ))}
        </div>
      )}
      {/* Content */}
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: blogData?.content }}
      ></div>
      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="bg-gray-700 px-2 py-1 text-sm rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogView;
