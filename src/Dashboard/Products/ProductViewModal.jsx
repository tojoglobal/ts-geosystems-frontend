import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import DOMPurify from "dompurify";

// Make sure to pass getCategoryName, getSubCategoryName, getBrandName as props

const PremiumProductViewModal = ({
  isModalOpen,
  setIsModalOpen,
  viewProduct,
  getCategoryName,
  getSubCategoryName,
  getBrandName,
}) => {
  const images = (() => {
    try {
      return Array.isArray(JSON.parse(viewProduct?.image_urls || "[]"))
        ? JSON.parse(viewProduct?.image_urls || "[]")
        : [];
    } catch {
      return [];
    }
  })();

  return (
    <Transition appear show={isModalOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsModalOpen(false)}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gradient-to-br from-[#151825]/80 to-[#2d3250]/80 backdrop-blur-md" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-3xl bg-gradient-to-b from-[#232946] via-[#363b4e] to-[#191a24] shadow-2xl border-[1.5px] border-[#0ea5e9] transition-all duration-300">
                <div className="flex items-start justify-between p-6 border-b border-[#24304a]">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold text-white flex-1"
                  >
                    <span className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] bg-clip-text text-transparent">
                      {viewProduct?.product_name}
                    </span>
                  </Dialog.Title>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="ml-4 text-[#38bdf8] hover:text-white transition-colors"
                    aria-label="Close modal"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>
                {viewProduct && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7 p-6">
                    {/* Left: Images */}
                    <div className="flex flex-col gap-3 items-center">
                      <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-[#0ea5e9] shadow-lg bg-[#151825] flex items-center justify-center">
                        {images[0] ? (
                          <img
                            src={`${import.meta.env.VITE_OPEN_APIURL}${
                              images[0]
                            }`}
                            alt="Product"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No image
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap justify-center mt-2">
                        {images.slice(1, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={`${import.meta.env.VITE_OPEN_APIURL}${img}`}
                            alt="Product Thumbnail"
                            className="h-16 w-16 object-cover rounded-md border border-[#1e293b] hover:border-[#22d3ee] transition"
                          />
                        ))}
                      </div>
                    </div>
                    {/* Right: Info */}
                    <div className="flex flex-col gap-3 text-[#e0f2fe]">
                      <div className="flex items-center gap-2">
                        <span className="bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] text-white px-3 py-1 rounded-full font-semibold text-lg shadow-sm">
                          ৳ {viewProduct.price}
                        </span>
                        <span className="ml-2 px-2 py-1 bg-[#0ea5e9]/20 rounded-full text-xs text-[#0ea5e9] font-semibold uppercase tracking-widest">
                          {getCategoryName(viewProduct.category)}
                        </span>
                        <span className="ml-2 px-2 py-1 bg-[#22d3ee]/20 rounded-full text-xs text-[#22d3ee] font-semibold uppercase tracking-widest">
                          {getSubCategoryName(viewProduct.sub_category)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="rounded bg-[#283046] px-2 py-0.5">
                          SKU: <b className="text-white">{viewProduct.sku}</b>
                        </span>
                        <span className="rounded bg-[#283046] px-2 py-0.5">
                          Condition:{" "}
                          <b className="text-white">
                            {viewProduct.product_condition}
                          </b>
                        </span>
                        <span className="rounded bg-[#283046] px-2 py-0.5">
                          Brand:{" "}
                          <b className="text-white">
                            {getBrandName(viewProduct.brand_name)}
                          </b>
                        </span>
                      </div>
                      <div className="mt-2">
                        <h4 className="text-base font-semibold text-[#22d3ee] mb-1">
                          Overview:
                        </h4>
                        <article
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              viewProduct.product_overview || ""
                            ),
                          }}
                          className="prose prose-sm sm:prose-base max-w-none leading-relaxed bg-[#22223b]/60 text-white px-3 py-2 rounded"
                        />
                      </div>
                      <div className="mt-2">
                        <h4 className="text-base font-semibold text-[#0ea5e9] mb-1">
                          Warranty Info:
                        </h4>
                        <article
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              viewProduct.warranty_info || ""
                            ),
                          }}
                          className="prose prose-sm sm:prose-base max-w-none leading-relaxed bg-[#1e293b]/60 text-[#bae6fd] px-3 py-2 rounded"
                        />
                      </div>
                      {viewProduct.video_urls && (
                        <div className="mt-2">
                          <a
                            href={viewProduct.video_urls}
                            className="inline-flex items-center gap-1 text-[#22d3ee] hover:text-[#0ea5e9] font-medium transition"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg
                              width="18"
                              height="18"
                              fill="currentColor"
                              className="inline mr-1"
                            >
                              <path d="M4 2.5A1.5 1.5 0 0 1 5.5 1h7A1.5 1.5 0 0 1 14 2.5v13a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 4 15.5v-13zM6 4v10l8-5-8-5z" />
                            </svg>
                            Watch Video
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-end px-6 pb-6 pt-3 mt-2 border-t border-[#24304a]">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-transparent bg-gradient-to-r from-[#0ea5e9] to-[#22d3ee] px-6 py-2 text-base font-semibold text-white shadow-lg hover:from-[#38bdf8] hover:to-[#0ea5e9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9] focus-visible:ring-offset-2 transition"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PremiumProductViewModal;
