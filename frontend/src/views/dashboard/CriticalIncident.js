import React, { useCallback, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { wazuhIndexerSeverityCountData } from "./store";

import {
  CardBody,
  CardHeader,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from "chart.js";
import { OptionsForCriticalGraph } from "utility/reduxConstant";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);

const CritcalIncident = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const store = useSelector((state) => state.dashboard);

  const [timeInterval, setTimeInterval] = useState({
    label: "Day",
    value: "day",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = useCallback(
    () => setDropdownOpen((prevState) => !prevState),
    []
  );
  const handleWazuhSeverityDashboardCountData = useCallback(
    (filterType = timeInterval) => {
      dispatch(
        wazuhIndexerSeverityCountData({
          timeRange: filterType?.value || "",
        })
      );
    },
    [dispatch, timeInterval]
  );

  useLayoutEffect(() => {
    handleWazuhSeverityDashboardCountData();
  }, [handleWazuhSeverityDashboardCountData]);

  // const handleGetWazuhIndexerCountData = useCallback(() => {
  //   dispatch(wazuhIndexerSeverityCountData());
  // }, [dispatch]);

  const handleFilterGraphData = (values = null) => {
    setTimeInterval(values);
    handleWazuhSeverityDashboardCountData(values);
  };
  // Data for the spider chart (Radar chart)
  const chartData = {
    labels: ["Critical", "High", "Medium", "Low"],
    datasets: [
      {
        // label: 'Incident Severity',
        data: [
          store?.wazuhSeverityCount?.critical_severity_hits_count || 0.01,
          store?.wazuhSeverityCount?.high_severity_hits_count || 0.01,
          store?.wazuhSeverityCount?.medium_severity_hits_count || 0.01,
          store?.wazuhSeverityCount?.low_severity_hits_count || 0.01,
          // store?.wazuhSeverityCount?.agents_count || 0.01,
        ],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: [
          "#FF0000",
          "#FFA500",
          "#FFFF00",
          "#00FF00",
          "#800080",
        ],
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
        pointRadius: 6,
        pointHoverRadius: 14,
      },
    ],
  };

  // Options for the Radar chart
  const chartOptions = {
    responsive: true,
    // maintainAspectRatio: false,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax:
          Math.max(
            store?.wazuhSeverityCount?.critical_severity_hits_count,
            store?.wazuhSeverityCount?.high_severity_hits_count,
            store?.wazuhSeverityCount?.medium_severity_hits_count,
            store?.wazuhSeverityCount?.low_severity_hits_count,
            // store?.wazuhSeverityCount?.agents_count
          ) + 10,
        angleLines: {
          display: true,
          color: "#ffffff",
        },
        grid: {
          color: "#ffffff",
        },
        ticks: {
          display: false,
        },
        pointLabels: {
          color: "#ffffff",
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#333333",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#ffffff",
        borderWidth: 1,
        callbacks: {
          title: function (tooltipItems) {
            const label = tooltipItems[0].label.toLowerCase();
            if (label === "agent") {
              return "Agent";
            }

            return tooltipItems[0].label + " Severity";
          },
          label: function (context) {
            // const value = context.raw;
            const severityTypes = {
              0: "Rule level 15 or Higher",
              1: "Rule level 12 to 14",
              2: "Rule level 7 to 11",
              3: "Rule level 0 to 6",
              4: ` Active: ${store?.wazuhSeverityCount?.agents_count}`,
            };

            return `${severityTypes[context.dataIndex]}`;
          },
        },
        customDataLabels: {
          display: true,
          color: "white",
          font: {
            size: 12,
          },
        },
      },
      // Custom plugin to render data point values
      afterDraw: (chart) => {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          meta.data.forEach((point, index) => {
            const value = dataset.data[index];
            const x = point.x; // X-coordinate of the point
            const y = point.y; // Y-coordinate of the point

            ctx.fillStyle = "#ffffff"; // Text color
            ctx.font = "12px Arial"; // Font style
            ctx.textAlign = "center"; // Center alignment
            ctx.fillText(value, x, y - 10); // Draw value slightly above the point
          });
        });
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = chartData.labels[index];

        if (label.toLowerCase() === "agent") {
          navigate("/admin/configuration-assessment-chart");
        } else {
          const severity = label.toLowerCase();
          navigate("/admin/level-severity-graph", {
            state: { severity: severity },
          });
        }
      }
    },
  };

  const plugins = [
    {
      id: "customDataLabels",
      afterDatasetsDraw(chart, args, options) {
        const { ctx, data } = chart;

        ctx.save();
        data.datasets[0].data.forEach((datapoint, index) => {
          const { x, y } = chart.getDatasetMeta(0).data[index].getCenterPoint();

          ctx.font = "12px Arial";
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(datapoint.toString(), x, y - 15);
        });
        ctx.restore();
      },
    },
  ];

  return (
    <div className="critical-chart">
      <CardHeader>
        <CardTitle tag="h3" className="d-flex">
          <div>
            <i className="tim-icons icon-alert-circle-exc text-primary" />
            Critical Incident By Type
          </div>
          <div>
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle caret>{timeInterval?.label}</DropdownToggle>
              <DropdownMenu>
                {OptionsForCriticalGraph &&
                  OptionsForCriticalGraph.map((option) => (
                    <DropdownItem
                      key={option.value}
                      onClick={() => handleFilterGraphData(option)}
                    >
                      {option.label}
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardTitle>
      </CardHeader>

      <CardBody>
        Last 24 Hours Alerts
        {/* <div className="row g-4">
                    <div className="col-12 col-md-6">
                        <div className="severity-card p-2 shadow-sm rounded">
                            <div className="fw-bold text-light">Critical Severity</div>
                            <h4
                                className="fw-bold text-danger cursor-pointer"
                                onClick={() =>
                                    navigate("/admin/level-severity-graph", {
                                        state: { severity: "critical" },
                                    })
                                }
                            >
                                {store?.wazuhSeverityCount?.critical_severity_hits_count || 0}
                            </h4>
                            <div className="text-muted">Rule level 15 or Higher</div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="severity-card p-2 shadow-sm rounded">
                            <div className="fw-bold text-light">High Severity</div>
                            <h4
                                className="fw-bold text-warning cursor-pointer"
                                onClick={() =>
                                    navigate("/admin/level-severity-graph", {
                                        state: { severity: "high" },
                                    })
                                }
                            >
                                {store?.wazuhSeverityCount?.high_severity_hits_count || 0}
                            </h4>
                            <div className="text-muted">Rule level 12 to 14</div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="severity-card p-2 shadow-sm rounded">
                            <div className="fw-bold text-light">Medium Severity</div>
                            <h4
                                className="fw-bold text-info cursor-pointer"
                                onClick={() =>
                                    navigate("/admin/level-severity-graph", {
                                        state: { severity: "medium" },
                                    })
                                }
                            >
                                {store?.wazuhSeverityCount?.medium_severity_hits_count || 0}
                            </h4>
                            <div className="text-muted">Rule level 7 to 11</div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="severity-card p-2 shadow-sm rounded">
                            <div className="fw-bold text-light">Low Severity</div>
                            <h4
                                className="fw-bold text-success cursor-pointer"
                                onClick={() =>
                                    navigate("/admin/level-severity-graph", {
                                        state: { severity: "low" },
                                    })
                                }
                            >
                                {store?.wazuhSeverityCount?.low_severity_hits_count || 0}
                            </h4>
                            <div className="text-muted">Rule level 0 to 6</div>
                        </div>
                    </div>
                </div> */}
        {/* Spider Chart (Radar Chart) */}
        <div className="chart-container mt-4 ">
          <div className="cart-count-with-label">
            {/* <span
              className="circle agent cursor-pointer"
              onClick={() =>
                navigate("/admin/configuration-assessment-chart", {
                  state: { severity: "agent" },
                })
              }
            >
              <span></span>Agent ({store?.wazuhSeverityCount?.agents_count || 0}
              )
            </span> */}

            <span
              className="circle critical cursor-pointer"
              onClick={() =>
                navigate("/admin/level-severity-graph", {
                  state: { severity: "critical" },
                })
              }
            >
              <span></span>Critical (
              {store?.wazuhSeverityCount?.critical_severity_hits_count})
            </span>

            <span
              className="circle high cursor-pointer"
              onClick={() =>
                navigate("/admin/level-severity-graph", {
                  state: { severity: "high" },
                })
              }
            >
              <span></span>High (
              {store?.wazuhSeverityCount?.high_severity_hits_count})
            </span>

            <span
              className="circle medium cursor-pointer"
              onClick={() =>
                navigate("/admin/level-severity-graph", {
                  state: { severity: "medium" },
                })
              }
            >
              <span></span>Medium (
              {store?.wazuhSeverityCount?.medium_severity_hits_count})
            </span>

            <span
              className="circle low cursor-pointer"
              onClick={() =>
                navigate("/admin/level-severity-graph", {
                  state: { severity: "low" },
                })
              }
            >
              <span></span>Low (
              {store?.wazuhSeverityCount?.low_severity_hits_count})
            </span>
          </div>

          <Radar data={chartData} options={chartOptions} plugins={plugins} />
        </div>
        {/* <div className="refresh-buttons mt-3">
          <div
            className="cursor-pointer"
            onClick={() => handleGetWazuhIndexerCountData()}
          >
            <i className="tim-icons icon-refresh-01"></i>Refresh
          </div>
        </div> */}
      </CardBody>
    </div>
  );
};

export default CritcalIncident;
