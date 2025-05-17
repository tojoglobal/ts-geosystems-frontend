const WeProvide = () => {
  const services = [
    {
      title: "SALES",
      image:
        "https://ts-geosystems.com.bd/assets/images/1726635271sales-enablement-icon-style-free-vector.jpg",
      description: [
        "We sale wide range of surveying equipment",
        "Sokkia Leica Kolida Topcon Trimble Nikon",
        "Pentax South & Foif",
      ],
    },
    {
      title: "SERVICE",
      image:
        "https://ts-geosystems.com.bd/assets/images/1726635450download.png",
      description: [
        "We do Service all major brands and models of",
        "Surveying Equipment with our Factory trained",
        "& Certified Technicians",
      ],
    },
    {
      title: "SUPPORT",
      image:
        "https://ts-geosystems.com.bd/assets/images/1726635580download%20(1).png",
      description: [
        "Our well-trained technical is committed to",
        "provide exceptional customer service and",
        "technical support for all product we sell.",
      ],
    },
  ];

  return (
    <div className="py-5 md:py-16 bg-white">
      <div className="max-w-[1370px] mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-7 md:mb-12">
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
          <h2 className="text-center text-xl sm:text-2xl md:text-4xl font-bold text-[#e62245] whitespace-nowrap">
            WE PROVIDE
          </h2>
          <div className="flex-1 h-0.5 bg-[#e62245]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-center">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-4 md:p-8 border rounded-lg shadow hover:shadow-md transition"
            >
              <img src={service.image} className="w-20 mx-auto" alt="" />
              <h3 className="text-2xl text-black font-bold mb-2">
                {service.title}
              </h3>
              {service.description.map((line, i) => (
                <p key={i} className="text-gray-600">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeProvide;
