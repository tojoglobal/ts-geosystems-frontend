import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HelpDeskButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [closing, setClosing] = useState(false);
  const [opening, setOpening] = useState(false); // New state for opening animation

  useEffect(() => {
    // Show the button every 15 seconds
    const showInterval = setInterval(() => {
      setIsVisible(true);

      // Hide after 5 seconds if info is not shown
      const hideTimeout = setTimeout(() => {
        if (!showInfo) {
          setIsVisible(false);
        }
      }, 5000);

      return () => clearTimeout(hideTimeout);
    }, 10000);

    // Show the popup the first time after 1s
    const initialTimeout = setTimeout(() => setIsVisible(true), 1000);

    return () => {
      clearInterval(showInterval);
      clearTimeout(initialTimeout);
    };
  }, [showInfo]);

  const toggleInfo = () => {
    if (showInfo) {
      setClosing(true); // Start closing animation
      setTimeout(() => {
        setShowInfo(false);
        setClosing(false); // Reset closing state after animation
        setIsVisible(false); // Hide the button after closing
      }, 500); // Duration of closing animation
    } else {
      setShowInfo(true);
      setOpening(true); // Start opening animation
      setTimeout(() => {
        setOpening(false); // Reset opening state after animation
      }, 500);
      setIsVisible(true); // Keep visible when info is shown
    }
  };

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${
        showInfo
          ? "translate-x-0"
          : isVisible
          ? "translate-x-0"
          : "-translate-x-full" // Move left when hidden
      }
      ${closing ? "-translate-x-full" : "translate-x-0"} `} // Slide left on closing
    >
      {showInfo ? (
        <div
          className={`bg-white p-3 rounded-xl shadow-lg max-w-sm w-[280px] border border-gray-200 transition-all duration-300 ease-in-out ${
            opening ? "animate-scaleIn" : closing ? "animate-scaleOut" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-1 gap-1">
            <h3 className="font-bold text-lg text-gray-800">Contact Support</h3>
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
            isVisible ? "translate-x-0" : "-translate-x-full" // Slide in from left when it appears
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
