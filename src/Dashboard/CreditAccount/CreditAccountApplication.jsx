import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";

const defaultValues = {
  companyName: "",
  tradingName: "",
  invoiceAddress: "",
  deliveryAddress: "",
  registeredOffice: "",
  tradingAddress: "",
  companyType: "",
  partnersInfo: "",
  vatNumber: "",
  companyNumber: "",
  incorporationDate: "",
  website: "",
  buyersContactName: "",
  buyersPhone: "",
  buyersEmail: "",
  accountsContactName: "",
  accountsPhone: "",
  accountsEmail: "",
  emailInvoices: "",
  invoiceEmail: "",
  ref1Company: "",
  ref1Phone: "",
  ref1Contact: "",
  ref1Email: "",
  ref1Address: "",
  ref2Company: "",
  ref2Phone: "",
  ref2Contact: "",
  ref2Email: "",
  ref2Address: "",
  applicantName: "",
  applicantPosition: "",
  applicantPhone: "",
  applicationDate: "",
  discoveryMethod: "",
  g2RepName: "",
};

const CreditAccountApplication = () => {
  const axiosPublicUrl = useAxiospublic();
  const fileInputRef = useRef();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = useForm({
    defaultValues,
  });

  // For showing selected files
  const files = watch("files");

  const onSubmit = async (data) => {
    try {
      const fd = new FormData();

      // Append all fields except files
      Object.entries(data).forEach(([key, value]) => {
        if (key === "files") return;
        fd.append(key, value ?? "");
      });

      // Append files (multiple supported)
      if (data.files && data.files.length > 0) {
        Array.from(data.files).forEach((file) => {
          fd.append("files", file);
        });
      }

      const response = await axiosPublicUrl.post("/api/credit-accounts", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Success",
        text: response.data?.message || "Application submitted!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred.",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-2 md:p-3">
      <div className="flex items-center gap-2 text-[11px] mb-3">
        <Link to="/" className="text-[#e62245] hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link to="/hire" className="capitalize text-[#e62245]">
          Hire
        </Link>
      </div>
      <h1 className="text-[28px] font-light text-[#e62245] mb-12">
        Credit Account Application
      </h1>
      <div className="max-w-2xl mx-auto">
        <p className="mb-6 text-sm">
          Please fill in the form, together with your any specific requirements,
          and we will reply with a customized quote. For queries please{" "}
          <Link to="/contact-us" className="text-[#e62245] underline">
            contact us...
          </Link>
        </p>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Company Details Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Company Details</h2>
            <div className="space-y-4">
              {/* Company Name */}
              <div className="relative w-full">
                <input
                  type="text"
                  {...register("companyName", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Company Name *"
                />
                <label
                  htmlFor="companyName"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Company Name *
                </label>
              </div>
              {/* Trading Name */}
              <div className="relative w-full">
                <input
                  type="text"
                  {...register("tradingName")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Trading Name (if different)"
                />
                <label
                  htmlFor="tradingName"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Trading Name (if different)
                </label>
              </div>
              {/* Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative w-full">
                  <textarea
                    {...register("invoiceAddress", { required: true })}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Invoice Address *"
                    rows="3"
                  />
                  <label
                    htmlFor="invoiceAddress"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Invoice Address *
                  </label>
                </div>
                <div className="relative w-full">
                  <textarea
                    {...register("deliveryAddress", { required: true })}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Delivery Address *"
                    rows="3"
                  />
                  <label
                    htmlFor="deliveryAddress"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Delivery Address *
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative w-full">
                  <textarea
                    {...register("registeredOffice")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Registered Office (if different)"
                    rows="3"
                  />
                  <label
                    htmlFor="registeredOffice"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Registered Office (if different)
                  </label>
                </div>
                <div className="relative w-full">
                  <textarea
                    {...register("tradingAddress")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Trading Address (if different)"
                    rows="3"
                  />
                  <label
                    htmlFor="tradingAddress"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Trading Address (if different)
                  </label>
                </div>
              </div>
              {/* Type of Company */}
              <div className="space-y-2">
                <p className="font-medium">Type of Company *</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Limited",
                    "PLC",
                    "Sole Trader",
                    "Partnership",
                    "Other",
                  ].map((type) => (
                    <label
                      className="flex items-center gap-2 cursor-pointer"
                      key={type}
                    >
                      <input
                        type="radio"
                        value={type}
                        {...register("companyType", { required: true })}
                        className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Partners/Proprietors */}
              <div className="relative w-full">
                <textarea
                  {...register("partnersInfo")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="If a partnership or proprietorship, please provide names and addresses of partners/proprietors"
                  rows="3"
                />
                <label
                  htmlFor="partnersInfo"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  If a partnership or proprietorship, please provide names and
                  addresses of partners/proprietors
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    {...register("vatNumber")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="VAT Number"
                  />
                  <label
                    htmlFor="vatNumber"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    VAT Number
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    {...register("companyNumber")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Company Number"
                  />
                  <label
                    htmlFor="companyNumber"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Company Number
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="date"
                    {...register("incorporationDate")}
                    className="peer w-full border border-gray-300 p-2 pt-5 pr-10 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded bg-white cursor-pointer"
                    placeholder="Date of Incorporation"
                    style={{ colorScheme: "light" }}
                  />
                  <label
                    htmlFor="incorporationDate"
                    className="absolute left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Date of Incorporation
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="url"
                    {...register("website")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Website"
                  />
                  <label
                    htmlFor="website"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Website
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative w-full">
                <input
                  type="text"
                  {...register("buyersContactName")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Buyers Contact Name"
                />
                <label
                  htmlFor="buyersContactName"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Buyers Contact Name
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="tel"
                  {...register("buyersPhone")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Buyers Phone"
                />
                <label
                  htmlFor="buyersPhone"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Buyers Phone
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="email"
                  {...register("buyersEmail")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Buyers Email"
                />
                <label
                  htmlFor="buyersEmail"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Buyers Email
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  {...register("accountsContactName", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Accounts Contact Name *"
                />
                <label
                  htmlFor="accountsContactName"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Accounts Contact Name *
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="tel"
                  {...register("accountsPhone")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Accounts Phone"
                />
                <label
                  htmlFor="accountsPhone"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Accounts Phone
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="email"
                  {...register("accountsEmail", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Accounts Email *"
                />
                <label
                  htmlFor="accountsEmail"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Accounts Email *
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium">
                Are we able to email invoices/statements? *
              </p>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Yes"
                    {...register("emailInvoices", { required: true })}
                    className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="No"
                    {...register("emailInvoices")}
                    className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
              <div className="relative w-full mt-5">
                <input
                  type="email"
                  {...register("invoiceEmail")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="If yes, please provide email"
                />
                <label
                  htmlFor="invoiceEmail"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  If yes, please provide email
                </label>
              </div>
            </div>
          </div>

          {/* Trade References Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Trade References</h2>
            {/* Reference 1 */}
            <div className="space-y-4">
              <p className="font-medium">Trade Reference 1</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    {...register("ref1Company")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Company Name 1"
                  />
                  <label
                    htmlFor="ref1Company"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Company Name 1
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="tel"
                    {...register("ref1Phone")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Phone 1"
                  />
                  <label
                    htmlFor="ref1Phone"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Phone 1
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    {...register("ref1Contact")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Contact Name 1"
                  />
                  <label
                    htmlFor="ref1Contact"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Contact Name 1
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="email"
                    {...register("ref1Email")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Email 1"
                  />
                  <label
                    htmlFor="ref1Email"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Email 1
                  </label>
                </div>
              </div>
              <div className="relative w-full">
                <textarea
                  {...register("ref1Address")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Address 1"
                  rows="3"
                />
                <label
                  htmlFor="ref1Address"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Address 1
                </label>
              </div>
            </div>
            {/* Reference 2 */}
            <div className="space-y-4">
              <p className="font-medium">Trade Reference 2</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    {...register("ref2Company")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Company Name 2"
                  />
                  <label
                    htmlFor="ref2Company"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Company Name 2
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="tel"
                    {...register("ref2Phone")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Phone 2"
                  />
                  <label
                    htmlFor="ref2Phone"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Phone 2
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    {...register("ref2Contact")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Contact Name 2"
                  />
                  <label
                    htmlFor="ref2Contact"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Contact Name 2
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="email"
                    {...register("ref2Email")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Email 2"
                  />
                  <label
                    htmlFor="ref2Email"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Email 2
                  </label>
                </div>
              </div>
              <div className="relative w-full">
                <textarea
                  {...register("ref2Address")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Address 2"
                  rows="3"
                />
                <label
                  htmlFor="ref2Address"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Address 2
                </label>
              </div>
            </div>
          </div>

          {/* Signatory Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Signatory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative w-full">
                <input
                  type="text"
                  {...register("applicantName", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Name of Person Making Application *"
                />
                <label
                  htmlFor="applicantName"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Name of Person Making Application *
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  {...register("applicantPosition", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Position *"
                />
                <label
                  htmlFor="applicantPosition"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Position *
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="tel"
                  {...register("applicantPhone", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Contact Phone *"
                />
                <label
                  htmlFor="applicantPhone"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Contact Phone *
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="date"
                  {...register("applicationDate", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 pr-10 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded bg-white cursor-pointer"
                  placeholder="Date *"
                  style={{ colorScheme: "light" }}
                />
                <label
                  htmlFor="applicationDate"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Date *
                </label>
              </div>
            </div>
          </div>
          {/* File Upload */}
          <div>
            <p className="mb-2 font-semibold">
              Please attach photos if applicable:
            </p>
            <label className="border-2 border-dashed border-gray-300 rounded p-8 text-center text-sm text-black block cursor-pointer">
              <span className="text-[#e62245]">Choose file</span> or drop here
              <input
                type="file"
                {...register("files")}
                className="hidden"
                ref={fileInputRef}
                multiple
              />
            </label>
            {files && files.length > 0 && (
              <div className="text-xs mt-2 text-gray-700">
                {Array.from(files)
                  .map((f) => f.name)
                  .join(", ")}
              </div>
            )}
          </div>
          {/* Marketing Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Marketing</h2>
            <div className="space-y-4">
              <div className="relative w-full">
                <select
                  {...register("discoveryMethod")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded appearance-none"
                >
                  <option value=""></option>
                  <option value="1">Friends & Colleague</option>
                  <option value="2">Search Engine (Google, Bing etc.)</option>
                  <option value="3">Social Media</option>
                  <option value="4">Email</option>
                  <option value="5">Trade Show</option>
                  <option value="6">Other</option>
                </select>
                <label
                  htmlFor="discoveryMethod"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  How Did You Discover TS Survey?
                </label>
              </div>
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  {...register("g2RepName")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Name of G2 Rep (if applicable)"
                />
                <label
                  htmlFor="g2RepName"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Name of G2 Rep (if applicable)
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer bg-[#e62245] text-white px-7 py-2 rounded hover:bg-[#d41d3f] transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          Please fill in the form, together with your surveying instrument
          details, and we will reply with an estimate. For queries please{" "}
          <Link to="/contact-us" className="text-[#e62245] underline">
            contact us...
          </Link>
        </p>
        <p className="text-sm text-gray-500">
          This site is protected by reCAPTCHA and the Google{" "}
          <Link to="/ts/privacy" className="text-[#e62245] underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/ts/terms" className="text-[#e62245] underline">
            Terms of Service
          </Link>{" "}
          apply.
        </p>
      </div>
    </div>
  );
};

export default CreditAccountApplication;
