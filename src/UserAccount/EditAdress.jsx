import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { useNavigate, useParams } from "react-router-dom";
import useToastSwal from "../Hooks/useToastSwal";
import { useAxiospublic } from "../Hooks/useAxiospublic";

const EditAddress = () => {
  const { id } = useParams();
    const axiosPublicUrl = useAxiospublic();
  const navigate = useNavigate();
  const showToast = useToastSwal();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      const { data } = await axiosPublicUrl.get(`/api/addresses`);
      const address = data.find((a) => String(a.id) === String(id));
      if (address) {
        reset({
          firstName: address.first_name,
          lastName: address.last_name,
          postcode: address.postcode,
          phoneNumber: address.phone,
          companyName: address.company,
          addressLine1: address.address_line_1,
          addressLine2: address.address_line_2,
          country: address.country,
          state: address.state,
          city: address.city,
        });
        setStates(State.getStatesOfCountry(address.country));
        setCities(City.getCitiesOfState(address.country, address.state));
      }
    };
    fetchAddress();
  }, [id, reset, axiosPublicUrl]);

  const selectedCountry = watch("country");
  const selectedState = watch("state");

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

  const onSubmit = async (data) => {
    await axiosPublicUrl.put("/api/addresses", {
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      postcode: data.postcode,
      phone: data.phoneNumber,
      company: data.companyName,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      country: data.country,
      state: data.state,
      city: data.city,
    });
    showToast("success", "Success!", "Address updated successfully!");
    navigate("/user/account/address-book");
  };

  return (
    <div className="mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-6">Edit Address</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            {...register("firstName", { required: "First name is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            {...register("lastName", { required: "Last name is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postcode/Zip<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            {...register("postcode", { required: "Postcode is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.postcode && (
            <p className="text-red-500 text-xs mt-1">
              {errors.postcode.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            {...register("phoneNumber")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            {...register("companyName")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            {...register("addressLine1", {
              required: "Address line 1 is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-xs mt-1">
              {errors.addressLine1.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2
          </label>
          <input
            type="text"
            {...register("addressLine2")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country<span className="text-red-600">*</span>
          </label>
          <select
            {...register("country", { required: "Country is required" })}
            className="w-full px-3 py-2 border appearance-none border-gray-300 rounded-md"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            County/State<span className="text-red-600">*</span>
          </label>
          <select
            {...register("state", { required: "State is required" })}
            className="w-full px-3 py-2 border appearance-none border-gray-300 rounded-md"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City<span className="text-red-600">*</span>
          </label>
          {cities.length > 0 ? (
            <select
              {...register("city", { required: "City is required" })}
              className="w-full px-3 py-2 border appearance-none border-gray-300 rounded-md"
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
              {...register("city", { required: "City is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          )}
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-crimson-red hover:bg-red-700 text-white py-2 rounded"
          >
            Update Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAddress;
