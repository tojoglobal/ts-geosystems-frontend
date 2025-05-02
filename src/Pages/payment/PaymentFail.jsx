const PaymentFail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h1>
        <p className="text-gray-700">
          Unfortunately, your transaction could not be completed.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Please try again or contact support.
        </p>
      </div>
    </div>
  );
};

export default PaymentFail;
