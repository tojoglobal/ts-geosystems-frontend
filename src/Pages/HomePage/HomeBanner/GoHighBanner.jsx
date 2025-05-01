const GoHighBanner = () => {
  return (
    <div className="md:w-full my-3 md:my-5 mx-3 md:max-w-[1300px] md:mx-auto">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="w-full md:w-[33%] overflow-hidden rounded-lg group">
          <img
            src="https://ts-geosystems.com.bd/assets/images/RsKp91pyTWS-COLLECTIONS.jpg"
            alt="Right Side"
            className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="w-full md:w-[67%] md:relative group overflow-hidden rounded-lg">
          <img
            src="https://ts-geosystems.com.bd/assets/images/UMIh5c9b11be38b01.jpg"
            alt=""
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

export default GoHighBanner;
