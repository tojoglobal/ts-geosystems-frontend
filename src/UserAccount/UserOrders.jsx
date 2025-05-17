import { AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";

const UserOrders = () => {
  const { user } = useSelector((state) => state.authUser);
  console.log(user);
  const orders = [
    {
      id: "#7187",
      productCount: 1,
      totalAmount: "£11,994.00",
      orderPlaced: "17th May 2025",
      lastUpdate: "17th May 2025",
      status: "AWAITING PAYMENT",
      image: "/product1.jpg" // You'll need to replace with actual image path
    },
    {
      id: "#7179",
      productCount: 1,
      totalAmount: "£38,760.00",
      orderPlaced: "15th May 2025",
      lastUpdate: "15th May 2025",
      status: "AWAITING PAYMENT",
      image: "/product2.jpg" // You'll need to replace with actual image path
    }
  ];

  return (
    <div>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded border-b">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20">
                  <img
                    src={order.image}
                    alt="Product"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-red-500 font-medium">Order {order.id}</h3>
                      <p className="text-sm text-gray-600">
                        {order.productCount} product totalling {order.totalAmount}
                      </p>
                    </div>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-8">
                    <div>
                      <p className="text-xs text-gray-500">ORDER PLACED</p>
                      <p className="text-sm">{order.orderPlaced}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">LAST UPDATE</p>
                      <p className="text-sm">{order.lastUpdate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <p className="text-sm text-center text-gray-600">Page 1 of 1</p>
        </div>
      ) : (
        <div className="bg-white p-4 rounded border text-gray-600 flex items-start gap-2">
          <AlertCircle className="mt-[2px]" size={18} />
          <p className="text-[14px]">
            You haven't placed any orders with us. When you do, their status will
            appear on this page.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
