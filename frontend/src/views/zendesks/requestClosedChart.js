// /* eslint-disable react-hooks/exhaustive-deps */

import React from "react";

import { useSelector } from "react-redux";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const RequestClosedChart = () => {
  const { zendeskStatsData } = useSelector((state) => state?.zendesk);

  const closedGraphData = zendeskStatsData?.closedGraphData || [];
  const labels = closedGraphData.map((entry) => entry.date);
  const counts = closedGraphData.map((entry) => entry.count || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Closed Requests",
        data: counts,
        backgroundColor: "#9cc904",
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: "#ffffff99" },
        title: { display: true, text: "Date", color: "#ffffff99" }
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#ffffff99" },
        title: { display: true, text: "Number of Requests", color: "#ffffff99" }
      }
    },
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#ffffff99" }
      }
    }
  };

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RequestClosedChart;