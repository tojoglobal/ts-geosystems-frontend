import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Facebook, Twitter, Linkedin, Mail, MessageSquare } from "lucide-react";
import RelatedArticles from "./RelatedArticles";

const tabs = ["Back to Blog", "Features", "Tips", "Announcements", "Events"];
const BlogDetails = () => {
  const [activeTab, setActiveTab] = useState("All");
  const iconClass =
    "w-9 h-9 flex items-center justify-center rounded-md text-white";
  const blogUrl = encodeURIComponent(
    "https://yourwebsite.com/blog/your-dynamic-slug"
  );
  const blogTitle = encodeURIComponent("Check out this amazing blog from G2!");
  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/" className="flex items-center gap-1 text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/support" className="text-[#e62245]">
          G2 Blog
        </Link>
      </div>
      <h1 className="text-3xl mt-2 text-[#e62245] mb-2">G2 BLOG</h1>
      <div className="border-t border-b py-4 mt-12 flex justify-center items-center gap-6 text-[#db7084] font-medium">
        {tabs.map((tab) => (
          <button
            className={`hover:text-[#754e55] ${
              activeTab === tab ? "text-[#e62245] underline" : ""
            }`}
            key={tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <button className="hover:text-[#754e55]">
          <IoSearch className="w-5" />
        </button>
      </div>
      <section className="max-w-2xl mx-auto my-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <img
            src="https://dropinblog.net/34252524/files/featured/geo-business-2025.jpg"
            alt="GEO Business 2025"
            className="rounded-md"
          />
          <img
            src="https://dropinblog.net/34252524/files/featured/geo-business-2025.jpg"
            alt="GEO Business 2025"
            className="rounded-md"
          />
          <img
            src="https://dropinblog.net/34252524/files/featured/geo-business-2025.jpg"
            alt="GEO Business 2025"
            className="rounded-md"
          />
          <img
            src="https://dropinblog.net/34252524/files/featured/geo-business-2025.jpg"
            alt="GEO Business 2025"
            className="rounded-md"
          />
        </div>
        <h2 className="text-2xl font-bold text-[#e62245]">
          See us at GEO Business 2025 on stand G124
        </h2>
        <div className="flex items-center gap-4 my-4">
          <img
            src="https://dropinblog.net/34252524/files/featured/leica-gs18-captivate-firmware.jpg"
            alt=""
            className="w-10 rounded-full"
          />
          <div className="space-y-1">
            <p className="text-[#e69ba9]">G2 Survey Events</p>
            <p className="text-sm text-gray-500">
              Apr 28th, 2025 · 1 minute read
            </p>
          </div>
        </div>
        <div className="my-6 shadow-xl">
          <AudioPlayer
            src="your-audio-file-url.mp3"
            autoPlay={false}
            controls
          />
        </div>
        <div className="space-y-3 text-sm">
          <p>
            We're excited to exhibit at GEO Business when it returns to ExCeL
            London on 4–5 June 2025.
          </p>
          <p>
            The UK's largest geospatial event features two days jam-packed with
            inspiring content. Including an expo of the latest solutions, 150+
            speakers across 7 stages, 70 hours of CPD accredited education,
            networking drinks, live demos of the latest tech, and much more!
          </p>
          <p>
            Join us there, say Hi and discover the latest developments in
            geospatial, get inspired and connect with others in the profession.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          <img
            src="https://dropinblog.net/34252524/files/featured/geo-business-2025.jpg"
            alt="GEO Business 2025"
            className="rounded-md"
          />
          <img
            src="https://dropinblog.net/34252524/files/featured/geo-business-2025.jpg"
            alt="GEO Business 2025"
            className="rounded-md"
          />
        </div>
        <div className="flex flex-wrap gap-1 underline text-sm text-[#e62245]">
          <span>#GeoBusiness</span>
          <span>#GeospatialTech</span>
          <span>#SeeYouThere</span>
          <span>#ExCeLLondon</span>
          <span>#MappingTheFuture</span>
        </div>
        <div className="flex gap-2 my-6">
          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${blogUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconClass} bg-[#3b5998]`}
          >
            <Facebook size={16} />
          </a>

          {/* Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?url=${blogUrl}&text=${blogTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconClass} bg-[#000000]`}
          >
            <Twitter size={16} />
          </a>

          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${blogUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconClass} bg-[#0077b5]`}
          >
            <Linkedin size={16} />
          </a>

          {/* Reddit */}
          <a
            href={`https://www.reddit.com/submit?url=${blogUrl}&title=${blogTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconClass} bg-[#ff4500]`}
          >
            <MessageSquare size={16} />
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${blogTitle}%20${blogUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconClass} bg-[#25d366]`}
          >
            <MessageSquare size={16} />
          </a>

          {/* Email */}
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
        <RelatedArticles />
      </div>
    </div>
  );
};

export default BlogDetails;
