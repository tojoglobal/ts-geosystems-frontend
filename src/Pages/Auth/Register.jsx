import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
   const [formData, setFormData] = useState({
      email: "",
      confirmPassword: "",
      lastName: "",
      phoneNumber: "",
      addressLine1: "",
      city: "",
      country: "",
      password: "",
      firstName: "",
      postcode: "",
      companyName: "",
      addressLine2: "",
      countyState: "",
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
         ...prevState,
         [name]: value
      }));
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form Data:', formData);
      // Add your form submission logic here
   };

   const handleCaptchaChange = (value) => {
      console.log("Captcha value:", value);
   };

   const countries = [
      "Afghanistan", "Albania", "Algeria", "Argentina", "Australia",
      "Austria", "Bahrain", "Bangladesh", "Belgium", "Bhutan",
      "Brazil", "Bulgaria", "Cambodia", "Canada", "China",
      "Colombia", "Croatia", "Czech Republic", "Denmark", "Egypt",
      "Finland", "France", "Germany", "Greece", "Hungary",
      "Iceland", "India", "Indonesia", "Iran", "Iraq",
      "Ireland", "Israel", "Italy", "Japan", "Jordan",
      "Kazakhstan", "Kenya", "Kuwait", "Laos", "Lebanon",
      "Malaysia", "Maldives", "Mexico", "Morocco", "Myanmar",
      "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway",
      "Oman", "Pakistan", "Philippines", "Poland", "Portugal",
      "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore",
      "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden",
      "Switzerland", "Taiwan", "Thailand", "Turkey", "UAE",
      "UK", "USA", "Ukraine", "Vietnam", "Yemen"
   ];

   return (
      <div className="min-h-screen bg-white">
         <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-6 text-sm">
               <Link to="/" className="hover:text-[#e62245]">
                  Home
               </Link>
               <span>/</span>
               <span className="text-[#e62245]">Create Account</span>
            </div>
            <div>
               <h1 className="text-2xl font-medium mb-6">New Account</h1>
               <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        Email Address<span className="text-red-600">*</span>
                     </label>
                     <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        Password<span className="text-red-600">*</span>
                     </label>
                     <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        Confirm Password<span className="text-red-600">*</span>
                     </label>
                     <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  {/* First Name */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        First Name<span className="text-red-600">*</span>
                     </label>
                     <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        Last Name<span className="text-red-600">*</span>
                     </label>
                     <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  {/* Postcode/Zip */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        Postcode/Zip<span className="text-red-600">*</span>
                     </label>
                     <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                     </label>
                     <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        Company Name
                     </label>
                     <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                  </div>

                  {/* Address Line 1 */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        Address Line 1<span className="text-red-600">*</span>
                     </label>
                     <input
                        type="text"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  {/* Address Line 2 */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        Address Line 2
                     </label>
                     <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        City<span className="text-red-600">*</span>
                     </label>
                     <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  {/* County/State */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        County/State<span className="text-red-600">*</span>
                     </label>
                     <input
                        type="text"
                        name="countyState"
                        value={formData.countyState}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     />
                  </div>

                  {/* Country */}
                  <div className="space-y-1">
                     <label className="block text-sm font-medium text-gray-700">
                        Country<span className="text-red-600">*</span>
                     </label>
                     <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                     >
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                           <option key={country} value={country}>
                              {country}
                           </option>
                        ))}
                     </select>
                  </div>

                  {/* reCAPTCHA - Full Width */}
                  <div className="col-span-full">
                     <ReCAPTCHA
                        sitekey="YOUR_RECAPTCHA_SITE_KEY"
                        onChange={handleCaptchaChange}
                     />
                  </div>

                  {/* Submit Button - Full Width */}
                  <div className="col-span-full">
                     <button
                        type="submit"
                        className="bg-[#e62245] text-white px-8 py-2 rounded hover:bg-[#d41f3f]"
                     >
                        CREATE ACCOUNT
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default Register;
