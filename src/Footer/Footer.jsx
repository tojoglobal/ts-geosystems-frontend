import Swal from "sweetalert2";
import { useState } from "react";
import { useSelector } from "react-redux";
import SocialButtons from "../Components/SocialButtons";
import { Link } from "react-router-dom";
import { useAxiospublic } from "../Hooks/useAxiospublic";

const Footer = () => {
  const { user } = useSelector((state) => state.authUser);
  const axiosPublic = useAxiospublic();
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <footer className="bg-[#585c5d] text-white pt-12">
      <div className="max-w-[85%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">CONTACT US</h2>
          <p className="text-sm mb-2">
            Banglamotor, Rusul view 65 Mymensingh Road (7th floor)
            <br />
            Dhaka-1000, Bangladesh.
          </p>
          <p className="text-sm mb-4">
            Banglamotor, Rusul view 65 Mymensingh Road (7th floor)
            <br />
            Dhaka-1000, Bangladesh.
          </p>
          <div className="flex gap-4 mt-4">
            <img
              src="https://ts-geosystems.com.bd/assets/images/ISO-WHITE.png"
              alt="ISO"
              className="h-12"
            />
            {/* <img src="/ur.png" alt="UR" className="h-8" />
            <img src="/ea-jas.png" alt="EA-JAS" className="h-8" /> */}
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
          <h2 className="text-xl font-semibold mb-4">JOIN OUR MAILING LIST</h2>
          <p className="text-sm mb-4">
            Signup for our newsletter to receive specials and up to date product
            news and releases.
          </p>
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
          <SocialButtons />
        </div>
      </div>
      <hr className="border-gray-400 pt-2 mb-4" />
      <div className="max-w-[85%] mx-auto flex flex-col md:flex-row justify-between items-center text-sm pb-6">
        <p>
          TS Geosystem © All rights reserved |{" "}
          <Link to="/sitemap">Sitemap</Link>
        </p>
        <div className="bg-[#585c5d] text-white text-center">
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
          {/* <img src="/paypal.png" alt="Paypal" className="h-6" />
          <img src="/vice.png" alt="Vice" className="h-6" />
          <img src="/electic.png" alt="Electic" className="h-6" />
          <img src="/amex.png" alt="Amex" className="h-6" />
          <img src="/discover.png" alt="Discover" className="h-6" /> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
