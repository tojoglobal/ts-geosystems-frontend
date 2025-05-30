import Swal from "sweetalert2";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAxiospublic } from "../Hooks/useAxiospublic";
import useDataQuery from "../utils/useDataQuery";
import {
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa6";
import { SkeletonLoader } from "../utils/Loader/SkeletonLoader";

const Footer = () => {
  const { user } = useSelector((state) => state.authUser);
  const axiosPublic = useAxiospublic();
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact info for social links (kept as before)
  const { data: contactInfo, isLoading: contactInfoLoading } = useDataQuery(
    ["contactInfo"],
    "/api/admin-contact-us"
  );
  const socialLinks = contactInfo?.socialLinks || {};

  // Load footer data from the API
  const { data } = useDataQuery(["footerData"], "/api/footer");
  const footerData = data?.data || {};

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await axiosPublic.post("/api/subscribers", { email });
      Swal.fire({
        title: "Success!",
        text: res.data.message,
        icon: "success",
      });
      setEmail("");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Failed to subscribe",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // All values come from database, do not fallback to defaults!
  const address1 = footerData.address1 || "";
  const address2 = footerData.address2 || "";
  const iso_image_url_1 = footerData.iso_image_url_1
    ? `${import.meta.env.VITE_OPEN_APIURL || ""}${footerData.iso_image_url_1}`
    : "";
  const iso_image_url_2 = footerData.iso_image_url_2
    ? `${import.meta.env.VITE_OPEN_APIURL || ""}${footerData.iso_image_url_2}`
    : "";
  const iso_image_url_3 = footerData.iso_image_url_3
    ? `${import.meta.env.VITE_OPEN_APIURL || ""}${footerData.iso_image_url_3}`
    : "";
  const mailing_title = footerData.mailing_title || "";
  const mailing_text = footerData.mailing_text || "";
  const bg_color = footerData.bg_color || "";

  return (
    <footer
      className="text-white pt-8 md:pt-12"
      style={{ backgroundColor: bg_color }}
    >
      <div className="max-w-[89%] md:max-w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">CONTACT US</h2>
          <p className="text-sm mb-2">
            {address1 && (
              <>
                {address1}
                <br />
              </>
            )}
          </p>
          <p className="text-sm mb-4">
            {address2 && (
              <>
                {address2}
                <br />
              </>
            )}
          </p>
          <div className="flex gap-2 mt-4">
            {iso_image_url_1 && (
              <img src={iso_image_url_1} alt="ISO" className="h-12 w-14" />
            )}
            {iso_image_url_2 && (
              <img src={iso_image_url_2} alt="ISO" className="h-12 w-14" />
            )}
            {iso_image_url_3 && (
              <img src={iso_image_url_3} alt="ISO" className="h-12 w-14" />
            )}
          </div>
        </div>
        {/* Accounts & Orders */}
        <div>
          <h2 className="text-xl font-semibold mb-4">ACCOUNTS & ORDERS</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-1">
              <Link to="/user/login">Login</Link>
              <span>or</span>
              <Link to="/user/create_account">Sign Up</Link>
            </li>
            <li>
              <Link to="/account/orders">My Account</Link>
            </li>
            <li>
              <Link to="/order-status">Order Status</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms & Service</Link>
            </li>
          </ul>
        </div>
        {/* Navigate */}
        <div>
          <h2 className="text-xl font-semibold mb-4">NAVIGATE</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/hire">HIRE</Link>
            </li>
            <li>
              <Link to="/service">SERVICE</Link>
            </li>
            <li>
              <Link to="/support">SUPPORT</Link>
            </li>
            <li>
              <Link to="/trade-in">TRADE IN</Link>
            </li>
            <li>
              <Link to="/ts-blog">BLOG</Link>
            </li>
            <li>
              <Link to="/about-us">ABOUT US</Link>
            </li>
            <li>
              <Link to="/contact-us">CONTACT US</Link>
            </li>
          </ul>
        </div>
        {/* Mailing List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{mailing_title}</h2>
          <p className="text-sm mb-4">{mailing_text}</p>
          <form onSubmit={handleSubscribe} className="flex mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your E-mail"
              className="w-full py-2 px-3 placeholder:text-sm placeholder:italic placeholder:text-black text-sm italic placeholder:font-normal bg-white rounded-l-[4px]"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#af1334] cursor-pointer px-4 py-2 rounded-r-sm font-medium ${
                isSubmitting ? "opacity-75" : ""
              }`}
            >
              {isSubmitting ? "Joining..." : "JOIN"}
            </button>
          </form>
          {contactInfoLoading ? (
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonLoader key={i} className="w-8 h-8 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 w-full max-w-md mx-auto z-10">
              {buttons.map((btn) => (
                <Link
                  key={btn.name}
                  to={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className="flex justify-center items-center px-1 py-1 h-8"
                    style={{
                      backgroundColor: btn.bg,
                      transform: "skewX(-15deg)",
                    }}
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
              ))}
            </div>
          )}
        </div>
      </div>
      <hr className="border-gray-400 pt-2 mb-4" />
      <div className="max-w-[85%] mx-auto flex flex-col md:flex-row justify-between items-center text-sm pb-6">
        <p>
          TS Geosystem © All rights reserved |{" "}
          <Link to="/sitemap">Sitemap</Link>
        </p>
        <div className="text-white text-center">
          <p>
            Provided by{" "}
            <a
              href="https://tojoglobal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#db7084] font-semibold hover:underline"
            >
              TOJO Global
            </a>
          </p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <img
            src="https://ts-geosystems.com.bd/assets/images/16305963101621960148credit-cards-footer.png"
            alt="Visa"
            className="h-6"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
