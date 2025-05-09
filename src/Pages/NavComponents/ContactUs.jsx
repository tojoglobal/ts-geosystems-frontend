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
import { useQuery } from "@tanstack/react-query";

const ContactUs = () => {
  const axiosPublicUrl = useAxiospublic();
  const {
    data: contactInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      const response = await axiosPublicUrl.get("/api/admin-contact-us");
      return response.data;
    },
  });

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
      if (response.data.success) {
        toast.success("Message sent successfully!");
        form.reset();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="p-3">Loading contact information...</div>;
  }

  if (isError) {
    return <div className="p-3">Error loading contact information</div>;
  }

  return (
    <div className="p-2 md:p-3">
      <div className="font-light flex items-center gap-2 text-[10px]">
        <Link to="/" className="flex items-center gap-1 text-[#e62245]">
          Home
        </Link>
        <span>/</span>
        <Link to="/contact-us" className="uppercase text-[#e62245]">
          Contact Us
        </Link>
      </div>
      <h1 className="text-3xl mt-2 font-light text-[#e62245] mb-5">
        CONTACT US
      </h1>
      <div className="max-w-2xl mx-auto mb-10">
        <p className="text-gray-700 mb-8 max-w-2xl">
          We're happy to answer any questions about our products or services.
          Please fill out the form below if you need assistance.
        </p>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        >
          <input
            type="text"
            name="firstname"
            placeholder="First Name*"
            className="border px-2 py-3 rounded border-gray-300 placeholder:text-black"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name*"
            className="border px-2 py-3 rounded border-gray-300 placeholder:text-black"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail*"
            className="border px-2 py-3 rounded border-gray-300 placeholder:text-black"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone*"
            className="border px-2 py-3 rounded border-gray-300 placeholder:text-black"
          />
          <textarea
            name="message"
            placeholder="Comments/Questions*"
            className="border px-2 py-3 rounded md:col-span-2 border-gray-300 placeholder:text-black"
            rows={4}
          ></textarea>
          <div className="flex justify-center md:col-span-2">
            <button
              type="submit"
              className="bg-[#e62245] text-white py-[6px] px-6 rounded w-fit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[40%] space-y-6 text-sm">
          <div className="text-black">
            <h2 className="text-lg font-bold pb-4 mb-4 relative border-b border-gray-200">
              Working Days
              <span className="absolute bottom-0 left-0 w-20 h-0.5 bg-[#e62245]"></span>
            </h2>
            <p className="text-base-200 mb-1">
              Saturday-Thursday: 9:27 PM - 9:27 PM
            </p>
            <p className="text-base-200">Friday: Weekly Holiday</p>
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
                className="rounded-full p-2 border"
              >
                <FaFacebookF />
              </a>
            )}
            {contactInfo?.socialLinks?.twitter && (
              <a
                href={contactInfo.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 border"
              >
                <FaTwitter />
              </a>
            )}
            {contactInfo?.socialLinks?.youtube && (
              <a
                href={contactInfo.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 border"
              >
                <FaYoutube />
              </a>
            )}
            {contactInfo?.socialLinks?.instagram && (
              <a
                href={contactInfo.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 border"
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
      <section className="my-12 relative">
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
          {[
            {
              name: "Chartwell",
              image:
                "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/a7832d91-6d86-4b77-947a-ff429aa6fc12.png",
              link: "/chartwell",
            },
            {
              name: "SURVIPOD",
              image:
                "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/ec4238ba-3eba-4030-9963-67a42faf2e75.png",
              link: "/chartwell",
            },
            {
              name: "VIVAX METROTECH",
              image:
                "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/a791e65d-defd-4ec8-8f33-64539bbaaf1a/brand-vivax-metrotech.webp",
              link: "/chartwell",
            },
            {
              name: "Hundred 2024",
              image:
                "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/b67f54d0-e3c7-4031-8daa-75fc89ff512b.png",
              link: "/chartwell",
            },
            {
              name: "Partner 5",
              image:
                "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/ec4238ba-3eba-4030-9963-67a42faf2e75.png",
              link: "/chartwell",
            },
            {
              name: "Partner 6",
              image:
                "https://files.elfsightcdn.com/8b8376a3-dcd2-4125-b325-6f12bad45143/b67f54d0-e3c7-4031-8daa-75fc89ff512b.png",
              link: "/chartwell",
            },
          ].map((partner, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-12 rounded shadow flex items-center justify-center">
                <Link to={partner.link}>
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="max-h-36 w-auto object-contain"
                  />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="swiper-button-prev-custom absolute -left-1 md:-left-5 top-[78%] -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100">
          <IoIosArrowBack size={18} className="text-gray-600" />
        </button>
        <button className="swiper-button-next-custom absolute -right-1 md:-right-5 top-[78%] -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100">
          <IoIosArrowForward size={18} className="text-gray-600" />
        </button>
      </section>
    </div>
  );
};

export default ContactUs;
