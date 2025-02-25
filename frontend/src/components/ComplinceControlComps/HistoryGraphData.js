import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, CardHeader, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import ScoreReportTable from "./CISHeader";
import { getCisListing } from "views/CompilanceControl/cisstore";
import UploadModal from "./model/uploadModal";
import UploadStatus from "./model/uploadStatus";
function HistoryAndReportCard(props) {
  useEffect(() => {
    console.log(props, 'propsData');
  }, [props]);

  const dispatch = useDispatch();
  const store = useSelector((state) => state.cis);
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getCisListing());
  }, [dispatch]);

  useEffect(() => {
    if (store.cisItems && store.cisItems.length > 0) {
      setData(store.cisItems);
    }
  }, [data, store.cisItems]);

  function ScoreingHistory(props) {
    let categories = [];
    let values = [];

    if (
      props?.tagInputSelectData?.label === "CIS V7.1" ||
      props?.tagInputSelectData?.label === "CIS V8"
    ) {
      if (props?.data) {
        // Sort the data array based on Year and Month
        const sortedData = props.data.sort((a, b) => {
          // Sort by Year first
          if (a.Year !== b.Year) {
            return a.Year - b.Year;
          }
          // If Year is the same, sort by Month
          return a.Month - b.Month;
        });

        sortedData && sortedData.forEach((element) => {
          const date = new Date(element.Year, element.Month - 1);
          categories.push(
            date.toLocaleString("en-US", { month: "short" }) +
            "-" +
            element?.Year
          );
          values.push(parseFloat(element?.CIScore).toFixed(2));
        });
      }
    } else {
      categories = [];
      values = [];
    }

    const options = {
      chart: {
        id: "my-chart",
        type: "line",
        height: 350,
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        show: true,
      },
      theme: {
        palette: "palette1",
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: "#ffffff",
            rotate: -45,
            rotateAlways: true,
          },
        },
      },
      yaxis: {
        title: {
          text: "Program Score",
          style: {
            fontWeight: 450,
            color: "#ffffff",
          },
        },
        labels: {
          style: {
            colors: "#ffffff",
          },
        },
      },
    };

    let series = [
      {
        data: props.values,
      },
    ];

    return (
      <div className="scoringHistoryChart">
        <ReactApexChart
          options={options}
          type="line"
          series={series}
          height={props.height}
        />
      </div>
    );
  }
  return (
    <Card className="mb-0">
      <CardHeader>
        <h3>Scoring History</h3>
      </CardHeader>
      <CardBody className="border-bottom border-light mx-2 px-0">
        <ScoreingHistory
          data={props?.data}
          tagInputSelectData={props?.tagInputSelectData}
          height="300px"
        />
      </CardBody>

      <CardHeader>
        <h3 className="mb-1">Program Reports</h3>
      </CardHeader>
      <CardBody className="pt-1">
        <Row className="flex-row-reverse">
          <div className="btn-group pb-4" style={{ paddingRight: "10px" }}>
            <UploadModal
              tagInputSelectData={{ label: "CIS V7.1" }}
              isComplianceGraphLoaded={props?.isComplianceGraphLoaded}
            />

            <UploadStatus tagInputSelectData={{ label: "CIS V7.1" }} />
          </div>
        </Row>
        <div className="scroll">
          <ScoreReportTable data={data} />
        </div>
      </CardBody>
    </Card>
  );
}

export default React.memo(HistoryAndReportCard);
