import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useDataQuery from "../utils/useDataQuery";

const HelpDeskButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [panelAnim, setPanelAnim] = useState("");
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Fetch dynamic info
  const { data: info, isLoading } = useDataQuery(
    ["helpdeskInfo"],
    "/api/helpdesk-info"
  );

  useEffect(() => {
    const startLoop = () => {
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (!showInfo) setIsVisible(false);
      }, 5000);
    };

    const initialDelay = setTimeout(startLoop, 13000);

    intervalRef.current = setInterval(() => {
      if (!showInfo) startLoop();
    }, 18000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showInfo]);

  const openPanel = () => {
    setShowInfo(true);
    setPanelAnim("animate-scaleIn");
    setIsVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTimeout(() => setPanelAnim(""), 300);
  };

  const closePanel = () => {
    setPanelAnim("animate-scaleOut");
    setTimeout(() => {
      setShowInfo(false);
      setPanelAnim("");
      setIsVisible(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      intervalRef.current = setInterval(() => {
        if (!showInfo) {
          setIsVisible(true);
          timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
          }, 5000);
        }
      }, 18000);
    }, 300);
  };

  if (isLoading) return null;

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
              {info?.title || "Support"}
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
            {info?.helpline_number && (
              <div className="flex items-center gap-1">
                <p className="text-gray-600">Helpline Number:</p>
                <p className="font-medium text-crimson-red">
                  {info.helpline_number}
                </p>
              </div>
            )}
            {info?.whatsapp && (
              <div className="flex items-center gap-1">
                <p className="text-gray-600">WhatsApp:</p>
                <p className="font-medium text-crimson-red">{info.whatsapp}</p>
              </div>
            )}
            {info?.email && (
              <div className="flex items-center gap-1">
                <p className="text-gray-600">Email:</p>
                <p className="font-medium text-crimson-red">{info.email}</p>
              </div>
            )}
            <div className="w-full">
              <Link
                to={info?.contact_btn_link || "/contact-us"}
                className="inline-block w-full justify-center text-center bg-crimson-red text-white px-4 py-1 rounded-[4px] font-semibold mt-2 shadow hover:bg-red-700 transition"
              >
                {info?.contact_btn_label || "Contact Us"}
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
            {info?.tooltip_text || "Need Support?"}
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
