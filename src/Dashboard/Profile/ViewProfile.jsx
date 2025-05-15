import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const ViewProfile = () => {
  const axiosPublicUrl = useAxiospublic();
  const [userEmail, setUserEmail] = useState(null); // For parsed user email
  const [dbUser, setDbUser] = useState(null); // For database user data

  useEffect(() => {
    // Step 1: Parse the email from localStorage
    const storedUser = localStorage.getItem("userEmail");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser); // Parse the JSON string
        setUserEmail(parsedUser.useremail); // Extract the email
      } catch (error) {
        console.error("Error parsing userEmail from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Step 2: Fetch user data from the server
    const fetchUser = async () => {
      if (!userEmail) return; // Wait until email is set

      try {
        const response = await axiosPublicUrl.get(
          `/admin/login?email=${userEmail}`
        );
        setDbUser(response.data.data); // Store the user data
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUser();
  }, [axiosPublicUrl, userEmail]);

  return (
    <div className="min-h-screen bg-[#f1f4ff] dark:bg-gray-900 p-4 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <div className="flex justify-between items-center py-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            / dashboard /{" "}
            <span className="text-[#03b00b] dark:text-green-400 font-medium">
              view-profile
            </span>
          </div>
          <div className="text-right border border-gray-300 dark:border-gray-600 rounded-sm py-1 px-3 text-sm text-[#03b00b] dark:text-green-400 font-medium">
            Today :{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="rounded-xl shadow-lg">
          <div className="relative">
            <img
              src="https://img.freepik.com/free-photo/3d-rendering-user-interface-design_23-2150709832.jpg"
              alt="Banner"
              className="w-full h-50 object-cover rounded-sm"
            />
            <div className="absolute bottom-[-40px] left-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg flex items-center w-[calc(100%-3em)] justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={
                      dbUser?.photo ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-4 border-white object-cover object-top ring-2 ring-[#03b00b]"
                  />
                  <div className="absolute bottom-1 right-1 bg-green-500 p-1 rounded-full text-white text-xs">
                    <FiCamera />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{dbUser?.name}</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-sm mt-1 bg-blue-100 dark:bg-green-900 text-[#00B22C] dark:text-green-300 px-2 py-1 rounded-xl capitalize">
                      {dbUser?.role_id === 0 ? "Admin" : "Moderator"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {dbUser?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 text-xl"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="text-pink-500 dark:text-pink-400 text-xl"
                >
                  <FaInstagram />
                </a>
                <a href="#" className="text-sky-500 dark:text-sky-400 text-xl">
                  <FaTwitter />
                </a>
                <button className="bg-[#6C63FF] cursor-pointer dark:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <Link to="/dashboard/update-profile">
            <button className="bg-blue-500 cursor-pointer dark:bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
