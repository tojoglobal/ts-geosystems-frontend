import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa6";

const SocialButtons = ({ contactInfo }) => {
  const { socialLinks } = contactInfo || {};

  const buttons = [
    {
      name: "Facebook",
      icon: <FaFacebookF className="text-white text-xs mr-1" />,
      url: socialLinks?.facebook,
      bg: "#155dfc",
    },
    {
      name: "Twitter",
      icon: <FaXTwitter className="text-white text-xs mr-1" />,
      url: socialLinks?.twitter,
      bg: "#000000",
    },
    {
      name: "YouTube",
      icon: <FaYoutube className="text-white text-xs mr-1" />,
      url: socialLinks?.youtube,
      bg: "#FF0000",
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="text-white text-xs mr-1" />,
      url: socialLinks?.instagram,
      bg: "#E1306C",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 w-full max-w-md mx-auto z-10">
      {buttons.map(
        (btn) =>
          btn.url && (
            <Link
              key={btn.name}
              to={btn.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="flex justify-center items-center px-1 py-1 h-8"
                style={{ backgroundColor: btn.bg, transform: "skewX(-15deg)" }}
              >
                <div
                  style={{ transform: "skewX(15deg)" }}
                  className="flex items-center text-sm"
                >
                  {btn.icon}
                  <span className="text-white text-[10px]">{btn.name}</span>
                </div>
              </div>
            </Link>
          )
      )}
    </div>
  );
};

export default SocialButtons;
