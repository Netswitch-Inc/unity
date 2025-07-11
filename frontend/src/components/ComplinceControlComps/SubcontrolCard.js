/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  Progress,
  FormGroup,
  CardTitle,
  CardHeader,
  UncontrolledTooltip,
} from "reactstrap";

// ** Utils
import { splitWithPipe } from "utility/Utils";

// ** Custom Components
import ReactTable from "./ReactTable";
import InfoDial from "./model/RadialDial";
import SubControlFullScreenPopup from "./model/SubControlFullScreenPopup";
import ScoreHistoryLineChartComp from "./model/HistoryChartLine";
// import InfoDialForIndustryStandard from "./model/IndustrialGraph";

// ** Third Party Components
import { TiArrowLeft } from "react-icons/ti";

import ToolDetailModal from "views/resilienceIndex/models/ToolDetailModal";

import { solutionToolIcons } from "utility/toolIcons";

// ** Icons
import openedIcon from "../../assets/img/openedPolygon.svg";
import closedIcon from "../../assets/img/closedPolygon.svg";
import gearIcon from "assets/img/gear.svg";
import editIcon from "assets/img/edit.svg";

function SubControlCard(props) {
  const navigate = useNavigate();

  let values = [2, 2, 5, 4, 3, 5, 3, 6, 2, 7];

  // ** Const
  const {
    authUserItem,
    selectedControl,
    aiServiceEnabled,
    handleOpenAIWriteModal,
    handleOpenSolutionModal
  } = props;
  const projectItemData = selectedControl?.project_id || null;
  const projectStatus = ["cancelled", "completed"];
  const cisControlId = projectItemData?.cis_control_id?._id || projectItemData?.cis_control_id || null;

  // ** States
  const [toolModalOpen, setToolModalOpen] = useState("");
  const [ComplianceScorinfHistoryGraphData] = useState([]);
  const [loadedSUbControl] = useState(true);
  const [valuesArr, setValuesArr] = useState(values);
  const [currentResilience, setCurrentResilience] = useState(0);

  const openToolModal = (value = "") => {
    setToolModalOpen(value)
  }

  const closeToolModal = () => {
    setToolModalOpen("")
  }

  const handleGetIcons = (toolIcons = "") => {
    let icons = toolIcons;
    if (toolIcons) {
      icons = splitWithPipe(toolIcons);

      if (icons?.length) {
        icons = solutionToolIcons.filter((x) => icons.includes(x.key));
      }
    }

    return icons;
  }

  useEffect(() => {
    setCurrentResilience(0)
  }, [selectedControl])

  const getColorCode = (val) => {
    if (val >= 70) {
      return "progressLow";
    } else if (val >= 40 && val < 70) {
      return "progressMed";
    } else {
      return "progressHigh";
    }
  }

  const SubControlTable = (props) => {
    const SubRows = ({ row, rowProps, visibleColumns, data, loading }) => {
      return (<>
        <tr>
          <td />
          <td colSpan={visibleColumns.length - 1}>
            <FormGroup>
              <label className="text-info">
                Description
                {!projectItemData || (projectItemData && projectStatus.includes(projectItemData?.status)) ? (
                  <img
                    width={18}
                    height={18}
                    alt="Edit"
                    title="Edit"
                    src={editIcon}
                    className="cursor-pointer mx-2"
                    onClick={() => handleOpenAIWriteModal(`sub-edit-dec@${row.original?._id}`)}
                  />
                ) : null}
              </label>
              <p>{row.original?.description}</p>
              <br />

              {aiServiceEnabled && (!projectItemData || (projectItemData && projectStatus.includes(projectItemData?.status))) ? (
                <div className="buttons">
                  <button type="button" className="btnprimary mt-0" onClick={() => handleOpenAIWriteModal(`cis@${row.original?._id}`)}>Rewrite with Sara</button>
                </div>
              ) : null}
            </FormGroup>
          </td>
        </tr>
      </>)
    }

    const SubRowAsync = ({ row, rowProps, visibleColumns, passedData }) => {
      return (
        <SubRows
          row={row}
          rowProps={rowProps}
          visibleColumns={visibleColumns}
          data={passedData}
          loading={false}
        />
      )
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
          }
        ]
      }
    ]

    const data = useMemo(() => tempData, [tempData]);
    const columns = useMemo(() => tempColumns, [tempColumns]);

    const renderRowSubComponent = useCallback(({ row, rowProps, visibleColumns, data }) => (
      <SubRowAsync
        row={row}
        data={data}
        rowProps={rowProps}
        visibleColumns={visibleColumns}
      />
    ), [])

    return (
      <div className="content">
        <ReactTable
          columns={columns}
          data={data}
          projectStatus={projectStatus}
          projectItemData={projectItemData}
          aiServiceEnabled={aiServiceEnabled}
          renderRowSubComponent={renderRowSubComponent}
          handleOpenAIWriteModal={handleOpenAIWriteModal}
        />
      </div>
    )
  }

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
      Header: () => null,
      id: "1",
      columns: [
        {
          Header: "Title",
          Cell: ({ row }) => (
            <span {...row.getToggleRowExpandedProps()}>
              {row?.original?.name}
            </span>
          ),
          SubCell: (cellProps) => (<>
            <p>{cellProps.description}</p>
          </>),
          maxWidth: 450
        },
        {
          Header: "Safeguard",
          accessor: (d) => d?.cis_sub_control
        },
        {
          Header: "Project",
          Cell: ({ row }) => (<>
            {projectItemData?._id && cisControlId === row?.original?._id ? (
              <div className="buttons">
                <button
                  className="btnprimary mt-0"
                  onClick={() => navigate(`/admin/project-details/${projectItemData._id}`, { state: { displayID: projectItemData._id, from: 'resilience', control_data: { ...selectedControl, cis_control_id: cisControlId } } })}
                >
                  View Project
                </button>
              </div>
            ) : (!projectItemData || (projectItemData && projectStatus.includes(projectItemData?.status))) ? (
              <div className="buttons">
                <button
                  className="btnprimary mt-0"
                  onClick={() => navigate(`/admin/project/add`, { state: { from: 'resilience', control_data: { ...selectedControl, cis_control_id: row?.original?._id || "" } } })}
                >
                  Add Project
                </button>
              </div>
            ) : (
              <div className="progress-container progress-sm">
                <Progress multi width={100}>
                  <Progress bar className={getColorCode(0)} max="100" value={0} />
                  <span className="progress-value">{0} %</span>
                </Progress>
              </div>
            )}
          </>),
          minWidth: 200,
          align: "right",
          padding: 20
        }
      ]
    },
    {
      Header: () => null, // No header
      id: "expander", // It needs an ID
      Cell: ({ row }) => (
        <span {...row.getToggleRowExpandedProps()}>
          {row.isExpanded ? (
            // <i className="tim-icons icon-minimal-down" />
            <img alt="Open" src={openedIcon} height={10} width={16} />
          ) : (
            // <i className="tim-icons icon-minimal-right" />
            <img alt="Close" src={closedIcon} height={10} width={16} />
          )}
        </span>
      ),
      minWidth: 30,
      padding: 10,
      // We can override the cell renderer with a SubCell to be used with an expanded row
      SubCell: () => null // No expander on an expanded row
    }
  ]

  const handleUpdateHistoricGraph = (toolVal) => {
    const toolItemStatic = solutionToolIcons.find((x) => x.key === toolVal)
    if (!projectItemData || (projectItemData && projectStatus.includes(projectItemData?.status))) {
      if (toolItemStatic?.historicData) {
        const updatedHistoricData = toolItemStatic.historicData.map(() => Math.floor(Math.random() * (70 - 20 + 1)) + 20)
        setValuesArr(updatedHistoricData);
        setCurrentResilience(updatedHistoricData[updatedHistoricData.length - 1]);
      }
    }

    openToolModal(toolVal)
  }

  return (
    <div>
      <Row role="displayName">
        <Col>
          <FormGroup>
            <h4 className="frame-heading pt-0 pb-1 pl-0">
              <div className="d-flex align-items-center">
                {selectedControl ? (
                  <TiArrowLeft
                    size={30}
                    className="arrow-left cursor-pointer d-none"
                    onClick={props.handleBackControl}
                  />
                ) : null}
                <div className="ml-1">
                  {selectedControl?.name}
                </div>
              </div>
            </h4>
          </FormGroup>
        </Col>
      </Row>

      <div>
        <Col lg={12} className="pl-1 pr-0">
          <Card className="mb-3">
            <Row role="framework_name">
              <Col md={6}>
                <FormGroup className="element-framework_name">
                  <label className="text-info">Framework</label>
                  <p>{selectedControl?.framework_id?.label}</p>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup className="element-identifier">
                  <label className="text-info">Identifier</label>
                  <p>{selectedControl?.identifier}</p>
                </FormGroup>
              </Col>

              <Col>
                <FormGroup className="element-description">
                  <label className="text-info">
                    Description
                    {!projectItemData || (projectItemData && projectStatus.includes(projectItemData?.status)) ? (
                      <img
                        width={18}
                        height={18}
                        alt="Edit"
                        title="Edit"
                        src={editIcon}
                        className="cursor-pointer mx-2"
                        onClick={() => handleOpenAIWriteModal("edit-dec@")}
                      />
                    ) : null}
                  </label>
                  <p>{selectedControl?.description}</p>
                </FormGroup>
              </Col>
            </Row>

            {aiServiceEnabled && (!projectItemData || (projectItemData && projectStatus.includes(projectItemData?.status))) ? (
              <div className="buttons">
                <button type="button" className="btnprimary mt-0" onClick={() => handleOpenAIWriteModal("self")}>Rewrite with Sara</button>
              </div>
            ) : null}
          </Card>

          <Card className="mb-3 h-100">
            <Row>
              <div className="col-6">
                <InfoDial
                  height={200}
                  label={"Resilience Index"}
                  values={[currentResilience]}
                />
              </div>

              <div className="col-6">
                <div className="icons-tools">
                  {selectedControl?.tool_icons && handleGetIcons(selectedControl?.tool_icons)?.length ? (
                    handleGetIcons(selectedControl.tool_icons)?.map((tool, index) => (
                      <Col key={`toolIcon_${index}`}>
                        <img
                          width={50}
                          height={50}
                          className="cursor-pointer"
                          alt={tool?.value}
                          src={tool?.source}
                          id={`tool-icon-${tool?.key}`}
                          // id={`complience-sub-control-${tool}-image`}
                          onClick={() => handleUpdateHistoricGraph(tool?.key)}
                        />
                        <UncontrolledTooltip
                          placement="auto"
                          target={`tool-icon-${tool?.key}`}
                        >
                          {tool?.value}
                        </UncontrolledTooltip>
                      </Col>
                    ))
                  ) : null}

                  {!projectItemData || (projectItemData && projectStatus.includes(projectItemData?.status)) ? (
                    <Col onClick={() => handleOpenSolutionModal()}>
                      <img
                        width={30}
                        height={30}
                        alt={"Tool"}
                        src={gearIcon}
                        className="cursor-pointer mb-md-2"
                        id={`gear-icon-${selectedControl?._id}`}
                      />
                      <UncontrolledTooltip
                        placement="top"
                        target={`gear-icon-${selectedControl?._id}`}
                      >
                        Select Solution
                      </UncontrolledTooltip>
                    </Col>
                  ) : null}
                </div>
              </div>

              {/* <div className="col-6">
                <InfoDialForIndustryStandard
                  height={200}
                  // width={300}
                  label={"Peer Index"}
                  controllerId={selectedControl._id}
                  values={Math.random() * (85 - 70) + 70}
                />
              </div> */}
            </Row>
          </Card>

          <Card className="mb-3">
            <Row>
              <Col>
                <SubControlTable
                  cisControlId={cisControlId}
                  data={selectedControl?.cis_control_id || []}
                  columns={subControlColumns}
                />
              </Col>
            </Row>
          </Card>

          <Card className="mb-0">
            <Row>
              <Col>
                <FormGroup>
                  <CardHeader className="d-flex justify-content-between p-0">
                    <CardTitle tag="h4" className="resilience-data">
                      Resilience Index Historic Data
                    </CardTitle>
                    <Row>
                      <Col className="text-left">
                        <span className="d-flex justify-content-end pr-1">
                          {" "}
                          <SubControlFullScreenPopup
                            values={valuesArr}
                            loadedSUbControl={loadedSUbControl}
                            ComplianceScorinfHistoryGraphData={ComplianceScorinfHistoryGraphData}
                          />
                        </span>
                      </Col>
                    </Row>
                  </CardHeader>

                  <ScoreHistoryLineChartComp
                    height="200px"
                    values={valuesArr}
                    loadedSUbControl={loadedSUbControl}
                    data={ComplianceScorinfHistoryGraphData}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Card>
        </Col>
      </div>

      <ToolDetailModal
        isOpen={toolModalOpen}
        closeModal={closeToolModal}
        authUserItem={authUserItem}
        selectedControl={selectedControl}
      />
    </div>
  )
}

export default React.memo(SubControlCard);
