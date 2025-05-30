import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const HelpDeskButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [panelAnim, setPanelAnim] = useState("");
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const startLoop = () => {
      // Show the button
      setIsVisible(true);

      // Set timeout to hide after 5 seconds if panel is not open
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (!showInfo) {
          setIsVisible(false);
        }
      }, 5000); // Show for 5 seconds
    };

    // Initial show after 15 seconds
    const initialDelay = setTimeout(startLoop, 13000); // Wait 15 seconds before first show

    // Set interval for subsequent shows (13 seconds hide + 5 seconds show = 20 second cycle)
    intervalRef.current = setInterval(() => {
      if (!showInfo) {
        // Only run the loop if the info panel is not open
        startLoop();
      }
    }, 18000); // 15 seconds hidden + 5 seconds visible = 20 seconds total cycle

    return () => {
      clearTimeout(initialDelay);
      clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showInfo]); // Re-run effect if showInfo changes

  const openPanel = () => {
    setShowInfo(true);
    setPanelAnim("animate-scaleIn");
    setIsVisible(true); // Keep button visible while panel is open
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Clear any pending hide timeout
    setTimeout(() => setPanelAnim(""), 300);
  };

  const closePanel = () => {
    setPanelAnim("animate-scaleOut");
    setTimeout(() => {
      setShowInfo(false);
      setPanelAnim("");
      // After closing, restart the visibility logic from the start of a "hide" phase
      setIsVisible(false); // Hide immediately after closing
      if (intervalRef.current) clearInterval(intervalRef.current); // Clear existing interval
      if (timeoutRef.current) clearTimeout(timeoutRef.current); // Clear existing timeout
      // Restart the loop from the beginning of a 15-second hide
      intervalRef.current = setInterval(() => {
        if (!showInfo) {
          setIsVisible(true);
          timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
          }, 5000);
        }
      }, 18000); // 15 seconds hidden + 5 seconds visible = 20 seconds total cycle
    }, 300);
  };

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {showInfo ? (
        <div
          className={`bg-white p-3 rounded-xl shadow-lg max-w-sm w-[280px] border border-gray-200 ${panelAnim}`}
        >
          <div className="flex justify-between items-center mb-1 gap-1">
            <h3 className="font-bold text-center flex-1 text-gray-800">
              Contact Support
            </h3>
            <button
              onClick={closePanel}
              className="text-gray-500 text-lg cursor-pointer hover:text-gray-700 ml-2"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-1">
              <p className="text-gray-600">Helpline Number:</p>
              <p className="font-medium text-crimson-red">+1 (123) 456-7890</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-gray-600">WhatsApp:</p>
              <p className="font-medium text-crimson-red">+1 (987) 654-3210</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-gray-600">Email:</p>
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
            onClick={openPanel}
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
