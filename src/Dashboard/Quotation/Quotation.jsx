import Swal from "sweetalert2";
import useDataQuery from "../../utils/useDataQuery";
import { Eye, Trash } from "lucide-react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Loader from "../../utils/Loader";

const QuotationData = () => {
  const axiosPublic = useAxiospublic();
  const {
    data = [],
    isLoading,
    refetch,
  } = useDataQuery(["quotationData"], "/api/quotation");

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Quotation Request?",
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
        await axiosPublic.delete(`/api/quotation/${id}`);
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: "The quotation request has been deleted.",
          icon: "success",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
          timer: 4000,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to delete quotation request",
          icon: "error",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
          timer: 4000,
        });
      }
    }
  };

  const showFullDetails = (request) => {
    Swal.fire({
      title: `Quotation Request from ${request.first_name} ${request.last_name}`,
      html: `
        <div class="text-left text-gray-300">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="mb-2"><strong>First Name:</strong> ${
                request.first_name
              }</p>
              <p class="mb-2"><strong>Last Name:</strong> ${
                request.last_name
              }</p>
              <p class="mb-2"><strong>Email:</strong> ${request.email}</p>
              <p class="mb-2"><strong>Phone:</strong> ${request.phone}</p>
              <p class="mb-2"><strong>Message:</strong></p>
              <p class="bg-slate-700 p-2 rounded">${
                request.message || "None"
              }</p>
            </div>
            <div>
              <p class="mb-2"><strong>Product Name:</strong> ${
                request.product_name
              }</p>
              <p class="mb-2"><strong>Product ID:</strong> ${
                request.product_id
              }</p>
              <p class="mb-2"><strong>Product Price:</strong> ৳${Number(
                request.product_price
              ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
              <p class="mb-2"><strong>Submitted:</strong> ${new Date(
                request.created_at
              ).toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
      width: "700px",
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
        <h2 className="text-xl font-semibold">Quotation Requests (Product)</h2>
        <div className="text-sm text-gray-400">
          Total Requests: {data.length || 0}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-900">
            <tr className="text-left">
              <th className="px-3 md:px-4 py-2">First Name</th>
              <th className="px-3 md:px-4 py-2">Last Name</th>
              <th className="px-3 md:px-4 py-2">Email</th>
              <th className="px-3 md:px-4 py-2">Phone</th>
              <th className="px-3 md:px-4 py-2">Product</th>
              <th className="px-3 md:px-4 py-2">Product Price</th>
              <th className="px-3 md:px-4 py-2">Date</th>
              <th className="px-3 md:px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((request) => (
              <tr
                key={request.id}
                className="bg-slate-800 border-b border-slate-600"
              >
                <td className="px-3 md:px-4 py-2">{request.first_name}</td>
                <td className="px-3 md:px-4 py-2">{request.last_name}</td>
                <td className="px-3 md:px-4 py-2">{request.email}</td>
                <td className="px-3 md:px-4 py-2">{request.phone}</td>
                <td className="px-3 md:px-4 py-2">{request.product_name}</td>
                <td className="px-3 md:px-4 py-2">
                  ৳
                  {Number(request.product_price).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-3 md:px-4 py-2">
                  {new Date(request.created_at).toLocaleDateString()}
                </td>
                <td className="px-3 md:px-4 py-2 flex gap-2 justify-center items-center">
                  <button
                    onClick={() => showFullDetails(request)}
                    className="text-yellow-400 cursor-pointer bg-yellow-900 p-1 rounded hover:bg-yellow-800"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="text-red-400 cursor-pointer bg-red-900 p-1 rounded hover:bg-red-800"
                    title="Delete"
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

export default QuotationData;
