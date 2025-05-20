import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import GoogleReview from "./AboutUs/GoogleReview";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { toast } from "react-toastify";
import useDataQuery from "../../utils/useDataQuery";

const ContactUs = () => {
  const axiosPublicUrl = useAxiospublic();
  const { data = [], isLoading: loading } = useDataQuery(
    ["popularBrand"],
    "/api/brands"
  );

  const {
    data: contactInfo,
    isLoading,
    isError,
  } = useDataQuery(["contactInfo"], "/api/admin-contact-us");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {
      firstName: formData.get("firstName") || "",
      lastName: formData.get("lastName") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      message: formData.get("message") || "",
    };

    try {
      const response = await axiosPublicUrl.post("/api/contact", data);
      console.log(response);
      if (response.data.success) {
        toast.success("Message sent successfully!");
        form.reset();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const brands = data.filter((brand) => brand.is_populer === 1);

  if (isLoading || loading) return null;

  if (isError) {
    return <div className="p-3">Error loading contact information</div>;
  }

  return (
    <div className="p-2 md:p-3">
      <div className="flex items-center gap-2 text-[11px]">
        <Link to="/" className="flex items-center gap-1 text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/contact-us" className="capitalize text-[#e62245]">
          Contact Us
        </Link>
      </div>
      <h1 className="text-[28px] mt-2 font-light text-[#e62245] mb-5">
        CONTACT US
      </h1>
      <div className="max-w-2xl mx-auto mb-10">
        <p className="text-gray-700 text-sm mb-6 max-w-2xl">
          We're happy to answer any questions about our products or services.
          Please fill out the form below if you need assistance.
        </p>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        >
          <input
            type="text"
            name="firstName"
            placeholder="First Name*"
            className="border px-2 py-3 rounded border-gray-300 placeholder:text-black"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name*"
            required
            className="border px-2 py-3 rounded border-gray-300 placeholder:text-black"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="E-mail*"
            className="border px-2 py-3 rounded border-gray-300 placeholder:text-black"
          />
          <input
            type="tel"
            name="phone"
            required
            placeholder="Phone*"
            className="border px-2 py-3 rounded border-gray-300 placeholder:text-black"
          />
          <textarea
            name="message"
            required
            placeholder="Comments/Questions*"
            className="border px-2 py-3 rounded md:col-span-2 border-gray-300 placeholder:text-black"
            rows={4}
          ></textarea>
          <div className="flex justify-center md:col-span-2">
            <button
              type="submit"
              className="bg-[#e62245] cursor-pointer text-white py-[6px] px-6 rounded w-fit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[40%] space-y-6 text-sm">
          <div className="">
            <h2 className="text-lg font-bold pb-4 mb-4 relative border-b border-gray-200 text-black">
              Working Days
              <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-[#e62245]"></span>
            </h2>
            <p className=" mb-1 text-black">
              Saturday-Thursday: 9:27 PM - 9:27 PM
            </p>
            <p className=" text-black">Friday: Weekly Holiday</p>
          </div>
          <div>
            <h2 className="text-lg font-bold pb-4 mb-4 relative border-b border-gray-200">
              Contact & Email
              <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-[#e62245]"></span>
            </h2>
            <ul className="space-y-2 text-gray-600">
              {/* Dynamic Phone Numbers */}
              {contactInfo?.phoneNumbers?.map((phone, index) => (
                <li key={index} className="flex items-center gap-2">
                  <FaPhoneAlt />
                  {phone.value}
                </li>
              ))}
              {/* Dynamic Emails */}
              {contactInfo?.emails?.map((email, index) => (
                <li key={index} className="flex items-center gap-2">
                  <FaEnvelope />
                  {email.value}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold pb-4 mb-4 relative border-b border-gray-200">
              Office Address
              <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-[#e62245]"></span>
            </h2>
            <ul className="space-y-2 text-gray-600">
              {/* Dynamic Office Addresses */}
              {contactInfo?.officeAddresses?.map((address, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1" />
                  {address.value.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex space-x-4 pt-2">
            {contactInfo?.socialLinks?.facebook && (
              <a
                href={contactInfo.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 border hover:bg-[#1877F2] hover:text-white transition"
              >
                <FaFacebookF />
              </a>
            )}
            {contactInfo?.socialLinks?.twitter && (
              <a
                href={contactInfo.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 border hover:bg-[#1DA1F2] hover:text-white transition"
              >
                <FaTwitter />
              </a>
            )}
            {contactInfo?.socialLinks?.youtube && (
              <a
                href={contactInfo.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 border hover:bg-[#FF0000] hover:text-white transition"
              >
                <FaYoutube />
              </a>
            )}
            {contactInfo?.socialLinks?.instagram && (
              <a
                href={contactInfo.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 border hover:bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 hover:text-white transition"
              >
                <FaInstagram />
              </a>
            )}
          </div>
        </div>
        <div className="w-full md:w-[60%]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d645.5947958153943!2d90.39336324225314!3d23.746107591039063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8be6eec9b99%3A0xbcb3b2d0ca3c69fa!2sTS%20Geosystems%20Bangladesh!5e0!3m2!1sen!2sbd!4v1746101609630!5m2!1sen!2sbd"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border rounded shadow"
          ></iframe>
        </div>
      </div>
      <GoogleReview />
      <section className="my-12 relative group">
        <div className="flex items-center justify-center gap-4 my-12">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-xl uppercase md:text-2xl font-bold text-[#e62245] text-center">
            Popular Brands
          </h2>
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        </div>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={4}
          autoplay={{ delay: 3000 }}
          loop={true}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {brands?.map((brand, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-12 rounded shadow flex items-center justify-center">
                <Link to={brand.slug}>
                  <img
                    src={`${import.meta.env.VITE_OPEN_APIURL}/uploads/${
                      brand.photo
                    }`}
                    alt={brand.name}
                    className="max-h-36 w-auto object-contain"
                  />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="cursor-pointer swiper-button-prev-custom hidden group-hover:block absolute -left-1 md:-left-4 top-[78%] -translate-y-1/2 z-10 bg-[#696666e3] shadow-md rounded-full p-2 hover:bg-[#111111]">
          <IoIosArrowBack size={18} className="text-white" />
        </button>
        <button className="cursor-pointer swiper-button-next-custom hidden group-hover:block absolute -right-1 md:-right-4 top-[78%] -translate-y-1/2 z-10 bg-[#696666e3] shadow-md rounded-full p-2 hover:bg-[#111111]">
          <IoIosArrowForward size={18} className="text-white" />
        </button>
      </section>
    </div>
  );
};

export default ContactUs;
