import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "demo@gmail.com";
  return (
    <div className="max-w-xl mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold text-green-600">
        Your account has been created
      </h1>
      <p className="mt-4 text-gray-700">
        Thank you for creating your account at TSGB Survey.
      </p>
      <p className="mt-2 text-gray-700">
        Your account details have been emailed to <strong>{email}</strong>
      </p>

      <button
        onClick={() => navigate("/shop-all")}
        className="mt-6 bg-[#e62245] text-white px-8 py-2 rounded hover:bg-[#d41f3f] text-[18px] cursor-pointer font-bold uppercase"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default WelcomePage;
