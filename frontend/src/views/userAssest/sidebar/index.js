// ** React Imports
import React from "react";

// ** Store & Actions
import { useSelector } from "react-redux";

// ** Reactstrap Imports
import { Card } from "reactstrap";

// ** Utils
import { onImageSrcError } from 'utility/Utils';

// ** Third Party Components
import classnames from 'classnames';

// ** Constant
import { defaultLogo } from "utility/reduxConstant";

// ** Logo
import logo from "assets/img/react-logo.png";

const AssessmentSidebar = ({
    activeStep = 1,
    step1Filled = false,
    step2Filled = false,
    step3Filled = false,
}) => {
    // ** Store vars
    const settingStore = useSelector((state) => state.globalSetting);

    // ** Const
    const appSettingItem = settingStore?.appSettingItem || null;
    const appLogo = appSettingItem?.logo || defaultLogo;

    const step1 = 1;
    const step2 = 2;
    const step3 = 3;
    const step4 = 4;

    return (
        <Card className="main-progress col-md-3 mb-0">
            <div className="main-logo-img">
                <div className="logo">
                    <img alt="..." src={appLogo} onError={(currentTarget) => onImageSrcError(currentTarget, logo)} />
                </div>
            </div>

            <div className="mb-0">
                <div className="steps-mains">
                    <div className={classnames("steps", {
                        'active-class': activeStep === step1,
                        'filled-step': step1Filled
                    })}>
                        <div className="borders step-line second-step">
                            <div className="step-icon">
                                <p>{step1}</p>
                            </div>
                        </div>
                        <div className="step-name">
                            <h4>Company Info</h4>
                        </div>
                    </div>

                    <div className={classnames("steps", {
                        'active-class': activeStep === step2,
                        'filled-step': step2Filled
                    })}>
                        <div className="borders step-line">
                            <div className="step-icon">
                                <p>{step2}</p>
                            </div>
                        </div>
                        <div className="step-name">
                            <h4>Verification</h4>
                        </div>
                    </div>

                    <div className={classnames("steps", {
                        'active-class': activeStep === step3,
                        'filled-step': step3Filled
                    })}>
                        <div className="borders step-line">
                            <div className="step-icon ">
                                <p>{step3}</p>
                            </div>
                        </div>
                        <div className="step-name">
                            <h4>Self Assessment</h4>
                        </div>
                    </div>

                    <div className={classnames("steps", {
                        'active-class': activeStep === step4
                    })}>
                        <div className="borders">
                            <div className="step-icon">
                                <p>{step4}</p>
                            </div>
                        </div>
                        <div className="step-name">
                            <h4>Thank You</h4>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default AssessmentSidebar;
