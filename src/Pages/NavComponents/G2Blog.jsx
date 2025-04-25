import { useState } from "react";
import { Link } from "react-router-dom";

const tabs = ["Features", "Tips", "Announcements", "Events"];
const fakeData = Array(6).fill({
  id: 1,
  image:
    "https://dropinblog.net/34252524/files/featured/g2survey-pix4d-official-reseller.png",
  logo: "https://dropinblog.net/34252524/authors/G213PNG.png",
  meta: "Leica Geosystems . Jun 2nd 2024 - 5 minute read",
  title: "G2 Survey Become Pix4D Official Reseller",
  type: "Announcements",
});

const G2Blog = () => {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/" className="flex items-center gap-1 text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/support" className="text-[#e62245]">
          G2 BLOG
        </Link>
      </div>
      <h1 className="text-3xl mt-2 text-[#e62245] mb-2">G2 BLOG</h1>
      <section className="mt-12">
        <div className="border-t border-b py-4 flex justify-center gap-6 text-[#db7084] font-medium">
          {tabs.map((tab) => (
            <button
              className="hover:text-[#754e55]"
              key={tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {fakeData
            .filter((post) => activeTab === "All" || post.type === activeTab)
            .slice(0, 6)
            .map((post, index) => (
              <div
                key={index}
                className="relative border rounded-lg overflow-hidden transition-all"
              >
                <img
                  src={post.image}
                  alt="post"
                  className="w-full object-cover"
                />
                <img
                  src={post.logo}
                  alt="logo"
                  className="absolute bottom-[135px] left-3 w-12 h-12 rounded-full"
                />
                <div className="p-4 mt-1">
                  <p className="text-xs text-gray-500 text-center mb-1">
                    {post.meta}
                  </p>
                  <h3 className="text-3xl text-center font-bold mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-center text-gray-400 uppercase">
                    {post.type}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default G2Blog;
