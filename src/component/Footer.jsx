import React from "react";
import { FaFacebookF, FaLinkedinIn, FaPrint } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
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
                        <img src="/iso.png" alt="ISO" className="h-8" />
                        <img src="/ur.png" alt="UR" className="h-8" />
                        <img src="/ea-jas.png" alt="EA-JAS" className="h-8" />
                    </div>
                </div>

                {/* Accounts & Orders */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        ACCOUNTS & ORDERS
                    </h2>
                    <ul className="space-y-2 text-sm">
                        <li>Login or SignUp</li>
                        <li>Order Status</li>
                        <li>Privacy Policy</li>
                        <li>Terms & Service</li>
                    </ul>
                </div>

                {/* Navigate */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">NAVIGATE</h2>
                    <ul className="space-y-2 text-sm">
                        <li>HIRE</li>
                        <li>SERVICE</li>
                        <li>SUPPORT</li>
                        <li>TRADE IN</li>
                        <li>BLOG</li>
                        <li>ABOUT US</li>
                        <li>CONTACT US</li>
                    </ul>
                </div>

                {/* Mailing List */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        JOIN OUR MAILING LIST
                    </h2>
                    <p className="text-sm mb-4">
                        Signup for our newsletter to receive specials and up to
                        date product news and releases.
                    </p>
                    <div className="flex mb-4">
                        <input
                            type="email"
                            defaultValue="Your E-mail"
                            className="w-full p-2 text-black bg-white rounded-l-md"
                        />
                        <button className="bg-[#af1334] px-4 py-2 rounded-r-md font-medium">
                            JOIN
                        </button>
                    </div>
                    <div className="flex gap-1">
                        {/* Facebook */}
                        <div
                            className="flex items-center bg-[#155dfc] px-2 py-1"
                            style={{
                                transform: "skewX(-15deg)",
                            }}
                        >
                            <div
                                style={{ transform: "skewX(15deg)" }}
                                className="flex items-center"
                            >
                                <FaFacebookF className="text-white text-lg mr-2" />
                                <span className="text-white">Facebook</span>
                            </div>
                        </div>

                        {/* Twitter */}
                        <div
                            className="flex items-center bg-black px-2 py-1"
                            style={{
                                transform: "skewX(-15deg)",
                            }}
                        >
                            <div
                                style={{ transform: "skewX(15deg)" }}
                                className="flex items-center"
                            >
                                <FaXTwitter className="text-white text-lg mr-2" />
                                <span className="text-white">Twitter</span>
                            </div>
                        </div>

                        {/* LinkedIn */}
                        <div
                            className="flex items-center bg-[#006097] px-2 py-1"
                            style={{
                                transform: "skewX(-15deg)",
                            }}
                        >
                            <div
                                style={{ transform: "skewX(15deg)" }}
                                className="flex items-center"
                            >
                                <FaLinkedinIn className="text-white text-lg mr-2" />
                                <span className="text-white">LinkedIn</span>
                            </div>
                        </div>

                        {/* Print */}
                        <div
                            className="flex items-center bg-[#343c40] px-2 py-1"
                            style={{
                                transform: "skewX(-15deg)",
                            }}
                        >
                            <div
                                style={{ transform: "skewX(15deg)" }}
                                className="flex items-center"
                            >
                                <FaPrint className="text-white text-lg mr-2" />
                                <span className="text-white">Print</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-gray-400 mb-4" />

            <div className="max-w-[85%] mx-auto flex flex-col md:flex-row justify-between items-center text-sm pb-6">
                <p>TS Geosystem © All rights reserved | Sitemap</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <img src="/visa.png" alt="Visa" className="h-6" />
                    <img src="/paypal.png" alt="Paypal" className="h-6" />
                    <img src="/vice.png" alt="Vice" className="h-6" />
                    <img src="/electic.png" alt="Electic" className="h-6" />
                    <img src="/amex.png" alt="Amex" className="h-6" />
                    <img src="/discover.png" alt="Discover" className="h-6" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
