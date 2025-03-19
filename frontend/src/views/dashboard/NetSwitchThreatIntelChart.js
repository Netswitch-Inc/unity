import React, { useLayoutEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { useDispatch, useSelector } from "react-redux";
import { netSwitchThreatIntelCountryCount } from "./store/index";

import {
  CardBody,
  CardTitle,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { OptionsForNetSwitchThreatIntelGraph } from "utility/reduxConstant";
import { useCallback } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useEffect } from "react";

const NetSwitchThreatIntelChart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state.dashboard);
  const link = store?.netSwitchThreatIntelCount?.link || "";

  const [timeInterval, setTimeInterval] = useState({
    label: "Day",
    value: "day",
  });
  const [chartData, setChartData] = useState(["Country", "Threat Count"]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = useCallback(
    () => setDropdownOpen((prevState) => !prevState),
    []
  );

  const handleNetSwitchThreatIntelCountData = useCallback(
    (filterType = timeInterval) => {
      dispatch(
        netSwitchThreatIntelCountryCount({
          timeRange: filterType?.value || "",
        })
      );
    },
    [dispatch, timeInterval]
  );

  useLayoutEffect(() => {
    handleNetSwitchThreatIntelCountData();
  }, [handleNetSwitchThreatIntelCountData]);

  const handleFilterGraphData = (values) => {
    setTimeInterval(values);
    handleNetSwitchThreatIntelCountData(values);
  };

  useEffect(() => {
    if (
      store?.actionFlag === "NSTI_CNT_SCS" ||
      store?.actionFlag === "NSTI_CNT_ERR"
    ) {
      let newChartData = [["Country", "Threat Count"]];

      const threatData = store?.netSwitchThreatIntelCount?.data;

      if (Array.isArray(threatData) && threatData.length > 1) {
        newChartData = [
          ["Country", "Threat Count"],
          ...threatData.map((item) => [item.country_name, item.count]),
        ];
        setChartData(newChartData);
      } else {
        setChartData(null);
      }
    }
  }, [store?.actionFlag, store?.netSwitchThreatIntelCount?.data]);

  const options = {
    title: "Top 7 Attacking Country",
    pieHole: 0.4, // Makes it a donut chart
    is3D: true,
    // legend: {position: 'top', textStyle: {color: 'black', fontSize: 8},alignment :'end'},
    legend: {
      position: "labeled",
      alignment: "end",
      textStyle: { color: "white", fontSize: 8, bold: true },
    },
    titleTextStyle: {
      position: "top",
      color: "white", // Set the title color (change this to any color you want)
      bold: true, // Make title bold
    },
    chartArea: { width: "85%", height: "70%" },
    backgroundColor: "transparent",
    colors: [
      "#4285F4",
      "#EA4335",
      "#FBBC05",
      "#34A853",
      "#FF6D00",
      "#8E44AD",
      "#1ABC9C",
    ],
  };

  return (
    <>
      <CardHeader>
        <CardTitle>
          <div
            tag="h3"
            className="cursor-pointer"
            onClick={() => navigate("/admin/netswitch-threat-intels")}
          >
            <i className="tim-icons icon-alert-circle-exc text-primary" />
            Netswitch Threat Intel
            <span>
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="ml-2"
                onClick={(event) => event.stopPropagation()}
              >
                <FaCloudUploadAlt size={20} />
              </a>
            </span>
          </div>

          <div>
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle caret>{timeInterval?.label}</DropdownToggle>
              <DropdownMenu>
                {OptionsForNetSwitchThreatIntelGraph &&
                  OptionsForNetSwitchThreatIntelGraph.map((option) => (
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
        {chartData ? (
          <Chart
            chartType="PieChart"
            width="100%"
            height="300px"
            data={chartData}
            options={options}
          />
        ) : (
          <div className="d-flex justify-content-center align-items-center w-100 h-100">
            <p>No Data Available</p>
          </div>
        )}
      </CardBody>
    </>
  );
};

export default NetSwitchThreatIntelChart;
