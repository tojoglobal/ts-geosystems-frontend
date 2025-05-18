import Swal from "sweetalert2";
import useDataQuery from "../../utils/useDataQuery";
import { Eye } from "lucide-react";

const AdminServiceInquiries = () => {
  const { data = [], isLoading } = useDataQuery(
    ["service-inquiries"],
    "/api/service-inquiries"
  );

  const showFullDetails = (inquiry) => {
    // Parse file_paths as array
    let files = [];
    try {
      files = JSON.parse(inquiry.file_paths || "[]");
    } catch {
      files = [];
    }

    Swal.fire({
      title: `Service Inquiry from ${inquiry.name}`,
      html: `
        <div class="text-left text-gray-300">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="mb-2"><strong>Company:</strong> ${inquiry.company}</p>
              <p class="mb-2"><strong>Email:</strong> ${inquiry.email}</p>
              <p class="mb-2"><strong>Phone:</strong> ${inquiry.phone}</p>
              <p class="mb-2"><strong>Equipment:</strong> ${
                inquiry.equipment
              }</p>
              <p class="mb-2"><strong>Model:</strong> ${inquiry.model}</p>
              <p class="mb-2"><strong>Request Service:</strong> ${
                inquiry.request_service ? "Yes" : "No"
              }</p>
              <p class="mb-2"><strong>Request Calibration:</strong> ${
                inquiry.request_calibration ? "Yes" : "No"
              }</p>
              <p class="mb-2"><strong>Request Repair:</strong> ${
                inquiry.request_repair ? "Yes" : "No"
              }</p>
            </div>
            <div>
              <p class="mb-2"><strong>Submitted:</strong> ${new Date(
                inquiry.created_at
              ).toLocaleString()}</p>
              <p class="mb-2"><strong>Comments:</strong></p>
              <p class="bg-slate-700 p-2 rounded">${
                inquiry.comments || "None"
              }</p>
            </div>
          </div>
          <hr class="my-3 border-slate-600">
          <h3 class="font-semibold mb-2">Attachments:</h3>
          <div class="flex flex-wrap gap-4">
            ${
              files.length
                ? files
                    .map((file) => {
                      const ext = file.split(".").pop().toLowerCase();
                      if (
                        ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
                          ext
                        )
                      ) {
                        return `
                        <div class="w-48">
                          <img 
                            src="${
                              import.meta.env.VITE_OPEN_APIURL
                            }/${file.replace(/^uploads\//, "uploads/")}" 
                            alt="Attachment" 
                            class="w-full h-auto rounded border border-slate-600"
                          />
                        </div>
                      `;
                      } else {
                        // For pdf, docx, etc.
                        return `
                        <div class="w-48 flex flex-col items-center justify-center">
                          <a href="${
                            import.meta.env.VITE_OPEN_APIURL
                          }/${file}" target="_blank" class="text-blue-400 underline break-words">
                            ${file.split("/").pop()}
                          </a>
                        </div>
                      `;
                      }
                    })
                    .join("")
                : "<div>No attachments.</div>"
            }
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
    <div className="bg-slate-800 text-white rounded-lg p-4 my-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Service Inquiries</h2>
        <div className="text-sm text-gray-400">
          Total Inquiries: {data.length || 0}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-900">
            <tr className="text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Equipment</th>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Calibration</th>
              <th className="px-4 py-2">Repair</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">View</th>
            </tr>
          </thead>
          <tbody>
            {data.map((inquiry) => (
              <tr
                key={inquiry.id}
                className="bg-slate-800 border-b border-slate-600"
              >
                <td className="px-4 py-2">{inquiry.name}</td>
                <td className="px-4 py-2">{inquiry.company}</td>
                <td className="px-4 py-2">{inquiry.email}</td>
                <td className="px-4 py-2">{inquiry.phone}</td>
                <td className="px-4 py-2">{inquiry.equipment}</td>
                <td className="px-4 py-2">{inquiry.model}</td>
                <td className="px-4 py-2">
                  {inquiry.request_service ? "Yes" : "No"}
                </td>
                <td className="px-4 py-2">
                  {inquiry.request_calibration ? "Yes" : "No"}
                </td>
                <td className="px-4 py-2">
                  {inquiry.request_repair ? "Yes" : "No"}
                </td>
                <td className="px-4 py-2">
                  {new Date(inquiry.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => showFullDetails(inquiry)}
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

export default AdminServiceInquiries;
