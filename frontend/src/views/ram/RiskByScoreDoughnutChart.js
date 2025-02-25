import ReactApexChart from "react-apexcharts";
import React from "react";

function RiskByScoreDoughnutChart() {
  let type = "pie";
  var options = {
    labels: ["High", "Medium", "Low"],
    legend: {
      labels: {
        colors: [
          "rgba(255,255,255, 0.8)",
          "rgba(255,255,255, 0.8)",
          "rgba(255,255,255, 0.8)",
        ],
      },
    },
  };
  let series = [25.37, 10.45, 64.18];
  return (
    <>
      <ReactApexChart
        width={"100%"}
        height={280}
        series={series}
        type={type}
        options={options}
      />
    </>
  );
}

export default RiskByScoreDoughnutChart;
