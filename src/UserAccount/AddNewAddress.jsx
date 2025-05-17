import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddNewAddress = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  useEffect(() => {
    setCountries(Country.getAllCountries());
    setValue("country", "US"); // Default to United States
  }, [setValue]);

  useEffect(() => {
    if (selectedCountry) {
      const stateData = State.getStatesOfCountry(selectedCountry);
      setStates(stateData);
      setValue("state", "");
      setValue("city", "");
      setCities([]);
    }
  }, [selectedCountry, setValue]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cityData = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(cityData);
      setValue("city", "");
    }
  }, [selectedCountry, selectedState, setValue]);

  const onSubmit = (data) => {
    console.log("Address submitted:", data);
    toast.success("Address added successfully!");
    navigate("/user/account/address-book");
  };

  return (
    <div className="mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6">Add a New Address</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Daria"
            {...register("firstName", { required: "First name is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Andrews"
            {...register("lastName", { required: "Last name is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Postcode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postcode/Zip<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="23591"
            {...register("postcode", { required: "Postcode is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
          {errors.postcode && (
            <p className="text-red-500 text-xs mt-1">
              {errors.postcode.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="+1 (681) 997-5989"
            {...register("phoneNumber")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
        </div>

        {/* Address Line 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="997 Cowley Parkway"
            {...register("addressLine1", {
              required: "Address line 1 is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-xs mt-1">
              {errors.addressLine1.message}
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country<span className="text-red-600">*</span>
          </label>
          <select
            {...register("country", { required: "Country is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            County/State<span className="text-red-600">*</span>
          </label>
          <select
            {...register("state", { required: "State is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
            disabled={!selectedCountry}
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City<span className="text-red-600">*</span>
          </label>
          {cities.length > 0 ? (
            <select
              {...register("city", { required: "City is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
              disabled={!selectedState}
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Enter your city"
              {...register("city", { required: "City is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-crimson-red"
            />
          )}
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-crimson-red hover:bg-red-700 text-white py-2 rounded"
          >
            Save Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewAddress;
