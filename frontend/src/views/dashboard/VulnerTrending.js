/* eslint-disable array-callback-return */

import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { openVASScanReportStatsData } from "views/dashboard/store";

import {
  CardBody,
  CardTitle,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

import moment from "moment";
import Chart from "react-apexcharts";
import { OptionsForVulnerGraph } from "utility/reduxConstant";

const VulnerTrending = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.dashboard);

  const [timeInterval, setTimeInterval] = useState({
    label: "Year",
    value: "year",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = useCallback(
    () => setDropdownOpen((prevState) => !prevState),
    []
  );
  const handleOpenVASScanReportStatsData = useCallback(
    (filterType = timeInterval) => {
      dispatch(
        openVASScanReportStatsData({
          timeRange: filterType?.value || "",
        })
      );
    },
    [dispatch, timeInterval]
  );

  useLayoutEffect(() => {
    handleOpenVASScanReportStatsData();
  }, [handleOpenVASScanReportStatsData]);

  // ** States
  const [lowVulner, setLowVulner] = useState([]);
  const [medVulner, setMedVulner] = useState([]);
  const [highVulner, setHighVulner] = useState([]);
  const [dateTimeVulner, setDateTimeVulner] = useState([]);

  const handleGetOpenVASScanReportData = useCallback(() => {
    dispatch(openVASScanReportStatsData({ timeRange: "year" }));
  }, [dispatch]);

  useLayoutEffect(() => {
    handleGetOpenVASScanReportData();
  }, [handleGetOpenVASScanReportData]);

  const handleFilterGraphData = (values = null) => {
    setTimeInterval(values);
    handleOpenVASScanReportStatsData(values);
  };

  useEffect(() => {
    if (
      store?.actionFlag === "OVSR_STATS_SCS" ||
      store?.actionFlag === "OVSR_STATS_ERR"
    ) {
      const lwVulner = [];
      const mdVulner = [];
      const hgVulner = [];
      const dtVulner = [];
      if (store?.opnVASScnReportStatsData?.length) {
        store.opnVASScnReportStatsData.map((item) => {
          if (item?.severity && item?.timestamp) {
            switch (item.severity) {
              case "High":
                hgVulner.push(item?.vulnerabilities || 0);
                break;
              case "Medium":
                mdVulner.push(item?.vulnerabilities || 0);
                break;
              default:
                lwVulner.push(item?.vulnerabilities || 0);
                break;
            }

            const time = moment(item.timestamp, "MMMM YYYY").format("MMM YY");
            if (dtVulner.indexOf(time) === -1) {
              dtVulner.push(time);
            }
          }
        });
      }

      setLowVulner(lwVulner);
      setMedVulner(mdVulner);
      setHighVulner(hgVulner);
      setDateTimeVulner(dtVulner);
    }
  }, [store.actionFlag, store.opnVASScnReportStatsData]);

  const series = [
    {
      name: "High",
      data: highVulner?.length ? highVulner : [0],
    },
    {
      name: "Medium",
      data: medVulner?.length ? medVulner : [0],
    },
    {
      name: "Low",
      data: lowVulner?.length ? lowVulner : [0],
    },
  ];

  const options = {
    colors: ["#ce454f", "#d1ac0f", "#646464"],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
    },
    plotOptions: {
      bar: { horizontal: false },
    },
    stroke: {
      width: 0,
      colors: ["#fff"],
    },
    xaxis: {
      categories: dateTimeVulner?.length ? dateTimeVulner : [" "],
    },
    yaxis: {
      labels: {
        style: { colors: "#aab8c5", fontSize: "12px" },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => val,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
      labels: { colors: "#aab8c5" },
    },
    dataLabels: {
      enabled: true,
      style: { colors: ["#e0e0e0"] },
      formatter: (val) => (val >= 25 ? val : ""),
    },
    grid: {
      show: true,
      borderColor: "rgba(128, 128, 128, 0.3)",
    },
  };

  return (
    <>
      <CardHeader>
        {/* <ExportPdf className="d-flex justify-content-end" /> */}
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
    </>
  );
};

export default VulnerTrending;
