import React, { useState } from "react";
import { FaFacebook, FaLinkedin, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import "./adminlogin.css";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { usePasswordToggle } from "../../utils/usePasswordToggle";

const AdminLogin = () => {
  const axiosPublicUrl = useAxiospublic();
  const navigate = useNavigate();

  const [passwordType, ToggleIcon] = usePasswordToggle();
  // form data
  const [formData, setFormData] = useState({
    adminemail: "",
    password: "",
  });

  //input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { adminemail, password } = formData;

    if (!adminemail || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please enter both email and password.",
        timer: 4000,
      });
      return;
    }

    try {
      const response = await axiosPublicUrl.post("/api/adminlogin", {
        email: adminemail.trim(),
        password: password.trim(),
      });

      const { adminInfo } = response.data;

      if (response.status === 200 && adminInfo) {
        // Store only needed info
        localStorage.setItem(
          "admin",
          JSON.stringify({
            adminId: adminInfo.adminId,
            role: adminInfo.role,
            adminEmail: adminInfo.adminEmail,
          })
        );

        Swal.fire({
          icon: "success",
          title: "Login successful!",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);

      Swal.fire({
        icon: "error",
        title: "Login failed!",
        text:
          error.response?.data?.message ||
          "Invalid email or password. Please try again.",
        timer: 4000,
      });
    }
  };

  return (
    <form action="" method="post" id="adminLogin" onSubmit={handleSubmit}>
      <div className="left hidden md:block">
        <div className="w-[80%]">
          <p className="mb-2">Hello, Welcome!</p>
          <p className="text-center text-gray-200">
            waiting for your <span className="font-semibold">Login</span>
          </p>
        </div>
      </div>
      <div className="right md:w-1/2 w-full">
        <div>
          <h1>Login</h1>
          <input
            type="email"
            value={formData.adminemail}
            onChange={handleChange}
            name="adminemail"
            id="adminemail"
            placeholder="Write your email"
          />
          <span className="material-symbols-outlined person">
            <MdEmail />
          </span>

          <input
            type={passwordType}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className="material-symbols-outlined cursor-pointer lock">
            {ToggleIcon}
          </span>

          <button type="submit">Login</button>
          <p>or login with social platforms</p>
          <div>
            <a href="">
              <FcGoogle />
            </a>
            <a href="">
              <FaFacebook className="text-[#1877F2]" />
            </a>
            <a href="">
              <FaLinkedin className="text-[#0A66C2]" />
            </a>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdminLogin;
