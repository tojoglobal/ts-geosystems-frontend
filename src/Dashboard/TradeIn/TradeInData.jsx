import Swal from "sweetalert2";
import useDataQuery from "../../utils/useDataQuery";
import { Eye } from "lucide-react";

const TradeInData = () => {
  const { data = [], isLoading } = useDataQuery(
    ["tradeInData"],
    "/api/trade-in"
  );

  const showFullDetails = (request) => {
    // Parse the photos array from the string
    const photos = JSON.parse(request.photos || "[]");

    Swal.fire({
      title: `Trade-In Request from ${request.name}`,
      html: `
        <div class="text-left text-gray-300">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="mb-2"><strong>Company:</strong> ${request.company}</p>
              <p class="mb-2"><strong>Email:</strong> ${request.email}</p>
              <p class="mb-2"><strong>Phone:</strong> ${request.phone}</p>
              <p class="mb-2"><strong>Equipment:</strong> ${
                request.equipment
              }</p>
              <p class="mb-2"><strong>Model:</strong> ${request.model}</p>
              <p class="mb-2"><strong>Serial Number:</strong> ${
                request.serialNumber
              }</p>
              <p class="mb-2"><strong>Software Included:</strong> ${
                request.software
              }</p>
            </div>
            <div>
              <p class="mb-2"><strong>Manufacture Date:</strong> ${
                request.manufactureDate
              }</p>
              <p class="mb-2"><strong>Condition:</strong> ${
                request.condition
              }/5</p>
              <p class="mb-2"><strong>Type:</strong> ${
                request.sellOrTrade === "sell" ? "Sell" : "Trade"
              }</p>
              <p class="mb-2"><strong>Submitted:</strong> ${new Date(
                request.createdAt
              ).toLocaleString()}</p>
              <p class="mb-2"><strong>Comments:</strong></p>
              <p class="bg-slate-700 p-2 rounded">${
                request.comments || "None"
              }</p>
            </div>
          </div>
          <hr class="my-3 border-slate-600">
          <h3 class="font-semibold mb-2">Photos:</h3>
          <div class="flex flex-wrap gap-4">
            ${photos
              .map(
                (photo) => `
              <div class="w-48">
                <img 
                  src="${import.meta.env.VITE_OPEN_APIURL}${photo}" 
                  alt="Equipment photo" 
                  class="w-full h-auto rounded border border-slate-600"
                />
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `,
      width: "900px",
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
        <h2 className="text-xl font-semibold">Trade-In Form Requests</h2>
        <div className="text-sm text-gray-400">
          Total Requests: {data.length || 0}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-900">
            <tr className="text-left">
              <th className="px-3 md:px-4 py-2">Name</th>
              <th className="px-3 md:px-4 py-2">Email</th>
              <th className="px-3 md:px-4 py-2">Phone</th>
              <th className="px-3 md:px-4 py-2">Equipment</th>
              <th className="px-3 md:px-4 py-2">Model</th>
              <th className="px-3 md:px-4 py-2">Condition</th>
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
                <td className="px-3 md:px-4 py-2">{request.name}</td>
                <td className="px-3 md:px-4 py-2">{request.email}</td>
                <td className="px-3 md:px-4 py-2">{request.phone}</td>
                <td className="px-3 md:px-4 py-2">{request.equipment}</td>
                <td className="px-3 md:px-4 py-2">{request.model}</td>
                <td className="px-3 md:px-4 py-2">{request.condition}/5</td>
                <td className="px-3 md:px-4 py-2">
                  {new Date(request.createdAt).toLocaleDateString()}
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

export default TradeInData;
