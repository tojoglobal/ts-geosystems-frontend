import { IoSearch } from "react-icons/io5";
import { Link, useParams, useNavigate } from "react-router-dom";
// import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Facebook, Twitter, Linkedin, Mail, MessageSquare } from "lucide-react";
import RelatedArticles from "./RelatedArticles";
import BlogSearch from "./BlogSearch";
import useDataQuery from "../../../utils/useDataQuery";
import BlogContentWithImages from "./BlogContentWithImages";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: blogData = {}, isLoading } = useDataQuery(
    ["singleBlog", id],
    `/api/blogs/${id}`,
    !!id
  );

  const { data: typeData = {} } = useDataQuery(
    ["blogTypes"],
    "/api/blog-types"
  );

  const blog = blogData.blog || {};
  const blogTypes = typeData.blogTypes || [];

  // Parse images and tags
  const images = JSON.parse(blog.images || "[]").filter((img) => img.show);
  const tags = JSON.parse(blog.tags || "[]");

  // Create tabs - "Back to Blog" + all blog types
  const tabs = ["Back to Blog", ...blogTypes.map((type) => type.name)];

  const iconClass =
    "w-9 h-9 flex items-center justify-center rounded-md text-white";

  // Dynamic URL and title for sharing
  const blogUrl = encodeURIComponent(window.location.href);
  const blogTitle = encodeURIComponent(
    blog.title || "Check out this amazing blog"
  );

  // Split images for display
  const topImages = images.slice(0, 2);
  const middleImages = images.slice(2, 4);

  const handleTabClick = (tab) => {
    if (tab === "Back to Blog") {
      navigate("/ts-blog");
    } else {
      // Navigate to filtered blog list view
      navigate(`/ts-blog?type=${encodeURIComponent(tab)}`);
    }
  };

  if (isLoading) return <div className="p-3 text-center">Loading blog...</div>;
  if (!blog.id) return <div className="p-3 text-center">Blog not found</div>;

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/" className="flex items-center gap-1 text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/ts-blog" className="text-[#e62245]">
          TS Blog
        </Link>
      </div>
      <h1 className="text-3xl mt-2 text-[#e62245] mb-2">TS BLOG</h1>
      <div className="border-t border-b py-4 mt-12 flex flex-wrap md:flex-row justify-center items-center gap-3 md:gap-6 text-[#db7084] font-medium">
        {tabs.map((tab) => (
          <button
            className={`capitalize cursor-pointer text-[14px] font-normal hover:text-[#754e55] ${
              tab === blog.blog_type ? "text-[#e62245] underline" : ""
            }`}
            key={tab}
            onClick={() => handleTabClick(tab)}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
        <BlogSearch />
      </div>
      <section className="max-w-2xl mx-auto my-10">
        {/* Top Images */}
        {topImages.length > 0 && (
          <div
            className={`grid grid-cols-1 ${
              topImages.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2"
            } gap-3 mb-8`}
          >
            {topImages.map((image, index) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_OPEN_APIURL}${image.filePath}`}
                alt={blog.title}
                className="rounded-sm w-full md:w-[350px] h-[200px]"
              />
            ))}
          </div>
        )}
        <h2 className="text-2xl font-bold text-[#e62245] capitalize">
          {blog.title}
        </h2>
        <div className="space-y-1 my-2">
          <p>
            Author:{" "}
            <span className="text-[#e0516c] capitalize">{blog.author}</span>
          </p>
          <p className="text-sm text-gray-500">
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · 5 minute read
          </p>
        </div>
        {/* <div className="my-6 shadow-xl">
          <AudioPlayer
            src="your-audio-file-url.mp3"
            autoPlay={false}
            controls
          />
        </div> */}
        <BlogContentWithImages blog={blog} middleImages={middleImages} />
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 underline text-sm text-[#e62245]">
            {tags.map((tag, index) => (
              <span key={index}>#{tag}</span>
            ))}
          </div>
        )}
        {/* Social Sharing */}
        <div className="flex gap-2 my-6">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${blogUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconClass} bg-[#3b5998]`}
          >
            <Facebook size={16} />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${blogUrl}&text=${blogTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconClass} bg-[#000000]`}
          >
            <Twitter size={16} />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${blogUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconClass} bg-[#0077b5]`}
          >
            <Linkedin size={16} />
          </a>
          <a
            href={`https://www.reddit.com/submit?url=${blogUrl}&title=${blogTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconClass} bg-[#ff4500]`}
          >
            <MessageSquare size={16} />
          </a>
          <a
            href={`https://wa.me/?text=${blogTitle}%20${blogUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconClass} bg-[#25d366]`}
          >
            <MessageSquare size={16} />
          </a>

          <a
            href={`mailto:?subject=${blogTitle}&body=${blogUrl}`}
            className={`${iconClass} bg-[#7b7b7b]`}
          >
            <Mail size={16} />
          </a>
        </div>
        <Link
          to="/ts-blog"
          className="text-sm text-[#e62245] hover:underline block mt-4"
        >
          « Back to Blog
        </Link>
      </section>
      <div className="my-12">
        <RelatedArticles
          currentBlogType={blog.blog_type}
          currentBlogId={blog.id}
        />
      </div>
    </div>
  );
};

export default BlogDetails;
