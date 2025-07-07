// ** React Imports
import React from "react";

// ** Third Party Components
import ReactApexChart from "react-apexcharts";

const RiskByScoreDoughnutChart = ({
  isEmptyBlankDataDisplay
}) => {
  let type = "pie";
  var options = {
    labels: isEmptyBlankDataDisplay ? [] : ["High", "Medium", "Low"],
    legend: {
      labels: {
        colors: [
          "rgba(255,255,255, 0.8)",
          "rgba(255,255,255, 0.8)",
          "rgba(255,255,255, 0.8)"
        ]
      }
    },
    noData: {
      text: "N/A",
      align: "center",
      style: {
        color: "#FFFFFF"
      }
    }
  }

  let series = isEmptyBlankDataDisplay ? [] : [25.37, 10.45, 64.18];
  return (
    <ReactApexChart
      type={type}
      height={280}
      width={"100%"}
      series={series}
      options={options}
    />
  )
}

export default RiskByScoreDoughnutChart;
