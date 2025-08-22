import React, { useState } from "react";
import Zeek from "../../assets/files/Deployment-Guide-Doc/Zeek_Log_Collector_Deployment_Guide.pdf";
import { Col, Row, Card, CardBody, Collapse, Button, Table, UncontrolledTooltip } from "reactstrap";
import { FaFileDownload } from 'react-icons/fa';
import LogcollectorImange from '../../assets/img/toolIcons/lc.png'
const LogCollector = () => {
  const [selectedAccordion, setSelectedAccordion] = useState();

  const handleClick = () => {
    window.open(Zeek, "_blank");
  };


  const ZeekGuidance = [
    {
      name: "Installation Guide",
      path: Zeek,
      pdfFileName: "Zeek_Log_Collector_Deployment_Guide.pdf",
    },
    {
      name: "UnityRI Integration",
      path: Zeek,
      pdfFileName: "Zeek_Log_Collector_Deployment_Guide.pdf",
    },
  ];
  const ZeekArr = [
    {
      name: "Zeek",
      // logo: OpenVAs,
    },
  ];

  return (
    <div className="content data-list global-management">

      <div className="container-fluid">
        <Row>
          <Col xxs="12" className="mb-4">
            <Card className="m-0">
              <div className="p-0 border-bottom pb-2 card-header row m-0">
                <img height={25}
                  width={25} src={LogcollectorImange} alt="logcollector" className="mr-2"></img>
                <h3 className="card-title mb-0 mt-0">Log Collectors</h3>
              </div>

              <CardBody className="m-0 p-0">
                {ZeekArr.map((vulnerability, indexTab) => (
                  <div
                    className="accrodion-permi mt-2"
                    key={`div_${indexTab}_${vulnerability.name}`}
                  >
                    <Button
                      color="link"
                      className="permission-accordion d-flex align-items-center"
                      onClick={() => {
                        setSelectedAccordion(indexTab);
                        if (indexTab === selectedAccordion) {
                          setSelectedAccordion();
                        }
                      }}
                      aria-expanded={selectedAccordion === indexTab}
                    >
                      {selectedAccordion === indexTab ? (
                        <span className="check-box-permission">
                          <p className="mb-0">-</p>
                        </span>
                      ) : (
                        <span className="check-box-permission">
                          <p className="mb-0">+</p>
                        </span>
                      )}{" "}
                      <span>{vulnerability.name} </span>
                    </Button>

                    <Collapse
                      isOpen={selectedAccordion === indexTab}
                      className="gobal-input border-top-0"
                    >
                      <Table>
                        <tbody>
                          {ZeekGuidance.map(
                            (guidance, indexRow) => (
                              <tr key={`tr_${indexRow}_${guidance.name}`}>
                                <td>{guidance.name}</td>
                                <td>
                                  <FaFileDownload
                                    size={20}
                                    cursor="pointer"
                                    id={`Download_${indexRow}`}
                                    onClick={() => handleClick()}
                                  />
                                  <UncontrolledTooltip
                                    placement="top"
                                    target={`Download_${indexRow}`}
                                  >
                                    Download
                                  </UncontrolledTooltip>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </Collapse>
                  </div>
                ))}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default LogCollector;
