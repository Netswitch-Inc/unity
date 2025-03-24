// ** React Imports
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import {
    updateAssessmentReport,
    createAssessmentReport,
    getAssessmentReport,
    cleanAssessmentReportMessage
} from "../store";

// ** Reactstrap Imports
import { Row, Col } from "react-bootstrap";
import { Card, CardBody, FormGroup } from "reactstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import Select from "react-select";

// ** Third Party Components
import PhoneInput from 'react-phone-input-2';

// ** Constant
import { businessType, AssessmentReport } from "utility/reduxConstant";

// ** Logo
import reactLogo from "assets/img/react-logo.png";

// ** Styles
import 'react-phone-input-2/lib/style.css';

const CompanyInfoStep = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const assessmentReport = useSelector((state) => state.assessmentReport);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const assessmentId = queryParams.get("id");

    const [asessmentReportValue, setAsessmentReportValue] = useState(AssessmentReport);

    // Define the validation schema
    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email format.")
            .required("Email is required."),
        mobile: Yup.string().required("Mobile number is required.")
    })

    const getbusinessTypeOption = (typeValue) => {
        return (
            businessType.find((option) => option.value === typeValue) || {
                label: "",
                value: "",
            }
        )
    }

    useEffect(() => {
        if (assessmentReport?.actionFlag === "ASSMT_RPRT_CRTD_SCS" && assessmentReport?.addAssessmentReportItem?._id) {
            navigate(`/code-verification/${id}?id=${assessmentReport?.addAssessmentReportItem?._id}`)
            dispatch(cleanAssessmentReportMessage());
        }

        if (assessmentReport?.actionFlag === "ASSMT_RPRT_UPDT_SCS" && assessmentReport?.assessmentReportItem?._id) {
            navigate(`/code-verification/${id}?id=${assessmentReport?.assessmentReportItem?._id}`);
            dispatch(cleanAssessmentReportMessage());
        }

        if (assessmentReport?.actionFlag === "ASSESSMENT_REPORT_GET") {
            setAsessmentReportValue({
                ...assessmentReport?.assessmentReportItem,
                business_type: getbusinessTypeOption(
                    assessmentReport?.assessmentReportItem?.business_type
                ),
            });
        }
    }, [assessmentReport, navigate, id, dispatch]);

    useEffect(() => {
        if (assessmentId) {
            // setAsessmentReportValue()
            const query = { id: assessmentId };
            dispatch(getAssessmentReport(query));
        }
    }, [assessmentId, dispatch]);

    const changeMobileValue = (name, value, formatObj, func) => {
        func(name, value);
        func("country_code", formatObj);
    };

    const onSubmit = (values) => {
        const payload = {
            ...values,
            business_type: values.business_type.value,
            assessment_id: id,
        }

        if (assessmentId) {
            dispatch(updateAssessmentReport(payload));
        }

        if (!assessmentId) {
            payload.assessment_id = id;
            dispatch(createAssessmentReport(payload));
        }
    }

    return (
        <div className="step-wise-content">
            <Row className="sticky--- m-0">
                <Card className="main-progress col-md-3 mb-0">
                    <div className="main-logo-img">
                        <div className="logo">
                            <img alt="..." src={reactLogo} />
                        </div>
                    </div>

                    <div className="mb-0">
                        <div className="steps-mains">
                            <div className="steps active-class">
                                <div className="borders step-line second-step">
                                    <div className="step-icon">
                                        <p>1</p>
                                    </div>
                                </div>
                                <div className="step-name">
                                    <h4>Company Info</h4>
                                </div>
                            </div>

                            <div className="steps">
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

                <Col className="right-side col-md-9">
                    <div className="card-header">
                        <h3 className="m-0">Company Information</h3>
                    </div>
                    <Card>
                        <CardBody className="pl-0 pr-0">
                            <Formik
                                initialValues={asessmentReportValue}
                                enableReinitialize={asessmentReportValue}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                {({ setFieldValue, values, errors, isSubmitting, touched }) => (
                                    <Form>
                                        <Row className="mb-3">
                                            <Col xl={6} className="mb-3 mb-xl-0">
                                                <FormGroup
                                                    controlId="formGridCompanyName"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label>Company Name</BootstrapForm.Label> */}
                                                    <label className="col-label form-label">Company Name</label>
                                                    <Field
                                                        type="text"
                                                        name="company_name"
                                                        className="col-input w-100"
                                                        placeholder="Enter Company Name"
                                                    />
                                                    {errors.company_name && touched.company_name && (
                                                        <div className="error" style={{ color: "red", marginTop: "3px" }}>
                                                            {errors.company_name}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>

                                            <Col xl={6}>
                                                <FormGroup
                                                    controlId="formGridCompanyName"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label>Contact Name</BootstrapForm.Label> */}
                                                    <label className="col-label form-label">Contact Name</label>
                                                    <Field
                                                        type="text"
                                                        name="name"
                                                        className="col-input w-100"
                                                        placeholder="Enter Contact Name"
                                                    />
                                                    {errors.name && touched.name && (
                                                        <div style={{ color: "red", marginTop: "3px" }}>
                                                            {errors.name}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Col xl={6} className="mb-3 mb-xl-0">
                                                <FormGroup
                                                    controlId="formGridEmailAddress"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label>Email Address</BootstrapForm.Label>\ */}
                                                    <label className="col-label form-label">Email Address <span style={{ color: 'red' }}>*</span> </label>
                                                    <Field
                                                        type="email"
                                                        name="email"
                                                        className="col-input w-100"
                                                        placeholder="Enter Your Email Address"
                                                    />
                                                    {errors.email && touched.email && (
                                                        <div className="error" style={{ color: "red", marginTop: "3px" }}>
                                                            {errors.email}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>

                                            <Col xl={6}>
                                                <FormGroup
                                                    controlId="formGridContactNumber"
                                                    className="mb-0 mobile-no country-drpdwn"
                                                >
                                                    {/* <BootstrapForm.Label>Mobile Number</BootstrapForm.Label> */}
                                                    <label className="col-label form-label">Mobile Number <span style={{ color: 'red' }}>*</span> </label>
                                                    {/*  <Field type="text" name="mobile" className="col-input w-100" placeholder="Enter Contact Number" /> */}
                                                    <PhoneInput
                                                        autoComplete="off"
                                                        value={values.mobile}
                                                        country={"gb"}
                                                        inputProps={{ name: "mobile" }}
                                                        placeholder="Enter mobile number"
                                                        disableDropdown={false}
                                                        countryCodeEditable={false}
                                                        onChange={(val, data) =>
                                                            changeMobileValue(
                                                                "mobile",
                                                                val,
                                                                data,
                                                                setFieldValue
                                                            )
                                                        }
                                                    // onBlur={() => setFieldTouched('mobile', true)}
                                                    />
                                                    {errors.mobile && touched.mobile && (
                                                        <div className="error" style={{ color: "red", marginTop: "3px" }}>
                                                            {errors.mobile}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Col xl={6}>
                                                {/* <BootstrapForm.Label>Business Type</BootstrapForm.Label> */}
                                                <label className="col-label form-label">Business Type</label>
                                                {businessType && (
                                                    <Select
                                                        name="business_type"
                                                        className="react-select col-select w-100"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Business Type..."
                                                        value={values?.business_type}
                                                        options={businessType}
                                                        onChange={(type) => {
                                                            setFieldValue("business_type", type);
                                                        }}
                                                    />
                                                )}
                                                {errors.business_type && touched.business_type && (
                                                    <div className="error" style={{ color: "red", marginTop: "3px" }}>
                                                        {errors.business_type}
                                                    </div>
                                                )}
                                            </Col>

                                            <Col xl={6} className="mb-3 mb-xl-0">
                                                <FormGroup
                                                    controlId="formGridContactNumber"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label>Number of Employees</BootstrapForm.Label> */}
                                                    <label className="col-label form-label">Number of Employees</label>
                                                    <Field
                                                        type="number"
                                                        name="team_size"
                                                        className="col-input w-100"
                                                        placeholder="Enter Number of Employees"
                                                    />
                                                    {errors.team_size && touched.team_size && (
                                                        <div className="error" style={{ color: "red", marginTop: "3px" }}>
                                                            {errors.team_size}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Col xl={12}>
                                                <FormGroup
                                                    controlId="formGridContactNumber"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label> Description of Operations</BootstrapForm.Label> */}
                                                    <label className="col-label form-label">Description of Operations</label>
                                                    <Field
                                                        type="textarea"
                                                        name="operation_description"
                                                        className="col-input w-100"
                                                        placeholder="Enter Description of Operations"
                                                    />
                                                    {errors.operation_description &&
                                                        touched.operation_description && (
                                                            <div className="error" style={{ color: "red", marginTop: "3px" }}>
                                                                {errors.operation_description}
                                                            </div>
                                                        )}
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row className="mb-3">
                                            <Col xl={6} className="mb-3 mb-xl-0">
                                                <FormGroup
                                                    controlId="formGridContactNumber"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label>Address 1</BootstrapForm.Label> */}
                                                    <label className="col-label form-label">Address 1</label>
                                                    <Field
                                                        type="text"
                                                        name="address1"
                                                        className="col-input w-100"
                                                        placeholder="Enter Address Line 1"
                                                    />
                                                    {errors.address1 && touched.address1 && (
                                                        <div className="error" style={{ color: "red", marginTop: "3px" }}>
                                                            {errors.address1}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col xl={6}>
                                                <FormGroup
                                                    controlId="formGridContactNumber"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label>Address 2</BootstrapForm.Label> */}
                                                    <label className="col-label form-label">Address 2</label>
                                                    <Field
                                                        type="text"
                                                        name="address2"
                                                        className="col-input w-100"
                                                        placeholder="Enter Address Line 2"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col lg={6} xl={3} className="mb-3 mb-xl-0">
                                                <FormGroup
                                                    controlId="formGridContactNumber"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label>City</BootstrapForm.Label> */}
                                                    <label className="col-label form-label">City</label>
                                                    <Field
                                                        type="text"
                                                        name="city"
                                                        className="col-input w-100"
                                                        placeholder="Enter City"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg={6} xl={3} className="mb-3 mb-xl-0">
                                                <FormGroup
                                                    controlId="formGridContactNumber"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label>State</BootstrapForm.Label> */}
                                                    <label className="col-label form-label">State</label>
                                                    <Field
                                                        type="text"
                                                        name="state"
                                                        className="col-input w-100"
                                                        placeholder="Enter State"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg={6} xl={3} className="mb-3 mb-xl-0">
                                                <FormGroup
                                                    controlId="formGridContactNumber"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label>Country</BootstrapForm.Label> */}
                                                    <label className="col-label form-label">Country</label>
                                                    <Field
                                                        type="text"
                                                        name="country"
                                                        className="col-input w-100"
                                                        placeholder="Enter Country"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg={6} xl={3} className="mb-xl-0">
                                                <FormGroup
                                                    controlId="formGridContactNumber"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label>Zipcode</BootstrapForm.Label> */}
                                                    <label className="col-label form-label">Zipcode</label>
                                                    <Field
                                                        type="text"
                                                        name="zipcode"
                                                        className="col-input w-100"
                                                        placeholder="Enter Zipcode"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <div className="buttons d-flex justify-content-end">
                                            <button
                                                type="submit"
                                                className="btnprimary mt-0"
                                                disabled={isSubmitting}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default CompanyInfoStep;
