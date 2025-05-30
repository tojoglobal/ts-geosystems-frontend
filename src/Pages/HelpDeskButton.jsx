import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HelpDeskButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [closing, setClosing] = useState(false);
  const [opening, setOpening] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  // Show/hide logic for the main button
  useEffect(() => {
    const showButton = () => {
      setIsVisible(true);

      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId);

      // Set new timeout to hide after 5 seconds if info isn't shown
      const id = setTimeout(() => {
        if (!showInfo) {
          setIsVisible(false);
        }
      }, 5000);

      setTimeoutId(id);
    };

    // Initial show after 1 second
    const initialTimeout = setTimeout(showButton, 1000);

    // Set interval to show every 10 seconds
    const interval = setInterval(showButton, 10000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showInfo]);

  const toggleInfo = () => {
    if (showInfo) {
      // Close the info panel with scale animation
      setClosing(true);
      setTimeout(() => {
        setShowInfo(false);
        setClosing(false);
        // Don't hide the main button immediately after closing
      });
    } else {
      // Open the info panel with scale animation
      setShowInfo(true);
      setOpening(true);
      setTimeout(() => setOpening(false), 300);
      // Keep visible when info is shown
      setIsVisible(true);
      // Clear the auto-hide timeout when opening
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {showInfo ? (
        <div
          className={`bg-white p-3 rounded-xl shadow-lg max-w-sm w-[280px] border border-gray-200 transition-all duration-300 ease-in-out ${
            opening ? "animate-scaleIn" : closing ? "animate-scaleOut" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-1 gap-1">
            <h3 className="font-bold text-lg text-center text-gray-800">Contact Support</h3>
            <button
              onClick={toggleInfo}
              className="text-gray-500 text-lg cursor-pointer hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm text-gray-600">Helpline Number:</p>
              <p className="font-medium text-crimson-red">+1 (123) 456-7890</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-sm text-gray-600">WhatsApp:</p>
              <p className="font-medium text-crimson-red">+1 (987) 654-3210</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-sm text-gray-600">Email:</p>
              <p className="font-medium text-crimson-red">support@ts.com</p>
            </div>
            <div className="w-full">
              <Link
                to="/contact-us"
                className="inline-block w-full justify-center text-center bg-crimson-red text-white px-4 py-1 rounded-[4px] font-semibold mt-2 shadow hover:bg-red-700 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`relative w-fit transition-transform duration-500 ease-in-out ${
            isVisible ? "translate-x-0" : "-translate-x-full"
          }`}
        >
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
