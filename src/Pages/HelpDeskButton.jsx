import { useState, useEffect } from "react";

const HelpDeskButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // Show the button every 15 seconds
    const showInterval = setInterval(() => {
      setIsVisible(true);

      // Hide after 5 seconds
      const hideTimeout = setTimeout(() => {
        if (!showInfo) {
          // Only hide if info panel isn't open
          setIsVisible(false);
        }
      }, 50000);

      return () => clearTimeout(hideTimeout);
    }, 5000);

    return () => clearInterval(showInterval);
  }, [showInfo]);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
    if (!showInfo) {
      setIsVisible(true); // Keep visible when info is shown
    }
  };

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {showInfo ? (
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-md border border-gray-200">
          <div className="flex justify-between items-center mb-1 gap-2">
            <h3 className="font-bold text-lg text-gray-800">Contact Support</h3>
            <button
              onClick={toggleInfo}
              className="text-gray-500 cursor-pointer hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="space-y-1">
            <div>
              <p className="text-sm text-gray-600">Helpline Number:</p>
              <p className="font-medium text-crimson-red">+1 (123) 456-7890</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">WhatsApp:</p>
              <p className="font-medium text-crimson-red">+1 (987) 654-3210</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email:</p>
              <p className="font-medium text-crimson-red">support@ts.com</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute -top-3 right-1 transform translate-x-full bg-white text-crimson-red text-xs font-semibold px-2 py-1 rounded shadow-md whitespace-nowrap">
            Need Support?
            <div className="absolute top-1/2 -left-1 w-2 h-2 bg-white transform -translate-y-1/2 rotate-45"></div>
          </div>
          <button
            onClick={toggleInfo}
            className="bg-crimson-red cursor-pointer text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
            aria-label="Help Desk"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default HelpDeskButton;
