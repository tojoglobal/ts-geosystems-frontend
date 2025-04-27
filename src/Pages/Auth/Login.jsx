import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  const handleFacebookLogin = () => {
    // connect
  };

  const handleGoogleLogin = () => {
    // connect
  };

  const handleAppleLogin = () => {
    // connect
  };

  return (
    <div className="flex justify-center items-center py-12 bg-white">
      <div className="w-full container mx-auto flex items-stretch text-black rounded-lg overflow-hidden">
        <div className="w-1/2 p-8">
          <h2 className="text-2xl mb-6">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm mb-1">Email Address:</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Enter your email"
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
              <label className="block text-sm mb-1">Password:</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="Enter your password"
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
            <div className="flex gap-2 mb-4">
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                LOGIN
              </button>
              <Link
                to="login.php?action=reset_password"
                className="text-sm text-red-600 underline"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">OR LOGIN WITH</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleFacebookLogin}
                className="flex items-center justify-center p-2 bg-[#3b5998] text-white rounded hover:bg-[#344e86] transition-colors"
              >
                <FaFacebook className="mr-2" />
                Facebook
              </button>
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center p-2 bg-[#DB4437] text-white rounded hover:bg-[#c23328] transition-colors"
              >
                <FaGoogle className="mr-2" />
                Google
              </button>
              <button
                onClick={handleAppleLogin}
                className="flex items-center justify-center p-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                <FaApple className="mr-2" />
                Apple
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - New Customer Info */}
        <div className="w-1/2 bg-[#cac9c9] p-8">
          <h2 className="text-xl text-[#908e8a] font-semibold mb-4">
            New Customer?
          </h2>
          <p className="text-sm mb-4 text-[#6f7a86]">
            Create an account with us and you'll be able to...
          </p>
          <ul className="list-none text-sm space-y-2 mb-6 text-[#6f7a86]">
            {[
              "Check out faster",
              "Save multiple shipping addresses",
              "Access your order history",
              "Track new orders",
              "Save items to your wish list",
            ].map((item, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/create_account"
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-800"
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
