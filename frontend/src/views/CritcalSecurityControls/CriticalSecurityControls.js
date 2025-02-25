/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, Fragment } from "react";

// ** Store & Actions
import { useSelector } from "react-redux";

import { useTable, useSortBy } from "react-table";
import {
  Col,
  Row,
  Card,
  Table,
  Input,
  Button,
  CardBody,
  FormGroup,
  CardTitle,
  CardHeader
} from "reactstrap";

import * as moment from "moment";
import Loader from "react-loader";
import classnames from "classnames";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import { BsFillCaretRightFill, BsFillCaretDownFill } from "react-icons/bs";

import CisHostDetails from "./CisHostDetails/CisHostDetails.js";
import CSCDeviceCountChart from "./CSCDeviceCountChart";
import AssignedTask from "./AssignedTaskPopup.js";

import AssignPolicyPopup from "./AssignedpolicyPopup.js";

function CisResultPage() {
  const authUserItem = useSelector((state) => state?.login?.authUserItem) || null;

  const [CisHostTable, setCisHostTable] = useState(false);
  const [CisHostName, setCisHostName] = useState("");
  const [CisHostTableIp, setCisHostTableIp] = useState("");
  const [CisHostLastScan, setCisHostLastScan] = useState("");
  const [CisHostTableSystem, setCisHostTableSystem] = useState("");
  const [CisHostTableScoring, setHostTableScoring] = useState("");
  const [scanId, setScanId] = useState("");
  const [startDates] = useState(null);
  const [endDates] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(6);
  const [dataTable] = useState([]);
  const [allTaskData] = useState([]);
  const [policyId] = useState();
  const [PolicyPopupShow, setPolicyPopupShow] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);
  const [expand, setExpand] = useState(false);
  const [loaded] = useState(true);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [SnackMessage] = useState("");

  const [ModalToggle, setModalToggle] = useState(false);
  let props = {
    ModalToggle,
    setModalToggle,
  };

  const expandColum = (item) => {
    item.expanded = !item.expanded;
    setExpand(!expand);
  };

  const expandchildReview = (item, task) => {
    task.expanded = !task.expanded;
    item.tasks?.forEach((elem) => {
      if (elem.expanded && elem.id !== task.id) {
        elem.expanded = false;
      }
    });
    setReviewsData([...reviewsData]);
  };

  const AssignPopupcallback = () => {
    setPolicyPopupShow(false);
  };

  const handlechange = () => {
  }

  const navigateToHostPage = (cell, scanId) => {
    const {
      row: { values },
    } = cell;
    setCisHostName(values.hostname);
    setCisHostTableIp(values.ip);
    setCisHostLastScan(values.lastscan);
    setCisHostTableSystem(values.system);
    setHostTableScoring(values.scoring);
    setScanId(scanId);
    setCisHostTable(true);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Hostname",
        accessor: "hostname",
      },
      {
        Header: "Version",
        accessor: "version",
      },
      {
        Header: "IP",
        accessor: "ip",
      },
      {
        Header: "System",
        accessor: "system",
      },
      {
        Header: "Profile",
        accessor: "profile",
      },
      {
        Header: "Last Scan",
        accessor: "lastscan",
      },
      {
        Header: "Over Scoring",
        accessor: "scoring",
      },
      {
        Header: "Previous Scoring",
        accessor: "pre_scoring",
      },
      {
        Header: "Urgency",
        accessor: "urgency",
      },
      {
        Header: "Actions",
        accessor: "actions",
      },
    ],
    []
  )

  const dataTableMap = dataTable.map((prop, key) => {
    return {
      id: key,
      hostname: prop.HostName,
      version: prop.version,
      ip: prop.ip,
      system: prop.System,
      profile: prop.profile,
      lastscan: (prop.lastscan = moment(prop.lastscan).format("YYYY-MM-DD")),
      scoring: prop.OverScoring,
      pre_scoring: prop.previousScoring ? prop.previousScoring : "-",
      urgency: prop.Urgency,
      scanId: prop.scanId,
      actions: (
        <div className="actions-right">
          <Button
            onClick={() => {
              data.find((o) => o.id === key);
            }}
            size="sm"
            className="btn btn-info btn-sm btn btn-secondary"
          >
            <i className="tim-icons icon-pencil" />
          </Button>{" "}
        </div>
      )
    }
  })

  const data = React.useMemo(() => {
    return dataTableMap;
  }, [dataTableMap]);

  const { getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data },
    useSortBy
  );

  const goBackHandler = () => {
    setCisHostTable(false);
  };

  const AssignedTaskCallBack = () => {
  }

  let handleClickRadio = () => {
    handlechange();
  };

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 5000);
  }, [showSnackBar]);

  return (
    <div className="content w-100">
      <ReactSnackBar
        Icon={(
          <span>
            <TiMessages size={25} />
          </span>
        )}
        Show={showSnackBar}
      >
        {SnackMessage}
      </ReactSnackBar>

      <Card className="card-chart">
        <CardHeader>
          <Row>
            <Col className="text-left p-0" sm="6">
              <FormGroup className="col-sm-4 pointer p-0">
                <Input
                  id="exampleSelect"
                  value={selectedDuration}
                  onChange={(e) =>
                    setSelectedDuration(parseInt(e.target.value))
                  }
                  name="select"
                  type="select"
                  className="pointer"
                >
                  <option value={6} className="pointer">
                    6 Months
                  </option>
                  <option value={12} className="pointer">
                    12 Months
                  </option>
                  <option value={18} className="pointer">
                    18 Months
                  </option>
                </Input>
              </FormGroup>

              <CardTitle tag="h3">CSC Overall Score and Device Count</CardTitle>
            </Col>
          </Row>
        </CardHeader>

        <CardBody>
          <CSCDeviceCountChart
            startDates={startDates}
            selectedDuration={selectedDuration}
            endDates={endDates}
          />
        </CardBody>
      </Card>

      {CisHostTable ? (
        <CisHostDetails
          ModalToggle={ModalToggle}
          setModalToggle={setModalToggle}
          goBackHandler={goBackHandler}
          hostName={CisHostName}
          hostIp={CisHostTableIp}
          scan={CisHostLastScan}
          system={CisHostTableSystem}
          scoring={CisHostTableScoring}
          scanId={scanId}
          dataTable={dataTable}
        />
      ) : (
        <Card>
          <CardBody>
            <div className="tabbed">
              <input
                type="radio"
                onClick={handleClickRadio}
                name="tabs"
                id="All-Results"
                defaultChecked={true}
              />
              <label htmlFor="All-Results">All Results</label>
              <input
                type="radio"
                onClick={handleClickRadio}
                name="tabs"
                id="Assigned-Task"
              />
              <label htmlFor="Assigned-Task">Assigned Task</label>
              <input
                type="radio"
                onClick={handleClickRadio}
                name="tabs"
                id="Reviewed-Task"
              />
              <label htmlFor="Reviewed-Task">Reviewed Task</label>
              <div className="tabs">
                <div>
                  <h2 className="card-title">
                    Critical Security Controls Asset Table
                  </h2>

                  <div>
                    <Table
                      responsive
                      striped
                      className=" clicktable tablesorter table"
                    >
                      <thead className="text-primary">
                        {headerGroups.map((headerGroup) => (
                          <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                              <th
                                {...column.getHeaderProps(
                                  column.getSortByToggleProps()
                                )}
                                className={classnames(
                                  "header " +
                                  (column.isSorted
                                    ? column.isSortedDesc
                                      ? "headerSortUp"
                                      : "headerSortDown"
                                    : undefined)
                                )}
                              >
                                {column.render("Header")}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>

                      <Loader
                        loaded={loaded}
                        lines={13}
                        length={10}
                        width={5}
                        radius={30}
                        corners={1}
                        rotate={0}
                        direction={1}
                        color="#2774f6"
                        speed={1}
                        trail={60}
                        shadow={false}
                        hwaccel={false}
                        className="spinner"
                        zIndex={2e9}
                        top="40%"
                        left="50%"
                        scale={1.0}
                        loadedClassName="loadedContent"
                      />

                      <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                          prepareRow(row);
                          return (
                            <tr {...row.getRowProps()}>
                              {row.cells.map((cell) => {
                                return (
                                  <td
                                    {...cell.getCellProps()}
                                    onClick={() =>
                                      navigateToHostPage(
                                        cell,
                                        row?.original?.scanId
                                      )
                                    }
                                  >
                                    {cell.render("Cell")}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h3 className="card-title border-bottom mt-1 py-1">
                    Assigned Task
                  </h3>
                  <div className="content ">
                    <div className="col-sm-12">
                      <div className="tbl-header">
                        <table className="compareTable AssignedTaskTable">
                          <thead>
                            <tr>
                              <th className="expanded-table"></th>
                              <th>Due Date</th>
                              <th>Notes</th>
                              <th>Hostname</th>
                              <th>Target IP</th>
                              <th>Last Scan</th>

                              {allTaskData[0]?.roleId ? (<>
                                <th className="pointer">Assigned By</th>
                                <th className="pointer">Assigned To</th>
                              </>) : null}

                              <th>Review</th>
                            </tr>
                          </thead>
                        </table>
                      </div>

                      <div className="tbl-content">
                        <table className="compareTable AssignedTaskTable">
                          <tbody>
                            {allTaskData?.map((item, index) => {
                              if (item?.tasks[0]?.isReviewed === 0) {
                                return (<Fragment key={index}>
                                  <tr
                                    className="table-body-content"
                                    key={index}
                                  >
                                    <td
                                      className="expanded-table"
                                      onClick={() => {
                                        expandColum(item);
                                      }}
                                    >
                                      {item.expanded ? (
                                        <BsFillCaretDownFill />
                                      ) : (
                                        <BsFillCaretRightFill />
                                      )}
                                    </td>

                                    <td>{item?.dueDate}</td>
                                    <td>{item?.tasks[0]?.Notes}</td>
                                    <td>{item?.hostname}</td>
                                    <td>{item?.TargetIP}</td>
                                    <td>{item?.scannedDate}</td>

                                    {item?.roleId ? (<>
                                      {item?.assignTo === authUserItem?._id ? (<>
                                        <td>{item?.assignby}</td>
                                        <td>{item?.assignto}</td>
                                        <td>
                                          <AssignedTask
                                            ModalToggle={ModalToggle}
                                            setModalToggle={
                                              setModalToggle
                                            }
                                            AssignedTaskCallBack={
                                              AssignedTaskCallBack
                                            }
                                            item={item}
                                            assignUserId={authUserItem?._id}
                                          />
                                        </td>
                                      </>) : (<>
                                        <td>{item?.assignby}</td>
                                        <td>{item?.assignto}</td>
                                        <td>
                                          <i
                                            disabled={true}
                                            className="tim-icons icon-pencil  btn-info btn btn-secondary btn-sm"
                                          ></i>
                                        </td>
                                      </>)}
                                    </>) : (
                                      <td>
                                        <AssignedTask
                                          ModalToggle={ModalToggle}
                                          setModalToggle={setModalToggle}
                                          AssignedTaskCallBack={
                                            AssignedTaskCallBack
                                          }
                                          item={item}
                                          assignUserId={authUserItem?._id}
                                        />
                                      </td>
                                    )}
                                  </tr>

                                  {item?.expanded ? (<>
                                    <tr key={index}>
                                      <th className="expanded-table"></th>
                                      <th className="pointer">
                                        Description
                                      </th>
                                      <th className="pointer">
                                        Failed Controls
                                      </th>
                                      <th></th>
                                    </tr>
                                    {item?.tasks?.map((task, ind) => (
                                      <tr key={`${index}${ind}`}>
                                        <td className="expanded-table"></td>
                                        <td>{task?.itemName}</td>
                                        <td>{task?.fail}</td>
                                        <td></td>
                                      </tr>
                                    ))}
                                  </>) : null}
                                </Fragment>)
                              }
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="card-title border-bottom mt-1 py-1">
                    Reviewed Task
                  </h3>
                  <div className="content ">
                    <div className="col-sm-12">
                      <div className="tbl-header">
                        <table className="compareTable">
                          <thead>
                            <tr>
                              <th className="expanded-table"></th>
                              <th>Host</th>
                              <th>Target Ip</th>
                              <th>Scan Date</th>
                              <th>Notes</th>
                              <th>Reviewed By</th>
                            </tr>
                          </thead>
                        </table>
                      </div>

                      <div className="tbl-content">
                        <table className="compareTable">
                          <tbody>
                            {reviewsData?.map((item, index) => {
                              return (
                                item.tasks?.length > 0 && (<>
                                  <tr
                                    className="table-body-content"
                                    key={index}
                                  >
                                    <td
                                      className="expanded-table"
                                      onClick={() => {
                                        expandColum(item);
                                      }}
                                    >
                                      {" "}
                                      {item.expanded ? (
                                        <BsFillCaretDownFill />
                                      ) : (
                                        <BsFillCaretRightFill />
                                      )}
                                    </td>
                                    <td>{item?.hostname}</td>
                                    <td>{item.TargetIP}</td>
                                    <td>{item?.scannedDate}</td>
                                    <td>{item?.tasks[0]?.Notes}</td>
                                    <td>{item?.reviewBy}</td>
                                  </tr>

                                  {item.expanded ? (<>
                                    <tr key={`expanded-${index}`}>
                                      <th className="expanded-table"></th>
                                      <th>Discription</th>
                                      <th>Failed Controls</th>
                                      <th></th>
                                      <th>Review Comments</th>
                                    </tr>

                                    {item.tasks.map((task, ind) => {
                                      return (
                                        <tr key={`${index}${ind}`}>
                                          {task?.policies?.length > 0 ? (
                                            <td
                                              className="expanded-table text-right"
                                              onClick={() => {
                                                expandchildReview(
                                                  item,
                                                  task
                                                );
                                              }}
                                            >
                                              {task.expanded ? (
                                                <BsFillCaretDownFill />
                                              ) : (
                                                <BsFillCaretRightFill />
                                              )}
                                            </td>
                                          ) : (
                                            <td />
                                          )}
                                          <td>{task?.itemName}</td>
                                          <td>{task?.fail}</td>
                                          <td></td>
                                          <td>{task?.reviewComments}</td>
                                        </tr>
                                      )
                                    })}
                                  </>) : null}

                                  {item.tasks?.find(
                                    (task) => task.expanded
                                  ) &&
                                    item.expanded &&
                                    item?.tasks?.find((task) => task.expanded)
                                      ?.policies?.length > 0 ? (<>
                                        <tr>
                                          <th className="expanded-table"></th>
                                          <th>Sequence Number</th>
                                          <th>Policy Name</th>
                                          <th>Result</th>
                                          <th>Review Comments</th>
                                        </tr>
                                        {item?.tasks
                                          ?.find((task) => task.expanded)
                                          ?.policies?.map((poli, index) => {
                                            return (<>
                                              <tr key={index}>
                                                <td className="expanded-table"></td>
                                                <td>
                                                  {poli?.sequenceNumber}
                                                </td>
                                                <td>{poli?.policyName}</td>
                                                <td>{poli?.result}</td>
                                                <td>
                                                  {poli?.reviewComments}
                                                </td>
                                              </tr>
                                            </>)
                                          })}
                                      </>) : null}
                                </>))
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {PolicyPopupShow ? (
        <AssignPolicyPopup
          id={policyId}
          props={props}
          AssignPopupcallback={AssignPopupcallback}
        />
      ) : null}
    </div>
  );
}

export default CisResultPage;
