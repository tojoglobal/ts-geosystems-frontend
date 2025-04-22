import { Link } from "react-router-dom";

const Login = () => {
   return (
      <div className="flex justify-center items-center py-12 bg-white">
         <div className="w-full container mx-auto flex text-black rounded-lg overflow-hidden">
            {/* Left Side - Login Form */}
            <div className="w-1/2 p-8">
               <h2 className="text-2xl mb-6">Login</h2>
               <div className="mb-4">
                  <label className="block text-sm mb-1">Email Address:</label>
                  <input
                     type="email"
                     className="w-full px-4 py-2 border border-gray-300 rounded"
                     placeholder="Enter your email"
                  />
               </div>
               <div className="mb-4">
                  <label className="block text-sm mb-1">Password:</label>
                  <input
                     type="password"
                     className="w-full px-4 py-2 border border-gray-300 rounded"
                     placeholder="Enter your password"
                  />
               </div>
               <div className="flex gap-2 mb-4">
                  <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                     LOGIN
                  </button>
                  <Link
                     to="login.php?action=reset_password"
                     className="text-sm text-red-600 underline"
                  >
                     Forgot your password?
                  </Link>
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
                  <li className="flex items-center">
                     <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                     Check out faster
                  </li>
                  <li className="flex items-center">
                     <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                     Save multiple shipping addresses
                  </li>
                  <li className="flex items-center">
                     <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                     Access your order history
                  </li>
                  <li className="flex items-center">
                     <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                     Track new orders
                  </li>
                  <li className="flex items-center">
                     <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                     Save items to your wish list
                  </li>
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
