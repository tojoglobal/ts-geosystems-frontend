// BlogTable.jsx
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import useDataQuery from "../../utils/useDataQuery";

const BlogTable = () => {
  const axiosPublicUrl = useAxiospublic();
  // const [blogs, setBlogs] = useState([]);

  const { data: { blogs } = [], refetch } = useDataQuery(
    ["AllblogView"],
    `/api/blogs`
  );

  // const handleDelete = async (id) => {
  //   if (confirm("Are you sure you want to delete this blog?")) {
  //     try {
  //       await axiosPublicUrl.delete(`/api/blogs/${id}`);
  //       setBlogs(blogs.filter((b) => b.id !== id));
  //       alert("Blog deleted successfully!");
  //     } catch (err) {
  //       console.error("Delete failed:", err);
  //     }
  //   }
  // };

  // console.log(blogs);

  const handleDelete = async (blogId) => {
    const result = await Swal.fire({
      title: "Are you sure to delete this blog?",
      text: "This blog and all its images will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#334155",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await axiosPublicUrl.delete(`/api/blogs/${blogId}`);
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The blog has been deleted.",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
        });
        refetch();
      } catch (error) {
        console.error("Delete error:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete blog.",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
        });
      }
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between ">
        <h1 className="text-2xl font-bold mb-4">All Blogs</h1>
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mb-3">
          <Link
            to="/dashboard/ts-blog/create"
            className="bg-teal-500 text-white py-1.5 px-4 rounded-sm hover:bg-teal-700 transition duration-200 text-center w-full sm:w-auto"
          >
            Add blog
          </Link>
        </div>
      </div>
      <table className="w-full table-auto border border-collapse bg-gray-900 text-white">
        <thead>
          <tr className="bg-gray-800">
            <th className="border border-gray-700 px-4 py-2">Title</th>
            <th className="border border-gray-700 px-4 py-2">Author</th>
            <th className="border border-gray-700 px-4 py-2">Type</th>
            <th className="border border-gray-700 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs?.length > 0 &&
            blogs?.map((blog) => (
              <tr key={blog.id}>
                <td className="border border-gray-700 px-4 py-2">{blog.title}</td>
                <td className="border border-gray-700 px-4 py-2 capitalize">{blog.author}</td>
                <td className="border border-gray-700 px-4 py-2">{blog.blogType}</td>
                <td className="border border-gray-700 px-4 py-2 space-x-3 text-center">
                  {/* View */}
                  <Link to={`/dashboard/ts-blog/view/${blog.id}`}>
                    <button className="text-blue-400 cursor-pointer hover:text-blue-600">
                      <FaEye />
                    </button>
                  </Link>
                  {/* Edit */}
                  <Link to={`/dashboard/ts-blog/edit/${blog.id}`}>
                    <button className="text-yellow-400 cursor-pointer hover:text-yellow-600">
                      <FaEdit />
                    </button>
                  </Link>
                  {/* Delete */}
                  <button
                    className="text-red-500 cursor-pointer hover:text-red-700"
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
