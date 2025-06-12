import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../HomePage/TotalStation.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useDataQuery from "../../utils/useDataQuery";
import { parsePrice } from "../../utils/parsePrice";
import { useTrackProductView } from "../../Hooks/useTrackProductView";
import { slugify } from "../../utils/slugify";
import { getProductType } from "../../utils/productOption";
import useToastSwal from "../../Hooks/useToastSwal";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/AddToCart/AddToCart";

const Recommended = ({ category, currentProductId }) => {
  const swiperRef = useRef(null);
  const dispatch = useDispatch();
  const { trackProductView } = useTrackProductView();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const showToast = useToastSwal();

  // Fetch recommended products when category changes
  const { data = {}, isLoading } = useDataQuery(
    ["recommendedProducts", category],
    `/api/category-products/${category}`,
    !!category
  );
  const products = data?.products;

  useEffect(() => {
    if (products?.length > 0) {
      const filteredProducts = products?.filter(
        (product) => product.id !== currentProductId
      );
      setRecommendedProducts(filteredProducts.slice(0, 10));
    }
  }, [products, currentProductId]);

  useEffect(() => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  }, [recommendedProducts]);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleAddToCart = (product) => {
    const itemToAdd = {
      id: product.id,
      product_name: product.product_name,
      price: parsePrice(product.price),
      quantity: 1,
    };

    dispatch(addToCart(itemToAdd));

    showToast(
      "success",
      "Added to Cart!",
      `<b style="color:#333">${product.product_name}</b> has been added to your cart.`,
      { timer: 2000 }
    );
  };

  if (isLoading) {
    return <div>Loading recommended products...</div>;
  }

  if (!category || recommendedProducts.length === 0) {
    return null; // Don't show if no category or no recommended products
  }

  return (
    <div className="w-full md:max-w-[95%] 2xl:max-w-[1370px] mx-auto rounded-md py-6 relative">
      {/* Tab Header */}
      <div className="flex items-center justify-between rounded-[4px] border border-gray-200">
        <div className="relative cursor-pointer group px-3 py-1">
          <div className="relative">
            <h2 className="text-[#e62245] text-base py-1 uppercase text-[20px] font-semibold w-fit pr-3 border-r border-gray-200">
              RECOMMENDED
            </h2>
            <span className="absolute -left-3 -bottom-[6px] h-[4px] w-0 bg-[#e62245] transition-all duration-300 group-hover:w-full"></span>
          </div>
        </div>
        {/* Custom Arrows */}
        <div className="flex gap-2 pr-4">
          <div
            className={`swiper-button-prev-custom cursor-pointer ${
              isBeginning
                ? "text-gray-200 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <IoIosArrowBack size={22} />
          </div>
          <div
            className={`swiper-button-next-custom cursor-pointer ${
              isEnd
                ? "text-gray-200 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <IoIosArrowForward size={22} />
          </div>
        </div>
      </div>
      {/* Swiper */}
      <div className="mt-7">
        <Swiper
          modules={[Navigation]}
          spaceBetween={33}
          slidesPerView={3}
          slidesPerGroup={3}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={handleSlideChange}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            640: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
          }}
        >
          {recommendedProducts.map((product, idx) => {
            const imageUrls = product?.image_urls
              ? JSON.parse(product.image_urls)
              : [];
            const mainImage =
              imageUrls.length > 0
                ? `${import.meta.env.VITE_OPEN_APIURL}${imageUrls[0]}`
                : "https://via.placeholder.com/150";
            const { isSimpleProduct } = getProductType(product);

            return (
              <SwiperSlide key={idx}>
                <div className="relative flex flex-col items-center bg-white h-full">
                  <Link
                    onClick={() => trackProductView(product.id)}
                    to={`/products/${product.id}/${slugify(
                      product.product_name || ""
                    )}`}
                  >
                    <div className="relative group w-full max-w-[120px] sm:max-w-[140px] md:max-w-[260px] mx-auto min-h-[300px]">
                      <img
                        src={mainImage}
                        alt={product.product_name}
                        className="w-full h-auto transition-opacity duration-300 group-hover:opacity-0"
                      />
                      {/* If you have hover images, you can add them here */}
                      <img
                        src={mainImage}
                        alt={`${product.product_name} hover`}
                        className="w-full h-auto absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                      />
                    </div>
                  </Link>
                  <div className="w-full border-t border-gray-200 pt-2 flex flex-col flex-grow">
                    <p className="text-xs text-gray-500">
                      {product.category
                        ? JSON.parse(product.category).cat
                        : "Category"}{" "}
                      | Sku: {product.sku || "N/A"}
                    </p>
                    <div className="min-h-[48px] flex items-start">
                      <Link
                        onClick={() => trackProductView(product.id)}
                        to={`/products/${product.id}/${slugify(
                          product.product_name || ""
                        )}`}
                        className="font-semibold text-sm text-gray-800"
                      >
                        {product.product_name}
                      </Link>
                    </div>
                    <div className="space-x-2">
                      <span className="text-sm font-bold text-[#222]">
                        ৳{parsePrice(product.price)}.00
                      </span>
                      <span className="text-xs line-through text-gray-400">
                        ৳{(parsePrice(product.price) * 1.2).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#b3b3b5]">
                      ৳{(parsePrice(product.price) * 1.2).toFixed(2)}{" "}
                      <span className="underline">(Inc. VAT)</span>
                    </div>
                    {product?.isStock === 1 && (
                      <div>
                        {isSimpleProduct ? (
                          <>
                            {Number(product?.priceShowHide) === 1 ? (
                              // Case 2: GET QUOTATION
                              <Link
                                onClick={() => trackProductView(product.id)}
                                to={`/products/${product.id}/${slugify(
                                  product.product_name || ""
                                )}`}
                              >
                                <button className="w-full bg-[#e62245] cursor-pointer text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors">
                                  GET QUOTATION
                                </button>
                              </Link>
                            ) : (
                              // Case 3: ADD TO CART
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="w-full bg-[#e62245] cursor-pointer text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors"
                              >
                                ADD TO CART
                              </button>
                            )}
                          </>
                        ) : (
                          // Case 1: CHOOSE OPTION
                          <Link
                            onClick={() => trackProductView(product.id)}
                            to={`/products/${product.id}/${slugify(
                              product.product_name || ""
                            )}`}
                          >
                            <button className="w-full bg-[#e62245] cursor-pointer text-[14px] text-white px-6 py-[5px] rounded-[4px] hover:bg-[#d41d3f] font-bold transition-colors">
                              CHOOSE OPTION
                            </button>
                          </Link>
                        )}
                      </div>
                    )}

                    {/* <button className="mt-1 cursor-pointer bg-[#e62245] hover:bg-[#c91d3a] text-white text-sm font-semibold py-[6px] px-4 rounded w-full">
                      ADD TO CART
                    </button> */}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default Recommended;
