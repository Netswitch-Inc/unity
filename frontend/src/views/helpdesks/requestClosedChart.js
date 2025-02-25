/* eslint-disable react-hooks/exhaustive-deps */

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
  // Fetch data from Redux
  const { helpdeskStatsData } = useSelector((state) => state?.helpdesk);

  // Extract the necessary data
  const closedGraphData = helpdeskStatsData?.closedGraphData || [];
  const labels = closedGraphData.map((entry) => entry.date);
  const nonViolated = closedGraphData.map((entry) => entry.nonViolated || 0);
  const violated = closedGraphData.map((entry) => entry.violated || 0);

  // Prepare chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: "Non-Violated",
        data: nonViolated,
        backgroundColor: "#9cc904",
      },
      {
        label: "SLA Violated",
        data: violated,
        backgroundColor: "#fa5335",
      }
    ]
  }

  const options = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#ffffff99 ",
        },
        title: {
          display: true,
          text: "Date",
          color: "#ffffff99 ",
        }
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#ffffff99" },
        title: {
          display: true,
          text: "Number of Requests",
          color: "#ffffff99 "
        }
      }
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ffffff99"
        }
      }
    }
  }

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default RequestClosedChart;
