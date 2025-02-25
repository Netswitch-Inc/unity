import React, { useEffect, useState, useLayoutEffect } from "react";
import OtpInput from "react-otp-input";
import { Card, CardBody, FormGroup } from "reactstrap";
import { Row, Col } from "react-bootstrap";
import {
    verifyCodeAssessmentReport,
    editAssessmentReportRequest,
} from "../store";
// import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import reactLogo from "assets/img/react-logo.png";

const VarificationCode = () => {
    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const assessmentId = queryParams.get("id");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [emailCode, setEmailCode] = useState("");
    const [smsCode, setSmsCode] = useState("");
    const [errorMessage, setErrorMessage] = useState(
        { email: false },
        { smsCode: false }
    );
    const [showSnackBar, setshowSnackbar] = useState(false);
    const [snakebarMessage, setSnakbarMessage] = useState("");

    const assessmentReport = useSelector((state) => state.assessmentReport);

    useLayoutEffect(() => {
        if (assessmentId) {
            const query = { id: assessmentId };
            dispatch(editAssessmentReportRequest(query));
        }
    }, [assessmentId, dispatch]);

    // useEffect(() => {
    //     if (assessmentReport?.actionFlag === 'VARIFIED') {
    //         navigate(`/asessment-report/${id}?id=${assessmentId}`)
    //     }
    // }, [assessmentReport?.actionFlag])

    useEffect(() => {
        if (
            assessmentReport?.assessmentReportItem?.email_verified &&
            assessmentReport.assessmentReportItem?.mobile_verified
        ) {
            navigate(`/asessment-report/${id}?id=${assessmentId}`);
        }
    });

    useEffect(() => {
        if (
            assessmentReport?.success &&
            assessmentReport?.actionFlag === "VARIFIED"
        ) {
            setshowSnackbar(true);
            setSnakbarMessage(assessmentReport.success);
        }

        if (assessmentReport?.error) {
            setshowSnackbar(true);
            setSnakbarMessage(assessmentReport.error);
        }
    }, [
        assessmentReport.actionFlag,
        assessmentReport.success,
        assessmentReport.error,
        dispatch,
    ]);

    useEffect(() => {
        if (assessmentReport.actionFlag === "VARIFIED" && showSnackBar) {
            setTimeout(() => {
                setshowSnackbar(false);
                setSnakbarMessage("");
                navigate(`/asessment-report/${id}?id=${assessmentId}`);
            }, 3000);
        }
        if (assessmentReport.actionFlag === "VARIFIED_ERROR" && showSnackBar) {
            setTimeout(() => {
                setshowSnackbar(false);
                setSnakbarMessage("");
            }, 3000);
        }
    }, [showSnackBar, assessmentId, navigate, assessmentReport.actionFlag, id]);

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
        }, 2000);
    }, [showSnackBar]);

    // const handleSubmit = () => {
    //     if (
    //         emailCode?.length === 4 &&
    //         smsCode?.length === 4 &&
    //         (!assessmentReport?.assessmentReportItem?.email_verified ||
    //             !assessmentReport.assessmentReportItem?.mobile_verified)
    //     ) {
    //         setErrorMessage({ email: false, smsCode: false });
    //         dispatch(
    //             verifyCodeAssessmentReport({
    //                 _id: assessmentId,
    //                 email_code: emailCode,
    //                 mobile_code: smsCode,
    //             })
    //         );
    //     } else {
    //         setErrorMessage({ email: true, smsCode: true });
    //         navigate(`/asessment-report/${id}?id=${assessmentId}`);
    //     }
    // };

    const handleSubmit = () => {
        if (emailCode?.length !== 6 && smsCode?.length !== 6) {
            setErrorMessage({ email: true, smsCode: true });
            return;
        }
        if (emailCode?.length !== 6) {
            setErrorMessage({ ...errorMessage, email: true });
            return;
        }
        if (smsCode?.length !== 6) {
            setErrorMessage({ ...errorMessage, smsCode: true });
            return;
        }

        if (
            emailCode?.length === 6 &&
            smsCode?.length === 6 &&
            (!assessmentReport?.assessmentReportItem?.email_verified ||
                !assessmentReport.assessmentReportItem?.mobile_verified)
        ) {
            setErrorMessage({ email: false, smsCode: false });
            dispatch(
                verifyCodeAssessmentReport({
                    _id: assessmentId,
                    email_code: emailCode,
                    mobile_code: smsCode,
                })
            );
        }
    };
    return (
        <div className="step-wise-content">
            <Row className="sticky--- m-0">
                <Col className="personal-information left-side">
                    <div className="steps">
                        <div className="logo">
                            <img alt="..." src={reactLogo} />
                        </div>
                        <ul>
                            <li className="active done">Company Information</li>
                            <li className="active">Verification(Email & Mobile)</li>
                            <li>Self Assessment</li>
                            <li>Thank You</li>
                        </ul>
                    </div>
                </Col>
                <Col className="right-side email-verifcation-or-mobile">
                    <ReactSnackBar
                        Icon={
                            <span>
                                <TiMessages size={25} />
                            </span>
                        }
                        Show={showSnackBar}
                    >
                        {snakebarMessage}
                    </ReactSnackBar>
                    <Card className="h-100">
                        <div className="card-header">
                            <h3 className="m-0">Verification(Email & Mobile)</h3>
                        </div>
                        <CardBody className="pl-0 pr-0">
                            <div className="row-row">
                                <div className="col-12 text-center">
                                    <label className="mb-3">Email Verifiaction Code</label>
                                    <FormGroup>
                                        <OtpInput
                                            value={emailCode}
                                            onChange={setEmailCode}
                                            numInputs={6}
                                            renderSeparator={<span> - </span>}
                                            renderInput={(props) => <input {...props} />}
                                        />
                                        {errorMessage?.email && emailCode?.length < 6 && (
                                            <div style={{ color: "red" }}>
                                                Enter 6-digit code received in your email
                                            </div>
                                        )}
                                    </FormGroup>
                                </div>
                                <div className="col-12 text-center mt-3">
                                    <label className="mb-3">Mobile Verification Code</label>
                                    <FormGroup>
                                        <OtpInput
                                            value={smsCode}
                                            onChange={setSmsCode}
                                            numInputs={6}
                                            renderSeparator={<span> - </span>}
                                            renderInput={(props) => <input {...props} />}
                                        />
                                        {errorMessage?.smsCode && smsCode?.length < 6 && (
                                            <div style={{ color: "red" }}>
                                                Enter 6-digit code received in your mobile via SMS
                                            </div>
                                        )}
                                    </FormGroup>
                                </div>
                            </div>

                            <div className="buttons justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() =>
                                        navigate(`/assessment-form/${id}?id=${assessmentId}`)
                                    }
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}

                                // disabled={isSubmitting}
                                >
                                    Next
                                </button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default VarificationCode;
