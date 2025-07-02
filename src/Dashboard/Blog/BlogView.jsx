import { useParams } from "react-router-dom";
import useDataQuery from "../../utils/useDataQuery";

const BlogView = () => {
  const { id } = useParams();
  const { data ={}} = useDataQuery(["blogView", id], `/api/blogs/${id}`, !!id);
  const blogData = data?.blog;

  if (!blogData) return <p className="text-center mt-6">Loading blog...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">{blogData?.title}</h1>
      <p className="text-gray-400 mb-2">
        By <strong>{blogData?.author}</strong> | Type: {blogData?.blog_type}
      </p>
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: blogData?.content }}
      ></div>

      {blogData?.tags && (
        <div className="mt-4 space-x-2">
          {JSON.parse(blogData.tags).map((tag, index) => (
            <span key={index} className="bg-gray-700 px-2 py-1 text-sm rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogView;
