import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
export default function NotificationBell() {
  const axiosPublicUrl = useAxiospublic();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const containerRef = useRef(null);
  const bellButtonRef = useRef(null);

  // Infinite notifications fetch: always enabled, polling in background
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["admin-notifications"],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await axiosPublicUrl.get(
          `/api/admin/notifications?page=${pageParam}&limit=10`
        );
        return res.data;
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.hasMore) return lastPage.page + 1;
        return undefined;
      },
      refetchInterval: 15000, // poll every 15s in background
      // enabled: open, // <-- REMOVED to enable always
    });

  // Flatten notifications
  const notifications = (data?.pages || []).flatMap(
    (p) => p.notifications || []
  );
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

  // Infinite scroll handler
  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
          container.scrollHeight - 20 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [open, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (event) => {
      // If click is outside the dropdown and bell button, close
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        bellButtonRef.current &&
        !bellButtonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={bellButtonRef}
        className="relative cursor-pointer flex items-center justify-center text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        <Bell size={23} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-[2px] inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          ref={containerRef}
          // className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 shadow-xl rounded-lg z-50 max-h-80 border border-gray-200 dark:border-gray-700 flex flex-col"
          className={`
            fixed md:absolute 
            top-12 right-4 left-4 md:left-auto
            w-auto md:w-96
            md:right-0 md:top-full md:mt-2
            bg-white dark:bg-gray-800 
            shadow-xl rounded-lg z-50 max-h-[60vh] md:max-h-80
            border border-gray-200 dark:border-gray-700 
            flex flex-col
          `}
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                className="text-xs cursor-pointer text-teal-600 hover:underline"
                onClick={() => markAllReadMutation.mutate()}
              >
                Mark all as read
              </button>
            )}
          </div>
          <div
            className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto flex-1"
            style={{ maxHeight: "20rem" }}
          >
            {isLoading && <div className="p-4 text-center">Loading...</div>}
            {!isLoading && notifications.length === 0 && (
              <div className="p-4 text-center text-gray-400">
                No notifications
              </div>
            )}
            {notifications.map((n) => (
              <Link
                to={n.link || "#"}
                key={n.id}
                onClick={() => {
                  markReadMutation.mutate(n.id);
                  setOpen(false);
                }}
                className={
                  `block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition ` +
                  (!n.is_read
                    ? "bg-blue-50 dark:bg-teal-900 font-semibold border-l-4 border-blue-600"
                    : "bg-white dark:bg-gray-800")
                }
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
            ))}
            {isFetchingNextPage && (
              <div className="p-2 text-center">Loading more...</div>
            )}
            {!isFetchingNextPage && hasNextPage && (
              <div className="text-center py-2">
                <button
                  className="text-teal-600 hover:underline text-sm"
                  onClick={() => fetchNextPage()}
                >
                  View more notifications
                </button>
              </div>
            )}
            {!hasNextPage && notifications.length > 10 && (
              <div className="text-center py-2 text-gray-400 text-xs">
                No more notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
