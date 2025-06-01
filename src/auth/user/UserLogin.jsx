import axios from "axios";
import { useState } from "react";
import { FaFacebook, FaLinkedin, FaLock, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoPersonSharp } from "react-icons/io5";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

// this component not used yet
const UserLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // form data
  const [formData, setFormData] = useState({
    username: "",
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
    const { username, password } = formData;

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: username,
          Passs: password,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        Swal.fire("Success", "Login successful!");
        localStorage.setItem("user", JSON.stringify({ username }));
        navigate("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid username or password",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <>
      {/* <!-- Login form --> */}
      <form action="" method="post" id="Login" onSubmit={handleSubmit}>
        {/* <!-- Left section of the form --> */}
        <div className="left">
          <div>
            {/* <!-- Welcome message and registration link --> */}
            <p>Hello, Welcome!</p>
            <a href="">Don't have an account? </a>
            <input type="submit" name="" id="" value="Register" />
          </div>
        </div>

        {/* <!-- Right section of the form --> */}
        <div className="right">
          <div>
            {/* <!-- Login heading --> */}
            <h1>Login</h1>

            {/* <!-- Username input field --> */}
            <input
              type="text"
              value={formData.username}
              onChange={handleChange}
              name="username"
              id=""
              placeholder="Username"
            />
            <span className="material-symbols-outlined person">
              {" "}
              <IoPersonSharp />{" "}
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
              className="material-symbols-outlined lock"
            >
              {showPassword ? <FaEyeSlash /> : <FaLock />}
            </span>

            {/* <!-- Forgot password link --> */}
            <a href="">Forgot Password?</a>

            {/* <!-- Login button --> */}
            <button type="submit">Login</button>

            {/* <!-- Social login options --> */}
            <p>or login with social platforms</p>
            <div>
              <a href="">
                <FcGoogle classNameName="pt-6" />{" "}
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

export default UserLogin;

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/admin/login",
        { email, password },
        { withCredentials: true }
      );
      navigate("/admin/dashboard");
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please check your credentials",
      });
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};
