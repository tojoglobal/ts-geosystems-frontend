// BlogTable.jsx
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const BlogTable = () => {
  const axiosPublicUrl = useAxiospublic();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosPublicUrl.get("/api/blogs");
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };

    fetchBlogs();
  }, [axiosPublicUrl]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await axiosPublicUrl.delete(`/api/blogs/${id}`);
        setBlogs(blogs.filter((b) => b.id !== id));
        alert("Blog deleted successfully!");
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Blogs</h1>
      <table className="w-full table-auto border-collapse bg-gray-900 text-white">
        <thead>
          <tr className="bg-gray-800">
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Author</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length > 0 &&
            blogs.map((blog) => (
              <tr key={blog.id}>
                <td className="border px-4 py-2">{blog.title}</td>
                <td className="border px-4 py-2">{blog.author}</td>
                <td className="border px-4 py-2">{blog.blogType}</td>
                <td className="border px-4 py-2 space-x-2 text-center">
                  {/* View */}
                  <Link to={`/dashboard/ts-blog/view/${blog.id}`}>
                    <button className="text-blue-400 hover:text-blue-600">
                      <FaEye />
                    </button>
                  </Link>
                  {/* Edit */}
                  <Link to={`/dashboard/ts-blog/edit/${blog.id}`}>
                    <button className="text-yellow-400 hover:text-yellow-600">
                      <FaEdit />
                    </button>
                  </Link>
                  {/* Delete */}
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(blog.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogTable;
