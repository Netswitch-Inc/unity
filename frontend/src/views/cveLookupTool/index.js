import React, { useRef, useState, useMemo } from "react";
import LoadingBar from "react-top-loading-bar";
import {
  Col,
  Row,
  Card,
  Form,
  Input,
  Table,
  Button,
  CardBody,
  CardTitle,
  InputGroup,
  CardFooter,
  InputGroupAddon
} from "reactstrap";
import Axios from "axios";
import { Top10CVE } from "../sampleData/mockData";
import CVELookUpTable from "./CVELookUpTable";
import { BiSearch } from "components/SVGIcons";

const CVESearch = () => {
  const ref = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [CVEData, setCVEData] = useState([]);
  const top10CVE = Top10CVE;

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  const search = () => {
    let baseURL = "https://services.nvd.nist.gov/rest/json/cves/1.0?keyword=";
    let apiUrl = baseURL + keyword;

    ref.current.continuousStart();
    Axios.get(apiUrl).then((response) => {
      if (response.data.totalResults > 0) {
        loopData(response);
        ref.current.complete();
      }
    });
  };

  const handleChangeFromClickTable = (cve) => {
    setKeyword(cve);
    let baseURL = "https://services.nvd.nist.gov/rest/json/cves/1.0?keyword=";
    let apiUrl = baseURL + cve;

    ref.current.continuousStart();
    Axios.get(apiUrl).then((response) => {
      if (response.data.totalResults > 0) {
        loopData(response);
        ref.current.complete();
      }
    });
  };

  const loopData = (repo) => {
    var arr = [];
    repo.data.result.CVE_Items.forEach((data, index) => {
      var description = data.cve.description.description_data[0].value;
      var cveId = data.cve.CVE_data_meta.ID;
      var severity = data.impact.baseMetricV3
        ? data.impact.baseMetricV3.cvssV3.baseSeverity
        : "Undefined";
      var baseScore = data.impact.baseMetricV3
        ? data.impact.baseMetricV3.cvssV3.baseScore
        : "Undefined";
      var publishedDate = data.publishedDate;
      var reference = [];

      data.cve.references.reference_data.forEach((data) => {
        var refObj = {};
        refObj.url = data.url;
        refObj.name = data.name;
        refObj.refsource = data.refsource;
        reference.push(refObj);
      });

      var obj = {
        index: index,
        CVE_ID: cveId,
        description: description,
        severity: severity,
        baseScore: baseScore,
        publishedDate: publishedDate,
        reference: reference,
      };
      arr.push(obj);
    });
    setCVEData(arr);
  };

  const CVEcolumns = useMemo(
    () => [
      {
        Header: "CVE ID",
        accessor: "CVE_ID",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "V3 Severity",
        accessor: "severity",
      },
      {
        Header: "V3 Score",
        accessor: "baseScore",
      },
    ],
    []
  );

  return (
    <div className="content cve-lookup-tool data-list">
      <LoadingBar color="#2BFD82FF" ref={ref} shadow={true} />
      <Row>
        <Col className="col-md-12 col-xl-6 ml-auto mr-auto">
          <h2
            className="text-center"
          >
            CVE Lookup Tool
          </h2>
          <p className="text-center" style={{ fontWeight: "400" }}>
            You can search the CVE List for a CVE Record if the CVE ID is known.
            To search by keyword, use a specific term or multiple keywords
            separated by a space. Your results will be the relevant CVE Records.
          </p>
        </Col>
      </Row>

      <Row>
        <Col className="col-md-6 ml-auto mr-auto">
          <InputGroup>
            <Input
              name="keyword"
              value={keyword}
              onChange={handleChange}
              placeholder="Keyword"
              type="text"
            />
            <InputGroupAddon id="searchImportGrp" addonType="append" className="position-absolute">
              <Button
                onClick={search}
                id="SearchBtn"
              >
                <span className="edit2-icons">
                    <BiSearch />
                </span>
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <br></br>
        </Col>
      </Row>

      <Row>
        {CVEData === [] || CVEData.length === 0 ? null : (
          <Card className="col-md-12 col-xxl-10 ml-auto mr-auto">
            <Form className="form-horizontal col-md-12 ml-auto mr-auto ">
              <CardBody>
                <Button className="btn-link btn btn-primary" color="warning">
                  Back
                </Button>
                <CVELookUpTable columnsName={CVEcolumns} CVEdata={CVEData} />
              </CardBody>
            </Form>
          </Card>
        )}
      </Row>

      <Row>
        {CVEData === [] || CVEData.length === 0 ? (
          <div className="col-md-12 col-xxl-10 ml-auto mr-auto">
            <Card>
              <CardBody>
                <Row>
                  <Col xs="7">
                    <div className="numbers">
                      <h3 className="card-title">
                        Top 10 CVEs
                      </h3>
                      <CardTitle tag="h4"></CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>

              <CardFooter className="pl-0 pr-0 pb-0 pt-0">
                <Col className="mb-2 p-0" md="12">
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>CVEs</th>
                        <th>Affected Host</th>
                        <th>First Discovered</th>
                        <th>Impacted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top10CVE.data.map((val, index) => (
                        <tr
                          key={index}
                          onClick={() => handleChangeFromClickTable(val.CVEs)}
                        >
                          <td>{val.CVEs}</td>
                          <td>{val.Count}</td>
                          <td>{val.FirstDiscovered}</td>
                          <td>{val.Impacted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </CardFooter>
            </Card>
          </div>
        ) : null}
      </Row>
    </div>
  )
}

export default CVESearch;
