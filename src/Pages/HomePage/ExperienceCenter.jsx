const ExperienceCenter = () => {
  return (
    <div className="py-3 md:py-12 bg-white">
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-[#e62245] whitespace-nowrap uppercase">
            Experience Center
          </h2>
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-md">
              <img
                src="https://ts-geosystems.com.bd/assets/images/bQiBB9xuUvXRTWS-COLLECTIONS.png"
                alt=""
                className="w-full h-44 md:h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceCenter;
