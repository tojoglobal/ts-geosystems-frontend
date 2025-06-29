import { Eye, Trash } from "lucide-react";
import useDataQuery from "../../utils/useDataQuery";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Loader from "../../utils/Loader";

const ProductQuestion = () => {
  const axiosPublic = useAxiospublic();
  const {
    data = { questions: [] },
    isLoading,
    refetch,
  } = useDataQuery(["productQuestions"], "/api/product-questions");

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Question?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    });

    if (result.isConfirmed) {
      try {
        await axiosPublic.delete(`/api/product-questions/${id}`);
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: "The question has been deleted.",
          icon: "success",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
          timer: 4000,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to delete question",
          icon: "error",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
          timer: 4000,
        });
      }
    }
  };

  const showFullQuestion = (q) => {
    Swal.fire({
      title: `Question from ${q.first_name} ${q.last_name}`,
      html: `
        <div class="text-left">
        <p class="mb-2"><strong>Product Id:</strong> ${q.product_id}</p>
          <p class="mb-2"><strong>Product:</strong> ${q.product_name}</p>
          <p class="mb-2"><strong>Email:</strong> ${q.email}</p>
          <p class="mb-2"><strong>Phone:</strong> ${q.phone || "N/A"}</p>
          <p class="mb-2"><strong>Date:</strong> ${new Date(
            q.created_at
          ).toLocaleString()}</p>
          <hr class="my-3 border-slate-600">
          <div class="max-h-96 overflow-y-auto">
            <p class="whitespace-pre-wrap">${q.question}</p>
          </div>
        </div>
      `,
      width: "800px",
      background: "#1e293b",
      color: "#f8fafc",
      confirmButtonColor: "#e11d48",
      showCloseButton: true,
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="bg-slate-800 text-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Product Questions (From details Page)
        </h2>
        <div className="text-sm text-gray-400">
          Total Questions: {data.questions.length}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-900">
            <tr className="text-left">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Question Preview</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.questions.map((q) => (
              <tr key={q.id} className="bg-slate-800 border-b border-slate-600">
                <td className="px-3 py-2 capitalize">{`${q.first_name} ${q.last_name}`}</td>
                <td className="px-3 py-2">{q.email}</td>
                <td className="px-3 py-2">{q.phone || "N/A"}</td>
                <td className="px-3 py-2">{q.product_name}</td>
                <td
                  className="px-3 py-2 cursor-pointer"
                  onClick={() => showFullQuestion(q)}
                >
                  <div className="max-w-xs truncate hover:text-clip hover:text-white">
                    {q.question.substring(0, 40)}...
                  </div>
                </td>
                <td className="px-3 py-2">
                  {new Date(q.created_at).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 space-x-2">
                  <button
                    onClick={() => showFullQuestion(q)}
                    className="text-yellow-400 cursor-pointer bg-yellow-900 p-1 rounded hover:bg-yellow-800"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="text-red-400 cursor-pointer bg-red-900 p-1 rounded hover:bg-red-800"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductQuestion;
