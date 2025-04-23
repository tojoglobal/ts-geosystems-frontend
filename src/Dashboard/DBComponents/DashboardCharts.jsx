import React from "react";
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
import { Bar, Pie } from "react-chartjs-2";
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
  // Bar Chart Data
  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Active Users",
        data: [20, 35, 30, 25, 45, 40, 30, 35, 40, 25, 30, 50],
        backgroundColor: "#0f766e",
      },
      {
        label: "Inactive Users",
        data: [10, 15, 20, 10, 25, 20, 15, 20, 25, 15, 20, 30],
        backgroundColor: "#2dd4bf",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  // Pie Chart Data
  const pieData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        label: "Total Value",
        data: [75, 25],
        backgroundColor: ["#0f766e", "#2dd4bf"],
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Audiences Chart */}
      <div className="col-span-2 bg-slate-900 text-white rounded-lg p-4">
        <div className="text-xl font-semibold mb-4">Audience Metrics</div>
        <Bar data={barData} options={barOptions} />
      </div>

      {/* Pie Chart */}
      <div className="bg-slate-900 text-white rounded-lg p-4">
        <div className="text-xl font-semibold mb-4">Total Value</div>
        <Pie data={pieData} options={pieOptions} />
      </div>

      {/* Map Box */}
      {/* <div className="bg-slate-900 text-white rounded-lg p-4 col-span-3">
        <div className="text-xl font-semibold mb-4">Live Users by Country</div>
        <Map
          initialViewState={{
            longitude: -100,
            latitude: 40,
            zoom: 2,
          }}
          style={{ width: "100%", height: "300px" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        >
          <Marker longitude={-74.006} latitude={40.7128} color="#0f766e" />
          <Marker longitude={2.3522} latitude={48.8566} color="#0f766e" />
          <Marker longitude={139.6917} latitude={35.6895} color="#0f766e" />
        </Map>
      </div> */}
    </div>
  );
};

export default DashboardCharts;
