import { useState } from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { slugify } from "../../../utils/slugify";
import useDataQuery from "../../../utils/useDataQuery";

const BlogSearch = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allBlogs = {}, isLoading: isSearchLoading } = useDataQuery(
    ["allBlogsSearch", searchQuery],
    `/api/search-blog${
      searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : ""
    }`,
    {
      enabled: isSearchOpen,
    }
  );

  const allAvailableBlogs = allBlogs.blogs || [];

  return (
    <>
      <button
        className="cursor-pointer hover:text-[#754e55]"
        onClick={() => setIsSearchOpen(true)}
      >
        <IoSearch className="w-5" />
      </button>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-start">
          <div className="mt-20 w-full max-w-3xl px-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 relative">
              {/* Input */}
              <input
                type="text"
                placeholder="Search for..."
                className="input input-bordered placeholder:text-xl text-xl w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                className="cursor-pointer z-10 absolute right-6 top-8 text-gray-400 hover:text-red-500"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
              >
                <RxCross2 size={22} />
              </button>
              <div className="mt-6 max-h-[60vh] overflow-y-auto">
                {isSearchLoading ? (
                  <p className="text-center text-gray-500">Loading...</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {allAvailableBlogs.length > 0 ? (
                      allAvailableBlogs.map((blog) => (
                        <Link
                          key={blog.id}
                          to={`/ts-blog/${blog.id}/${slugify(
                            blog.title || ""
                          )}`}
                          className="border-b pb-4"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          <h3 className="text-lg font-semibold text-[#e62245] mb-1">
                            {blog.title}
                          </h3>
                          <p
                            className="text-sm text-gray-600 mb-2"
                            dangerouslySetInnerHTML={{
                              __html: blog.content?.slice(0, 200) + "...",
                            }}
                          />
                        </Link>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">
                        {searchQuery
                          ? `No results found for "${searchQuery}"`
                          : "No blogs available"}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogSearch;
