/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";

import { useSelector } from "react-redux";

import GaugeChart from "react-gauge-chart";

const SlaViolatedRequestChart = () => {
  // Get the unified dashboard data from Redux state.
  // We're assuming that the unified API saves data under state.helpdesk.Helpdesk,
  // and that it contains a property "slaViolatedGauge" with the required values.
  const { helpdeskStatsData } = useSelector((state) => state.helpdesk);
  const slaViolatedGauge = helpdeskStatsData?.slaViolatedGauge || {};

  // Extract the values directly provided by the backend.
  const totalOpenRequests = slaViolatedGauge.totalOpen || 0;
  const violatedCount = slaViolatedGauge.violatedCount || 0;
  const percentage = slaViolatedGauge.percentage || 0;

  return (
    <div style={{ width: "50%", margin: "auto", textAlign: "center" }}>
      {totalOpenRequests > 0 && (
        <>
          <GaugeChart
            id="gauge-chart"
            nrOfLevels={20}
            percent={percentage}
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
            <span style={{ color: "#fa5335" }}>
              SLA Violated: {violatedCount}
            </span>
            <span style={{ color: "#9cc904" }}>Open: {totalOpenRequests}</span>
          </div>
        </>
      )}
    </div>
  )
}

export default SlaViolatedRequestChart;
