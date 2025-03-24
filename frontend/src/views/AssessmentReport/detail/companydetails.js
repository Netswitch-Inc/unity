/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { getAssessmentReport } from "views/userAssest/store";

// ** Reactstrap Imports
import { Col, Row, FormGroup } from "reactstrap"
const AssessmentReportCompanyDetails = () => {
    // ** Hooks
    const { id } = useParams();

    const dispatch = useDispatch();
    const store = useSelector((state) => state.assessmentReport);

    // ** States
    const [assessmentReportData, setAssessmentReportData] = useState(null);

    useLayoutEffect(() => {
        dispatch(getAssessmentReport({ id }));
    }, [dispatch]);

    useEffect(() => {
        if (store.assessmentReportItem) {
            setAssessmentReportData(store.assessmentReportItem);
        }
    }, [store.assessmentReportItem]);

    return (
        <div className="content">
            <Row className="log-details mb-4">
                <Col md={6}>
                    <FormGroup className="d-flex mb-2">
                        <label className="mb-0 font-weight-bold">Company Name:</label>
                        <p className="mb-0 text-white ml-1">
                            {assessmentReportData?.company_name || ""}
                        </p>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup className="d-flex mb-2">
                        <label className="mb-0 font-weight-bold">Name:</label>
                        <p className="mb-0 text-white ml-1">
                            {assessmentReportData?.name || ""}
                        </p>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup className="d-flex mb-2">
                        <label className="mb-0 font-weight-bold">Email:</label>
                        <p className="mb-0 text-white ml-1">
                            {assessmentReportData?.email || ""}
                        </p>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup className="d-flex mb-2">
                        <label className="mb-0 font-weight-bold">Mobile:</label>
                        <p className="mb-0 text-white ml-1">
                            {assessmentReportData?.mobile ? `+${assessmentReportData?.mobile}` : ""}
                        </p>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup className="d-flex mb-2">
                        <label className="mb-0 font-weight-bold">Team Size:</label>
                        <p className="mb-0 text-white ml-1">
                            {assessmentReportData?.team_size || ""}
                        </p>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup className="d-flex mb-2">
                        <label className="mb-0 font-weight-bold">Business Type:</label>
                        <p className="mb-0 text-white text-capitalize ml-1">
                            {assessmentReportData?.business_type || ""}
                        </p>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup className="d-flex mb-2">
                        <label className="mb-0 font-weight-bold">Address 1:</label>
                        <p className="mb-0 text-white ml-1">
                            {assessmentReportData?.address1 || ""}
                        </p>
                    </FormGroup>
                </Col>

                {assessmentReportData?.address2 ? (
                    <Col md={6}>
                        <FormGroup className="d-flex mb-2">
                            <label className="mb-0 font-weight-bold">Address 2:</label>
                            <p className="mb-0 text-white ml-1">
                                {assessmentReportData?.address2 || ""}
                            </p>
                        </FormGroup>
                    </Col>
                ) : null}

                <Col md={6}>
                    <FormGroup className="d-flex mb-2">
                        <label className="mb-0 font-weight-bold">City:</label>
                        <p className="mb-0 text-white ml-1">
                            {assessmentReportData?.city || ""}
                        </p>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup className="d-flex mb-2">
                        <label className="mb-0 font-weight-bold">State:</label>
                        <p className="mb-0 text-white ml-1">
                            {assessmentReportData?.state || ""}
                        </p>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup className="d-flex mb-2">
                        <label className="mb-0 font-weight-bold">Country:</label>
                        <p className="mb-0 text-white ml-1">
                            {assessmentReportData?.country || ""}
                        </p>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup className="d-flex mb-2">
                        <label className="mb-0 font-weight-bold">Zipcode:</label>
                        <p className="mb-0 text-white ml-1">
                            {assessmentReportData?.zipcode || ""}
                        </p>
                    </FormGroup>
                </Col>

                <Col md={12}>
                    <FormGroup className="d-flex mb-2">
                        <label className="mb-0 font-weight-bold">Operation Description:</label>
                        <p className="mb-0 text-white ml-1">
                            {assessmentReportData?.operation_description || ""}
                        </p>
                    </FormGroup>
                </Col>
            </Row>
        </div>
    )
}

export default AssessmentReportCompanyDetails;
