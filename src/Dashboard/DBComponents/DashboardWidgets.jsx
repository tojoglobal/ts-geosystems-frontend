import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

const COLORS = ["#0f766e", "#2dd4bf", "#facc15"];

export default function DashboardWidgets() {
  // Data for Pie Chart
  const pieData = [
    { name: "E-Commerce", value: 52.524 },
    { name: "Facebook", value: 48.625 },
    { name: "Instagram", value: 85.745 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Source of Purchases */}
      <Card className="bg-slate-900 text-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">Source of Purchases</div>
            <div className="text-gray-400 text-sm">Sort By: Yearly</div>
          </div>
          <div className="text-gray-400 text-sm mt-1">Total Sales: 5,685</div>
          <div className="h-48 flex items-center justify-center relative">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-gray-400 text-sm mt-4">
            Magnis dis parturient montes nascetur ridiculus tincidunt lobortis.
          </div>
          <div className="flex justify-between text-gray-400 text-sm mt-4">
            {pieData.map((entry, index) => (
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
        </CardContent>
      </Card>

      {/* Sales Statistics */}
      <Card className="bg-slate-900 text-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">Sales Statistics</div>
            <div className="text-gray-400 text-sm">Today</div>
          </div>
          <div className="text-xl font-bold text-white mt-1">725,800</div>
          <div className="text-gray-400 text-sm mb-4">
            <span className="text-green-400">+15.72% vs. previous month</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <SalesStat
              label="Product Pending"
              orders="17,351"
              returns="2,123"
              earnings="+45.3%"
            />
            <SalesStat
              label="Product Cancelled"
              orders="67,356"
              returns="3,652"
              earnings="-14.6%"
              down
            />
            <SalesStat
              label="Product Delivered"
              orders="67,356"
              returns="3,652"
              earnings="-14.6%"
            />
          </div>
          <Button variant="outline" className="w-full mt-4">
            View More
          </Button>
        </CardContent>
      </Card>

      {/* Top Users */}
      <Card className="bg-slate-900 text-white col-span-1 md:col-span-2">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">Top Users</div>
            <div className="text-gray-400 text-sm">Sort By: Yearly</div>
          </div>
          <div className="mt-4">
            {[
              {
                name: "Glenn Holden",
                email: "glennholden@tocly.com",
                status: "Cancel",
                amount: "$250.00",
                statusClass: "text-red-400 bg-red-900",
              },
              {
                name: "Lolita Hamill",
                email: "lolitahamill@tocly.com",
                status: "Success",
                amount: "$110.00",
                statusClass: "text-green-400 bg-green-900",
              },
              {
                name: "Robert Mercer",
                email: "robertmercer@tocly.com",
                status: "Active",
                amount: "$420.00",
                statusClass: "text-blue-400 bg-blue-900",
              },
              {
                name: "Marie Kim",
                email: "mariekim@tocly.com",
                status: "Pending",
                amount: "$120.00",
                statusClass: "text-yellow-400 bg-yellow-900",
              },
              {
                name: "Sonya Henshaw",
                email: "sonyahenshaw@tocly.com",
                status: "Active",
                amount: "$112.00",
                statusClass: "text-blue-400 bg-blue-900",
              },
            ].map((user, index) => (
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
        </CardContent>
      </Card>
    </div>
  );
}

function SalesStat({ label, orders, returns, earnings, down = false }) {
  const arrowClass = down ? "text-red-400" : "text-green-400";
  const bgClass = down ? "bg-red-900" : "bg-green-900";
  return (
    <div className={`bg-slate-800 rounded-lg p-3`}>
      <div className="text-sm text-gray-400">{label}</div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-gray-300 text-sm">{orders} orders</span>
        <span className="text-gray-300 text-sm">{returns} returns</span>
      </div>
      <div
        className={`text-sm px-2 py-1 mt-2 rounded-full ${arrowClass} ${bgClass}`}
      >
        {earnings}
      </div>
    </div>
  );
}
