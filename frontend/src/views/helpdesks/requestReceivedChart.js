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
  const { helpdeskStatsData } = useSelector((state) => state?.helpdesk);

  // Extract SLA Chart data from Redux store
  const slaChartData = helpdeskStatsData?.slaChartData || [];

  // Extract labels (dates) and values from `slaChartData`
  const labels = slaChartData.map((entry) => entry.date)
  const nonViolatedData = slaChartData.map((entry) => entry.nonViolated || 0)
  const violatedData = slaChartData.map((entry) => entry.violated || 0)

  // Prepare chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: "Non-Violated",
        data: nonViolatedData,
        backgroundColor: "#9cc904", // Green color for non-violated
        color: "#ffffff99"
      },
      {
        label: "SLA Violated",
        data: violatedData,
        backgroundColor: "#fa5335", // Yellow color for violated
        color: "#ffffff99"
      }
    ]
  }

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
