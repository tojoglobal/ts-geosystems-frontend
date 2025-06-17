import Swal from "sweetalert2";
import useDataQuery from "../../utils/useDataQuery";
import { Eye } from "lucide-react";

const QuotationData = () => {
  const { data = [], isLoading } = useDataQuery(
    ["quotationData"],
    "/api/quotation"
  );

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

  if (isLoading) {
    return (
      <div className="bg-slate-800 text-white rounded-lg p-4 my-4">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 text-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quotation Requests</h2>
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
              <th className="px-3 md:px-4 py-2">View</th>
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
                <td className="px-3 md:px-4 py-2">
                  <button
                    onClick={() => showFullDetails(request)}
                    className="text-yellow-400 cursor-pointer bg-yellow-900 p-1 rounded hover:bg-yellow-800"
                  >
                    <Eye size={16} />
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
