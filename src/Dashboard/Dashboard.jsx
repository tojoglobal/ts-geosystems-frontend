import { useState } from "react";
import { useDashboardMetrics } from "./DBComponents/useDashboardData";
import {
  ArrowDownRight,
  ArrowUpRight,
  Users,
  DollarSign,
  ShoppingCart,
  CreditCard,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import DashboardCharts from "./DBComponents/DashboardCharts";
import DashboardWidgets from "./DBComponents/DashboardWidgets";
import LatestTransactions from "./DBComponents/LatestTransactions";

export default function Dashboard() {
  const [earningsPeriod, setEarningsPeriod] = useState("year");
  const [ordersPeriod, setOrdersPeriod] = useState("year");

  // Always fetch all users (no period param)
  const { data: earningsMetrics = {}, isLoading: earningsLoading } =
    useDashboardMetrics(earningsPeriod);
  const { data: ordersMetrics = {}, isLoading: ordersLoading } =
    useDashboardMetrics(ordersPeriod);
  const { data: usersMetrics = {}, isLoading: usersLoading } =
    useDashboardMetrics("all");
  return (
    <div className="p-1 pt-0 grid md:gap-4 grid-cols-1 xl:grid-cols-4">
      {/* Top Metrics */}
      <Card className="border-0 col-span-1 xl:col-span-4 bg-slate-900 text-white">
        <CardContent className="px-0 md:px-0 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <MetricBox
            icon={<DollarSign />}
            title="Total Earnings"
            value={earningsMetrics?.totalEarnings || "$0.00 USD"}
            change={earningsMetrics?.earningsChange || "+0.0%"}
            up={!earningsMetrics?.earningsChange?.startsWith("-")}
            period={earningsPeriod}
            setPeriod={setEarningsPeriod}
            loading={earningsLoading}
            showPeriodDropdown={true}
          />
          <MetricBox
            icon={<ShoppingCart />}
            title="Total Orders"
            value={ordersMetrics?.totalOrders || "0"}
            change={ordersMetrics?.orderChange || "+0.0%"}
            up={!ordersMetrics?.orderChange?.startsWith("-")}
            period={ordersPeriod}
            setPeriod={setOrdersPeriod}
            loading={ordersLoading}
            showPeriodDropdown={true}
          />
          <MetricBox
            icon={<Users />}
            title="Total Users"
            value={usersMetrics?.totalUsers || "0"}
            change={usersMetrics?.userChange || "+0.0%"}
            up={!usersMetrics?.userChange?.startsWith("-")}
            period="all"
            setPeriod={null}
            loading={usersLoading}
            showPeriodDropdown={false}
          />
          <MetricBox
            icon={<CreditCard />}
            title="Avg. Order Value"
            value={
              earningsMetrics && Number(ordersMetrics?.totalOrders) > 0
                ? `$${(
                    parseFloat(
                      earningsMetrics.totalEarnings.replace(/[^0-9.-]+/g, "")
                    ) / Number(ordersMetrics.totalOrders)
                  ).toFixed(2)}`
                : "$0.00"
            }
            change=""
            loading={earningsLoading || ordersLoading}
            showPeriodDropdown={false}
          />
        </CardContent>
      </Card>
      {/* Charts */}
      <div className="col-span-1 xl:col-span-4">
        <DashboardCharts />
      </div>
      {/* Widgets */}
      <div className="col-span-1 xl:col-span-4">
        <DashboardWidgets />
      </div>
      {/* Latest Transactions */}
      <div className="col-span-1 xl:col-span-4">
        <LatestTransactions />
      </div>
    </div>
  );
}

function MetricBox({
  icon,
  title,
  value,
  change,
  up = false,
  period,
  setPeriod,
  loading,
  showPeriodDropdown = true,
}) {
  const ArrowIcon = up ? ArrowUpRight : ArrowDownRight;
  const arrowClass = up ? "text-green-400" : "text-red-400";

  const periodLabel =
    {
      year: "Yearly",
      month: "Monthly",
      week: "Weekly",
      today: "Today",
      all: "All Time",
    }[period] || "All Time";

  return (
    <div className="bg-slate-800 rounded-xl p-3 md:p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-gray-300">{icon}</div>
      </div>
      <div className="text-base md:text-2xl font-bold">
        {loading ? <span className="animate-pulse">...</span> : value}
      </div>
      <div className="flex justify-between items-center gap-1">
        <div className={`flex items-center gap-1 text-sm ${arrowClass}`}>
          {showPeriodDropdown && loading ? (
            <span className="animate-pulse">...</span>
          ) : (
            <>
              <ArrowIcon className="w-4 h-4" />
              {change}
            </>
          )}
        </div>
        {showPeriodDropdown && setPeriod && (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex items-center gap-1">
              <MoreVertical className="h-5 w-5 text-gray-400 hover:text-gray-300 cursor-pointer" />
              <span className="text-xs ml-1 text-gray-400">{periodLabel}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700">
              <DropdownMenuItem
                className="text-gray-300 hover:bg-slate-700 cursor-pointer"
                onClick={() => setPeriod("year")}
              >
                Yearly
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-gray-300 hover:bg-slate-700 cursor-pointer"
                onClick={() => setPeriod("month")}
              >
                Monthly
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-gray-300 hover:bg-slate-700 cursor-pointer"
                onClick={() => setPeriod("week")}
              >
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-gray-300 hover:bg-slate-700 cursor-pointer"
                onClick={() => setPeriod("today")}
              >
                Today
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!showPeriodDropdown && (
          <span className="text-xs ml-1 text-gray-400">{periodLabel}</span>
        )}
      </div>
    </div>
  );
}
