import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import Swal from "sweetalert2";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "./firebase.config.js";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../features/UserAuth/authSlice";

const Login = () => {
  const axiosPublic = useAxiospublic();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        // Dispatch the action to save user info in Redux
        dispatch(
          loginSuccess({
            email: response.data.user.email,
            role: response.data.user.role,
          })
        );

        Swal.fire({
          icon: "success",
          title: "Login successful!",
          showConfirmButton: false,
          timer: 1500,
        });
        // Redirect based on user role
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

      Swal.fire({
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send this token to your backend
      const res = await axiosPublic.post("/api/social-login", {
        token: idToken,
      });

      if (res.status === 200) {
        navigate("/user/account/orders");
        Swal.fire({ icon: "success", title: "Login successful!", timer: 1500 });
        console.log(res.data);

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

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await axiosPublic.post("/api/social-login", {
        token: idToken,
      });

      if (res.status === 200) {
        navigate("/user/account/orders");
        Swal.fire({ icon: "success", title: "Login successful!", timer: 1500 });
        dispatch(
          loginSuccess({
            email: res.data.user.email,
            role: res.data.user.role,
          })
        );
      }
    } catch (error) {
      console.error("Facebook login error:", error);
    }
  };

  return (
    <div className="px-3 py-5 bg-white max-w-[1370px] text-gray-700 mx-auto">
      <div className="flex items-center gap-2 text-[11px] mb-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#e62245]">Login</span>
      </div>
      <div className="my-5 flex flex-col md:flex-row">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 pr-8">
          <h2 className="text-2xl font-normal mb-6">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm mb-1 text-gray-700">
                Email Address:
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded"
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
                className="w-full px-3 py-2 border border-gray-300 rounded"
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
            <div className="flex gap-4 mb-6">
              <button
                type="submit"
                className="bg-[#e62245] text-white px-6 py-2 rounded hover:bg-[#d11a3b]"
              >
                LOGIN
              </button>
              <Link
                to="/forgot-password"
                className="text-sm text-[#e62245] underline"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
          {/* Social Login - Moved inside left column */}
          <div className="mb-1">
            <div className="flex items-center mb-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">OR LOGIN WITH</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleFacebookLogin}
                className="flex items-center justify-center p-2 bg-[#3b5998] text-white rounded hover:bg-[#344e86]"
              >
                <FaFacebook className="mr-2" />
                Facebook
              </button>
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center p-2 bg-[#DB4437] text-white rounded hover:bg-[#c23328]"
              >
                <FaGoogle className="mr-2" />
                Google
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - New Customer Info f5f5f5 */}
        <div className="w-full md:w-1/2 bg-[#cac9c9] p-6">
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
  );
};

export default Login;
