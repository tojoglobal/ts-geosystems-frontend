import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { FaFacebook, FaLinkedin, FaTwitter, FaPinterest } from "react-icons/fa";
import Recommended from "./Recommended";
import { useParams } from "react-router-dom";

const images = [
   "https://ts-geosystems.com.bd/assets/images/1727171133KTS-472R10LC.png",
   "https://ts-geosystems.com.bd/assets/images/1634490597Hcc2445bfd070462089ea573816837100j.jpg",
   "https://ts-geosystems.com.bd/assets/images/1727171133KTS-472R10LC.png",
   "https://ts-geosystems.com.bd/assets/images/1727171133KTS-472R10LC.png",
];

const ProductDetails = () => {
   const { id } = useParams();
   console.log("dynamic", id);
   const [selectedImage, setSelectedImage] = useState(images[0]);
   console.log(selectedImage);
   const [activeTab, setActiveTab] = useState("OVERVIEW");
   const overviewRef = useRef(null);
   const [isVideoPlaying, setIsVideoPlaying] = useState(false);

   const specifications = [
      {
         name: "Product Type",
         value: "Velvet elegant sleeveless evening dress",
      },
      { name: "Material", value: "Polyester / Spandex" },
      { name: "Lining Material", value: "Polyester" },
      { name: "Fabric Type", value: "Fleece" },
      { name: "Technics", value: "Plain dyed" },
      { name: "Decoration", value: "Sequins" },
      { name: "Size", value: "S/M/L" },
   ];

   const handleReadMoreClick = () => {
      setActiveTab("OVERVIEW");
      overviewRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   return (
      <div className="bg-white p-3">
         <div className="container mx-auto px-4 pt-10">
            <div className="flex flex-col md:flex-row gap-10">
               {/* Image Gallery */}
               <div className="flex flex-col items-start gap-4 relative">
                  {/* Badges */}
                  <div className="absolute top-2 left-2 z-10">
                     <div className="flex flex-col gap-2">
                        <span className="bg-[#ffa000] text-white text-xs px-2 py-1 rounded">
                           Featured
                        </span>
                        <span className="bg-[#daa520] text-white text-xs px-2 py-1 rounded">
                           -17%
                        </span>
                     </div>
                  </div>
                  <div className="w-[550px] h-[550px] border rounded-xl overflow-hidden">
                     <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        modules={[Navigation, Thumbs]}
                        className="w-full h-full"
                     >
                        {images.map((img, index) => (
                           <SwiperSlide key={index}>
                              <img
                                 src={img}
                                 alt={`Product ${index + 1}`}
                                 className="w-full h-full object-contain"
                              />
                           </SwiperSlide>
                        ))}
                     </Swiper>
                  </div>
                  {/* Swiper for thumbnails */}
                  <Swiper
                     spaceBetween={10}
                     slidesPerView={4}
                     modules={[Navigation, Thumbs]}
                     className="w-80"
                  >
                     {images.map((img, index) => (
                        <SwiperSlide
                           key={index}
                           onClick={() => setSelectedImage(img)}
                        >
                           <div className="border p-1 rounded cursor-pointer hover:ring-2 ring-[#e62245]">
                              <img
                                 src={img}
                                 alt={`Thumb ${index}`}
                                 className="w-full h-16 object-contain"
                              />
                           </div>
                        </SwiperSlide>
                     ))}
                  </Swiper>
               </div>
               {/* Product Info */}
               <div className="flex-1">
                  <h1 className="text-3xl text-black font-semibold mb-4">
                     Kolida KTS470 Windows Total Station
                  </h1>
                  <div className="flex items-center gap-2">
                     <div className="mb-2 text-xl line-through text-gray-400">
                        ৳120,000.00
                     </div>
                     <div className="mb-4 text-3xl text-[#e62245] font-bold">
                        ৳100,000.00
                     </div>
                  </div>
                  <p className="text-[#8d7f90] text-lg mb-4">
                     It is a long established fact that a reader will be
                     distracted by the readable content of a page when looking
                     at its layout.{" "}
                     <button
                        onClick={handleReadMoreClick}
                        className="text-[#e62245] cursor-pointer hover:underline"
                     >
                        Read more
                     </button>
                  </p>
                  <div className="mb-2 text-[#8d7f90] border-t border-[#d3d3d3]">
                     <strong>SKU:</strong>{" "}
                     <span className="text-[#e62245]">#65dVy8345fg9776</span>
                  </div>
                  <div className="mb-1 text-[#8d7f90]">
                     <strong>Brand:</strong>
                  </div>
                  <div className="mb-1 text-[#8d7f90]">
                     <strong>Categories:</strong>
                     <span className="text-[#e62245]">
                        {" "}
                        Total Station / Kolida
                     </span>
                  </div>
                  <div className="mb-1 text-[#8d7f90]">
                     <strong>Tags:</strong>
                     <span className="text-[#e62245]">women, dresses:</span>
                  </div>
                  <div className="mb-6 text-[#8d7f90] flex gap-4">
                     <div className="space-y-6">
                        <div className="flex gap-8">
                           <div className="w-40">
                              <label className="block mb-2 text-gray-600 font-medium">
                                 Color
                              </label>
                              <select className="w-full border border-gray-300 rounded py-2 px-3 text-gray-600 focus:outline-none focus:border-[#e62245]">
                                 <option>Red</option>
                                 <option>Blue</option>
                                 <option>Black</option>
                                 <option>Pink</option>
                              </select>
                           </div>
                           <div className="w-40">
                              <label className="block mb-2 text-gray-600 font-medium">
                                 Size
                              </label>
                              <select className="w-full border border-gray-300 rounded py-2 px-3 text-gray-600 focus:outline-none focus:border-[#e62245]">
                                 <option>M</option>
                                 <option>L</option>
                                 <option>XL</option>
                                 <option>XXL</option>
                              </select>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <label className="text-gray-600 font-medium">
                              Quantity:
                           </label>
                           <div className="flex items-center border border-gray-300 rounded">
                              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors">
                                 -
                              </button>
                              <span className="px-6 py-2 border-x border-gray-300 text-gray-600">
                                 1
                              </span>
                              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors">
                                 +
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
                  <button className="relative overflow-hidden group text-white px-12 font-semibold py-[11px] rounded bg-[#e62245]">
                     <span className="absolute left-0 top-0 h-full w-0 bg-black transition-all duration-500 ease-out group-hover:w-full z-0"></span>
                     <span className="relative z-10">ADD TO CART</span>
                  </button>
                  <div className="mt-6">
                     <div className="flex gap-2 text-white">
                        <span className="font-medium mr-2 text-[#8d7f90]">
                           Share:
                        </span>
                        <button className="bg-[#e62245] p-2 rounded">
                           <FaLinkedin />
                        </button>
                        <button className="bg-[#e62245] p-2 rounded">
                           <FaFacebook />
                        </button>
                        <button className="bg-[#e62245] p-2 rounded">
                           <FaTwitter />
                        </button>
                        <button className="bg-[#e62245] p-2 rounded">
                           <FaPinterest />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
            {/* Tabs */}
            <div className="mt-12" ref={overviewRef}>
               <div className="flex gap-2 border border-gray-300 rounded-md overflow-hidden">
                  {["OVERVIEW", "SPECIFICATIONS", "PRODUCT VIDEOS"].map(
                     (tab, idx) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           className={`text-base sm:text-2xl font-semibold px-4 py-3 transition-colors duration-200 ${
                              activeTab === tab
                                 ? "text-[#e62245]"
                                 : "text-gray-600 hover:text-[#e62245]"
                           } ${idx === 1 ? "border-x border-gray-300" : ""}`}
                        >
                           {tab}
                        </button>
                     )
                  )}
               </div>
               <div className="border-2 border-[#e5e5e5] p-4">
                  {activeTab === "OVERVIEW" && (
                     <div className="text-gray-700 leading-relaxed">
                        <p>
                           Lorem ipsum dolor sit amet consectetur adipisicing
                           elit. Cupiditate quae illo soluta sapiente minus
                           voluptatibus molestias voluptates maiores
                           repudiandae, velit quaerat error! Dolor alias
                           voluptates rerum vitae ilium officiis laboriosam, eos
                           fugiat necessitatibus iste quasi vero porro at
                           asperiores atque numquam adipisci esse perferendis
                           hic dolore dolores facere quidem? Voluptatum, nemo
                           voluptates. Qui, animi edit voluptatem velit nostrum
                           rem maiores. Qui esse magnam enim natus numquam ab
                           adipisci nihil mollitia odio ducimus architecto unde
                           harum saepe illum, ipse hic dicta alias cumque et
                           minus veritatis assumenda a quo. Possimus, vitae est!
                           Fuga quidem minima sunt modi.
                        </p>
                     </div>
                  )}
                  {activeTab === "SPECIFICATIONS" && (
                     <div className="border rounded-lg overflow-hidden m-4">
                        <table className="w-full">
                           <thead>
                              <tr className="bg-gray-50">
                                 <th className="text-left text-gray-700 p-4">
                                    SPECIFICATIONS
                                 </th>
                                 <th className="text-left p-4 text-gray-700">
                                    Descriptions
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              {specifications.map((spec, index) => (
                                 <tr key={index} className="border-t">
                                    <td className="p-4 text-gray-700">
                                       {spec.name}:
                                    </td>
                                    <td className="p-4 text-gray-700">
                                       {spec.value}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
                  {activeTab === "PRODUCT VIDEOS" && (
                     <div className="flex justify-center">
                        {!isVideoPlaying ? (
                           <div
                              className="w-[640px] h-[360px] bg-gray-100 rounded-lg flex items-center justify-center"
                              onClick={() => setIsVideoPlaying(true)}
                           >
                              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center cursor-pointer">
                                 <div className="w-0 h-0 border-t-[20px] border-t-transparent border-l-[30px] border-l-white border-b-[20px] border-b-transparent ml-2"></div>
                              </div>
                           </div>
                        ) : (
                           <div className="w-[640px] h-[360px] rounded-lg overflow-hidden">
                              <iframe
                                 width="100%"
                                 height="100%"
                                 src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                 title="YouTube video"
                                 frameBorder="0"
                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                 allowFullScreen
                              ></iframe>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
         <Recommended />
      </div>
   );
};

export default ProductDetails;
