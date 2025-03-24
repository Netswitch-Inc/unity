/* eslint-disable array-callback-return */

import React, { useState, useEffect, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { openVASScanReportStatsData } from "views/dashboard/store";

import {
  CardBody,
  Dropdown,
  CardTitle,
  CardHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";

import Chart from "react-apexcharts";
import { OptionsForVulnerGraph } from "utility/reduxConstant";

const VulnerTrending = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.dashboard);

  const [timeInterval, setTimeInterval] = useState({ label: "Year", value: "year" });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = useCallback(() => setDropdownOpen((prevState) => !prevState), [])

  const handleOpenVASScanReportStatsData = useCallback((filterType) => {
    dispatch(openVASScanReportStatsData({
      timeRange: filterType?.value || ""
    }))
  }, [dispatch])

  const processGraphData = useCallback((data) => {
    // If no data, return empty structures
    if (!data || data.length === 0) {
      return {
        timestamps: [],
        lowVulner: [],
        medVulner: [],
        highVulner: []
      }
    }

    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.timestamp]) {
        acc[item.timestamp] = {
          Low: 0,
          Medium: 0,
          High: 0
        }
      }

      acc[item.timestamp][item.severity] += item.vulnerabilities || 0;

      return acc;
    }, {})

    // Sort timestamps to maintain order
    const sortedTimestamps = Object.keys(groupedData).sort();

    return {
      timestamps: sortedTimestamps,
      lowVulner: sortedTimestamps.map(ts => groupedData[ts].Low),
      medVulner: sortedTimestamps.map(ts => groupedData[ts].Medium),
      highVulner: sortedTimestamps.map(ts => groupedData[ts].High || 0)
    }
  }, [])

  const handleFilterGraphData = (values = null) => {
    // Update the time interval state first
    setTimeInterval(values);

    // Then dispatch the action with the new time interval
    handleOpenVASScanReportStatsData(values);
  }

  // States for graph data
  const [lowVulner, setLowVulner] = useState([]);
  const [medVulner, setMedVulner] = useState([]);
  const [highVulner, setHighVulner] = useState([]);
  const [dateTimeVulner, setDateTimeVulner] = useState([]);

  // Fetch data when component mounts or time interval changes
  useEffect(() => {
    handleOpenVASScanReportStatsData(timeInterval)
  }, [timeInterval, handleOpenVASScanReportStatsData])

  // Process and set graph data
  useEffect(() => {
    if (
      store?.actionFlag === "OVSR_STATS_SCS" ||
      store?.actionFlag === "OVSR_STATS_ERR"
    ) {
      if (store?.opnVASScnReportStatsData?.length) {
        const { timestamps, lowVulner: low, medVulner: med, highVulner: high } = processGraphData(store.opnVASScnReportStatsData);

        setLowVulner(low);
        setMedVulner(med);
        setHighVulner(high);
        setDateTimeVulner(timestamps);
      } else {
        // Clear the graph if no data
        setLowVulner([]);
        setMedVulner([]);
        setHighVulner([]);
        setDateTimeVulner([]);
      }
    }
  }, [store.actionFlag, store.opnVASScnReportStatsData, processGraphData, timeInterval])

  // Series and options configuration
  const series = [
    {
      name: "High",
      data: highVulner?.length ? highVulner : [0]
    },
    {
      name: "Medium",
      data: medVulner?.length ? medVulner : [0]
    },
    {
      name: "Low",
      data: lowVulner?.length ? lowVulner : [0]
    }
  ]

  const options = {
    colors: ["#ce454f", "#d1ac0f", "#646464"],
    chart: {
      type: "bar",
      height: 350,
      stacked: true
    },
    plotOptions: {
      bar: { horizontal: false }
    },
    stroke: {
      width: 0,
      colors: ["#fff"]
    },
    xaxis: {
      categories: dateTimeVulner?.length ? dateTimeVulner : [" "]
    },
    yaxis: {
      labels: {
        style: { colors: "#aab8c5", fontSize: "12px" }
      }
    },
    tooltip: {
      y: {
        formatter: (val) => val
      }
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
      labels: { colors: "#aab8c5" }
    },
    dataLabels: {
      enabled: true,
      style: { colors: ["#e0e0e0"] },
      formatter: (val) => (val >= 25 ? val : "")
    },
    grid: {
      show: true,
      borderColor: "rgba(128, 128, 128, 0.3)"
    }
  }

  return (<>
    <CardHeader>
      <CardTitle tag="h3">
        <i className="tim-icons icon-alert-circle-exc text-primary" />
        Vulnerabilities Trending
        <div>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>{timeInterval?.label}</DropdownToggle>
            <DropdownMenu>
              {OptionsForVulnerGraph &&
                OptionsForVulnerGraph.map((option) => (
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
      <Chart type="bar" height="350" series={series} options={options} />
    </CardBody>
  </>)
}

export default VulnerTrending;
