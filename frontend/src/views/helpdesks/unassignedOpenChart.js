/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";

import { useSelector } from "react-redux";

import GaugeChart from "react-gauge-chart";

const UnassignedOpenChart = () => {
  // Fetch `unassignedGauge` data from Redux store
  const { helpdeskStatsData } = useSelector((state) => state?.helpdesk);
  const unassignedGauge = helpdeskStatsData?.unassignedGauge || {};

  // Extract required values
  const totalOpenRequests = unassignedGauge.totalOpen || 0;
  const unassignedCount = unassignedGauge.unassignedCount || 0;
  const unassignedPercentage = unassignedGauge.percentage || 0;

  return (
    <div style={{ width: "50%", margin: "auto", textAlign: "center" }}>
      <GaugeChart
        id="gauge-chart"
        nrOfLevels={20}
        percent={unassignedPercentage}
        colors={["#fa5335", "#9cc904"]}
        arcWidth={0.3}
        textColor="#000"
        animate={false}
        className="open-text"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        <span style={{ color: "#fa5335" }}>Unassigned: {unassignedCount}</span>
        <span style={{ color: "#9cc904" }}>Open: {totalOpenRequests}</span>
      </div>
    </div>
  )
}

export default UnassignedOpenChart;
