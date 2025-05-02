const PaymentIpn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">IPN Received</h1>
        <p className="text-gray-700">
          We have received the payment notification from SSLCOMMERZ.
        </p>
        <p className="text-sm text-gray-500 mt-4">You may close this window.</p>
      </div>
    </div>
  );
};

export default PaymentIpn;
