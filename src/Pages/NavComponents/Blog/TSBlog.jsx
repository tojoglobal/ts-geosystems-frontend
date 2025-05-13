import { useState } from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { slugify } from "../../../utils/slugify";
import useDataQuery from "../../../utils/useDataQuery";

const TSBlog = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Fetch data with pagination
  const { data = {}, isLoading } = useDataQuery(
    ["allBlogs", currentPage],
    `/api/blogs?page=${currentPage}&limit=${postsPerPage}`
  );

  // Fetch blog types
  const { data: typeData = {} } = useDataQuery(
    ["blogTypes"],
    "/api/blog-types"
  );

  const { blogs = [], pagination } = data;
  const { blogTypes = [] } = typeData;

  // Create tabs - "All" + blog types
  const tabs = ["All", ...blogTypes.map((type) => type.name)];

  // Parse blog data with safe image handling
  const parsedBlogs = blogs.map((blog) => {
    try {
      const images = JSON.parse(blog.images || "[]");
      const firstImage = images[0];

      return {
        ...blog,
        images,
        tags: JSON.parse(blog.tags || "[]"),
        image: firstImage?.filePath
          ? `${import.meta.env.VITE_OPEN_APIURL}${firstImage.filePath}`
          : "https://via.placeholder.com/400x300?text=No+Image",
        logo: "https://dropinblog.net/34252524/authors/G213PNG.png",
        meta: `${blog.author} • ${new Date(
          blog.created_at
        ).toLocaleDateString()} - 5 minute read`,
        type: blog.blog_type || "Features",
      };
    } catch (error) {
      console.error("Error parsing blog data:", error);
      return {
        ...blog,
        images: [],
        tags: [],
        image: "https://via.placeholder.com/400x300?text=No+Image",
        logo: "https://dropinblog.net/34252524/authors/G213PNG.png",
        meta: `${blog.author} • ${new Date(
          blog.created_at
        ).toLocaleDateString()} - 5 minute read`,
        type: blog.blog_type || "Features",
      };
    }
  });

  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="p-2 md:p-3">
      <div className="flex items-center gap-2 text-[11px]">
        <Link to="/" className="flex items-center gap-1 text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/ts-blog" className="uppercase text-[#e62245]">
          TS Blog
        </Link>
      </div>
      <h1 className="text-[28px] font-light mt-2 text-[#e62245] mb-2">
        TS BLOG
      </h1>
      <section className="mt-12">
        {activeTab !== "All" && (
          <div className="text-center mb-8">
            <h2 className="text-3xl text-[#e62245] font-semibold">
              {activeTab}
            </h2>
          </div>
        )}
        <div className="border-t border-b border-[#d5d8d9] py-3 flex flex-wrap justify-center items-center gap-4 text-[#db7084] font-medium">
          {tabs.map((tab) => (
            <button
              className={`capitalize text-[14px] font-normal hover:text-[#754e55] ${
                activeTab === tab ? "text-[#e62245] underline" : ""
              }`}
              key={tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
          <button className="hover:text-[#754e55]">
            <IoSearch className="w-5" />
          </button>
        </div>
        {isLoading ? (
          <div className="text-center py-10">Loading blogs...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
              {parsedBlogs
                .filter(
                  (post) => activeTab === "All" || post.type === activeTab
                )
                .map((post) => (
                  <Link
                    key={post.id}
                    to={`/ts-blog/${post.id}/${slugify(post.title || "")}`}
                    className="relative border border-[#eaedef] rounded-sm pb-6 hover:shadow-md"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-80 object-cover"
                    />
                    {/* <img
                      src={post.logo}
                      alt="logo"
                      className="absolute bottom-[128px] left-3 w-12 h-12 rounded-full"
                    /> */}
                    <div className="p-2 mt-1 bg-[#fafdff]">
                      <p className="text-xs text-gray-500 text-center mb-1">
                        {post.meta}
                      </p>
                      <h3 className="text-[30px] font-bold text-center capitalize mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-center text-gray-400 uppercase">
                        {post.type}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>

            {/* Pagination Navigation */}
            <div className="flex justify-between items-center mt-8 max-w-6xl mx-auto px-4">
              <div>
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="flex items-center gap-2 text-[#e62245] hover:text-[#754e55]"
                  >
                    <IoIosArrowBack />
                    Previous
                  </button>
                )}
              </div>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div>
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="flex items-center gap-2 text-[#e62245] hover:text-[#754e55]"
                  >
                    Next
                    <IoIosArrowForward />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default TSBlog;
