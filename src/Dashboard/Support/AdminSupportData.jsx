import Swal from "sweetalert2";
import useDataQuery from "../../utils/useDataQuery";
import { Eye, Trash } from "lucide-react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Loader from "../../utils/Loader";

const AdminSupportData = () => {
  const axiosPublic = useAxiospublic();
  const {
    data = [],
    isLoading,
    refetch,
  } = useDataQuery(["adminSupportData"], "/api/support");

  // Delete handler
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Support Request?",
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
        await axiosPublic.delete(`/api/support/${id}`);
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: "The support request has been deleted.",
          icon: "success",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
          timer: 4000,
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to delete support request",
          icon: "error",
          background: "#1e293b",
          color: "#f8fafc",
          confirmButtonColor: "#e11d48",
          timer: 4000,
        });
      }
    }
  };

  const showFullDetails = (support) => {
    // Parse supportIssues (may be a double-stringified array)
    let issuesArr = [];
    try {
      let parsed = support.supportIssues;
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      issuesArr = Array.isArray(parsed) ? parsed : [];
    } catch {
      issuesArr = [];
    }

    // Parse files (array, may be empty)
    let files = [];
    try {
      let parsed = support.files;
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      files = Array.isArray(parsed) ? parsed : [];
    } catch {
      files = [];
    }

    Swal.fire({
      title: `Support Request from ${support.name}`,
      html: `
        <div class="text-left text-gray-300">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="mb-2"><strong>Company:</strong> ${support.company}</p>
              <p class="mb-2"><strong>Email:</strong> ${support.email}</p>
              <p class="mb-2"><strong>Phone:</strong> ${support.phone}</p>
              <p class="mb-2"><strong>Equipment:</strong> ${
                support.equipment
              }</p>
              <p class="mb-2"><strong>Model:</strong> ${support.model}</p>
              <p class="mb-2"><strong>Support Issues:</strong> ${
                issuesArr.length
                  ? issuesArr
                      .map(
                        (i) =>
                          `<span class="bg-slate-700 rounded px-2 py-1 mr-1">${i}</span>`
                      )
                      .join(" ")
                  : "None"
              }</p>
            </div>
            <div>
              <p class="mb-2"><strong>Submitted:</strong> ${new Date(
                support.createdAt
              ).toLocaleString()}</p>
              <p class="mb-2"><strong>Details:</strong></p>
              <p class="bg-slate-700 p-2 rounded">${
                support.details || "None"
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
                            }${file.replace(/^uploads\//, "uploads/")}" 
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
                          }${file}" target="_blank" class="text-blue-400 underline break-words">
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

  if (isLoading) return <Loader />;

  return (
    <div className="bg-slate-800 text-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-xl font-semibold">Support Requests Form Data</h2>
        <div className="text-sm text-gray-400">
          Total Requests: {data.length || 0}
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
              <th className="px-4 py-2">Support Issues</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((support) => (
              <tr
                key={support.id}
                className="bg-slate-800 border-b border-slate-600"
              >
                <td className="px-4 py-2">{support.name}</td>
                <td className="px-4 py-2">{support.company}</td>
                <td className="px-4 py-2">{support.email}</td>
                <td className="px-4 py-2">{support.phone}</td>
                <td className="px-4 py-2">{support.equipment}</td>
                <td className="px-4 py-2">{support.model}</td>
                <td className="px-4 py-2">
                  {(() => {
                    let arr = [];
                    try {
                      let parsed = support.supportIssues;
                      if (typeof parsed === "string")
                        parsed = JSON.parse(parsed);
                      if (typeof parsed === "string")
                        parsed = JSON.parse(parsed);
                      arr = Array.isArray(parsed) ? parsed : [];
                    } catch {
                      arr = [];
                    }
                    return arr.length
                      ? arr.map((i) => (
                          <span
                            key={i}
                            className="bg-slate-700 rounded px-2 py-1 mr-1"
                          >
                            {i}
                          </span>
                        ))
                      : "None";
                  })()}
                </td>
                <td className="px-4 py-2">
                  {new Date(support.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center items-center">
                  <button
                    onClick={() => showFullDetails(support)}
                    className="text-yellow-400 cursor-pointer bg-yellow-900 p-1 rounded hover:bg-yellow-800"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(support.id)}
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

export default AdminSupportData;
