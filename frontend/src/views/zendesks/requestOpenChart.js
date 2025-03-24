/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";

import { useSelector } from "react-redux";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Legend,
  Tooltip,
  BarElement,
  LinearScale,
  CategoryScale
} from "chart.js";

// Register necessary chart elements
ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const RequestReceivedChart = () => {
  // Fetch dashboard data from Redux
  const { zendeskStatsData } = useSelector((state) => state?.zendesk);

  // Extract receivedGraphData
  const receivedGraphData = zendeskStatsData?.openGraphData || [];

  // Filter out entries where count is 0
  const filteredData = receivedGraphData.filter((entry) => entry.count > 0);

  // Extract labels (dates) and values from `filteredData`
  const labels = filteredData.map((entry) => entry.date);
  const counts = filteredData.map((entry) => entry.count);

  // Prepare chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: "Received Requests",
        data: counts,
        backgroundColor: "#9cc904", // Blue color for received requests
        color: "#ffffff99"
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: "#ffffff99"
        },
        beginAtZero: true,
        title: {
          display: true,
          text: "Date",
          color: "#ffffff99"
        }
      },
      y: {
        ticks: {
          color: "#ffffff99"
        },
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Requests",
          color: "#ffffff99"
        }
      }
    },
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#ffffff99" }
      },
      title: { color: "#ffffff99" }
    }
  }

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default RequestReceivedChart;
