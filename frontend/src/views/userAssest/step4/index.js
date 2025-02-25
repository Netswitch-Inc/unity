/* eslint-disable react-hooks/exhaustive-deps */

import { Button, Card, CardBody } from "reactstrap";
import { Row, Col } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import { assessmentReportPdf, assessmentReportPdfSentEmail } from "../store";
import { useDispatch, useSelector } from "react-redux";
import SimpleSpinner from "components/spinner/simple-spinner";
import reactLogo from "assets/img/react-logo.png";
import thankYouImg from "assets/img/thank-you-img.png";
import { useEffect, useState, useLayoutEffect } from "react";
import { getAssessmentReportAnswersList } from "../store";
const ThankYou = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const assessmentReportId = queryParams.get("id");
    const assessmentReport = useSelector((state) => state.assessmentReport);
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
        };
        dispatch(getAssessmentReportAnswersList(params));
        // handleAssemmentReportAnswerList()
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
                <Col className="personal-information left-side thank-you-left">
                    <div className="steps">
                        <div className="logo">
                            <img alt="..." src={reactLogo} />
                        </div>
                        <ul>
                            <li className="active done">Company Information</li>
                            <li className="active done">Verification(Email & Mobile)</li>
                            <li className="active done">Self Assessment</li>
                            <li className="active">Thank You</li>
                        </ul>
                    </div>
                </Col>
                <Col className="right-side thank-you">
                    <Card className="h-100">
                        {!assessmentReport?.loading ? <SimpleSpinner /> : null}
                        <CardBody className="pl-0 pr-0">
                            <div className="row-row">
                                {!assessmentReportAnswerList?.asessmentReportAnswers?.assessment_show_score_calculation ? (
                                    <>
                                        <div className="card-header mb-3">
                                            <h3 className="m-0">THANK YOU!</h3>
                                        </div>
                                        <img alt="..." src={thankYouImg} className="mb-3" />
                                        <p className="mb-3">
                                            In publishing and graphic design, Lorem ipsum is a placeholder
                                            text commonly used to demonstrate the visual form of a
                                            document
                                        </p>
                                    </>) : (
                                    <>
                                        <div className="card-header mb-3">
                                            <h3 className="m-0">{` ${assessmentReportAnswerList?.asessmentReportAnswers?.assessment_name} Results`}</h3>
                                        </div>

                                        <div role="alert" style={{ marginBottom: '20px', padding: '30px', fontSize: '18px' }}>
                                            <div>
                                                {/* Title or description text */}
                                                <strong className="fs-3">Warning!</strong> <span>We recommend discussing budget allocations to strengthen your defenses. The NIST Framework can help identify weaknesses and guide where to allocate funds effectively.</span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="progress" style={{ height: '15px' }}>
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

                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>

                                            {assessmentReportAnswerList?.asessmentReportAnswers?.sections.map((section, index) => (
                                                <div
                                                    key={section._id}
                                                    style={{
                                                        border: '1px solid #ccc',
                                                        borderRadius: '8px',
                                                        padding: '20px',
                                                        margin: '10px',
                                                        width: '200px',
                                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                        backgroundColor: '#f9f9f9',
                                                    }}
                                                >
                                                    <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{section.name}</h3>
                                                    <p style={{ marginBottom: '10px', fontSize: '14px' }}>{section.description}</p>
                                                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                        {totalPoints[index] || 0}/{totalMaxPoints[index] || 0}
                                                    </p>
                                                    <p style={{ fontSize: '14px', color: '#4caf50' }}>
                                                        {totalMaxPoints[index] > 0
                                                            ? `${((totalPoints[index] * 100) / totalMaxPoints[index]).toFixed(2)}%`
                                                            : "0%"}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <div className="buttons d-flex">
                                    <Button
                                        className="btn btn-primary"
                                        onClick={() => handleSendEmailPdf()}
                                    >
                                        Send Report to Email
                                    </Button>
                                    <Button
                                        className="btn btn-primary"
                                        onClick={() => handleDownloadPdf()}
                                    >
                                        Download Report
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
export default ThankYou;
