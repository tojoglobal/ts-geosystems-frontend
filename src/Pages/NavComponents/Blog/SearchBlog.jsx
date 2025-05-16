import { RxCross2 } from "react-icons/rx";
const SearchBlog = ({
  isSearchOpen,
  searchQuery,
  setSearchQuery,
  setIsSearchOpen,
}) => {
  return (
    <div>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-start">
          <div className="mt-20 w-full max-w-3xl px-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 relative">
              <input
                type="text"
                placeholder="Search for..."
                className="input input-bordered placeholder:text-xl text-xl w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* Close Button */}
              <button
                className="cursor-pointer z-10 absolute right-6 top-8 text-gray-400 hover:text-red-500"
                onClick={() => setIsSearchOpen(false)}
              >
                <RxCross2 size={22} />
              </button>
              <div className="mt-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                  {/* Sample search results */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-[#e62245] mb-1">
                      See Us At GEO Business 2025 On Stand G124
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      We're excited to exhibit at GEO Business when it returns
                      to ExCeL London on 4-5 June 2025. The UK's largest
                      geospatial event...
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-[#e62245] mb-1">
                      G2 Survey Become Pix4D Official Reseller
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      G2 Survey Becomes Pix4D Official Reseller: Empowering
                      Precision with Photogrammetry Innovation. We're thrilled
                      to announce a major development at G2 Survey - we are now
                      a...
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-[#e62245] mb-1">
                      G2 Survey Sponsors CICES Burns Supper 2025
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      The rearranged date for the CICES Burns Supper has been
                      set! We are proud to be a Platinum Sponsor of the CICES
                      Burns Supper 2025...
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-[#e62245] mb-1">
                      Important GS18 Firmware Update
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Overview Starting from 1st January 2025, the
                      initialization of the tilt compensation functionality of
                      the GS18 T and GS18 I GNSS sensors will no longer...
                    </p>
                  </div>
                  <div className="pb-4">
                    <h3 className="text-lg font-semibold text-[#e62245] mb-1">
                      G2 Survey To Exhibit At Road Expo Scotland 2024
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      G2 Survey to Exhibit at Road Expo Scotland 2024 - Stand B1
                      We are thrilled to announce that G2 Survey will be
                      exhibiting at the highly...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBlog;