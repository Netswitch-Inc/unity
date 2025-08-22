import React, { useState } from "react";
import Wazuh from "../../assets/files/Deployment-Guide-Doc/Wazuh-Deployment-Guide.pdf";
import { Col, Row, Card, CardBody, Collapse, Button, Table,UncontrolledTooltip } from "reactstrap";
import { FaFileDownload } from "react-icons/fa";
import siem from '../../assets/img/toolIcons/siem.png'

const SIEM = () => {
    const [selectedAccordion, setSelectedAccordion] = useState();

    const handleClick = () => {
        window.open(Wazuh, "_blank");
    };

    const SIEMGuidance = [
        {
            name: "Deployment Guide",
            path: Wazuh,
            pdfFileName: "Wazuh-Deployment-Guide.pdf",
        },
        {
            name: "UnityRI Integration",
            path: Wazuh,
            pdfFileName: "Wazuh-Deployment-Guide.pdf",
        },
    ];
    const SIEM = [
        {
            name: "Wazuh",
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
                                    width={25} src={siem} alt="siem" className="mr-2"></img>
                                <h3 className="card-title mb-0 mt-0">SIEM</h3>
                                {/* <button type="button" className="btn btn-primary d-none">
                                Back
                                <TiArrowLeft size={25} title="Back" className="ml-2" />
                            </button> */}
                            </div>

                            <CardBody className="m-0 p-0">
                                {SIEM.map((vulnerability, indexTab) => (
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
                                                    {SIEMGuidance.map((guidance, indexRow) => (
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
                                                    ))}
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
export default SIEM;
