import { Card, CardContent } from "@/Components/ui/card";
import { PieChart, Cell, Pie, ResponsiveContainer } from "recharts";
const SourceOfPurchases = ({ data, loading }) => {
  const COLORS = ["#0f766e", "#2dd4bf", "#facc15"];
  const totalSales = data?.reduce((sum, item) => sum + item.value, 0) || 0;
  return (
    <div>
      <Card className="bg-slate-800 col-span-1 border-0 text-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center pb-3">
            <div className="text-[18px] font-semibold">Source of Purchases</div>
            <div className="text-gray-400 text-sm">Sort By: Yearly</div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <>
              <div className="h-64 mt-5 flex items-center justify-center relative">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={95}
                      outerRadius={120}
                      fill="#8884d8"
                      paddingAngle={5}
                    >
                      {data?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute w-[150px] text-center text-white text-2xl">
                  Total Sales {totalSales}
                </div>
              </div>
              <div className="flex pt-6 justify-between text-gray-400 text-sm mt-4">
                {data?.map((entry, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full`}
                      style={{ background: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{entry.name}</span>
                    <span className="font-bold text-white">
                      {entry.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SourceOfPurchases;
