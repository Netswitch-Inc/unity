import React, { useState, useRef } from "react";

import {
  Col,
  Row,
  Card,
  Input,
  Table,
  Button,
  CardBody,
  FormGroup,
  CardFooter,
  InputGroup,
  InputGroupAddon
} from "reactstrap";

import LoadingBar from "react-top-loading-bar";
import SlidingPanel from "react-sliding-side-panel";

import CisResultPage from "../CritcalSecurityControls/CriticalSecurityControls";

// ** JSON data
import { Governance } from "../sampleData/mockData";
import { BiSearch } from "components/SVGIcons";

const ComplianceSearch = () => {
  const ref = useRef(null);

  let complianceTags = "ISO27001";
  const governanceSearchData = Governance.GovernanceSearchData;

  let [keyword, setKeyword] = useState("");
  let [clickedSearch, setClickedSearch] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  let [filteredGovernanceSearchData, setFilteredGovernanceSearchData] =
    useState(governanceSearchData);

  const search = () => {
    setClickedSearch(true);
    if (keyword === "") {
      setFilteredGovernanceSearchData(governanceSearchData);
    } else {
      setFilteredGovernanceSearchData(
        governanceSearchData.filter((item) =>
          item.Title.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
  }

  const handleChange = (e) => {
    setKeyword(e.target.value);
  }

  const ComplianceSearchSliderPanel = (props) => {
    // setOpenPanel(props.isOpen);
    return (
      <SlidingPanel type={"right"} isOpen={openPanel} size={50} panelClassName="sliding-panel">
        <Row>
          <Col>
            <Row>
              <Button
                className="btn btn-primary mb-2"
                onClick={() => setOpenPanel(false)}
              >
                <i className="tim-icons icon-minimal-left" /> Back
              </Button>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <label className="text-info">Control Title</label>
                  <h3>{selectedItem.ControlTitle}</h3>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <label className="text-info">SARA Control</label>
                  <p>{selectedItem.SARAControl}</p>
                </FormGroup>
              </Col>

              <Col>
                <FormGroup>
                  <label className="text-info">SARA Safeguard</label>
                  <p>{selectedItem.SARASafeguard}</p>
                </FormGroup>
              </Col>

              <Col>
                <FormGroup>
                  <label className="text-info">Asset Type</label>
                  <p>{selectedItem.AssetType}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <label className="text-info">Security Function</label>
                  <p>{selectedItem.SecurityFunction}</p>
                </FormGroup>
              </Col>

              <Col>
                <FormGroup>
                  <label className="text-info">Control</label>
                  <p>{selectedItem.Control}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <label className="text-info">Description</label>
                  <p>{selectedItem.Description}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <label className="text-info">ControlText</label>
                  <p>{selectedItem.ControlText}</p>
                </FormGroup>
              </Col>
            </Row>
          </Col>

          <Col>
            <Row className="m-0">
              <CisResultPage />
            </Row>
          </Col>
        </Row>
      </SlidingPanel>
    )
  }

  function handleDetailsAction(selectedItem) {
    setOpenPanel(true);
    setSelectedItem(selectedItem);
  }

  return (<>
    <div className="content compliance-lookup-tool data-list">
      <LoadingBar color="#2BFD82FF" ref={ref} shadow={true} />
      <Row>
        <Col className="col-md-12 col-xl-6 ml-auto mr-auto">
          <h2 className="text-center">Governance Controls Search</h2>
        </Col>
      </Row>

      <Row>
        <Col className="col-md-6 ml-auto mr-auto">
          <InputGroup>
            <Input
              type="text"
              name="keyword"
              value={keyword}
              onChange={handleChange}
              placeholder="Keyword"
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
        {clickedSearch ? (
          <div className="col-md-12 col-xxl-10 ml-auto mr-auto">
            <Card>
              <CardBody>
                <Row>
                  <Col xs="7">
                    <div className="numbers">
                      <h3 className="card-title">Showing results</h3>
                      {filteredGovernanceSearchData.length} results
                      <br />
                      Filtered by:
                      <div className="react-tagsinput">
                        <span>
                          <span className="react-tagsinput-tag readonly info">
                            {complianceTags}
                          </span>
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>

              <CardFooter className="pl-0 pr-0 pb-0 pt-0">
                <Col className="mb-2 p-0" md="12">
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Title</th>
                        <th>Compliance</th>
                        <th>SARA Control</th>
                        <th>SARA Safeguard</th>
                        <th>Asset Type</th>
                        <th>Security Function</th>
                        <th>Control</th>
                        <th>Control Text</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGovernanceSearchData.map((val, index) => {
                        return (
                          <tr key={index}>
                            <td>{val.Title}</td>
                            <td>
                              <div className="react-tagsinput">
                                <span>
                                  <span className="react-tagsinput-tag readonly info">
                                    {val.Compliance}
                                  </span>
                                </span>
                              </div>
                            </td>
                            <td>{val.SARAControl}</td>
                            <td>{val.SARASafeguard}</td>
                            <td>{val.AssetType}</td>
                            <td>{val.SecurityFunction}</td>
                            <td>{val.Control}</td>
                            <td>{val.ControlText}</td>
                            <td>
                              <Button onClick={() => handleDetailsAction(val)} className="btn btn-primary">
                                Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              </CardFooter>
            </Card>
          </div>
        ) : null}

        <ComplianceSearchSliderPanel
          isOpen={openPanel}
          selectedItem={selectedItem}
        />
      </Row>
    </div>
  </>)
}

export default ComplianceSearch;
