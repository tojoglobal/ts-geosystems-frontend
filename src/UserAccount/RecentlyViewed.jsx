const RecentlyViewed = () => {
  const recentItems = [
    {
      id: 1,
      name: "Leica ICON iCG70 GNSS RTK Rover Package",
      sku: "606654",
      brand: "Leica Geosystems",
      price: 9995.0,
      salePrice: 8995.0,
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/788/4468/leica-icon-cc170-controller__40664.1723046791.jpg?c=1",
      onSale: true,
    },
    {
      id: 2,
      name: "Leica RTC360 3D Laser Scanner 2021 - Used",
      sku: "RECON-RTC360-2021",
      brand: "Leica Geosystems",
      price: 32300.0,
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/626/3566/leica-software-prepare-cyclone-register-360-plus-a__87741.1692245134.jpg?c=1",
      onSale: false,
    },
    {
      id: 3,
      name: "Leica Rugby 620 Rotating Laser",
      sku: "790559",
      brand: "Leica Geosystems",
      price: 595.0,
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/117/2820/leica-rugby-620-rotating-laser-b__78824.1669836099.jpg?c=1",
      onSale: false,
    },
    {
      id: 4,
      name: "Leica Cyclone 3DR Pro",
      sku: "901516",
      brand: "Leica Geosystems",
      price: 480.0,
      image:
        "https://cdn11.bigcommerce.com/s-ew2v2d3jn1/images/stencil/500x659/products/826/4895/leica-cyclone-3dr-l__70113.1737663989.jpg?c=1",
      onSale: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {recentItems.map((item) => (
        <div
          key={item.id}
          className="bg-white overflow-hidden"
        >
          <div className="relative">
            {item.onSale && (
              <span className="absolute top-1 right-4 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                SALE
              </span>
            )}
            <img
              src={item.image}
              alt={item.name}
              className="w-auto mx-auto max-h-[176px] object-cover"
            />
          </div>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">
              {item.brand} | Sku: {item.sku}
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              {item.name}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                {item.salePrice ? (
                  <>
                    <span className="text-lg font-bold text-gray-900">
                      £{item.salePrice.toFixed(2)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      £{item.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    £{item.price.toFixed(2)}
                  </span>
                )}
                <div className="text-xs text-gray-500">(Inc. VAT)</div>
              </div>
            </div>
            <button className="mt-4 w-full bg-crimson-red text-white text-[14px] py-2 px-4 rounded hover:bg-red-700 transition-colors">
              {item.salePrice ? "ADD TO CART" : "CHOOSE OPTIONS"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentlyViewed;
