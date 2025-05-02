const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-6">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-center">
        <h1 className="text-2xl font-bold text-yellow-600 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-700">You have cancelled the payment process.</p>
        <p className="text-sm text-gray-500 mt-4">You can try again later.</p>
      </div>
    </div>
  );
};

export default PaymentCancel;
