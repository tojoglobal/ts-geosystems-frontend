import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

export default function NotificationBell() {
    const axiosPublicUrl = useAxiospublic();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const res = await axiosPublicUrl.get("/api/admin/notifications");
      // Always return an array
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.notifications)) return res.data.notifications;
      if (Array.isArray(res.data?.data)) return res.data.data;
      return [];
    },
    refetchInterval: 15000,
  });
  
  const notifications = Array.isArray(data) ? data : [];
  const unreadCount = notifications.filter((n) => !n.is_read).length || 0;

  // Mark as read on click
  const markReadMutation = useMutation({
    mutationFn: async (id) =>
      axiosPublicUrl.put(`/api/admin/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries(["admin-notifications"]),
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () =>
      axiosPublicUrl.put(`/api/admin/notifications/mark-all-read`),
    onSuccess: () => queryClient.invalidateQueries(["admin-notifications"]),
  });

  // Show top 4 notifications, scrollable
  const latest = notifications.slice(0, 4);

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        <Bell size={23} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 shadow-xl rounded-lg z-50 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                className="text-xs text-teal-600 hover:underline"
                onClick={() => markAllReadMutation.mutate()}
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : latest.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No notifications
              </div>
            ) : (
              latest.map((n) => (
                <Link
                  to={n.link || "#"}
                  key={n.id}
                  onClick={() => {
                    markReadMutation.mutate(n.id);
                    setOpen(false);
                  }}
                  className={`block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                    !n.is_read
                      ? "bg-gray-50 dark:bg-gray-900 font-semibold"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        n.type === "order"
                          ? "bg-green-500"
                          : n.type === "question"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    ></span>
                    <span className="text-sm text-gray-800 dark:text-gray-100">
                      {n.content}
                    </span>
                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
          {notifications.length > 4 && (
            <div className="text-center py-2">
              <Link
                to="/admin/notifications"
                className="text-teal-600 hover:underline text-sm"
                onClick={() => setOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
