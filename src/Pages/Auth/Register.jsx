import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";

const Register = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [captchaToken, setCaptchaToken] = useState(null);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Get all countries
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Watch for country and state changes
  const selectedCountry = watch("country");
  const selectedState = watch("state");

  useEffect(() => {
    if (selectedCountry) {
      // Get states for selected country
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
      // Reset state and city when country changes
      setValue("state", "");
      setValue("city", "");
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry, setValue]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      // Get cities for selected state
      const stateCities = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(stateCities);
      // Reset city when state changes
      setValue("city", "");
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState, setValue]);

  const handleCaptchaChange = (value) => {
    setCaptchaToken(value);
  };

  const onSubmit = async (data) => {
    if (!captchaToken) {
      toast.error("Please verify the reCAPTCHA");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_OPEN_APIURL}/add-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success("Account created successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create account");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1300px] mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/" className="hover:text-[#e62245]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#e62245]">Create Account</span>
        </div>
        <div>
          <h1 className="text-2xl font-medium mb-6">New Account</h1>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email Address<span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
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
            {/* Password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Password<span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
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
            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password<span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {/* First Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                First Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            {/* Last Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Last Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            {/* Postcode/Zip */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Postcode/Zip<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                {...register("postcode", {
                  required: "Postcode is required",
                })}
              />
              {errors.postcode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.postcode.message}
                </p>
              )}
            </div>
            {/* Phone Number */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                {...register("phoneNumber")}
              />
            </div>
            {/* Company Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                {...register("companyName")}
              />
            </div>
            {/* Address Line 1 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Address Line 1<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                {...register("addressLine1", {
                  required: "Address line 1 is required",
                })}
              />
              {errors.addressLine1 && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.addressLine1.message}
                </p>
              )}
            </div>
            {/* Address Line 2 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Address Line 2
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                {...register("addressLine2")}
              />
            </div>
            {/* Country */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Country<span className="text-red-600">*</span>
              </label>
              <select
                className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                {...register("country", {
                  required: "Country is required",
                })}
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
            {/* State */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                County/State<span className="text-red-600">*</span>
              </label>
              {states.length > 0 ? (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                  {...register("state", {
                    required: "State is required",
                  })}
                  disabled={!selectedCountry}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                  placeholder="Enter your state"
                  {...register("state", {
                    required: "State is required",
                  })}
                />
              )}
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>
            {/* City */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                City<span className="text-red-600">*</span>
              </label>
              {cities.length > 0 ? (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                  {...register("city", {
                    required: "City is required",
                  })}
                  disabled={!selectedState}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e62245]"
                  placeholder="Enter your city"
                  {...register("city", {
                    required: "City is required",
                  })}
                />
              )}
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            {/* reCAPTCHA - Full Width */}
            <div className="col-span-full">
              <ReCAPTCHA
                sitekey="6LeKvyorAAAAAKGd6v6jMwiNuMqHazF0OoFqdqtT"
                onChange={handleCaptchaChange}
              />
            </div>
            {/* Submit Button - Full Width */}
            <div className="col-span-full">
              <button
                type="submit"
                className="bg-[#e62245] text-white px-8 py-2 rounded hover:bg-[#d41f3f]"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
