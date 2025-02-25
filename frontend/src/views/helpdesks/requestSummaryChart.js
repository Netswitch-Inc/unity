/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useSelector } from "react-redux";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RequestSummaryChart = () => {
  // Get the unified dashboard data from Redux.
  // We assume the backend returns a field `summaryChartData` that is an array of objects,
  // each with keys: day, OverDue, Inbound, Completed.
  const { helpdeskStatsData } = useSelector((state) => state.helpdesk);
  const summaryChartData = helpdeskStatsData?.summaryChartData || [
    { day: "Sun", OverDue: 0, Inbound: 0, Completed: 0 },
    { day: "Mon", OverDue: 0, Inbound: 0, Completed: 0 },
    { day: "Tue", OverDue: 0, Inbound: 0, Completed: 0 },
    { day: "Wed", OverDue: 0, Inbound: 0, Completed: 0 },
    { day: "Thu", OverDue: 0, Inbound: 0, Completed: 0 },
    { day: "Fri", OverDue: 0, Inbound: 0, Completed: 0 },
    { day: "Sat", OverDue: 0, Inbound: 0, Completed: 0 }
  ]

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={summaryChartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" tick={{ fill: "#ffffff99" }} />
        <YAxis tick={{ fill: "#ffffff99" }} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="OverDue"
          stroke="#fc1d1d"
          strokeWidth="1"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="Inbound" stroke="#9cc904" />
        <Line type="monotone" dataKey="Completed" stroke="#fa5335" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default RequestSummaryChart;
