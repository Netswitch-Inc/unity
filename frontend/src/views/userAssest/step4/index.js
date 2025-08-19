/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getAssessmentReportAnswersList } from "../store";
import { assessmentReportPdf, assessmentReportPdfSentEmail } from "../store";

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
    // const calculationPoint = location?.state?.aseesmentCalculation

    const [totalPoints, setTotalPoints] = useState([])
    const [totalMaxPoints, setTotalMaxPoints] = useState([])
    const [totalPercentage, setTotalPercentage] = useState('0%')
    const assessmentReportAnswerList = useSelector((state) => state.assessmentReport);

    const handleDownloadPdf = async () => {
        const payload = {
            assessment_id: id,
            asessment_report_id: assessmentReportId,
        };
        await dispatch(assessmentReportPdf(payload));
        const url = `${process.env.REACT_APP_BACKEND_REST_API_URL}/files/assessment-report/${assessmentReportId}.pdf`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    useLayoutEffect(() => {
        const params = {
            assessment_id: id,
            asessment_report_id: assessmentReportId,
        }

        dispatch(getAssessmentReportAnswersList(params));
    }, [dispatch, assessmentReportId, id]);

    const handleSendEmailPdf = async () => {
        const payload = {
            assessment_id: id,
            assessment_report_id: assessmentReportId,
        };
        await dispatch(assessmentReportPdfSentEmail(payload));
    };

    useEffect(() => {
        // Only proceed if score calculation is enabled
        if (assessmentReportAnswerList?.asessmentReportAnswers?.assessment_show_score_calculation) {
            // Make a copy of the current totalPoints to avoid direct mutation
            const updatedPoints = [...totalPoints];
            const updatedOverAllSectionScore = [...totalMaxPoints]
            let OverAllPontsTotal = 0
            let OverAllPoints = 0
            // Loop through each section
            assessmentReportAnswerList?.asessmentReportAnswers?.sections.forEach((section, sectionIndex) => {
                let sectionTotalPoints = 0;
                let overAllSectionScore = 0
                // Loop through the questions in the section
                section.questions.forEach((question) => {
                    if (question.option_type === "radio") {
                        // Get the options and the user's selected answer
                        const selectedAnswer = question.answerDetails?.value;
                        const options = question.options;

                        // Find the option with the maximum points (if needed)
                        const maxPointsOption = options.reduce(
                            (max, current) => {
                                return current.points > max.points ? current : max;
                            },
                            { points: 0 }
                        );

                        // If the selected answer matches an option, get the points for that option
                        const selectedOption = options.find(
                            (option) => option?.value === selectedAnswer
                        );
                        const selectedPoints = selectedOption ? selectedOption.points : 0;

                        // Add the selected points to the total for this section
                        sectionTotalPoints += selectedPoints;
                        overAllSectionScore += maxPointsOption?.points || 0
                        OverAllPoints += maxPointsOption?.points || 0
                        OverAllPontsTotal += selectedPoints

                    }
                });

                // Update the totalPoints array at the specific index of the section
                updatedPoints[sectionIndex] = sectionTotalPoints;
                updatedOverAllSectionScore[sectionIndex] = overAllSectionScore;
            });

            // Set the updated total points for each section
            setTotalPoints(updatedPoints);
            setTotalMaxPoints(updatedOverAllSectionScore)

            setTotalPercentage(`${((OverAllPontsTotal * 100) / OverAllPoints).toFixed(2)}%`)
        }
    }, [assessmentReportAnswerList?.asessmentReportAnswers]);

    return (
        <div className="step-wise-content vh-100">
            <Row className="sticky--- m-0 thank-you-sticky">
                <AssessmentSidebar activeStep={4} step1Filled={true} step2Filled={true} step3Filled={true} />

                <Col className="right-side thank-you">
                    <div className="card-header">
                        <h3 className="m-0">THANK YOU</h3>
                    </div>
                    {/* {!assessmentReportAnswerList?.asessmentReportAnswers?.assessment_show_score_calculation ? (
                        <>
                            <div className="card-header">
                                <h3 className="m-0">THANK YOU</h3>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="card-header">
                                <h3 className="m-0">
                                    {` ${assessmentReportAnswerList?.asessmentReportAnswers?.assessment_name} Results`}
                                </h3>
                            </div>
                        </>
                    )} */}

                    <Card className="">
                        {!assessmentReport?.loading ? (<SimpleSpinner />) : null}

                        <div className="pl-0 pr-0">
                            <div className="row-row">
                                {!assessmentReportAnswerList?.asessmentReportAnswers?.assessment_show_score_calculation ? (<>
                                    <div className="thank-name mt-5 text-center">
                                        <h3 className="m-0">THANK YOU !</h3>
                                    </div>
                                    <div className="text-center">
                                        <img alt="..." src={thankYouImg} className="mb-3" />
                                    </div>
                                </>) : (<>
                                    <div className="thank-name text-center">
                                        <h3 className="m-0 p-0">{` ${assessmentReportAnswerList?.asessmentReportAnswers?.assessment_name} Results`}</h3>
                                    </div>

                                    <div role="alert" className="warn-progress  text-center">
                                        <div className="main-warning">
                                            {/* Title or description text */}
                                            <strong className="fs-3 warning">Warning!</strong> <span className="warning-text">We recommend discussing budget allocations to strengthen your defenses. The NIST Framework can help identify weaknesses and guide where to allocate funds effectively.</span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="progress">
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: totalPercentage }}
                                                aria-valuenow={totalPercentage}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                {totalPercentage} {/* Display percentage inside the progress bar */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row h-100 thanks-card text-center" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                        {assessmentReportAnswerList?.asessmentReportAnswers?.sections.map((section, index) => (
                                            <div className="col-lg-4 col-md-6 mt-4">
                                                <div key={section._id} className="card-box">
                                                    <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#fff', fontWeight: '600' }}>{section.name}</h3>
                                                    <p style={{ marginBottom: '10px', color: '#fff', fontSize: '14px' }}>{section.description}</p>
                                                    <p style={{ fontSize: '16px', fontWeight: '600' }}>
                                                        {totalPoints[index] || 0}/{totalMaxPoints[index] || 0}
                                                    </p>
                                                    <p style={{ fontSize: '14px', color: '#09D66E', fontWeight: '600' }}>
                                                        {totalMaxPoints[index] > 0 ? `${((totalPoints[index] * 100) / totalMaxPoints[index]).toFixed(2)}%` : "0%"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>)}
                                <div className="buttons d-flex justify-content-center both-btn">
                                    <button
                                        className=" btnprimary mt-0"
                                        onClick={() => handleSendEmailPdf()}
                                    >
                                        Send Report to Email
                                    </button>
                                    <button
                                        className="btnprimary"
                                        onClick={() => handleDownloadPdf()}
                                    >
                                        Download Report
                                    </button>
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
