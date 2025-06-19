// ** React Imports
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import {
    getAssessmentReport,
    verifyCodeAssessmentReport
} from "../store";

// ** Reactstrap Imports
import { Card, FormGroup } from "reactstrap";
import { Row, Col } from "react-bootstrap";

// ** Utils
import { onImageSrcError } from 'utility/Utils';

// ** Third Party Components
import OtpInput from "react-otp-input";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { defaultLogo } from 'utility/reduxConstant';

// ** Logo
import logo from "assets/img/react-logo.png";

const VarificationCode = () => {
    // ** Hooks
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    
    // ** Store vars
    const dispatch = useDispatch();
    const assessmentReport = useSelector((state) => state.assessmentReport);
    const settingStore = useSelector((state) => state.globalSetting);
    
    // ** Const
    const appSettingItem = settingStore?.appSettingItem || null;
    const appLogo = appSettingItem?.logo || defaultLogo;    
    const assessmentId = queryParams.get("id");
    
    // ** States
    const [emailCode, setEmailCode] = useState("");
    const [smsCode /* , setSmsCode */] = useState("");
    const [errorMessage, setErrorMessage] = useState({ email: false }, { smsCode: false })
    const [showSnackBar, setshowSnackbar] = useState(false);
    const [snakebarMessage, setSnakbarMessage] = useState("");
    

    useLayoutEffect(() => {
        if (assessmentId) {
            const query = { id: assessmentId };
            dispatch(getAssessmentReport(query));
        }
    }, [assessmentId, dispatch]);

    // useEffect(() => {
    //     if (assessmentReport?.actionFlag === 'CD_VRFYD_SCS') {
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
            assessmentReport?.actionFlag === "CD_VRFYD_SCS"
        ) {
            setshowSnackbar(true);
            setSnakbarMessage(assessmentReport.success);
        }

        if (assessmentReport?.error) {
            setshowSnackbar(true);
            setSnakbarMessage(assessmentReport.error);
        }
    }, [assessmentReport.actionFlag, assessmentReport.success, assessmentReport.error, dispatch]);

    useEffect(() => {
        if (assessmentReport.actionFlag === "CD_VRFYD_SCS" && showSnackBar) {
            setTimeout(() => {
                setshowSnackbar(false);
                setSnakbarMessage("");
                navigate(`/asessment-report/${id}?id=${assessmentId}`);
            }, 3000);
        }

        if (assessmentReport.actionFlag === "CD_VRFYD_ERR" && showSnackBar) {
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

    const handleSubmit = () => {
        // if (emailCode?.length !== 6 && smsCode?.length !== 6) {
        //     setErrorMessage({ email: true, smsCode: true });
        //     return;
        // }

        if (emailCode?.length !== 6) {
            setErrorMessage({ ...errorMessage, email: true });
            return;
        }

        // if (smsCode?.length !== 6) {
        //     setErrorMessage({ ...errorMessage, smsCode: true });
        //     return;
        // }

        // if (
        //     emailCode?.length === 6 &&
        //     smsCode?.length === 6 &&
        //     (!assessmentReport?.assessmentReportItem?.email_verified ||
        //         !assessmentReport.assessmentReportItem?.mobile_verified)
        // ) {
        if (emailCode?.length === 6 && (!assessmentReport?.assessmentReportItem?.email_verified || !assessmentReport.assessmentReportItem?.mobile_verified)) {
            setErrorMessage({ email: false, smsCode: false });
            dispatch(verifyCodeAssessmentReport({
                _id: assessmentId,
                email_code: emailCode,
                mobile_code: smsCode
            }));
        }
    }

    return (
        <div className="step-wise-content">
            <Row className="sticky--- m-0">
                <Card className="main-progress col-md-3 mb-0">
                    <div className="main-logo-img">
                        <div className="logo">
                            <img alt="..." src={appLogo} onError={(currentTarget) => onImageSrcError(currentTarget, logo)} />
                        </div>
                    </div>

                    <div className="mb-0">
                        <div className="steps-mains">
                            <div className="steps filled-step">
                                <div className="borders step-line second-step">
                                    <div className="step-icon">
                                        <p>1</p>
                                    </div>
                                </div>
                                <div className="step-name">
                                    <h4>Company Info</h4>
                                </div>
                            </div>

                            <div className="steps active-class">
                                <div className="borders step-line">
                                    <div className="step-icon ">
                                        <p>2</p>
                                    </div>
                                </div>
                                <div className="step-name">
                                    <h4>Verification</h4>
                                </div>
                            </div>

                            <div className="steps">
                                <div className="borders step-line">
                                    <div className="step-icon ">
                                        <p>3</p>
                                    </div>
                                </div>
                                <div className="step-name">
                                    <h4>Self Assessment</h4>
                                </div>
                            </div>

                            <div className="steps">
                                <div className="borders">
                                    <div className="step-icon">
                                        <p>4</p>
                                    </div>
                                </div>
                                <div className="step-name">
                                    <h4>Thank You</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Col className="right-side email-verifcation-or-mobile">
                    <ReactSnackBar Icon={(
                        <span><TiMessages size={25} /></span>
                    )} Show={showSnackBar}>
                        {snakebarMessage}
                    </ReactSnackBar>
                    <div className="card-header">
                        <h3 className="m-0">Verification Email</h3>
                        {/* <h3 className="m-0">Verification(Email & Mobile)</h3> */}
                    </div>
                    
                    <Card className="pl-0 pr-0 varification-card">
                        <div className="row-row">
                            <div className="col-12 text-center">
                                <label className="mb-3 varification-label">Email Verifiaction Code</label>
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
                            {/* <div className="col-12 text-center mt-3">
                                <label className="mb-3 varification-label">Mobile Verification Code</label>
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
                            </div> */}
                        </div>

                        <div className="buttons justify-content-between d-flex btn-position">
                            <button
                                type="button"
                                className="btnprimary ml-3"
                                onClick={() => navigate(`/assessment-form/${id}?id=${assessmentId}`)}
                            >
                                Previous
                            </button>

                            <button
                                className="btnprimary mr-3"
                                onClick={handleSubmit}
                            >
                                Next
                            </button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default VarificationCode;
