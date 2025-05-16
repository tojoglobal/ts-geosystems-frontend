import { RxCross2 } from "react-icons/rx";
import useDataQuery from "../../../utils/useDataQuery";
import { Link } from "react-router-dom";
import { slugify } from "../../../utils/slugify";

const SearchBlog = ({
  isSearchOpen,
  searchQuery,
  setSearchQuery,
  setIsSearchOpen,
}) => {
  const { data = {}, isLoading } = useDataQuery(["allBlogs"], "/api/blogs");
  const blogs = data.blogs || [];

  // Filter blogs based on search query
  const filteredBlogs = blogs
    .slice(0, 5)
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div>
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
              />
              <button
                className="cursor-pointer z-10 absolute right-6 top-8 text-gray-400 hover:text-red-500"
                onClick={() => setIsSearchOpen(false)}
              >
                <RxCross2 size={22} />
              </button>
              <div className="mt-6 max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                  <p className="text-center text-gray-500">Loading...</p>
                ) : filteredBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredBlogs.map((blog) => (
                      <Link
                        key={blog.id}
                        to={`/ts-blog/${blog.id}/${slugify(blog.title || "")}`}
                        className="border-b pb-4"
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
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    No results found for "<strong>{searchQuery}</strong>"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBlog;
