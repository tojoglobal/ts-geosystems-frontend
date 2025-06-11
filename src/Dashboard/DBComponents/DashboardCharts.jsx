import { useAudienceMetrics } from "./useDashboardData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import SourceOfPurchases from "./SourceOfPurchases";
// import Map, { Marker } from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

const DashboardCharts = () => {
  const { data: barData, isLoading: barLoading } = useAudienceMetrics();
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="col-span-1 md:col-span-2 bg-slate-800 text-white rounded-lg p-4">
        <div className="text-xl font-semibold mb-4">Audience Metrics</div>
        {barLoading ? (
          <div className="h-64 flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <Bar data={barData} options={barOptions} />
        )}
      </div>
      <SourceOfPurchases />
    </div>
  );
};

export default DashboardCharts;
