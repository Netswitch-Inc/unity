/* eslint-disable react-hooks/exhaustive-deps */

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  FormGroup,
  CardTitle,
  Progress,
  UncontrolledTooltip
} from "reactstrap";
import React, { useEffect, useState } from "react";
import SubControlFullScreenPopup from "./model/SubControlFullScreenPopup";
import ReactTable from "./ReactTable";
import { useSelector, useDispatch } from "react-redux";
import { getComplinceSubcontrolListing } from "views/CompilanceControl/cisstore";
import { complianceTools } from "views/sampleData/ComplianceControlData";
import InfoDialForIndustryStandard from "./model/IndustrialGraph";
import { useNavigate } from "react-router-dom";
import ScoreHistoryLineChartComp from "./model/HistoryChartLine";
import InfoDial from "./model/RadialDial";
import PenTsting from "../../assets/img/toollogo/Pen-Testing.png";
import Loc from "../../assets/img/toollogo/image_592.png";
import VA from "../../assets/img/toollogo/image_593.png";
import SIEM from "../../assets/img/toollogo/SIEM.png";

function SubControlCard(props) {
  let values = [2, 2, 5, 4, 3, 5, 3, 6, 2, 7];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state.cis);
  // cisSubcontrol
  const [subControlData, setSubControlData] = useState([]);
  const [ComplianceScorinfHistoryGraphData] = useState([]);
  const [loadedSUbControl] = useState(true);
  const [toolsIcon, setToolsIcon] = useState([]);
  const [valuesArr, setValuesArr] = useState(values);
  const [currentResilience, setCurrentResilience] = useState(0);

  const ToolsArray = [
    { icon: "PENTEST", path: PenTsting, fullName: "Penetration Testing" },
    { icon: "SIEM", path: SIEM, fullName: 'Security Information and Event Management' },
    { icon: "LOC", path: Loc, fullName: 'Log Collector' },
    { icon: "VA", path: VA, fullName: 'Vulnerability Assessment' },
  ];

  const handleReturnIcon = (givenIcon) => {
    return ToolsArray.find((icon) => icon.icon === givenIcon).path;
  };

  const handleReturnIconFullName = (givenIcon) => {
    return ToolsArray.find((icon) => icon.icon === givenIcon).fullName;
  };

  useEffect(() => {
    const uniqueArr = [];
    props.selectedTiles.cis_control_id?.length > 0 && props.selectedTiles.cis_control_id.forEach((item) => {
      if (!uniqueArr.includes(item.tool_icon)) {
        uniqueArr.push(item.tool_icon);
      }
    });
    setToolsIcon(uniqueArr);
    setCurrentResilience(0)
  }, [props.selectedTiles]);

  useEffect(() => {
    // framework_id,control_id
    const query = {
      framework_id: props.selectedTiles.framework_id?._id,
      control_id: props.selectedTiles._id,
    };
    dispatch(getComplinceSubcontrolListing(query));
  }, [dispatch, props.selectedTiles]);

  useEffect(() => {
    if (store.cisSubcontrol && store.cisSubcontrol.length > 0) {
      setSubControlData(store.cisSubcontrol);
    }
    if (store.cisSubcontrol.length === 0) {
      setSubControlData([]);
    }
  }, [store.cisSubcontrol]);

  function getColorCode(val) {
    if (val >= 70) {
      return "progressLow";
    } else if (val >= 40 && val < 70) {
      return "progressMed";
    } else {
      return "progressHigh";
    }
  }

  function SubControlTable(props) {
    function SubRows({ row, rowProps, visibleColumns, data, loading }) {
      const [description] = React.useState(row.original.description);
      return (
        <>
          <tr>
            <td />
            <td colSpan={visibleColumns.length - 1}>
              <FormGroup>
                <label className="text-info">Description</label>
                <p>{description}</p>
                <br />
                <Button className="btn btn-primary btn-next mt-0">
                  Rewrite with AI
                </Button>
              </FormGroup>
            </td>
          </tr>
        </>
      );
    }

    function SubRowAsync({ row, rowProps, visibleColumns, passedData }) {
      return (
        <SubRows
          row={row}
          rowProps={rowProps}
          visibleColumns={visibleColumns}
          data={passedData}
          loading={false}
        />
      );
    }

    let tempData = props.data;
    let tempColumns = props.columns || [
      {
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <i className="tim-icons icon-minimal-down" />
            ) : (
              <i className="tim-icons icon-minimal-right" />
            )}
          </span>
        ),
        SubCell: () => null, // No expander on an expanded row
      },
      {
        Header: () => null, // No header,
        id: "header",
        columns: [
          {
            Header: "Name",
            accessor: (d) => d.name,
            SubCell: (cellProps) => <>{cellProps.value}</>,
          },
          {
            Header: "description",
            accessor: (d) => d.description,
          },
        ],
      },
    ];

    const data = React.useMemo(() => tempData, [tempData]);
    const columns = React.useMemo(() => tempColumns, [tempColumns]);

    const renderRowSubComponent = React.useCallback(
      ({ row, rowProps, visibleColumns, data }) => (
        <SubRowAsync
          row={row}
          rowProps={rowProps}
          visibleColumns={visibleColumns}
          data={data}
        />
      ),
      []
    );

    return (
      <div className="content">
        <ReactTable
          columns={columns}
          data={data}
          renderRowSubComponent={renderRowSubComponent}
        />
      </div>
    );
  }

  // const handleBack = () => {
  //   props.setIsGoingBack(true);
  // };


  // const ScoreHistoryLineChart = React.memo((props) => {
  //   let categories = [];
  //   const options = {
  //     chart: {
  //       id: "my-chart",
  //       type: "line",
  //       height: 350,
  //       zoom: {
  //         enabled: false,
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     stroke: {
  //       curve: "smooth",
  //     },
  //     grid: {
  //       show: true,
  //     },
  //     theme: {
  //       palette: "palette1",
  //     },
  //     xaxis: {
  //       categories: categories,
  //       labels: {
  //         style: {
  //           colors: "#ffffff",
  //           rotate: -45,
  //           rotateAlways: true,
  //         },
  //       },
  //     },
  //     yaxis: {
  //       title: {
  //         text: "Program Score",
  //         style: {
  //           fontWeight: 450,
  //           color: "#ffffff",
  //         },
  //       },
  //       labels: {
  //         style: {
  //           colors: "#ffffff",
  //         },
  //       },
  //     },
  //   };

  //   // let series = [
  //   //   {
  //   //     data: props?.values,
  //   //   },
  //   // ];

  //   const series = useMemo(() => [{
  //     data: props?.values, // Use props.values or computed values from data
  //   }], [props.toolIcon])

  //   return (
  //     <>
  //       <Loader
  //         loaded={props.loadedSUbControl}
  //         lines={13}
  //         length={10}
  //         width={5}
  //         radius={30}
  //         corners={1}
  //         rotate={0}
  //         direction={1}
  //         color="#2774f6"
  //         speed={1}
  //         trail={60}
  //         shadow={false}
  //         hwaccel={false}
  //         className="spinner spinner-compliance"
  //         zIndex={2e9}
  //         scale={1.0}
  //         loadedClassName="loadedContent"
  //       />
  //       <ReactApexChart
  //         options={options}
  //         type="line"
  //         series={series}
  //         height={props.height}
  //       />
  //     </>
  //   );
  // })

  let subControlColumns = [
    {
      Header: () => null, // No header
      id: "expander", // It needs an ID
      Cell: ({ row }) => (
        <span {...row.getToggleRowExpandedProps()}>
          {row.isExpanded ? (
            <i className="tim-icons icon-minimal-down" />
          ) : (
            <i className="tim-icons icon-minimal-right" />
          )}
        </span>
      ),
      // We can override the cell renderer with a SubCell to be used with an expanded row
      SubCell: () => null, // No expander on an expanded row
    },
    {
      Header: () => null,
      id: "1",
      columns: [
        {
          Header: "Title",
          // We re-map data using accessor functions for subRows
          accessor: (d) => (
            <>
              {d?.title} ({d?.name})
            </>
          ),
          // We can render something different for subRows
          SubCell: (cellProps) => (
            <>
              <p>{cellProps.description}</p>
            </>
          ),
          maxWidth: 450,
        },
        {
          Header: "Type",
          accessor: (d) => d?.security_function,
        },
        {
          Header: "Progress",
          accessor: (d) => (
            <div className="progress-container progress-sm">
              <Progress multi width={100}>
                <Progress bar className={getColorCode(0)} max="100" value={0} />
                <span className="progress-value">{0} %</span>
              </Progress>
            </div>
          ),
          minWidth: 200,
          align: "right",
          padding: 30,
        },
      ],
    },
  ];

  // const handleUpdateHistoricGraph = (toolVal) => {
  //   const toolItemStatic = complianceTools.find(
  //     (toolItem) => toolItem.logoPath === toolVal
  //   );
  //   setValuesArr(() => toolItemStatic.historicData);
  //   setCurrentResilience(() => toolItemStatic.resilienceIndex);
  // };

  const handleUpdateHistoricGraph = (toolVal) => {
    const toolItemStatic = complianceTools.find(
      (toolItem) => toolItem.logoPath === toolVal
    );

    if (toolItemStatic) {
      const updatedHistoricData = toolItemStatic.historicData.map(() =>
        Math.floor(Math.random() * (70 - 20 + 1)) + 20
      );

      setValuesArr(updatedHistoricData);
      setCurrentResilience(updatedHistoricData[updatedHistoricData.length - 1]);
    }
  };



  return (
    <Card className="element-backCard mb-0 h-100">
      {/* <Col lg="12">
        <Row>
          <Col xm="1">
            <Button
              className="btn btn-primary btn-next"
              onClick={handleBack}
            >
              <i className="tim-icons icon-minimal-left" /> Back
            </Button>
          </Col>
        </Row>
      </Col> */}
      <CardHeader className={"" /* Some padding pb-5 ?*/}>
        <h3>{props.selectedTiles?.text}</h3>
      </CardHeader>
      <CardBody>
        <Col lg="12">
          <Row className="">
            <Col lg="8">
              <Row role="displayName">
                <Col>
                  <FormGroup>
                    <label className="text-info">Name</label>
                    <p>{props.selectedTiles?.name}</p>
                  </FormGroup>
                </Col>
              </Row>
              <Row role="description">
                <Col>
                  <FormGroup className="element-description">
                    <label className="text-info">Description</label>
                    <p>
                      <small>{props.selectedTiles?.description}</small>
                    </p>
                  </FormGroup>
                </Col>
              </Row>
              <Button className="btn btn-primary btn-next mt-0">
                Rewrite with AI
              </Button>
              <Row>
                <Col>
                  <FormGroup>
                    <CardHeader className="d-flex justify-content-between p-0  border-bottom">
                      <CardTitle tag="h4">
                        Resilience Index Historic Data
                      </CardTitle>
                      <Row>
                        <Col className="text-left">
                          <span className="d-flex justify-content-end pr-1">
                            {" "}
                            <SubControlFullScreenPopup
                              values={valuesArr}
                              loadedSUbControl={loadedSUbControl}
                              ComplianceScorinfHistoryGraphData={
                                ComplianceScorinfHistoryGraphData
                              }
                            />
                          </span>
                        </Col>
                      </Row>
                    </CardHeader>
                    <ScoreHistoryLineChartComp
                      values={valuesArr}
                      loadedSUbControl={loadedSUbControl}
                      data={ComplianceScorinfHistoryGraphData}
                      height="200px"
                      toolIcon={toolsIcon}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div className="icons-tools">
                {toolsIcon &&
                  toolsIcon.map((tool, index) => {
                    return (
                      <Col key={`toolIcon_${index}`}>
                        <img
                          src={handleReturnIcon(tool)}
                          id={`complience-sub-control-${tool}-image`}
                          alt="toolIcon"
                          height={50}
                          width={50}
                          onClick={() => handleUpdateHistoricGraph(tool)}
                          className="cursor-pointer"
                        />
                        <UncontrolledTooltip
                          placement="auto"
                          target={`complience-sub-control-${tool}-image`}
                        // container={`complience-sub-control-${cisControl?.tool_icon}`}
                        >
                          {handleReturnIconFullName(tool)}
                        </UncontrolledTooltip>
                      </Col>
                    );
                  })}
              </div>
              <div>
                <Button
                  onClick={() =>
                    navigate(
                      `/admin/project/add`,
                      { state: { control_data: props.selectedTiles } }
                    )
                  }
                  className="btn btn-primary btn-next mt-0"
                >
                  Add Project
                </Button>
              </div>
            </Col>

            <Col lg="4">
              <Row>
                {/* Column for gauge */}
                <InfoDial
                  values={[currentResilience]}
                  width={300}
                  label={"Resilience Index"}
                />
              </Row>
              <Row>
                <InfoDialForIndustryStandard
                  values={Math.random() * (85 - 70) + 70}
                  controllerId={props.selectedTiles._id}
                  width={300}
                  label={"Peer Index"}
                />
              </Row>

            </Col>

          </Row>
          <Row className="">
            <Col>
              <SubControlTable
                data={subControlData}
                columns={subControlColumns}
              />
            </Col>
          </Row>
        </Col>
      </CardBody>
    </Card>
  );
}
export default React.memo(SubControlCard);
