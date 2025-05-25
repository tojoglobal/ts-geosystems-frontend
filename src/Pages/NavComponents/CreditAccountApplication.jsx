import { Link } from "react-router-dom";

const CreditAccountApplication = () => {
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
        {" "}
        <p className="mb-6 text-sm">
          Please fill in the form, together with your any specific requirements,
          and we will reply with a customized quote. For queries please{" "}
          <Link to="/contact-us" className="text-[#e62245] underline">
            contact us...
          </Link>
        </p>
        <form className="space-y-6">
          {/* Company Details Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Company Details</h2>
            <div className="space-y-4">
              <div className="relative w-full">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Company Name *"
                />
                <label
                  htmlFor="name"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Company Name *
                </label>
              </div>
              <div className="relative w-full">
                <input
                  type="text"
                  name="Trading Name"
                  id="Trading Name"
                  required
                  className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                  placeholder="Trading Name (if different)"
                />
                <label
                  htmlFor="Trading Name"
                  className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Trading Name (if different)
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea
                  placeholder="Invoice Address *"
                  className="w-full p-2 border rounded"
                  rows="3"
                  required
                />
                <textarea
                  placeholder="Delivery Address *"
                  className="w-full p-2 border rounded"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea
                  placeholder="Registered Office (if different)"
                  className="w-full p-2 border rounded"
                  rows="3"
                />
                <textarea
                  placeholder="Trading Address (if different)"
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              <div className="space-y-2">
                <p className="font-medium">Type of Company *</p>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="companyType"
                      value="Limited"
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
                      className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                    />
                    <span className="text-sm">PLC</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="companyType"
                      value="Sole Trader"
                      className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                    />
                    <span className="text-sm">Sole Trader</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="companyType"
                      value="Partnership"
                      className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                    />
                    <span className="text-sm">Partnership</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="companyType"
                      value="Other"
                      className="w-5 h-5 cursor-pointer appearance-none rounded-full border-[2px] border-gray-300 checked:border-[5px] checked:border-[#e62245] checked:bg-white bg-[#e7e7e7] transition-all duration-150"
                    />
                    <span className="text-sm">Other</span>
                  </label>
                </div>
              </div>
              <textarea
                placeholder="If a partnership or proprietorship, please provide names and addresses of partners/proprietors"
                className="w-full p-2 border rounded"
                rows="3"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="VAT Number"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Company Number"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="date"
                  placeholder="Date of Incorporation"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="url"
                  placeholder="Website"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Buyers Contact Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="tel"
                placeholder="Buyers Phone"
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Buyers Email"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Accounts Contact Name *"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="tel"
                placeholder="Accounts Phone"
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Accounts Email *"
                className="w-full p-2 border rounded"
                required
              />
            </div>
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
              <input
                type="email"
                placeholder="If yes, please provide email"
                className="w-full p-2 border rounded mt-2"
              />
            </div>
          </div>

          {/* Trade References Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Trade References</h2>
            {/* Reference 1 */}
            <div className="space-y-4">
              <p className="font-medium">Trade Reference 1</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company Name 1"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="tel"
                  placeholder="Phone 1"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Contact Name 1"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email 1"
                  className="w-full p-2 border rounded"
                />
              </div>
              <textarea
                placeholder="Address 1"
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
            {/* Reference 2 */}
            <div className="space-y-4">
              <p className="font-medium">Trade Reference 2</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company Name 2"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="tel"
                  placeholder="Phone 2"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Contact Name 2"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email 2"
                  className="w-full p-2 border rounded"
                />
              </div>
              <textarea
                placeholder="Address 2"
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>
          </div>

          {/* Signatory Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Signatory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name of Person Making Application *"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Position *"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="tel"
                placeholder="Contact Phone *"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="date"
                placeholder="Date *"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="border-2 border-dashed p-4 text-center rounded">
              <p className="text-gray-600">
                Company Letter Head, BACS Details & Signature
              </p>
              <button type="button" className="text-blue-600 hover:underline">
                Choose file
              </button>
              <p className="text-sm text-gray-500">or drop here</p>
            </div>
          </div>

          {/* Marketing Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Marketing</h2>
            <div className="space-y-4">
              <select className="w-full p-2 border rounded">
                <option value="">How Did You Discover G2 Survey?</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </select>
              <input
                type="text"
                placeholder="Name of G2 Rep (if applicable)"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#e62245] text-white py-2 px-4 rounded hover:bg-[#d41f3f] transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreditAccountApplication;
