import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { Sparkles } from "lucide-react";

const ViewProfile = () => {
  const axiosPublicUrl = useAxiospublic();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axiosPublicUrl.get("/api/admin/profile");
        const data = response.data.data;
        setDbUser(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#151825] via-[#232946] to-[#0ea5e9]">
        <div className="flex items-center gap-3 text-white text-xl font-bold">
          <Sparkles className="animate-pulse text-indigo-400" />
          Loading...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c2a] via-[#22223b] to-[#151825] p-4 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent mb-2">
          Profile
        </h1>
        <div className="flex justify-between items-center py-4">
          <div className="text-sm text-gray-400 mb-2">
            / dashboard /{" "}
            <span className="text-[#0ea5e9] font-medium">view-profile</span>
          </div>
          <div className="text-right border border-gray-300 dark:border-gray-600 rounded-lg py-1 px-3 text-sm text-[#fff] font-medium bg-white/60 dark:bg-[#1e1d2e]/60">
            Today :{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        <div className=" relative z-0 ">
          <div className="relative">
            <div className="rounded-3xl shadow-2xl bg-black/70 border-2 border-[#0ea5e9] overflow-hidden rounded-t-3xl">
              <img
                src="https://img.freepik.com/free-photo/3d-rendering-user-interface-design_23-2150709832.jpg"
                alt="Banner"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="absolute z-40 -bottom-12 left-7 right-7 bg-[#181c2a] dark:bg-[#181c2a] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center md:justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={
                      dbUser?.photo
                        ? dbUser.photo.startsWith("http")
                          ? dbUser.photo
                          : `${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                              dbUser.photo
                            }`
                        : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white object-cover object-top ring-4 ring-[#0ea5e9] shadow-2xl"
                  />
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-md"></div>
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#bae6fd]">
                    {dbUser?.name}
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap mt-2">
                    <p className="text-sm bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] text-white px-3 py-1 rounded-xl capitalize font-bold shadow">
                      {dbUser?.role === 0 ? "Admin" : "Moderator"}
                    </p>
                    <p className="text-sm text-gray-300">{dbUser?.email}</p>
                    <p className="text-sm text-gray-400">{dbUser?.phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 md:mt-0 bg-[#141a2e] p-3 rounded-xl shadow">
                {dbUser?.facebook && (
                  <a
                    href={dbUser.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 text-2xl hover:scale-110 transition"
                  >
                    <FaFacebookF />
                  </a>
                )}
                {dbUser?.instagram && (
                  <a
                    href={dbUser.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 dark:text-pink-400 text-2xl hover:scale-110 transition"
                  >
                    <FaInstagram />
                  </a>
                )}
                {dbUser?.linkedin && (
                  <a
                    href={dbUser.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 dark:text-blue-300 text-2xl hover:scale-110 transition"
                  >
                    <FaLinkedinIn />
                  </a>
                )}
                {dbUser?.twitter && (
                  <a
                    href={dbUser.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-500 dark:text-sky-400 text-2xl hover:scale-110 transition"
                  >
                    <FaTwitter />
                  </a>
                )}
                <button className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] cursor-pointer text-white px-5 py-2 rounded-xl font-bold shadow hover:from-[#22d3ee] hover:to-[#0ea5e9] transition">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 text-center">
          <Link to="/dashboard/update-profile">
            <button className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] cursor-pointer text-white px-8 py-3 rounded-2xl font-bold text-lg shadow hover:from-[#22d3ee] hover:to-[#0ea5e9] transition">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
