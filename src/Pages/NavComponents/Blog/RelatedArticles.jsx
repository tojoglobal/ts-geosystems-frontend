import { useEffect, useState } from "react";
import useDataQuery from "../../../utils/useDataQuery";
import { Link } from "react-router-dom";
import { slugify } from "../../../utils/slugify";

const RelatedArticles = ({ currentBlogType, currentBlogId }) => {
  const [articles, setArticles] = useState([]);
  const { data = {}, isLoading } = useDataQuery(
    ["relatedBlogs", currentBlogType, currentBlogId],
    `/api/related?type=${encodeURIComponent(
      currentBlogType
    )}&excludeId=${currentBlogId}`,
    !!currentBlogType && !!currentBlogId
  );

  useEffect(() => {
    if (data?.relatedArticles) {
      setArticles(data.relatedArticles);
    }
  }, [data]);

  if (isLoading) return <div>Loading related articles...</div>;
  if (!articles.length) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#e62245] mb-4">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/ts-blog/${article.id}/${slugify(article.title || "")}`}
            className="bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            {article.image && (
              <img
                src={`${import.meta.env.VITE_OPEN_APIURL}${article.image}`}
                alt={article.title}
                className="w-full rounded-t-sm h-80 object-cover"
              />
            )}
            <div className="px-4 py-8 bg-[#fafdff]">
              <h3 className="text-xl text-center font-semibold mb-2 transition-colors">
                {article.title}
              </h3>
              <div className="flex justify-center items-center text-xs text-gray-600 space-x-2">
                <span>{article.readTime}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
