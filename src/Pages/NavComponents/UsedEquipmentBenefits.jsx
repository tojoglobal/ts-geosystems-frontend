import { Link } from "react-router-dom";

const UsedEquipmentBenefits = () => {
  return (
    <section className="mt-12">
      <img
        src="https://cdn11.bigcommerce.com/s-ew2v2d3jn1/product_images/uploaded_images/banner-used-equipment.jpg"
        alt="Used Equipment Banner"
      />
      <div className="space-y-6 text-center mt-5">
        <p className="text-sm font-normal">
          G2 Survey offer a wide range of reconditioned and used surveying
          equipment at very competitive prices, providing excellent value for
          money.
        </p>
        <p className="text-sm font-normal">
          All of our pre-owned used Total Stations, GNSS/GPS Systems, 3D Laser
          Scanners, Laser Levels, Levels, and other used surveying equipment are
          fully serviced, certified and come with a minimum 3 month warranty for
          both parts and labour.
        </p>
        <p className="text-sm font-normal">
          With an extensive range of used Total Stations, used 3D Laser Scanners
          and used GNSS/GPS Systems and more, we're guaranteed to find the right
          equipment for you, whatever the budget.
        </p>
        {/* Highlighted box */}
        <div className="bg-gray-100 p-8 rounded-lg space-y-6">
          <h2 className="text-xl text-[#e62245] uppercase">
            Used Surveying Equipment Benefits
          </h2>
          <p>Cost Effective - Substantial Savings Over Buying New Equipment</p>
          <p>Serviced / Calibrated by Leica Trained Technicians</p>
          <p>6 Month Extended Warranty Available on Many Instruments</p>
          <p>
            Leading Brands - Whether it be a Used{" "}
            <a href="#" className="underline">
              Leica TS15
            </a>{" "}
            Total Station or a{" "}
            <a href="#" className="underline">
              Leica BLK360
            </a>{" "}
            Used Laser Scanner you're after, we've got you covered
          </p>
          <p className="italic font-semibold">Worldwide Shipping</p>
          <p className="text-[#e62245] text-sm font-normal">
            DEMAND IS HIGH FOR PRE-OWNED EQUIPMENT, AND OUR STOCK IS CONSTANTLY
            CHANGING.
          </p>
          <p className="text-[#e62245] text-sm font-normald">
            IF YOU CAN'T FIND THE SPECIFIC KIT YOU REQUIRE PLEASE CONTACT US AND
            WE WILL SOURCE IT.
          </p>
          <div className="flex justify-center">
            <Link
              to="/contact-us"
              className="bg-[#e62245] text-white px-3 text-sm py-1.5 rounded-[4px] hover:bg-[#c81e3b] transition"
            >
              Contact Us
            </Link>
          </div>
          <div>
            <a href="#" className="text-[#e62245] underline text-sm">
              G2 Survey Reconditioned Surveying Equipment Brochure
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsedEquipmentBenefits;
