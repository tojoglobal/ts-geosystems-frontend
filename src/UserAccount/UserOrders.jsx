import { AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import useDataQuery from "../utils/useDataQuery";

const UserOrders = () => {
  const { user } = useSelector((state) => state.authUser);

  const { data, isLoading, isError } = useDataQuery(
    ["userOrders", user.email],
    `/api/order/${user.email}`,
    !!user?.email
  );

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (isError) {
    return (
      <div className="bg-white p-4 rounded border text-gray-600 flex items-start gap-2">
        <AlertCircle className="mt-[2px]" size={18} />
        <p className="text-[14px]">
          Failed to load orders. Please try again later.
        </p>
      </div>
    );
  }

  const orders = data?.data || [];
  
  // Format order data for display
  const formattedOrders = orders.map((order) => {
    // Get the first item's image if available
    let firstImage = "/placeholder-product.jpg"; // default image
    try {
      const items = JSON.parse(order.items);
      if (items.length > 0 && items[0].image_urls) {
        const images = JSON.parse(items[0].image_urls);
        if (images.length > 0) {
          firstImage = images[0];
        }
      }
    } catch (e) {
      console.error("Error parsing order items", e);
    }

    return {
      id: order.order_id,
      productCount: JSON.parse(order.items).length,
      totalAmount: `£${parseFloat(order.total).toFixed(2)}`,
      orderPlaced: new Date(order.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      lastUpdate: new Date(order.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      status: order.status.toUpperCase(),
      image: firstImage,
    };
  });

  return (
    <div>
      {formattedOrders.length > 0 ? (
        <div className="space-y-4">
          {formattedOrders.map((order) => (
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
                      <h3 className="text-red-500 font-medium">
                        Order {order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.productCount} product
                        {order.productCount !== 1 ? "s" : ""} totalling{" "}
                        {order.totalAmount}
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
          {data?.pagination && (
            <p className="text-sm text-center text-gray-600">
              Page {data.pagination.currentPage} of {data.pagination.totalPages}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white p-4 rounded border text-gray-600 flex items-start gap-2">
          <AlertCircle className="mt-[2px]" size={18} />
          <p className="text-[14px]">
            You haven't placed any orders with us. When you do, their status
            will appear on this page.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
