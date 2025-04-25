import { Link } from "react-router-dom";
const TradeIn = () => {
    return (
      <div className="p-3">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="flex items-center gap-1 text-[#e62245]">
            Home
          </Link>
          <span>/</span>
          <Link to="/Service" className="text-[#e62245]">
            TRADE IN
          </Link>
        </div>
        <p className="text-[#e62245] uppercase text-3xl mt-1 mb-6">TRADE IN</p>
        <h1 className="text-2xl mt-2 text-[#e62245] mb-2 font-bold">
          Sell or Trade In Your Surveying Equipment
        </h1>
        <p className="mb-4">
          G2 Survey purchases Leica Geosystems survey equipment and will trade
          in Trimble, Topcon, and others against the purchase of new or used
          Leica surveying instruments.
        </p>

        <h2 className="text-[#e62245] font-bold mb-1">Our Buying Process</h2>
        <ol className="list-decimal list-inside mb-4">
          <li>
            1. To give you our best offer, we request you complete the form
            below as fully as possible, especially the make, model, serial
            number, software, condition, and photos.
          </li>
          <li>
            2. Once we receive that information, we will review the details and
            condition and will make you an offer. When you agree to the quote,
            we'll send a purchase order for your review along with our terms and
            conditions.
          </li>
          <li>
            3. Upon approval of the purchase order, we will arrange collection.
            Once the equipment is received it will be tested and verified within
            5 working days.
          </li>
          <li>
            4. Payment is sent once condition has been verified. If the items
            are not received as expected, we may amend our offer, or return at
            no cost.
          </li>
        </ol>
        <h2 className="text-[#e62245] font-bold mb-1">Trade-Ins</h2>
        <p>
          Are you looking to trade in your survey equipment? The process is the
          same for buying your equipment! We will simply credit the offer amount
          towards the new equipment you want to purchase.
        </p>
      </div>
    );
};

export default TradeIn;