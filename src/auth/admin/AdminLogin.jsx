import React, { useState } from "react";
import { FaFacebook, FaLinkedin, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const AdminLogin = () => {
  const axiosPublicUrl = useAxiospublic();
  // const apiKey = import.meta.env.VITE_OPEN_APIURL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // form data
  const [formData, setFormData] = useState({
    useremail: "",
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
    const { useremail, password } = formData;
    try {
      const response = await axiosPublicUrl.post("/api/adminlogin", {
        email: useremail,
        password: password,
      });
      const data = response.data;
      console.log(data);

      if (data.success) {
        localStorage.setItem("userEmail", JSON.stringify({ useremail }));
        navigate("/dashboard");
        Swal.fire({
          icon: "success",
          title: "Login successful!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: data.message || "Invalid username or password",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again!",
      });
    }
  };

  return (
    <>
      {/* <!-- Login form --> */}
      <form action="" method="post" id="adminLogin" onSubmit={handleSubmit}>
        {/* <!-- Left section of the form --> */}
        <div className="left">
          <div className="w-[80%]">
            {/* <!-- Welcome message and registration link  Very good works are--> */}
            <p className="mb-2">Hello, Welcome!</p>
            <p className="text-center text-gray-600">
              waiting for you <span className="font-semibold">Login</span>
            </p>
          </div>
        </div>

        {/* <!-- Right section of the form --> */}
        <div className="right">
          <div>
            {/* <!-- Login heading --> */}
            <h1>Login</h1>

            {/* <!-- Username input field --> */}
            <input
              type="email"
              value={formData.useremail}
              onChange={handleChange}
              name="useremail"
              id="useremail"
              placeholder="Write your email"
            />
            <span className="material-symbols-outlined person">
              {" "}
              <MdEmail />{" "}
            </span>

            {/* <!-- Password input field --> */}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <span
              onClick={togglePassword}
              className="material-symbols-outlined cursor-pointer lock"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {/* <!-- Login button --> */}
            <button type="submit">Login</button>

            {/* <!-- Social login options --> */}
            <p>or login with social platforms </p>
            <div>
              <a href="">
                <FcGoogle className="pt-6" />{" "}
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
    </>
  );
};

export default AdminLogin;
