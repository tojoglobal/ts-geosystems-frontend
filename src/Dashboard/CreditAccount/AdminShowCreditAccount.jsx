import Swal from "sweetalert2";
import useDataQuery from "../../utils/useDataQuery";
import { Eye } from "lucide-react";

const AdminShowCreditAccount = () => {
  const { data = [], isLoading } = useDataQuery(
    ["adminCreditAccountData"],
    "/api/credit-accounts"
  );

  const showFullDetails = (app) => {
    // Parse files (array, may be empty)
    let files = [];
    try {
      let parsed = app.files;
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      files = Array.isArray(parsed) ? parsed : [];
    } catch {
      files = [];
    }

    Swal.fire({
      title: `Credit Application: ${app.companyName}`,
      html: `
        <div class="text-left text-gray-300">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="mb-2"><strong>Trading Name:</strong> ${
                app.tradingName || ""
              }</p>
              <p class="mb-2"><strong>Type:</strong> ${
                app.companyType || ""
              }</p>
              <p class="mb-2"><strong>VAT Number:</strong> ${
                app.vatNumber || ""
              }</p>
              <p class="mb-2"><strong>Company Number:</strong> ${
                app.companyNumber || ""
              }</p>
              <p class="mb-2"><strong>Website:</strong> ${app.website || ""}</p>
              <p class="mb-2"><strong>Buyer Contact Name:</strong> ${
                app.buyersContactName || ""
              }</p>
              <p class="mb-2"><strong>Buyer Phone:</strong> ${
                app.buyersPhone || ""
              }</p>
              <p class="mb-2"><strong>Buyer Email:</strong> ${
                app.buyersEmail || ""
              }</p>
              <p class="mb-2"><strong>Accounts Contact Name:</strong> ${
                app.accountsContactName || ""
              }</p>
              <p class="mb-2"><strong>Accounts Phone:</strong> ${
                app.accountsPhone || ""
              }</p>
              <p class="mb-2"><strong>Accounts Email:</strong> ${
                app.accountsEmail || ""
              }</p>
            </div>
            <div>
              <p class="mb-2"><strong>Invoice Address:</strong> ${
                app.invoiceAddress || ""
              }</p>
              <p class="mb-2"><strong>Delivery Address:</strong> ${
                app.deliveryAddress || ""
              }</p>
              <p class="mb-2"><strong>Registered Office:</strong> ${
                app.registeredOffice || ""
              }</p>
              <p class="mb-2"><strong>Trading Address:</strong> ${
                app.tradingAddress || ""
              }</p>
              <p class="mb-2"><strong>Partners Info:</strong> ${
                app.partnersInfo || ""
              }</p>
              <p class="mb-2"><strong>Email Invoices:</strong> ${
                app.emailInvoices || ""
              }</p>
              <p class="mb-2"><strong>Invoice Email:</strong> ${
                app.invoiceEmail || ""
              }</p>
            </div>
          </div>
          <hr class="my-3 border-slate-600">
          <div class="mb-2"><strong>Reference 1:</strong> ${
            app.ref1Company || ""
          }, ${app.ref1Contact || ""}, ${app.ref1Phone || ""}, ${
        app.ref1Email || ""
      }, ${app.ref1Address || ""}</div>
          <div class="mb-2"><strong>Reference 2:</strong> ${
            app.ref2Company || ""
          }, ${app.ref2Contact || ""}, ${app.ref2Phone || ""}, ${
        app.ref2Email || ""
      }, ${app.ref2Address || ""}</div>
          <div class="mb-2"><strong>Applicant:</strong> ${
            app.applicantName || ""
          }, ${app.applicantPosition || ""}, ${app.applicantPhone || ""}</div>
          <div class="mb-2"><strong>Application Date:</strong> ${
            app.applicationDate || ""
          }</div>
          <div class="mb-2"><strong>Discovery Method:</strong> ${
            app.discoveryMethod || ""
          }</div>
          <div class="mb-2"><strong>G2 Rep Name:</strong> ${
            app.g2RepName || ""
          }</div>
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
        <h2 className="text-xl font-semibold">Credit Account Applications</h2>
        <div className="text-sm text-gray-400">
          Total Applications: {data.length || 0}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-900">
            <tr className="text-left">
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">View</th>
            </tr>
          </thead>
          <tbody>
            {data.map((app) => (
              <tr
                key={app.id}
                className="bg-slate-800 border-b border-slate-600"
              >
                <td className="px-4 py-2">{app.companyName}</td>
                <td className="px-4 py-2">{app.companyType}</td>
                <td className="px-4 py-2">{app.applicantName}</td>
                <td className="px-4 py-2">{app.applicantPhone}</td>
                <td className="px-4 py-2">{app.accountsEmail}</td>
                <td className="px-4 py-2">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => showFullDetails(app)}
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

export default AdminShowCreditAccount;
