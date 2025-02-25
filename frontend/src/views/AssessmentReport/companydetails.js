/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { editAssessmentReportRequest } from "views/userAssest/store";
import { useSelector, useDispatch } from "react-redux";
// import SimpleSpinner from "components/spinner/simple-spinner";
import { Row, Col, FormGroup, Card, CardBody } from "reactstrap";

const AssessmentReportCompanyDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const store = useSelector((state) => state.assessmentReport);
    const [assessmentReportData, setAssessmentReportData] = useState(null);
    useLayoutEffect(() => {
        dispatch(editAssessmentReportRequest({ id }));
    }, [dispatch]);

    useEffect(() => {
        if (store.assessmentReportItem) {
            setAssessmentReportData(store.assessmentReportItem);
        }
    }, [store.assessmentReportItem]);
    // store.assessmentReportItem
    return (
        <div className="content">
            <Card>
                <CardBody className="pl-0 pr-0 mt-2">
                    <Row>
                        <Col md="4">
                            <FormGroup>
                                <label>Company Name</label>
                                <div>
                                    <span>{assessmentReportData?.company_name}</span>
                                </div>
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <label>Name</label>
                                <div>
                                    <span>{assessmentReportData?.name}</span>
                                </div>
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <label>Email</label>
                                <div>
                                    <span>{assessmentReportData?.email}</span>
                                </div>
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <label>Mobile</label>
                                <div>
                                    <span>{assessmentReportData?.mobile}</span>
                                </div>
                            </FormGroup>
                        </Col>
                        {/* </Row>

                    <Row> */}
                        <Col md="4">
                            <FormGroup>
                                <label>Team Size</label>
                                <div>
                                    <span>{assessmentReportData?.team_size}</span>
                                </div>
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <label>Business Type</label>
                                <div>
                                    <span>{assessmentReportData?.business_type}</span>
                                </div>
                            </FormGroup>
                        </Col>

                        <Col md="4">
                            <FormGroup>
                                <label>Address 1</label>
                                <div>
                                    <span>{assessmentReportData?.address1}</span>
                                </div>
                            </FormGroup>
                        </Col>
                        {/* </Row>

                    <Row> */}
                        <Col md="4">
                            <FormGroup>
                                <label>Address 2</label>
                                <div>
                                    <span>{assessmentReportData?.address2}</span>
                                </div>
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <label>City</label>
                                <div>
                                    <span>{assessmentReportData?.city}</span>
                                </div>
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <label>State</label>
                                <div>
                                    <span>{assessmentReportData?.state}</span>
                                </div>
                            </FormGroup>
                        </Col>
                        {/* </Row>

                    <Row> */}
                        <Col md="4">
                            <FormGroup>
                                <label>Country</label>
                                <div>
                                    <span>{assessmentReportData?.country}</span>
                                </div>
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <label>Zipcode</label>
                                <div>
                                    <span>{assessmentReportData?.zipcode}</span>
                                </div>
                            </FormGroup>
                        </Col>
                        <Col md="12">
                            <FormGroup>
                                <label>Operation Description</label>
                                <div>
                                    <span>{assessmentReportData?.operation_description}</span>
                                </div>
                            </FormGroup>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    );
};

export default AssessmentReportCompanyDetails;