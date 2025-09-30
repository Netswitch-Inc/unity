/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import React, { useLayoutEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getAssessmentReportAnswersList } from "../store";

// ** Reactstrap Imports
import { Card } from "reactstrap";
import { Row, Col } from "react-bootstrap";

// ** Utils
import { setInnerHtml, htmlToString } from "utility/Utils";

// ** Custom Components
import AssessmentSidebar from "../sidebar";
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Icons
import thankYouImg from "assets/img/thankyouicon.svg";

const ThankYou = () => {
    // ** Hooks
    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    // ** Store vars
    const dispatch = useDispatch();
    const assessmentReport = useSelector((state) => state.assessmentReport);
    
    // ** Const
    const assessmentReportId = queryParams.get("id");

    useLayoutEffect(() => {
        const params = {
            assessment_id: id,
            asessment_report_id: assessmentReportId,
        }

        dispatch(getAssessmentReportAnswersList(params));
    }, [dispatch, assessmentReportId, id]);

    return (
        <div className="step-wise-content vh-100">
            <Row className="sticky--- m-0 thank-you-sticky">
                <AssessmentSidebar activeStep={4} step1Filled={true} step2Filled={true} step3Filled={true} />

                <Col className="right-side thank-you">
                    <div className="card-header">
                        <h3 className="m-0">THANK YOU</h3>
                    </div>

                    <Card className="">
                        {!assessmentReport?.loading ? (<SimpleSpinner />) : null}

                        <div className="pl-0 pr-0">
                            <div className="row-row">
                                <div className="thank-name mt-5 text-center">
                                    <h3 className="m-0">THANK YOU !</h3>
                                </div>
                                
                                <div className="text-center">
                                    <img alt="..." src={thankYouImg} className="mb-3" />
                                </div>

                                {htmlToString(assessmentReport?.asessmentReportAnswers?.assessment_additional_description) ? (
                                    setInnerHtml(assessmentReport?.asessmentReportAnswers?.assessment_additional_description, "draft-editor-content-view mt-3")
                                ) : null}
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ThankYou;
