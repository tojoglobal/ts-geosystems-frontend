// BlogView.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const BlogView = () => {
  const { id } = useParams();
  const axiosPublicUrl = useAxiospublic();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axiosPublicUrl.get(`/api/blogs/${id}`);
        setBlog(res.data?.blog);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };

    fetchBlog();
  }, [id, axiosPublicUrl]);

  console.log(blog);

  if (!blog) return <p className="text-center mt-6">Loading blog...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-400 mb-2">
        By <strong>{blog.author}</strong> | Type: {blog.blogType}
      </p>
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>

      {blog?.tags && (
        <div className="mt-4 space-x-2">
          {JSON.parse(blog.tags).map((tag, index) => (
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
