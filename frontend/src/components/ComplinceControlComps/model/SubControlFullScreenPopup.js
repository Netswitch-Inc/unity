/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import ReactApexChart from "react-apexcharts";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { Card, CardBody, Col, Row } from "reactstrap";
// import Chart from "react-apexcharts";
import "bootstrap/dist/css/bootstrap.min.css";

const SubControlFullScreenPopup = ({
    ComplianceScorinfHistoryGraphData,
    loadedSUbControl,
    values
}) => {
    const [lgShow, setLgShow] = useState(false);
    const handleClose = () => setLgShow(false);

    function ScoreHistoryLineChart(props) {
        let categories = [];

        const options = {
            chart: {
                id: "my-chart",
                type: "line",
                zoom: {
                    enabled: false,
                    align: "left",
                },
            },

            annotations: {
                yaxis: [
                    {
                        y: 93,
                        borderColor: "#00E396",
                        label: {
                            borderColor: "#00E396",
                            offsetX: -500,
                            offsetY: 6,
                            style: {
                                color: "#0042da",
                                background: "#00E396",
                                cssClass: "apexcharts-yaxis-annotation-label",
                                padding: {
                                    left: 5,
                                    right: 5,
                                    top: 0,
                                    bottom: 0,
                                },
                            },
                            text: "Industry Average",
                        },
                    },
                ],
            },
            dataLabels: {
                enabled: false,
            },
            // toolbar: {
            //     show: false //Disable toolbar
            // },

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
                    text: "Program Score (%)",
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
            <>
                <ReactApexChart
                    options={options}
                    type="line"
                    series={series}
                    height={props.height}
                />
            </>
        );
    }

    return (
        <>
            <a
                href="#"
                className="FaExpandArrowsAltIcons"
                onClick={() => setLgShow(true)}
            >
                <FaExpandArrowsAlt />
            </a>
            <Modal
                className="UpdateUserPopup"
                size="xl"
                show={lgShow}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header>
                    <span
                        className="modal-title border-bottom col-sm-12 "
                        id="example-modal-sizes-title-lg"
                    >
                        <h3>Resilience Index Historic Data</h3>
                    </span>
                    <button type="button" className="Close-button" onClick={handleClose}>
                        ×
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className="content" id="threat-sources">
                        <Row>
                            <Col lg="12">
                                <Card className="p-3">
                                    <CardBody>
                                        <ScoreHistoryLineChart
                                            loadedSUbControl={loadedSUbControl}
                                            data={ComplianceScorinfHistoryGraphData}
                                            height="400px"
                                            values={values}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default React.memo(SubControlFullScreenPopup);
