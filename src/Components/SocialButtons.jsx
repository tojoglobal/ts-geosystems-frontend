import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";

const SocialButtons = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 w-full max-w-md mx-auto z-10">
      {/* Facebook */}
      <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <div
          className="flex justify-center items-center bg-[#155dfc] px-1 py-1 h-8"
          style={{ transform: "skewX(-15deg)" }}
        >
          <div
            style={{ transform: "skewX(15deg)" }}
            className="flex items-center text-sm"
          >
            <FaFacebookF className="text-white text-xs mr-1" />
            <span className="text-white text-[10px]">Facebook</span>
          </div>
        </div>
      </Link>
      {/* Twitter */}
      <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <div
          className="flex justify-center items-center bg-black px-1 py-1 h-8"
          style={{ transform: "skewX(-15deg)" }}
        >
          <div
            style={{ transform: "skewX(15deg)" }}
            className="flex items-center text-sm"
          >
            <FaXTwitter className="text-white text-xs mr-1" />
            <span className="text-white text-[10px]">Twitter</span>
          </div>
        </div>
      </Link>
      {/* LinkedIn */}
      <Link to="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        <div
          className="flex justify-center items-center bg-[#006097] px-1 py-1 h-8"
          style={{ transform: "skewX(-15deg)" }}
        >
          <div
            style={{ transform: "skewX(15deg)" }}
            className="flex items-center text-sm"
          >
            <FaLinkedinIn className="text-white text-xs mr-1" />
            <span className="text-white text-[10px]">LinkedIn</span>
          </div>
        </div>
      </Link>
      {/* Instagram */}
      <Link
        to="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          className="flex justify-center items-center bg-[#E1306C] px-1 py-1 h-8"
          style={{ transform: "skewX(-15deg)" }}
        >
          <div
            style={{ transform: "skewX(15deg)" }}
            className="flex items-center text-sm"
          >
            <FaInstagram className="text-white text-xs mr-1" />
            <span className="text-white text-[10px]">Instagram</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SocialButtons;
