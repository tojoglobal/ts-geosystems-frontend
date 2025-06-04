import { Eye } from "lucide-react";
import Swal from "sweetalert2";
import useDataQuery from "../../utils/useDataQuery";

const AdminShowCreditAccount = () => {
  const { data = [], isLoading } = useDataQuery(
    ["creditAccountApplications"],
    "/api/credit-accounts"
  );

  const showFullDetails = (application) => {
    const files = JSON.parse(application.files || "[]");
    Swal.fire({
      title: `Application from ${application.companyName}`,
      html: `
        <div class="text-left text-gray-300">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="mb-2"><strong>Trading Name:</strong> ${
                application.tradingName || ""
              }</p>
              <p class="mb-2"><strong>Invoice Address:</strong> ${
                application.invoiceAddress
              }</p>
              <p class="mb-2"><strong>Delivery Address:</strong> ${
                application.deliveryAddress
              }</p>
              <p class="mb-2"><strong>Company Type:</strong> ${
                application.companyType
              }</p>
              <p class="mb-2"><strong>VAT Number:</strong> ${
                application.vatNumber
              }</p>
              <p class="mb-2"><strong>Company Number:</strong> ${
                application.companyNumber
              }</p>
              <p class="mb-2"><strong>Buyer's Email:</strong> ${
                application.buyersEmail
              }</p>
              <p class="mb-2"><strong>Accounts Email:</strong> ${
                application.accountsEmail
              }</p>
              <p class="mb-2"><strong>Email Invoices?:</strong> ${
                application.emailInvoices
              }</p>
            </div>
            <div>
              <p class="mb-2"><strong>Applicant:</strong> ${
                application.applicantName
              } (${application.applicantPosition})</p>
              <p class="mb-2"><strong>Applicant Phone:</strong> ${
                application.applicantPhone
              }</p>
              <p class="mb-2"><strong>Date:</strong> ${
                application.applicationDate
              }</p>
              <p class="mb-2"><strong>Discovery Method:</strong> ${
                application.discoveryMethod
              }</p>
              <p class="mb-2"><strong>G2 Rep Name:</strong> ${
                application.g2RepName
              }</p>
              <p class="mb-2"><strong>Submitted:</strong> ${new Date(
                application.createdAt
              ).toLocaleString()}</p>
            </div>
          </div>
          <hr class="my-3 border-slate-600">
          <h3 class="font-semibold mb-2">Files:</h3>
          <div class="flex flex-wrap gap-4">
            ${files
              .map(
                (file) => `
              <div class="w-48">
                <a href="${
                  import.meta.env.VITE_OPEN_APIURL
                }${file}" target="_blank" rel="noopener noreferrer">
                  <img 
                    src="${import.meta.env.VITE_OPEN_APIURL}${file}" 
                    alt="Attachment" 
                    class="w-full h-auto rounded border border-slate-600"
                  />
                </a>
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
        <h2 className="text-xl font-semibold">Credit Account Applications</h2>
        <div className="text-sm text-gray-400">
          Total Applications: {data.length || 0}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-900">
            <tr className="text-left">
              <th className="px-3 md:px-4 py-2">Company</th>
              <th className="px-3 md:px-4 py-2">Trading Name</th>
              <th className="px-3 md:px-4 py-2">Applicant</th>
              <th className="px-3 md:px-4 py-2">Email</th>
              <th className="px-3 md:px-4 py-2">Date</th>
              <th className="px-3 md:px-4 py-2">View</th>
            </tr>
          </thead>
          <tbody>
            {data.map((application) => (
              <tr
                key={application.id}
                className="bg-slate-800 border-b border-slate-600"
              >
                <td className="px-3 md:px-4 py-2">{application.companyName}</td>
                <td className="px-3 md:px-4 py-2">{application.tradingName}</td>
                <td className="px-3 md:px-4 py-2">
                  {application.applicantName}
                </td>
                <td className="px-3 md:px-4 py-2">
                  {application.accountsEmail}
                </td>
                <td className="px-3 md:px-4 py-2">
                  {new Date(application.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3 md:px-4 py-2">
                  <button
                    onClick={() => showFullDetails(application)}
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
