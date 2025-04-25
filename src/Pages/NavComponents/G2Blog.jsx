import { useState } from "react"; 
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
const tabs = ["Features", "Tips", "Announcements", "Events"];
const fakeData = [
  {
    id: 1,
    image:
      "https://dropinblog.net/34252524/files/featured/g2survey-pix4d-official-reseller.png",
    logo: "https://dropinblog.net/34252524/authors/G213PNG.png",
    meta: "Leica Geosystems . Jun 2nd 2024 - 5 minute read",
    title: "G2 Survey Become Pix4D Official Reseller",
    type: "Announcements",
    url: "/g2-blog/?p=release-of-the-new-leica-gs05-gnss-smart-antenna",
  },
  {
    id: 2,
    image:
      "https://dropinblog.net/34252524/files/featured/leica-gs18-captivate-firmware.jpg",
    logo: "https://dropinblog.net/34252524/authors/G213PNG.png",
    meta: "Leica Geosystems . Jun 2nd 2024 - 5 minute read",
    title: "G2 Survey Become Pix4D Official Reseller",
    type: "Tips",
    url: "/g2-blog/?p=release-of-the-new-leica-gs05-gnss-smart-antenna",
  },
  {
    id: 3,
    image:
      "https://dropinblog.net/34252524/files/featured/the-sunday-times-100-2024.png",
    logo: "https://dropinblog.net/34252524/authors/G213PNG.png",
    meta: "Leica Geosystems . Jun 2nd 2024 - 5 minute read",
    title: "G2 Survey Become Pix4D Official Reseller",
    type: "Features",
    url: "/g2-blog/?p=release-of-the-new-leica-gs05-gnss-smart-antenna",
  },
  {
    id: 4,
    image: "https://dropinblog.net/34252524/files/featured/cices-burns.jpeg",
    logo: "https://dropinblog.net/34252524/authors/G213PNG.png",
    meta: "Leica Geosystems . Jun 2nd 2024 - 5 minute read",
    title: "G2 Survey Become Pix4D Official Reseller",
    type: "Events",
    url: "/g2-blog/?p=release-of-the-new-leica-gs05-gnss-smart-antenna",
  },
  {
    id: 5,
    image:
      "https://dropinblog.net/34252524/files/featured/g2-survey-road-expo-scotland-2024.jpg",
    logo: "https://dropinblog.net/34252524/authors/G213PNG.png",
    meta: "Leica Geosystems . Jun 2nd 2024 - 5 minute read",
    title: "G2 Survey Become Pix4D Official Reseller",
    type: "Tips",
    url: "/g2-blog/?p=release-of-the-new-leica-gs05-gnss-smart-antenna",
  },
  {
    id: 6,
    image:
      "https://dropinblog.net/34252524/files/featured/leica-gs05-gnss-antenna.jpg",
    logo: "https://dropinblog.net/34252524/authors/G213PNG.png",
    meta: "Leica Geosystems . Jun 2nd 2024 - 5 minute read",
    title: "G2 Survey Become Pix4D Official Reseller",
    type: "Features",
    url: "/g2-blog/?p=release-of-the-new-leica-gs05-gnss-smart-antenna",
  },
];

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
        {activeTab !== "All" && (
          <div className="text-center mb-8">
            <h2 className="text-3xl text-[#e62245] font-semibold">{activeTab}</h2>
          </div>
        )}
        <div className="border-t border-b py-4 flex justify-center items-center gap-6 text-[#db7084] font-medium">
          {activeTab !== "All" && (
            <button onClick={() => setActiveTab("All")} className="text-sm">
              Back to Blog
            </button>
          )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {fakeData
            .filter((post) => activeTab === "All" || post.type === activeTab)
            .map((post, index) => (
              <Link
                key={index}
                to={post.url}
                className="relative border rounded-lg overflow-hidden transition-all hover:shadow-lg"
              >
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-48 object-cover"
                />
                <img
                  src={post.logo}
                  alt="logo"
                  className="absolute bottom-[135px] left-3 w-10 h-10 rounded-full"
                />
                <div className="p-4 mt-1">
                  <p className="text-xs text-gray-500 text-center mb-1">
                    {post.meta}
                  </p>
                  <h3 className="text-2xl text-center font-bold mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-center text-gray-400 uppercase">
                    {post.type}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
};

export default G2Blog;