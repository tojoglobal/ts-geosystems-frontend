import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import useToastSwal from "../../Hooks/useToastSwal";

// Utility to merge custom label focus with tailwind/peer
function focusInputById(id) {
  const el = document.getElementById(id);
  if (el) el.focus();
}

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
  const showToast = useToastSwal();
  const axiosPublicUrl = useAxiospublic();
  const fileInputRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues });

  const onFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const onSubmit = async (data) => {
    try {
      const fd = new FormData();

      // Append all text fields
      Object.entries(data).forEach(([key, value]) => {
        fd.append(key, value ?? "");
      });

      // Append files (multiple supported)
      selectedFiles.forEach((file) => {
        fd.append("files", file);
      });

      const response = await axiosPublicUrl.post("/api/credit-accounts", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast(
        "success",
        "success",
        response.data?.message || "Application submitted!"
      );
      reset();
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      showToast(
        "error",
        "Error",
        error?.response?.data?.message || error.message || "An error occurred."
      );
    }
  };

  // Custom label class for black color and pointer
  const labelClass =
    "absolute pl-2 left-2 top-2 text-black text-sm transition-all cursor-pointer peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black select-none";

  // For radio/checkbox label
  const radioLabelClass = "text-black text-sm cursor-pointer select-none";

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
                  id="companyName"
                  {...register("companyName", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Company Name *"
                />
                <label
                  htmlFor="companyName"
                  className={labelClass}
                  onClick={() => focusInputById("companyName")}
                >
                  Company Name *
                </label>
              </div>
              {/* Trading Name */}
              <div className="relative w-full">
                <input
                  type="text"
                  id="tradingName"
                  {...register("tradingName")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Trading Name (if different)"
                />
                <label
                  htmlFor="tradingName"
                  className={labelClass}
                  onClick={() => focusInputById("tradingName")}
                >
                  Trading Name (if different)
                </label>
              </div>
              {/* Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative w-full">
                  <textarea
                    id="invoiceAddress"
                    {...register("invoiceAddress", { required: true })}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Invoice Address *"
                    rows="3"
                  />
                  <label
                    htmlFor="invoiceAddress"
                    className={labelClass}
                    onClick={() => focusInputById("invoiceAddress")}
                  >
                    Invoice Address *
                  </label>
                </div>
                <div className="relative w-full">
                  <textarea
                    id="deliveryAddress"
                    {...register("deliveryAddress", { required: true })}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Delivery Address *"
                    rows="3"
                  />
                  <label
                    htmlFor="deliveryAddress"
                    className={labelClass}
                    onClick={() => focusInputById("deliveryAddress")}
                  >
                    Delivery Address *
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative w-full">
                  <textarea
                    id="registeredOffice"
                    {...register("registeredOffice")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Registered Office (if different)"
                    rows="3"
                  />
                  <label
                    htmlFor="registeredOffice"
                    className={labelClass}
                    onClick={() => focusInputById("registeredOffice")}
                  >
                    Registered Office (if different)
                  </label>
                </div>
                <div className="relative w-full">
                  <textarea
                    id="tradingAddress"
                    {...register("tradingAddress")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Trading Address (if different)"
                    rows="3"
                  />
                  <label
                    htmlFor="tradingAddress"
                    className={labelClass}
                    onClick={() => focusInputById("tradingAddress")}
                  >
                    Trading Address (if different)
                  </label>
                </div>
              </div>
              {/* Type of Company */}
              <div className="space-y-2">
                <p className="font-medium text-black">Type of Company *</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Limited",
                    "PLC",
                    "Sole Trader",
                    "Partnership",
                    "Other",
                  ].map((type) => (
                    <label
                      className={`${radioLabelClass} flex items-center gap-2`}
                      key={type}
                      htmlFor={`companyType-${type}`}
                      onClick={() => focusInputById(`companyType-${type}`)}
                    >
                      <input
                        type="radio"
                        value={type}
                        id={`companyType-${type}`}
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
                  id="partnersInfo"
                  {...register("partnersInfo")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="If a partnership or proprietorship, please provide names and addresses of partners/proprietors"
                  rows="3"
                />
                <label
                  htmlFor="partnersInfo"
                  className={labelClass}
                  onClick={() => focusInputById("partnersInfo")}
                >
                  If a partnership or proprietorship, please provide names and
                  addresses of partners/proprietors
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    id="vatNumber"
                    {...register("vatNumber")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="VAT Number"
                  />
                  <label
                    htmlFor="vatNumber"
                    className={labelClass}
                    onClick={() => focusInputById("vatNumber")}
                  >
                    VAT Number
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    id="companyNumber"
                    {...register("companyNumber")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Company Number"
                  />
                  <label
                    htmlFor="companyNumber"
                    className={labelClass}
                    onClick={() => focusInputById("companyNumber")}
                  >
                    Company Number
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="date"
                    id="incorporationDate"
                    {...register("incorporationDate")}
                    className="peer w-full border border-gray-300 p-2 pt-5 pr-10 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded bg-white cursor-pointer"
                    placeholder="Date of Incorporation"
                    style={{ colorScheme: "light" }}
                  />
                  <label
                    htmlFor="incorporationDate"
                    className={labelClass}
                    onClick={() => focusInputById("incorporationDate")}
                  >
                    Date of Incorporation
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="url"
                    id="website"
                    {...register("website")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Website"
                  />
                  <label
                    htmlFor="website"
                    className={labelClass}
                    onClick={() => focusInputById("website")}
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
                  id="buyersContactName"
                  {...register("buyersContactName")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Buyers Contact Name"
                />
                <label
                  htmlFor="buyersContactName"
                  className={labelClass}
                  onClick={() => focusInputById("buyersContactName")}
                >
                  Buyers Contact Name
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="tel"
                  id="buyersPhone"
                  {...register("buyersPhone")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Buyers Phone"
                />
                <label
                  htmlFor="buyersPhone"
                  className={labelClass}
                  onClick={() => focusInputById("buyersPhone")}
                >
                  Buyers Phone
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="email"
                  id="buyersEmail"
                  {...register("buyersEmail")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Buyers Email"
                />
                <label
                  htmlFor="buyersEmail"
                  className={labelClass}
                  onClick={() => focusInputById("buyersEmail")}
                >
                  Buyers Email
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  id="accountsContactName"
                  {...register("accountsContactName", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Accounts Contact Name *"
                />
                <label
                  htmlFor="accountsContactName"
                  className={labelClass}
                  onClick={() => focusInputById("accountsContactName")}
                >
                  Accounts Contact Name *
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="tel"
                  id="accountsPhone"
                  {...register("accountsPhone")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Accounts Phone"
                />
                <label
                  htmlFor="accountsPhone"
                  className={labelClass}
                  onClick={() => focusInputById("accountsPhone")}
                >
                  Accounts Phone
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="email"
                  id="accountsEmail"
                  {...register("accountsEmail", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Accounts Email *"
                />
                <label
                  htmlFor="accountsEmail"
                  className={labelClass}
                  onClick={() => focusInputById("accountsEmail")}
                >
                  Accounts Email *
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-black">
                Are we able to email invoices/statements? *
              </p>
              <div className="grid grid-cols-2 gap-4">
                {["Yes", "No"].map((val) => (
                  <label
                    className={`${radioLabelClass} flex items-center gap-2`}
                    htmlFor={`emailInvoices-${val}`}
                    key={val}
                    onClick={() => focusInputById(`emailInvoices-${val}`)}
                  >
                    <input
                      type="radio"
                      value={val}
                      id={`emailInvoices-${val}`}
                      {...register("emailInvoices", { required: true })}
                      className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                    />
                    <span className="text-sm">{val}</span>
                  </label>
                ))}
              </div>
              <div className="relative w-full mt-5">
                <input
                  type="email"
                  id="invoiceEmail"
                  {...register("invoiceEmail")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="If yes, please provide email"
                />
                <label
                  htmlFor="invoiceEmail"
                  className={labelClass}
                  onClick={() => focusInputById("invoiceEmail")}
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
              <p className="font-medium text-black">Trade Reference 1</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    id="ref1Company"
                    {...register("ref1Company")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Company Name 1"
                  />
                  <label
                    htmlFor="ref1Company"
                    className={labelClass}
                    onClick={() => focusInputById("ref1Company")}
                  >
                    Company Name 1
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="tel"
                    id="ref1Phone"
                    {...register("ref1Phone")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Phone 1"
                  />
                  <label
                    htmlFor="ref1Phone"
                    className={labelClass}
                    onClick={() => focusInputById("ref1Phone")}
                  >
                    Phone 1
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    id="ref1Contact"
                    {...register("ref1Contact")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Contact Name 1"
                  />
                  <label
                    htmlFor="ref1Contact"
                    className={labelClass}
                    onClick={() => focusInputById("ref1Contact")}
                  >
                    Contact Name 1
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="email"
                    id="ref1Email"
                    {...register("ref1Email")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Email 1"
                  />
                  <label
                    htmlFor="ref1Email"
                    className={labelClass}
                    onClick={() => focusInputById("ref1Email")}
                  >
                    Email 1
                  </label>
                </div>
              </div>
              <div className="relative w-full">
                <textarea
                  id="ref1Address"
                  {...register("ref1Address")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Address 1"
                  rows="3"
                />
                <label
                  htmlFor="ref1Address"
                  className={labelClass}
                  onClick={() => focusInputById("ref1Address")}
                >
                  Address 1
                </label>
              </div>
            </div>
            {/* Reference 2 */}
            <div className="space-y-4">
              <p className="font-medium text-black">Trade Reference 2</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    id="ref2Company"
                    {...register("ref2Company")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Company Name 2"
                  />
                  <label
                    htmlFor="ref2Company"
                    className={labelClass}
                    onClick={() => focusInputById("ref2Company")}
                  >
                    Company Name 2
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="tel"
                    id="ref2Phone"
                    {...register("ref2Phone")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Phone 2"
                  />
                  <label
                    htmlFor="ref2Phone"
                    className={labelClass}
                    onClick={() => focusInputById("ref2Phone")}
                  >
                    Phone 2
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    id="ref2Contact"
                    {...register("ref2Contact")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Contact Name 2"
                  />
                  <label
                    htmlFor="ref2Contact"
                    className={labelClass}
                    onClick={() => focusInputById("ref2Contact")}
                  >
                    Contact Name 2
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="email"
                    id="ref2Email"
                    {...register("ref2Email")}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Email 2"
                  />
                  <label
                    htmlFor="ref2Email"
                    className={labelClass}
                    onClick={() => focusInputById("ref2Email")}
                  >
                    Email 2
                  </label>
                </div>
              </div>
              <div className="relative w-full">
                <textarea
                  id="ref2Address"
                  {...register("ref2Address")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Address 2"
                  rows="3"
                />
                <label
                  htmlFor="ref2Address"
                  className={labelClass}
                  onClick={() => focusInputById("ref2Address")}
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
                  id="applicantName"
                  {...register("applicantName", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Name of Person Making Application *"
                />
                <label
                  htmlFor="applicantName"
                  className={labelClass}
                  onClick={() => focusInputById("applicantName")}
                >
                  Name of Person Making Application *
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  id="applicantPosition"
                  {...register("applicantPosition", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Position *"
                />
                <label
                  htmlFor="applicantPosition"
                  className={labelClass}
                  onClick={() => focusInputById("applicantPosition")}
                >
                  Position *
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="tel"
                  id="applicantPhone"
                  {...register("applicantPhone", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Contact Phone *"
                />
                <label
                  htmlFor="applicantPhone"
                  className={labelClass}
                  onClick={() => focusInputById("applicantPhone")}
                >
                  Contact Phone *
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="date"
                  id="applicationDate"
                  {...register("applicationDate", { required: true })}
                  className="peer w-full border border-gray-300 p-2 pt-5 pr-10 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded bg-white cursor-pointer"
                  placeholder="Date *"
                  style={{ colorScheme: "light" }}
                />
                <label
                  htmlFor="applicationDate"
                  className={labelClass}
                  onClick={() => focusInputById("applicationDate")}
                >
                  Date *
                </label>
              </div>
            </div>
          </div>
          {/* File Upload */}
          <div>
            <p className="mb-2 font-semibold text-black">
              Please attach photos if applicable:
            </p>
            <label className="border-2 border-dashed border-gray-300 rounded p-8 text-center text-sm text-black block cursor-pointer">
              <span className="text-[#e62245]">Choose file</span> or drop here
              <input
                type="file"
                name="files"
                ref={fileInputRef}
                onChange={onFileChange}
                className="hidden"
                multiple
              />
            </label>
            {selectedFiles.length > 0 && (
              <div className="text-xs mt-2 text-gray-700">
                {selectedFiles.map((f) => f.name).join(", ")}
              </div>
            )}
          </div>
          {/* Marketing Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Marketing</h2>
            <div className="space-y-4">
              <div className="relative w-full">
                <select
                  id="discoveryMethod"
                  {...register("discoveryMethod")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded appearance-none"
                >
                  <option value=""></option>
                  <option value="Friends & Colleague">
                    Friends & Colleague
                  </option>
                  <option value="Search Engine (Google, Bing etc.)">
                    Search Engine (Google, Bing etc.)
                  </option>
                  <option value="Social Media">Social Media</option>
                  <option value="Email">Email</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Other">Other</option>
                </select>
                <label
                  htmlFor="discoveryMethod"
                  className={labelClass}
                  onClick={() => focusInputById("discoveryMethod")}
                >
                  How Did you Discover TS Geosystems?
                </label>
              </div>
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  id="g2RepName"
                  {...register("g2RepName")}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Name of G2 Rep (if applicable)"
                />
                <label
                  htmlFor="g2RepName"
                  className={labelClass}
                  onClick={() => focusInputById("g2RepName")}
                >
                  Name of TSGB Representative (if applicable)
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
