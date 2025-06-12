import { Card, CardContent } from "@/Components/ui/card";
import { PieChart, Cell, Pie, ResponsiveContainer } from "recharts";
import {
  useOrdersByStatus,
  useOrdersByPaymentMethod,
} from "./useDashboardData";

const COLORS = ["#0f766e", "#2dd4bf", "#facc15", "#f472b6", "#818cf8"];

const SourceOfPurchases = () => {
  // Orders grouped by STATUS (completed, pending, etc)
  const { data, isLoading: statusLoading } = useOrdersByStatus();
  const statusData = data?.statusData || [];
  const totalOrders = data?.total || 0;
  // Orders grouped by payment method
  const { data: methodData = [], isLoading: methodLoading } =
    useOrdersByPaymentMethod();

  return (
    <Card className="bg-slate-800 border-0 text-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-center pb-3">
          <div className="text-[18px] font-semibold">Orders by Status</div>
        </div>
        {statusLoading ? (
          <div className="h-64 flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <>
            <div className="h-64 mt-5 flex items-center justify-center relative">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={95}
                    outerRadius={120}
                    paddingAngle={5}
                  >
                    {statusData?.map((entry, index) => (
                      <Cell
                        key={`status-cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute w-[150px] text-center text-white text-2xl">
                Total Orders {totalOrders}
              </div>
            </div>
            <div className="flex pt-6 justify-between text-gray-400 text-sm mt-4">
              {statusData?.map((entry, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="capitalize">{entry.name}</span>
                  <span className="font-bold text-white">
                    {entry.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            {/* Payment Method Breakdown at the bottom */}
            <div className="mt-4 border-t border-gray-700 pt-3">
              <div className="text-lg font-semibold mb-3">Payment Method</div>
              {methodLoading ? (
                <div>Loading...</div>
              ) : (
                <div className="flex gap-8 flex-wrap">
                  {methodData?.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ background: COLORS[index % COLORS.length] }}
                      ></span>
                      <span className="capitalize">{entry.name}</span>
                      <span className="font-bold text-white">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SourceOfPurchases;
