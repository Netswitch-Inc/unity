/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import CisHostDetailsTable from "./CisHostDetailsTable";
import {
  Col,
  Row,
  Card,
  Input,
  Progress,
  CardBody,
  FormGroup,
  CardHeader,
  Breadcrumb,
  CustomInput,
  BreadcrumbItem
} from "reactstrap";

import "./style.css";

const CisHostDetails = ({
  ModalToggle,
  setModalToggle,
  goBackHandler,
  hostName,
  hostIp,
  scan,
  system,
  scoring,
  scanId,
  dataTable,
}) => {
  let [scoringData, setscoringData] = useState(scoring);

  let Filterdatatable = dataTable.filter((ele) => {
    return ele.scanId.toString() === scanId.toString();
  });

  const [InputSearch, setInputSearch] = useState("");
  const [hostData] = useState({
    hostName: hostName,
    TargetIP: hostIp,
    scannedDate: scan
  });
  const [showStatus, setShowStatus] = useState(showStatus);

  const filterTableData = (event) => {
    if (event) {
      setInputSearch(event.target.value);
    } else {
      setInputSearch("");
    }
  };

  const goBack = () => {
    goBackHandler();
  };

  function getClassForProgress(val) {
    if (val >= 70) {
      return "progressLow";
    } else if (val >= 40 && val < 70) {
      return "progressMed";
    } else {
      return "progressHigh";
    }
  }

  useEffect(() => {
    setscoringData(
      Filterdatatable.length > 0 ? Filterdatatable[0]?.OverScoring : scoring
    );
  }, []);

  return (<>
    <div className="content">
      <Row>
        <Col>
          <Card>
            <Breadcrumb>
              <BreadcrumbItem
                className={"interactive-breadcrumb"}
                onClick={goBack}
              >
                All Results
              </BreadcrumbItem>
              <BreadcrumbItem active>Host Details</BreadcrumbItem>
            </Breadcrumb>
            <CardHeader className="CSCcardheader"> Host Details</CardHeader>
            <CardBody>
              <Row>
                <Col className="pr-md-1" md="3">
                  <FormGroup>
                    <label>Name</label>
                    <p>{hostName}</p>
                  </FormGroup>
                </Col>
                <Col className="pr-md-1" md="4">
                  <FormGroup>
                    <label>System</label>
                    <p>{system}</p>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="pr-md-1" md="3">
                  <FormGroup>
                    <label>IP</label>
                    <p>{hostIp}</p>
                  </FormGroup>
                </Col>
                <Col className="pr-md-1" md="4">
                  <FormGroup>
                    <label>Scan Profile</label>
                    <p>{scan}</p>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="pr-md-1" md="3">
                  <FormGroup>
                    <label>Last Scan</label>
                    <p>{scan}</p>
                  </FormGroup>
                </Col>
                <Col className="pr-md-1" md="4">
                  <FormGroup className="progress-container">
                    <label>Score</label>
                    <Progress multi>
                      <Progress
                        bar
                        className={getClassForProgress(scoringData)}
                        max="100"
                        value={scoringData}
                      >
                        <span className="progress-value">{scoringData}</span>
                      </Progress>
                    </Progress>
                  </FormGroup>
                </Col>
                <Col className="pr-md-1 CustomSwitchBtnn" md="2">
                  <div className="button-filter">
                    <p className={"pr"}>Show</p>
                    <div className="d-flex justify-content-center align-items-center">
                      <span className="mr-2 toggle-label">All</span>
                      <CustomInput
                        style={{
                          color: "red",
                          transition: "all 1s ease-out",
                          transitionProperty: "color, background-color",
                        }}
                        id="switch-1"
                        type="switch"
                        className="mt-n4"
                        checked={showStatus}
                        onChange={(event) =>
                          setShowStatus(event.target.checked)
                        }
                      />

                      <span className="ml-n2 toggle-label">Fail</span>
                    </div>
                  </div>
                </Col>
                <Col className="pr-md-1" md="3">
                  <FormGroup>
                    <Input
                      type="text"
                      value={InputSearch}
                      name="searchRecords"
                      placeholder="Search records"
                      onChange={(event) => filterTableData(event)}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <CisHostDetailsTable
                hostData={hostData}
                scanId={scanId}
                searchedTerm={InputSearch}
                status={showStatus}
                ModalToggle={ModalToggle}
                setModalToggle={setModalToggle}
              ></CisHostDetailsTable>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  </>)
}

export default CisHostDetails;
