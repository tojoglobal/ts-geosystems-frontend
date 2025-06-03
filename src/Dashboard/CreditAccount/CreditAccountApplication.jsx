import { Link } from "react-router-dom";
import { useState } from "react";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";

const CreditAccountApplication = () => {
  const axiosPublicUrl = useAxiospublic();
  const [formData, setFormData] = useState({
    // Company Details
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

    // Contact Details
    buyersContactName: "",
    buyersPhone: "",
    buyersEmail: "",
    accountsContactName: "",
    accountsPhone: "",
    accountsEmail: "",
    emailInvoices: "",
    invoiceEmail: "",

    // Trade References
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

    // Signatory
    applicantName: "",
    applicantPosition: "",
    applicantPhone: "",
    applicationDate: "",
    files: null, // For single file, or set to [] and handle multiple if needed

    // Marketing
    discoveryMethod: "",
    g2RepName: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files.length > 1 ? Array.from(files) : files[0], // handle single/multiple
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build FormData for file upload, even if no files
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "files" && value) {
        if (Array.isArray(value)) {
          value.forEach((file) => fd.append("files", file));
        } else {
          fd.append("files", value);
        }
      } else {
        fd.append(key, value);
      }
    });

    try {
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
      setFormData({
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
        files: null,
        discoveryMethod: "",
        g2RepName: "",
      });
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
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Company Details Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Company Details</h2>
            <div className="space-y-4">
              {/* Company Name */}
              <div className="relative w-full">
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Company Name *"
                />
                <label
                  htmlFor="companyName"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Company Name *
                </label>
              </div>
              {/* Trading Name */}
              <div className="relative w-full">
                <input
                  type="text"
                  name="tradingName"
                  id="tradingName"
                  value={formData.tradingName}
                  onChange={handleChange}
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Trading Name (if different)"
                />
                <label
                  htmlFor="tradingName"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Trading Name (if different)
                </label>
              </div>
              {/* Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Invoice Address */}
                <div className="relative w-full">
                  <textarea
                    name="invoiceAddress"
                    id="invoiceAddress"
                    required
                    value={formData.invoiceAddress}
                    onChange={handleChange}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Invoice Address *"
                    rows="3"
                  />
                  <label
                    htmlFor="invoiceAddress"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Invoice Address *
                  </label>
                </div>

                {/* Delivery Address */}
                <div className="relative w-full">
                  <textarea
                    name="deliveryAddress"
                    id="deliveryAddress"
                    required
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Delivery Address *"
                    rows="3"
                  />
                  <label
                    htmlFor="deliveryAddress"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Delivery Address *
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Registered Office */}
                <div className="relative w-full">
                  <textarea
                    name="registeredOffice"
                    id="registeredOffice"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Registered Office (if different)"
                    rows="3"
                  />
                  <label
                    htmlFor="registeredOffice"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Registered Office (if different)
                  </label>
                </div>

                {/* Trading Address */}
                <div className="relative w-full">
                  <textarea
                    name="tradingAddress"
                    id="tradingAddress"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Trading Address (if different)"
                    rows="3"
                  />
                  <label
                    htmlFor="tradingAddress"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Trading Address (if different)
                  </label>
                </div>
              </div>
              {/* Type of Company */}
              <div className="space-y-2">
                <p className="font-medium">Type of Company *</p>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="companyType"
                      value="Limited"
                      checked={formData.companyType === "Limited"}
                      onChange={handleChange}
                      className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                      required
                    />
                    <span className="text-sm">Limited</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="companyType"
                      value="PLC"
                      checked={formData.companyType === "PLC"}
                      onChange={handleChange}
                      className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                    />
                    <span className="text-sm">PLC</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="companyType"
                      value="Sole Trader"
                      checked={formData.companyType === "Sole Trader"}
                      onChange={handleChange}
                      className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                    />
                    <span className="text-sm">Sole Trader</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="companyType"
                      value="Partnership"
                      checked={formData.companyType === "Partnership"}
                      onChange={handleChange}
                      className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                    />
                    <span className="text-sm">Partnership</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="companyType"
                      value="Other"
                      checked={formData.companyType === "Other"}
                      onChange={handleChange}
                      className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                    />
                    <span className="text-sm">Other</span>
                  </label>
                </div>
              </div>
              {/* Partners/Proprietors */}
              <div className="relative w-full">
                <textarea
                  name="partnersInfo"
                  id="partnersInfo"
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="If a partnership or proprietorship, please provide names and addresses of partners/proprietors"
                  rows="3"
                />
                <label
                  htmlFor="partnersInfo"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  If a partnership or proprietorship, please provide names and
                  addresses of partners/proprietors
                </label>
              </div>
              {/* Additional Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* VAT Number */}
                <div className="relative w-full">
                  <input
                    type="text"
                    name="vatNumber"
                    id="vatNumber"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="VAT Number"
                  />
                  <label
                    htmlFor="vatNumber"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    VAT Number
                  </label>
                </div>

                {/* Company Number */}
                <div className="relative w-full">
                  <input
                    type="text"
                    name="companyNumber"
                    id="companyNumber"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Company Number"
                  />
                  <label
                    htmlFor="companyNumber"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Company Number
                  </label>
                </div>

                {/* Date of Incorporation */}
                <div
                  className="relative w-full"
                  onClick={() =>
                    document.getElementById("incorporationDate").showPicker()
                  }
                >
                  <input
                    type="date"
                    name="incorporationDate"
                    id="incorporationDate"
                    className="peer w-full border border-gray-300 p-2 pt-5 pr-10 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded bg-white cursor-pointer"
                    placeholder="Date of Incorporation"
                    style={{ colorScheme: "light" }}
                  />
                  <label
                    htmlFor="incorporationDate"
                    className="absolute left-2 top-2 text-gray-500 text-sm transition-all 
      peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black 
      peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Date of Incorporation
                  </label>
                </div>

                {/* Website */}
                <div className="relative w-full">
                  <input
                    type="url"
                    name="website"
                    id="website"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Website"
                  />
                  <label
                    htmlFor="website"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
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
              {/* Buyers Contact Name */}
              <div className="relative w-full">
                <input
                  type="text"
                  name="buyersContactName"
                  id="buyersContactName"
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Buyers Contact Name"
                />
                <label
                  htmlFor="buyersContactName"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Buyers Contact Name
                </label>
              </div>

              {/* Buyers Phone */}
              <div className="relative w-full">
                <input
                  type="tel"
                  name="buyersPhone"
                  id="buyersPhone"
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Buyers Phone"
                />
                <label
                  htmlFor="buyersPhone"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Buyers Phone
                </label>
              </div>

              {/* Buyers Email */}
              <div className="relative w-full">
                <input
                  type="email"
                  name="buyersEmail"
                  id="buyersEmail"
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Buyers Email"
                />
                <label
                  htmlFor="buyersEmail"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Buyers Email
                </label>
              </div>

              {/* Accounts Contact Name */}
              <div className="relative w-full">
                <input
                  type="text"
                  name="accountsContactName"
                  id="accountsContactName"
                  required
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Accounts Contact Name *"
                />
                <label
                  htmlFor="accountsContactName"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Accounts Contact Name *
                </label>
              </div>

              {/* Accounts Phone */}
              <div className="relative w-full">
                <input
                  type="tel"
                  name="accountsPhone"
                  id="accountsPhone"
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Accounts Phone"
                />
                <label
                  htmlFor="accountsPhone"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Accounts Phone
                </label>
              </div>

              {/* Accounts Email */}
              <div className="relative w-full">
                <input
                  type="email"
                  name="accountsEmail"
                  id="accountsEmail"
                  required
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Accounts Email *"
                />
                <label
                  htmlFor="accountsEmail"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Accounts Email *
                </label>
              </div>
            </div>

            {/* Email Invoices Preference */}
            <div className="space-y-2">
              <p className="font-medium">
                Are we able to email invoices/statements? *
              </p>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="emailInvoices"
                    value="Yes"
                    className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                    required
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="emailInvoices"
                    value="No"
                    className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
              <div className="relative w-full mt-5">
                <input
                  type="email"
                  name="invoiceEmail"
                  id="invoiceEmail"
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="If yes, please provide email"
                />
                <label
                  htmlFor="invoiceEmail"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
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
                {/* Company Name 1 */}
                <div className="relative w-full">
                  <input
                    type="text"
                    name="ref1Company"
                    id="ref1Company"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Company Name 1"
                  />
                  <label
                    htmlFor="ref1Company"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Company Name 1
                  </label>
                </div>

                {/* Phone 1 */}
                <div className="relative w-full">
                  <input
                    type="tel"
                    name="ref1Phone"
                    id="ref1Phone"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Phone 1"
                  />
                  <label
                    htmlFor="ref1Phone"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Phone 1
                  </label>
                </div>

                {/* Contact Name 1 */}
                <div className="relative w-full">
                  <input
                    type="text"
                    name="ref1Contact"
                    id="ref1Contact"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Contact Name 1"
                  />
                  <label
                    htmlFor="ref1Contact"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Contact Name 1
                  </label>
                </div>

                {/* Email 1 */}
                <div className="relative w-full">
                  <input
                    type="email"
                    name="ref1Email"
                    id="ref1Email"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Email 1"
                  />
                  <label
                    htmlFor="ref1Email"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Email 1
                  </label>
                </div>
              </div>

              {/* Address 1 */}
              <div className="relative w-full">
                <textarea
                  name="ref1Address"
                  id="ref1Address"
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Address 1"
                  rows="3"
                />
                <label
                  htmlFor="ref1Address"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Address 1
                </label>
              </div>
            </div>

            {/* Reference 2 */}
            <div className="space-y-4">
              <p className="font-medium">Trade Reference 2</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name 2 */}
                <div className="relative w-full">
                  <input
                    type="text"
                    name="ref2Company"
                    id="ref2Company"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Company Name 2"
                  />
                  <label
                    htmlFor="ref2Company"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Company Name 2
                  </label>
                </div>

                {/* Phone 2 */}
                <div className="relative w-full">
                  <input
                    type="tel"
                    name="ref2Phone"
                    id="ref2Phone"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Phone 2"
                  />
                  <label
                    htmlFor="ref2Phone"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Phone 2
                  </label>
                </div>

                {/* Contact Name 2 */}
                <div className="relative w-full">
                  <input
                    type="text"
                    name="ref2Contact"
                    id="ref2Contact"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Contact Name 2"
                  />
                  <label
                    htmlFor="ref2Contact"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Contact Name 2
                  </label>
                </div>

                {/* Email 2 */}
                <div className="relative w-full">
                  <input
                    type="email"
                    name="ref2Email"
                    id="ref2Email"
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Email 2"
                  />
                  <label
                    htmlFor="ref2Email"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Email 2
                  </label>
                </div>
              </div>

              {/* Address 2 */}
              <div className="relative w-full">
                <textarea
                  name="ref2Address"
                  id="ref2Address"
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Address 2"
                  rows="3"
                />
                <label
                  htmlFor="ref2Address"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
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
              {/* Applicant Name */}
              <div className="relative w-full">
                <input
                  type="text"
                  name="applicantName"
                  id="applicantName"
                  required
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Name of Person Making Application *"
                />
                <label
                  htmlFor="applicantName"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Name of Person Making Application *
                </label>
              </div>

              {/* Position */}
              <div className="relative w-full">
                <input
                  type="text"
                  name="applicantPosition"
                  id="applicantPosition"
                  required
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Position *"
                />
                <label
                  htmlFor="applicantPosition"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Position *
                </label>
              </div>

              {/* Contact Phone */}
              <div className="relative w-full">
                <input
                  type="tel"
                  name="applicantPhone"
                  id="applicantPhone"
                  required
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Contact Phone *"
                />
                <label
                  htmlFor="applicantPhone"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Contact Phone *
                </label>
              </div>

              {/* Date */}
              <div
                className="relative w-full"
                onClick={() =>
                  document.getElementById("applicationDate").showPicker()
                }
              >
                <input
                  type="date"
                  name="applicationDate"
                  id="applicationDate"
                  required
                  className="peer w-full border border-gray-300 p-2 pt-5 pr-10 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded bg-white cursor-pointer"
                  placeholder="Date *"
                  style={{ colorScheme: "light" }}
                />
                <label
                  htmlFor="applicationDate"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black  peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
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
                name="files"
                onChange={handleChange}
                className="hidden"
                multiple
              />
            </label>
            {formData.files &&
              (Array.isArray(formData.files)
                ? formData.files.length > 0
                : !!formData.files.name) && (
                <div className="text-xs mt-2 text-gray-700">
                  {Array.isArray(formData.files)
                    ? formData.files.map((f) => f.name).join(", ")
                    : formData.files?.name}
                </div>
              )}
          </div>
          {/* Marketing Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Marketing</h2>
            <div className="space-y-4">
              {/* Discovery Method */}
              <div className="relative w-full">
                <select
                  name="discoveryMethod"
                  id="discoveryMethod"
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded appearance-none"
                >
                  <option value=""></option>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                  <option value="3">Option 3</option>
                </select>
                <label
                  htmlFor="discoveryMethod"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  How Did You Discover G2 Survey?
                </label>
              </div>

              {/* G2 Rep Name */}
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  name="g2RepName"
                  id="g2RepName"
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Name of G2 Rep (if applicable)"
                />
                <label
                  htmlFor="g2RepName"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Name of G2 Rep (if applicable)
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="cursor-pointer bg-[#e62245] text-white px-7 py-2 rounded hover:bg-[#d41d3f] transition-colors"
            >
              Submit
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
