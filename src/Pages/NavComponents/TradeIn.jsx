import { Link } from "react-router-dom";
import { useState } from "react";

const TradeIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    equipment: "",
    model: "",
    serialNumber: "",
    software: "",
    manufactureDate: "",
    condition: "",
    sellOrTrade: "",
    comments: "",
    photos: null,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: e.target.files,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send formData to your server
    console.log("Form submitted:", formData);
    // Add your API call here
    // Example:
    // fetch('/api/trade-in', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formData),
    // })
    // .then(response => response.json())
    // .then(data => console.log('Success:', data))
    // .catch(error => console.error('Error:', error));
  };

  return (
    <div className="p-2 md:p-3">
      <div className="font-light flex items-center gap-2 text-[10px]">
        <Link to="/" className="flex items-center gap-1 text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/trade-in" className="uppercase text-[#e62245]">
          Trade In
        </Link>
      </div>
      <p className="text-[#e62245] font-light mt-3 text-3xl mb-6">
        TRADE IN
      </p>
      <h1 className="text-2xl mt-2 text-[#e62245] mb-2 font-bold">
        Sell or Trade In Your Surveying Equipment
      </h1>
      <p className="mb-4">
        G2 Survey purchases Leica Geosystems survey equipment and will trade in
        Trimble, Topcon, and others against the purchase of new or used Leica
        surveying instruments.
      </p>
      <h2 className="text-[#e62245] font-bold mb-1">Our Buying Process</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>
          1. To give you our best offer, we request you complete the form below
          as fully as possible, especially the make, model, serial number,
          software, condition, and photos.
        </li>
        <li>
          2. Once we receive that information, we will review the details and
          condition and will make you an offer. When you agree to the quote,
          we'll send a purchase order for your review along with our terms and
          conditions.
        </li>
        <li>
          3. Upon approval of the purchase order, we will arrange collection.
          Once the equipment is received it will be tested and verified within 5
          working days.
        </li>
        <li>
          4. Payment is sent once condition has been verified. If the items are
          not received as expected, we may amend our offer, or return at no
          cost.
        </li>
      </ol>
      <h2 className="text-[#e62245] font-bold mb-1">Trade-Ins</h2>
      <p>
        Are you looking to trade in your survey equipment? The process is the
        same for buying your equipment! We will simply credit the offer amount
        towards the new equipment you want to purchase.
      </p>
      <div className="max-w-3xl mx-auto my-8">
        <h2 className="text-[34px] font-bold mb-1">
          Survey Equipment Sell / Trade In Offer Form
        </h2>
        <p className="mb-6">
          Please fill in the form, together with your surveying instrument
          details, and we will reply with an offer.
        </p>
        <form className="space-y-6 text-black" onSubmit={handleSubmit}>
          <p className="text-lg font-semibold">Contact Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative w-full">
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                placeholder="Name *"
              />
              <label
                htmlFor="name"
                className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                Name *
              </label>
            </div>
            <div className="relative w-full">
              <input
                type="text"
                name="company"
                id="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                placeholder="Company Name *"
              />
              <label
                htmlFor="company"
                className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                Company Name
              </label>
            </div>
            <div className="relative w-full">
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                placeholder="Email *"
              />
              <label
                htmlFor="email"
                className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                Email *
              </label>
            </div>
            <div className="relative w-full">
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                placeholder="Phone *"
              />
              <label
                htmlFor="phone"
                className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
              >
                Phone *
              </label>
            </div>
          </div>
          <div className="space-y-4 text-sm text-gray-800">
            <div className="space-y-4">
              <label className="block text-lg font-semibold mb-5">
                Surveying Equipment Details
              </label>
              <div>
                <label className="block mb-1">Instrument Make *</label>
                <select
                  className="w-full border appearance-none p-4 focus:outline-none focus:ring focus:ring-[#e62245]"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleChange}
                  required
                >
                  <option value=""></option>
                  <option value="Leica">Leica</option>
                  <option value="Sokkia">Sokkia</option>
                  <option value="Topcon">Topcon</option>
                  <option value="Trimble">Trimble</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    name="model"
                    id="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Instrument Model"
                  />
                  <label
                    htmlFor="model"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Instrument Model *
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    name="serialNumber"
                    id="serialNumber"
                    required
                    value={formData.serialNumber}
                    onChange={handleChange}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Serial Number/s"
                  />
                  <label
                    htmlFor="serialNumber"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Serial Number/s
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    name="software"
                    id="software"
                    required
                    value={formData.software}
                    onChange={handleChange}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Software/Apps"
                  />
                  <label
                    htmlFor="software"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Software/Apps
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    name="manufactureDate"
                    id="manufactureDate"
                    required
                    value={formData.manufactureDate}
                    onChange={handleChange}
                    className="peer w-full border border-gray-300 p-2 pt-5 placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245] rounded"
                    placeholder="Manufacture Date"
                  />
                  <label
                    htmlFor="manufactureDate"
                    className="absolute pl-2 left-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                  >
                    Manufacture Date
                  </label>
                </div>
              </div>
              <div className="">
                <div className="mb-4">
                  <label className="block mb-2">Equipment Condition *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((number) => (
                      <label key={number} className="flex-1 relative">
                        <input
                          type="radio"
                          name="condition"
                          value={number}
                          checked={formData.condition === number.toString()}
                          onChange={handleChange}
                          className="peer sr-only"
                          required
                        />
                        <div className="w-full text-center py-4 border rounded cursor-pointer peer-checked:bg-[#e62245] peer-checked:text-white peer-checked:border-[#e62245] hover:border-[#e62245]">
                          {number}
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex text-gray-400 justify-between text-sm mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Sell or Trade In? *</label>
                <div className="flex space-x-20 gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sellOrTrade"
                      value="sell"
                      checked={formData.sellOrTrade === "sell"}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#e62245] bg-gray-200 border-gray-300 focus:ring-[#e62245] checked:bg-[#e62245] accent-[#e62245]"
                      required
                    />
                    <span className="text-sm">Sell</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sellOrTrade"
                      value="tradeIn"
                      checked={formData.sellOrTrade === "tradeIn"}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#e62245] bg-gray-200 border-gray-300 focus:ring-[#e62245] checked:bg-[#e62245] accent-[#e62245]"
                    />
                    <span className="text-sm">Trade In</span>
                  </label>
                </div>
              </div>
              <div className="relative w-full">
                <textarea
                  name="comments"
                  id="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  className="peer w-full border border-gray-300 p-2 pt-5 h-24 rounded placeholder-transparent focus:outline-none focus:ring focus:ring-[#e62245]"
                  placeholder="Comments"
                ></textarea>
                <label
                  htmlFor="comments"
                  className="absolute left-2 px-2 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-black peer-focus:top-2 peer-focus:text-xs peer-focus:text-black"
                >
                  Comments
                </label>
              </div>
              <div>
                <p className="mb-2">Please attach photos if applicable:</p>
                <label className="border-2 border-dashed border-gray-300 rounded p-8 text-center text-sm text-black block cursor-pointer">
                  <span className="text-[#e62245]">Choose file</span> or drop
                  here
                  <input
                    type="file"
                    name="photos"
                    onChange={handleChange}
                    className="hidden"
                    multiple
                  />
                </label>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#e62245] text-white px-7 py-2 rounded hover:bg-[#d41d3f] transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Please fill in the form, together with your surveying instrument
              details, and we will reply with an estimate. For queries please{" "}
              <Link to="/contact-us" className="text-[#e62245] underline">
                contact us...
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              This site is protected by reCAPTCHA and the Google{" "}
              <Link to="/privacy" className="text-[#e62245] underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/terms" className="text-[#e62245] underline">
                Terms of Service
              </Link>{" "}
              apply.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeIn;
