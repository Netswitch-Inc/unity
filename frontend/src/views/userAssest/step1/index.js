import React, { useEffect, useState } from "react";
import { Card, CardBody, FormGroup } from "reactstrap";
import { Row, Col } from "react-bootstrap";
import { businessType, AssessmentReport } from "utility/reduxConstant";
import { Formik, Form, Field } from "formik";
import Select from "react-select";
import {
    updateAssessmentReport,
    createAssessmentReport,
    cleanAssessmentReportMessage,
    editAssessmentReportRequest,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import * as Yup from "yup";
import reactLogo from "assets/img/react-logo.png";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


const CompanyInfoStep = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const assessmentReport = useSelector((state) => state.assessmentReport);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const assessmentId = queryParams.get("id");

    const [asessmentReportValue, setAsessmentReportValue] =
        useState(AssessmentReport);

    // Define the validation schema
    const validationSchema = Yup.object().shape({
        // company_name: Yup.string().required("Company name is required"),
        // name: Yup.string().required("Contact name is required"),
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        mobile: Yup.string()
            .required("Mobile number is required"),
        // .matches(/^[0-9]{11}$/, "Mobile number must be 10 digits"),
        // business_type: Yup.object().required("Business type is required"),
        // team_size: Yup.number()
        //     .required("Number of employees is required")
        //     .positive("Must be a positive number")
        //     .integer("Must be an integer"),
        // operation_description: Yup.string().required(
        //     "Description of operations is required"
        // ),
        // address1: Yup.string().required("Address line 1 is required"),
    });

    const getbusinessTypeOption = (typeValue) => {
        return (
            businessType.find((option) => option.value === typeValue) || {
                label: "",
                value: "",
            }
        );
    };

    useEffect(() => {
        if (
            assessmentReport?.actionFlag === "ASSESSMENT_REPORT_CREATED" &&
            assessmentReport?.addAssessmentReportItem?._id
        ) {
            navigate(
                `/code-verification/${id}?id=${assessmentReport?.addAssessmentReportItem?._id}`
            );
            dispatch(cleanAssessmentReportMessage());
        }
        if (
            assessmentReport?.actionFlag === "ASSESSMENT_REPORT_UPDATED" &&
            assessmentReport?.assessmentReportItem?._id
        ) {
            navigate(
                `/code-verification/${id}?id=${assessmentReport?.assessmentReportItem?._id}`
            );
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
            dispatch(editAssessmentReportRequest(query));
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
        };
        if (assessmentId) {
            dispatch(updateAssessmentReport(payload));
        }
        if (!assessmentId) {
            payload.assessment_id = id;
            dispatch(createAssessmentReport(payload));
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
                            <li className="active">Company Information</li>
                            <li>Verification(Email & Mobile)</li>
                            <li>Self Assessment</li>
                            <li>Thank You</li>
                        </ul>
                    </div>
                </Col>
                <Col className="right-side">
                    <Card>
                        <div className="card-header">
                            <h3 className="m-0">Company Information</h3>
                        </div>

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
                                                    <label>Company Name</label>
                                                    <Field
                                                        type="text"
                                                        name="company_name"
                                                        className="form-control mb-0"
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
                                                    <label>Contact Name</label>
                                                    <Field
                                                        type="text"
                                                        name="name"
                                                        className="form-control mb-0"
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
                                                    <label>Email Address <span style={{ color: 'red' }}>*</span> </label>
                                                    <Field
                                                        type="email"
                                                        name="email"
                                                        className="form-control mb-0"
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
                                                    className="mb-0 mobile-no"
                                                >
                                                    {/* <BootstrapForm.Label>Mobile Number</BootstrapForm.Label> */}
                                                    <label>Mobile Number <span style={{ color: 'red' }}>*</span> </label>
                                                    {/*  <Field type="text" name="mobile" className="form-control mb-0" placeholder="Enter Contact Number" /> */}
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
                                                <label>Business Type</label>
                                                {businessType && (
                                                    <Select
                                                        name="business_type"
                                                        className="react-select info"
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
                                        </Row>
                                        <Row className="mb-3">
                                            <Col xl={6} className="mb-3 mb-xl-0">
                                                <FormGroup
                                                    controlId="formGridContactNumber"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label>Number of Employees</BootstrapForm.Label> */}
                                                    <label>Number of Employees</label>
                                                    <Field
                                                        type="number"
                                                        name="team_size"
                                                        className="form-control mb-0"
                                                        placeholder="Enter Number of Employees"
                                                    />
                                                    {errors.team_size && touched.team_size && (
                                                        <div className="error" style={{ color: "red", marginTop: "3px" }}>
                                                            {errors.team_size}
                                                        </div>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col xl={6}>
                                                <FormGroup
                                                    controlId="formGridContactNumber"
                                                    className="mb-0"
                                                >
                                                    {/* <BootstrapForm.Label> Description of Operations</BootstrapForm.Label> */}
                                                    <label>Description of Operations</label>
                                                    <Field
                                                        type="text"
                                                        name="operation_description"
                                                        className="form-control mb-0"
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
                                                    <label>Address 1</label>
                                                    <Field
                                                        type="text"
                                                        name="address1"
                                                        className="form-control mb-0"
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
                                                    <label>Address 2</label>
                                                    <Field
                                                        type="text"
                                                        name="address2"
                                                        className="form-control mb-0"
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
                                                    <label>City</label>
                                                    <Field
                                                        type="text"
                                                        name="city"
                                                        className="form-control mb-0"
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
                                                    <label>State</label>
                                                    <Field
                                                        type="text"
                                                        name="state"
                                                        className="form-control mb-0"
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
                                                    <label>Country</label>
                                                    <Field
                                                        type="text"
                                                        name="country"
                                                        className="form-control mb-0"
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
                                                    <label>Zipcode</label>
                                                    <Field
                                                        type="text"
                                                        name="zipcode"
                                                        className="form-control mb-0"
                                                        placeholder="Enter Zipcode"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <div className="buttons justify-content-end">
                                            <button
                                                type="submit"
                                                className="btn btn-primary mt-0"
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
    );
};
export default CompanyInfoStep;
