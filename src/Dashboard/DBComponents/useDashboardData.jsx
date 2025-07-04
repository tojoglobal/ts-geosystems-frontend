import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

export const useDashboardMetrics = (period = "year", usersPeriod = "year") => {
  const axiosPublicUrl = useAxiospublic();

  return useQuery({
    queryKey: ["dashboard-metrics", period, usersPeriod],
    queryFn: async () => {
      // Orders and earnings
      const ordersRes = await axiosPublicUrl.get(
        `/api/order-metrics?period=${period}`
      );
      const orders = ordersRes.data.orders || [];
      // Users
      const usersRes = await axiosPublicUrl.get(`/api/all-users`);
      const users = usersRes.data || [];

      const totalOrders = orders.length;
      const totalUsers = users.length;
      const totalEarnings = orders.reduce(
        (sum, order) => sum + parseFloat(order.total || 0),
        0
      );

      // Demo change values, replace with real calculations if needed
      const orderChange = (Math.random() * 10 - 5).toFixed(1);
      const userChange = (Math.random() * 10).toFixed(1);
      const earningsChange = (Math.random() * 5 + 2).toFixed(1);

      return {
        totalEarnings: `$${totalEarnings.toFixed(2)} USD`,
        earningsChange: `${earningsChange}%`,
        totalOrders: `${totalOrders}`,
        orderChange: `${orderChange}%`,
        totalUsers: `${totalUsers}`,
        userChange: `${userChange}%`,
      };
    },
  });
};

export const useAudienceMetrics = () => {
  return useQuery({
    queryKey: ["audience-metrics"],
    queryFn: async () => {
      // This would ideally come from analytics data
      // For demo, we'll generate random data
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const activeUsers = months.map(() => Math.floor(Math.random() * 50) + 20);
      const inactiveUsers = months.map(
        () => Math.floor(Math.random() * 30) + 10
      );

      return {
        labels: months,
        datasets: [
          {
            label: "Active Users",
            data: activeUsers,
            backgroundColor: "#0f766e",
          },
          {
            label: "Inactive Users",
            data: inactiveUsers,
            backgroundColor: "#2dd4bf",
          },
        ],
      };
    },
  });
};

export const useOrdersByStatus = () => {
  const axiosPublicUrl = useAxiospublic();
  return useQuery({
    queryKey: ["orders-by-status"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/orders-status-summary");
      const statusData = res.data.map(row => ({
        name: row.status || "Unknown",
        value: row.count,
      }));
      const total = statusData.reduce((sum, item) => sum + item.value, 0);
      return { statusData, total };
    },
  });
}

export const useOrdersByPaymentStatus = () => {
  const axiosPublicUrl = useAxiospublic();
  return useQuery({
    queryKey: ["orders-by-payment-status"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/orderinfo");
      const orders = res?.data?.data || [];
      const counts = {};
      orders.forEach((order) => {
        const status = order.paymentStatus || "Unknown";
        counts[status] = (counts[status] || 0) + 1;
      });
      // Return both the status breakdown and the real total
      return {
        statusData: Object.entries(counts).map(([name, value]) => ({
          name,
          value,
        })),
        pagination: res.data.pagination || {},
      };
    },
  });
};

export const useOrdersByPaymentMethod = () => {
  const axiosPublicUrl = useAxiospublic();
  return useQuery({
    queryKey: ["orders-by-payment-method"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get(
        "/api/orders-payment-method-summary"
      );
      return res.data.map((row) => ({
        name: row.payment_method || "Unknown",
        value: row.count,
      }));
    },
  });
};

export const useSalesStatistics = () => {
  const axiosPublicUrl = useAxiospublic();

  return useQuery({
    queryKey: ["sales-statistics"],
    queryFn: async () => {
      const ordersRes = await axiosPublicUrl.get("/api/orderinfo");
      const orders = ordersRes.data?.data || [];

      // Calculate statistics
      const pendingOrders = orders.filter((o) => o.status === "pending").length;
      const cancelledOrders = orders.filter(
        (o) => o.status === "cancelled"
      ).length;
      const completedOrders = orders.filter(
        (o) => o.status === "completed"
      ).length;

      // For demo, we'll use random changes
      const pendingChange = (Math.random() * 20 + 5).toFixed(1);
      const cancelledChange = (Math.random() * -10 - 5).toFixed(1);
      const completedChange = (Math.random() * 15).toFixed(1);

      return [
        {
          label: "Product Pending",
          orders: pendingOrders,
          returns: Math.floor(pendingOrders * 0.1),
          earnings: `+${pendingChange}%`,
          earningsClass: "text-green-400",
        },
        {
          label: "Product Cancelled",
          orders: cancelledOrders,
          returns: Math.floor(cancelledOrders * 0.05),
          earnings: `${cancelledChange}%`,
          earningsClass: "text-red-400",
        },
        {
          label: "Product Delivered",
          orders: completedOrders,
          returns: Math.floor(completedOrders * 0.03),
          earnings: `+${completedChange}%`,
          earningsClass: "text-green-400",
        },
      ];
    },
  });
};

export const useTopUsers = () => {
  const axiosPublicUrl = useAxiospublic();

  return useQuery({
    queryKey: ["top-users"],
    queryFn: async () => {
      const [usersRes, ordersRes] = await Promise.all([
        axiosPublicUrl.get("/api/all-users"),
        axiosPublicUrl.get("/api/orderinfo"),
      ]);

      const users = usersRes?.data || [];
      const orders = ordersRes.data?.data || [];

      // Calculate user spending (simplified for demo)
      const userSpending = {};
      orders.forEach((order) => {
        if (!userSpending[order.email]) {
          userSpending[order.email] = 0;
        }
        userSpending[order.email] += parseFloat(order.total || 0);
      });

      // Get top 5 users
      const topUsers = users
        .map((user) => ({
          ...user,
          amount: `$${(userSpending[user.email] || 0).toFixed(2)}`,
        }))
        .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
        .slice(0, 5)
        .map((user) => ({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          status:
            Math.random() > 0.7
              ? "Cancel"
              : Math.random() > 0.5
              ? "Success"
              : Math.random() > 0.3
              ? "Active"
              : "Pending",
          amount: user.amount,
          statusClass:
            Math.random() > 0.7
              ? "text-red-400 bg-red-900"
              : Math.random() > 0.5
              ? "text-green-400 bg-green-900"
              : Math.random() > 0.3
              ? "text-blue-400 bg-blue-900"
              : "text-yellow-400 bg-yellow-900",
        }));

      return topUsers;
    },
  });
};
