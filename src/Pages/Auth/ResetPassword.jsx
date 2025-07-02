const ResetPassword = () => {
  return (
    <div className="flex justify-center items-center py-12 bg-white">
      <div className="w-full max-w-xl px-4">
        <div className="text-sm text-gray-500 mb-2">
          <span className="text-black hover:underline cursor-pointer">
            Home
          </span>{" "}
          / <span className="text-red-600">Forgot Password</span>
        </div>
        <h2 className="text-2xl text-gray-700 mb-4">Reset Password</h2>
        <p className="text-sm text-gray-700 mb-6 leading-relaxed">
          Fill in your email below to request a new password. An email will be
          sent to the address below containing a link to verify your email
          address.
        </p>
        <div className="flex">
          <input
            type="email"
            placeholder="Email Address"
            className="flex-grow px-4 py-2 border border-gray-300 focus:outline-none focus:ring focus:ring-red-500"
          />
          <button className="bg-red-600 text-white font-semibold px-6 rounded-r-md hover:bg-red-700">
            RESET PASSWORD
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
