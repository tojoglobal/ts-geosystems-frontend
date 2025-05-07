import {
  ArrowDownRight,
  ArrowUpRight,
  Users,
  DollarSign,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import DashboardCharts from "./DBComponents/DashboardCharts";
import DashboardWidgets from "./DBComponents/DashboardWidgets";
import LatestTransactions from "./DBComponents/LatestTransactions";

export default function Dashboard() {
  return (
    <div className="p-3 pt-0 grid gap-4 grid-cols-1 xl:grid-cols-4">
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
      <div className="col-span-4">
        <DashboardWidgets />
      </div>
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
