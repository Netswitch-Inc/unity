import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

function CSCDeviceCountChart() {
  const [allDeviceCounts] = useState([]);
  const [allCISscore] = useState([]);
  const [lable] = useState([]);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [SnackMessage] = useState();

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 5000);
  }, [showSnackBar]);

  return (
    <div className="chart-area">
      <ReactSnackBar
        Icon={
          <span>
            <TiMessages size={25} />
          </span>
        }
        Show={showSnackBar}
      >
        {SnackMessage}
      </ReactSnackBar>
      <Line
        data={(canvas) => {
          let ctx = canvas.getContext("2d");
          let gradientStroke1 = ctx.createLinearGradient(0, 230, 0, 50);
          gradientStroke1.addColorStop(1, "rgba(29,140,248,0.2)");
          gradientStroke1.addColorStop(0.4, "rgba(29,140,248,0.0)");
          gradientStroke1.addColorStop(0, "rgba(29,140,248,0)");

          let gradientStroke2 = ctx.createLinearGradient(0, 230, 0, 50);
          gradientStroke2.addColorStop(1, "rgba(72,72,176,0.1)");
          gradientStroke2.addColorStop(0.4, "rgba(72,72,176,0.0)");
          gradientStroke2.addColorStop(0, "rgba(119,52,169,0)");
          return {
            labels: lable,
            datasets: [
              {
                label: "CSC Score",
                fill: true,
                backgroundColor: gradientStroke1,
                borderColor: "#d048b6",
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: "#d048b6",
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: "#1f8ef1",
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: allCISscore,
              },
              {
                label: "Device Count",
                fill: true,
                backgroundColor: gradientStroke2,
                borderColor: "#1f8ef1",
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: "#1f8ef1",
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: "#1f8ef1",
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: allDeviceCounts,
              },
            ],
          };
        }}
        options={{
          maintainAspectRatio: false,
          legend: {
            display: true,
          },
          tooltips: {
            backgroundColor: "#f5f5f5",
            titleFontColor: "#333",
            bodyFontColor: "#666",
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest",
          },
          responsive: true,
          scales: {
            yAxes: {
              id: "y-axis",
              type: "linear",
              position: "left",
              gridLines: {
                drawBorder: false,
                color: "rgba(29,140,248,0.0)",
                zeroLineColor: "transparent",
              },
              ticks: {
                padding: 20,
                fontColor: "#9a9a9a",
                min: 0,
                stepSize: 20,
              },
            },
            xAxes: {
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: "rgba(29,140,248,0.1)",
                zeroLineColor: "transparent",
              },
              ticks: {
                padding: 20,
                fontColor: "#9a9a9a",
              },
            },
          },
        }}
      />
    </div>
  );
}

export default CSCDeviceCountChart;
