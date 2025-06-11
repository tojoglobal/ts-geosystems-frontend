import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { useSalesStatistics, useTopUsers } from "./useDashboardData";

export default function DashboardWidgets() {
  const { data: salesStats, isLoading: statsLoading } = useSalesStatistics();
  const { data: topUsers, isLoading: usersLoading } = useTopUsers();
  console.log(salesStats, topUsers);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-10 gap-4">
      <Card className="bg-slate-800 col-span-1 sm:col-span-2 xl:col-span-5 border-0 text-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center pb-5">
            <div className="text-xl font-semibold">Sales Statistics</div>
            <div className="text-gray-400 text-sm">Today</div>
          </div>
          {statsLoading ? (
            <div className="h-64 flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="text-gray-300 min-w-full">
                  <thead className="text-sm text-gray-400 uppercase bg-slate-800">
                    <tr className="text-left">
                      <th className="py-2">Order Status</th>
                      <th className="px-2 py-2">Orders</th>
                      <th className="px-2 py-2">Returns</th>
                      <th className="px-2 py-2">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesStats?.map((item, index) => (
                      <tr
                        key={index}
                        className="bg-slate-800 border-b text-sm border-slate-700"
                      >
                        <td className="whitespace-nowrap py-2">{item.label}</td>
                        <td className="px-2 py-2">{item.orders}</td>
                        <td className="px-2 py-2">{item.returns}</td>
                        <td className={`px-2 py-2 ${item.earningsClass}`}>
                          {item.earnings}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" className="w-full bg-[#0B6D7F] mt-4">
                View More
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Top Users */}
      <Card className="bg-slate-800 col-span-1 sm:col-span-2 xl:col-span-5 border-0 text-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">Top Users</div>
            <div className="text-gray-400 text-sm">Sort By: Yearly</div>
          </div>
          {usersLoading ? (
            <div className="h-64 flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <div className="mt-4">
              {topUsers?.map((user, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-slate-800"
                >
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{user.amount}</div>
                    <div
                      className={`text-sm px-2 py-1 rounded-full ${user.statusClass}`}
                    >
                      {user.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
