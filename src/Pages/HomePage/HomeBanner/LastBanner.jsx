const LastBanner = () => {
  return (
    <div className="max-w-[1370px] mx-3 md:mx-auto flex items-center gap-3 overflow-hidden mt-3 rounded-lg">
      {[1, 2].map((_, idx) => (
        <div
          key={idx}
          className="flex-1 overflow-hidden rounded-lg group transition-shadow duration-300 shadow hover:shadow-lg"
          style={{ aspectRatio: "2.8/1", minHeight: "160px" }}
        >
          <img
            src="https://ts-geosystems.com.bd/assets/images/afhEMonitors.png"
            alt="GoHighBanner"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
};

export default LastBanner;
