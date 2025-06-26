import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "./firebase.config.js";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/UserAuth/authSlice";
import useToastSwal from "../../Hooks/useToastSwal.jsx";
import Modal from "react-modal";
import { useState } from "react";

// Responsive and centered modal styles
const customModalStyles = {
  content: {
    maxWidth: "95vw",
    width: "350px",
    inset: "50% auto auto 50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "12px",
    padding: "1.5rem",
    background: "#fff",
    boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
    border: "none",
    minHeight: "auto",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  overlay: {
    zIndex: 1000,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

const Login = () => {
  const axiosPublic = useAxiospublic();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showToast = useToastSwal();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailErr, setForgotEmailErr] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const response = await axiosPublic.post("/api/user-login", formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: response.data.user.email,
            role: response.data.user.role,
          })
        );
        dispatch(
          loginSuccess({
            email: response.data.user.email,
            role: response.data.user.role,
          })
        );

        showToast("success", "Login successful!");
        if (response.data.user.role === "USER") {
          navigate("/user/account/orders");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          errorMessage =
            data.Error || "Invalid request. Please check your input.";
        } else if (status === 401) {
          errorMessage =
            data.Error || "Unauthorized. Please check your credentials.";
        } else {
          errorMessage = data.Error || errorMessage;
        }
      }
      showToast(
        "error",
        "Login Failed",
        errorMessage || "Invalid username or password"
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await axiosPublic.post("/api/social-login", {
        token: idToken,
      });

      if (res.status === 200) {
        navigate("/user/account/orders");
        showToast("success", "Google Login successful!");
        dispatch(
          loginSuccess({
            email: res.data.user.email,
            role: res.data.user.role,
          })
        );
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  // Forgot Password handlers
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotEmailErr("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotEmailErr("Please provide a valid email address");
      return;
    }
    try {
      await resetPassword(forgotEmail);
      showToast("success", "Reset email sent to your mail.");
      setIsModalOpen(false);
      setForgotEmail(""); // clear field
    } catch (err) {
      setForgotEmailErr(err.message || "Could not send reset email.");
    }
  };

  return (
    <div className="px-3 py-5 bg-white w-full md:max-w-[95%] 2xl:max-w-[1370px] text-gray-700 mx-auto">
      <div className="flex items-center gap-2 text-[11px] mb-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">Login</span>
      </div>
      <div className="my-5 flex flex-col md:flex-row gap-6">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-normal mb-6">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="block text-sm mb-1 text-gray-700">
                Email Address:
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 focus:outline-none focus:border focus:border-gray-400 border border-gray-300 rounded-sm"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1 text-gray-700">
                Password:
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border focus:outline-none focus:border focus:border-gray-400 border-gray-300 rounded-sm"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Flex container for LOGIN button and Google button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#e62245] cursor-pointer text-white px-6 py-2 rounded hover:bg-[#d11a3b]"
                >
                  LOGIN
                </button>
                <button
                  type="button"
                  className="text-sm cursor-pointer text-[#e62245] underline bg-transparent border-none outline-none"
                  onClick={() => setIsModalOpen(true)}
                >
                  Forgot your password?
                </button>
              </div>
              <div className="flex gap-3">
                <span className="text-sm text-gray-500 mt-5">
                  OR LOGIN WITH
                </span>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex cursor-pointer items-center justify-center px-6 py-2 bg-[#DB4437] text-white rounded hover:bg-[#c23328]"
                >
                  <FaGoogle className="mr-2" />
                  Google
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* Right Side - New Customer Info */}
        <div className="w-full md:w-1/2">
          <div className="bg-[#cac9c9] p-6">
            <h2 className="text-xl text-gray-600 font-semibold mb-4">
              New Customer?
            </h2>
            <p className="text-sm mb-4 text-gray-600">
              Create an account with us and you'll be able to:
            </p>
            <ul className="list-none text-sm ml-5 space-y-2 mb-6 text-gray-600">
              {[
                "Check out faster",
                "Save multiple shipping addresses",
                "Access your order history",
                "Track new orders",
                "Save items to your wish list",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-gray-600 rounded-full mt-1.5 mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/user/create_account"
              className="inline-block bg-[#e62245] text-white px-6 py-2 rounded hover:bg-[#d11a3b] text-sm"
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setForgotEmailErr("");
        }}
        style={customModalStyles}
        contentLabel="Reset Password"
        ariaHideApp={false}
      >
        <h2 className="text-xl mb-3 text-gray-800 font-semibold text-center">
          Reset Password
        </h2>
        <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
          <label className="block mb-1 text-sm text-gray-700">
            Email address
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border focus:outline-none focus:border focus:border-gray-400 border-gray-300 rounded-sm"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
            autoFocus
          />
          {forgotEmailErr && (
            <p className="text-red-500 text-xs mb-1">{forgotEmailErr}</p>
          )}
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 w-full">
            <button
              type="submit"
              className="w-full cursor-pointer sm:w-auto bg-[#e62245] text-white px-4 py-2 rounded hover:bg-[#d11a3b] transition-all"
            >
              Send Reset Email
            </button>
            <button
              type="button"
              className="w-full cursor-pointer sm:w-auto text-gray-500 underline"
              onClick={() => {
                setIsModalOpen(false);
                setForgotEmailErr("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Login;
