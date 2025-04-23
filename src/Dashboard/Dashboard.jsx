import {
  ArrowDownRight,
  ArrowUpRight,
  Users,
  DollarSign,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import DashboardCharts from "./DBComponents/DashboardCharts";
import DashboardWidgets from "./DBComponents/DashboardWidgets";
import LatestTransactions from "./DBComponents/LatestTransactions";

export default function Dashboard() {
  return (
    <div className="p-4 pt-0 grid gap-4 grid-cols-1 xl:grid-cols-4">
      {/* Top Metrics */}
      <Card className="border-0 col-span-1 xl:col-span-4 bg-slate-900 text-white">
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          <MetricBox
            icon={<DollarSign />}
            title="Total Earnings"
            value="$34,123.20 USD"
            change="+7.2%"
            up
          />
          <MetricBox
            icon={<ShoppingCart />}
            title="Total Orders"
            value="63,234 NOU"
            change="-7.2%"
          />
          <MetricBox
            icon={<Users />}
            title="Today Visitor"
            value="425,234 KDU"
            change="+2.4%"
            up
          />
          <MetricBox
            icon={<CreditCard />}
            title="Total Expense"
            value="$26,482.46 USD"
            change="+2.2%"
            up
          />
        </CardContent>
      </Card>

      <div className="col-span-4">
        <DashboardCharts />
      </div>
      {/* Audiences Chart */}
      {/* <Card className="col-span-2 bg-slate-900 text-white">
        <CardContent className="p-4">
          <div className="text-xl font-semibold mb-2">Audience Metrics</div>
          <div className="h-48 bg-slate-800 rounded-lg flex items-center justify-center text-sm text-gray-400">
            [Bar Chart Here]
          </div>
        </CardContent>
      </Card> */}

      {/* Pie Chart */}
      {/* <Card className="bg-slate-900 text-white">
        <CardContent className="p-4">
          <div className="text-xl font-semibold mb-2">Total Value</div>
          <div className="h-48 bg-slate-800 rounded-lg flex items-center justify-center text-sm text-gray-400">
            [$75,781 Pie Chart Here]
          </div>
        </CardContent>
      </Card> */}

      <div className="col-span-4">
        <DashboardWidgets />
      </div>
      {/* Source of Purchases */}
      <Card className="col-span-1 bg-slate-900 text-white">
        <CardContent className="p-4">
          <div className="text-xl font-semibold mb-2">Source of Purchases</div>
          <div className="text-gray-400 text-sm">Total Sales: 5,685</div>
          <div className="h-32 bg-slate-800 rounded-lg mt-2 flex items-center justify-center text-sm">
            [Circular Graph Placeholder]
          </div>
        </CardContent>
      </Card>

      {/* Sales Statistics */}
      <Card className=" col-span-1 bg-slate-900 text-white">
        <CardContent className="p-4">
          <div className="text-xl font-semibold mb-2">Sales Statistics</div>
          <div className="text-gray-400 text-sm mb-4">
            Today vs previous month
          </div>
          <div className="grid grid-cols-3 gap-2">
            <SalesStat label="Pending" count="2,123" value="17,351" />
            <SalesStat label="Cancelled" count="3,662" value="67,536" />
            <SalesStat label="Delivered" count="3,662" value="67,536" />
          </div>
        </CardContent>
      </Card>

      {/* Top Users */}
      <Card className="col-span-2 bg-slate-900 text-white">
        <CardContent className="p-4">
          <div className="text-xl font-semibold mb-2">Top Users</div>
          <div className="text-sm text-gray-400">[Users List Placeholder]</div>
        </CardContent>
      </Card>
      <div className="col-span-4">
        <LatestTransactions />
      </div>
    </div>
  );
}

function MetricBox({ icon, title, value, change, up = false }) {
  const ArrowIcon = up ? ArrowUpRight : ArrowDownRight;
  const arrowClass = up ? "text-green-400" : "text-red-400";
  return (
    <div className="bg-slate-800 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-gray-300">{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`flex items-center gap-1 text-sm ${arrowClass}`}>
        <ArrowIcon className="w-4 h-4" />
        {change}
      </div>
    </div>
  );
}

function SalesStat({ label, count, value }) {
  return (
    <div className="bg-slate-800 rounded-lg p-3">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-sm text-gray-300">{count} orders</div>
    </div>
  );
}
