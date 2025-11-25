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
import { Card, CardBody, FormGroup, FormFeedback } from "reactstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

//import Select from "react-select";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";
import AssessmentSidebar from "../sidebar";

// ** Third Party Components
import PhoneInput from 'react-phone-input-2';

// ** Constant
import { businessType, AssessmentReport } from "utility/reduxConstant";

// ** Styles
import 'react-phone-input-2/lib/style.css';

const CompanyInfoStep = () => {
    // ** Hooks
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // ** Store vars
    const dispatch = useDispatch();
    const assessmentReport = useSelector((state) => state.assessmentReport);

    // ** Const
    const assessmentId = queryParams.get("id");

    const [asessmentReportValue, setAsessmentReportValue] = useState(AssessmentReport);

    // Define the validation schema
    const validationSchema = Yup.object().shape({
        first_name: Yup.string().required("First Name is required."),
        last_name: Yup.string().required("Last Name is required."),
        email: Yup.string().email("Invalid email format.")
            .required("Email is required."),
        //mobile: Yup.string().required("Mobile number is required.")
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
        if (assessmentReport?.actionFlag) {
            dispatch(cleanAssessmentReportMessage());
        }

        if (assessmentReport?.actionFlag === "ASSMT_RPRT_CRTD_SCS" && assessmentReport?.addAssessmentReportItem?._id) {
            navigate(`/code-verification/${id}?id=${assessmentReport?.addAssessmentReportItem?._id}`)
        }

        if (assessmentReport?.actionFlag === "ASSMT_RPRT_UPDT_SCS" && assessmentReport?.assessmentReportItem?._id) {
            if (assessmentReport?.assessmentReportItem?.email_verified) {
                navigate(`/assessment-report/${id}?id=${assessmentReport?.assessmentReportItem?._id}`);
                //navigate(`/thank-you/${id}?id=${assessmentId}`);
            } else {
                navigate(`/code-verification/${id}?id=${assessmentReport?.assessmentReportItem?._id}`);
            }
        }

        if (assessmentReport?.actionFlag === "ASSMT_RPRT_ITM_SCS") {
            setAsessmentReportValue({
                ...assessmentReport?.assessmentReportItem,
                business_type: getbusinessTypeOption(
                    assessmentReport?.assessmentReportItem?.business_type
                ),
            });
        }
    }, [assessmentReport, navigate, assessmentId, id, dispatch]);

    useEffect(() => {
        if (assessmentId) {
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
            name: `${values.first_name} ${values.last_name}`?.trim(),
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
            {!assessmentReport?.loading ? (<SimpleSpinner />) : null}

            <Row className="sticky--- m-0">
                <AssessmentSidebar activeStep={1} />

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
                                {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
                                    <Form>
                                        <Row>
                                            {/* <Col xl={6} className="mb-3 mb-xl-0">
                                                <FormGroup
                                                    controlId="formGridCompanyName"
                                                    className="mb-0"
                                                >
                                                    <label className="col-label form-label">Company Name</label>
                                                    <Field
                                                        type="text"
                                                        name="company_name"
                                                        className="col-input w-100"
                                                        placeholder="Enter Company Name"
                                                    />
                                                    {errors.company_name && touched.company_name && (
                                                        <FormFeedback className="d-block">{errors?.company_name}</FormFeedback>
                                                    )}
                                                </FormGroup>
                                            </Col> */}

                                            <Col xl={6} className="mb-3">
                                                <FormGroup controlId="formGridCompanyName" className="mb-0">
                                                    <label className="col-label form-label">First Name <span style={{ color: 'red' }}>*</span></label>
                                                    <Field
                                                        type="text"
                                                        name="first_name"
                                                        className="col-input w-100"
                                                        placeholder="Enter First Name"
                                                    />
                                                    {errors.first_name && touched.first_name && (
                                                        <FormFeedback className="d-block">{errors?.first_name}</FormFeedback>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            
                                            <Col xl={6} className="mb-3">
                                                <FormGroup controlId="formGridCompanyName" className="mb-0">
                                                    <label className="col-label form-label">Last Name <span style={{ color: 'red' }}>*</span></label>
                                                    <Field
                                                        type="text"
                                                        name="last_name"
                                                        className="col-input w-100"
                                                        placeholder="Enter Last Name"
                                                    />
                                                    {errors.last_name && touched.last_name && (
                                                        <FormFeedback className="d-block">{errors?.last_name}</FormFeedback>
                                                    )}
                                                </FormGroup>
                                            </Col>

                                            <Col xl={6} className="mb-3">
                                                <FormGroup controlId="formGridEmailAddress" className="mb-0">
                                                    <label className="col-label form-label">Email Address <span style={{ color: 'red' }}>*</span> </label>
                                                    <Field
                                                        type="email"
                                                        name="email"
                                                        className="col-input w-100"
                                                        placeholder="Enter Your Email Address"
                                                    />
                                                    {errors.email && touched.email && (
                                                        <FormFeedback className="d-block">{errors?.email}</FormFeedback>
                                                    )}
                                                </FormGroup>
                                            </Col>

                                            <Col xl={6} className="mb-3">
                                                <FormGroup controlId="formGridContactNumber" className="mb-0 mobile-no country-drpdwn">
                                                    <label className="col-label form-label">Mobile Number</label>
                                                    <PhoneInput
                                                        autoComplete="off"
                                                        value={values.mobile}
                                                        country={"gb"}
                                                        inputProps={{ name: "mobile" }}
                                                        placeholder="Enter mobile number"
                                                        disableDropdown={false}
                                                        countryCodeEditable={false}
                                                        onChange={(val, data) => changeMobileValue("mobile", val, data, setFieldValue)}
                                                        onBlur={() => setFieldTouched('mobile', true)}
                                                    />
                                                    {errors.mobile && touched.mobile && (
                                                        <FormFeedback className="d-block">{errors?.mobile}</FormFeedback>
                                                    )}
                                                </FormGroup>
                                            </Col>

                                            {/*<Col xl={6} className="mb-3">*/}
                                            {/*    <FormGroup controlId="formGridContactNumber" className="mb-0">*/}
                                            {/*        <label className="col-label form-label">Business Type</label>*/}
                                            {/*        {businessType && (*/}
                                            {/*            <Select*/}
                                            {/*                name="business_type"*/}
                                            {/*                className="react-select col-select w-100"*/}
                                            {/*                classNamePrefix="react-select"*/}
                                            {/*                placeholder="Select Business Type..."*/}
                                            {/*                value={values?.business_type}*/}
                                            {/*                options={businessType}*/}
                                            {/*                onChange={(type) => setFieldValue("business_type", type)}*/}
                                            {/*            />*/}
                                            {/*        )}*/}
                                            {/*        {errors.business_type && touched.business_type && (*/}
                                            {/*            <FormFeedback className="d-block">{errors?.business_type}</FormFeedback>*/}
                                            {/*        )}*/}
                                            {/*    </FormGroup>*/}
                                            {/*</Col>*/}
                                            
                                            {/*<Col xl={6} className="mb-3">*/}
                                            {/*    <FormGroup controlId="formGridContactNumber" className="mb-0">*/}
                                            {/*        <label className="col-label form-label">Number of Employees</label>*/}
                                            {/*        <Field*/}
                                            {/*            type="number"*/}
                                            {/*            name="team_size"*/}
                                            {/*            className="col-input w-100"*/}
                                            {/*            placeholder="Enter Number of Employees"*/}
                                            {/*        />*/}
                                            {/*        {errors.team_size && touched.team_size && (*/}
                                            {/*            <FormFeedback className="d-block">{errors?.team_size}</FormFeedback>*/}
                                            {/*        )}*/}
                                            {/*    </FormGroup>*/}
                                            {/*</Col>*/}
                                            
                                            {/*<Col xl={12} className="mb-3">*/}
                                            {/*    <FormGroup controlId="formGridContactNumber" className="mb-0">*/}
                                            {/*        <label className="col-label form-label">Description of Operations</label>*/}
                                            {/*        <Field*/}
                                            {/*            as="textarea"*/}
                                            {/*            type="textarea"*/}
                                            {/*            name="operation_description"*/}
                                            {/*            className="col-input w-100"*/}
                                            {/*            placeholder="Enter Description of Operations"*/}
                                            {/*        />*/}
                                            {/*        {errors.operation_description && touched.operation_description && (*/}
                                            {/*            <FormFeedback className="d-block">{errors?.operation_description}</FormFeedback>*/}
                                            {/*        )}*/}
                                            {/*    </FormGroup>*/}
                                            {/*</Col>*/}
                                            
                                            {/*<Col xl={6} className="mb-3">*/}
                                            {/*    <FormGroup controlId="formGridContactNumber" className="mb-0">*/}
                                            {/*        <label className="col-label form-label">Address 1</label>*/}
                                            {/*        <Field*/}
                                            {/*            type="text"*/}
                                            {/*            name="address1"*/}
                                            {/*            className="col-input w-100"*/}
                                            {/*            placeholder="Enter Address Line 1"*/}
                                            {/*        />*/}
                                            {/*        {errors.address1 && touched.address1 && (*/}
                                            {/*            <FormFeedback className="d-block">{errors?.address1}</FormFeedback>*/}
                                            {/*        )}*/}
                                            {/*    </FormGroup>*/}
                                            {/*</Col>*/}
                                            
                                            {/*<Col xl={6} className="mb-3">*/}
                                            {/*    <FormGroup controlId="formGridContactNumber" className="mb-0">*/}
                                            {/*        <label className="col-label form-label">Address 2</label>*/}
                                            {/*        <Field*/}
                                            {/*            type="text"*/}
                                            {/*            name="address2"*/}
                                            {/*            className="col-input w-100"*/}
                                            {/*            placeholder="Enter Address Line 2"*/}
                                            {/*        />*/}
                                            {/*    </FormGroup>*/}
                                            {/*</Col>*/}
                                            
                                            {/*<Col lg={6} xl={3} className="mb-3">*/}
                                            {/*    <FormGroup controlId="formGridContactNumber" className="mb-0">*/}
                                            {/*        <label className="col-label form-label">City</label>*/}
                                            {/*        <Field*/}
                                            {/*            type="text"*/}
                                            {/*            name="city"*/}
                                            {/*            className="col-input w-100"*/}
                                            {/*            placeholder="Enter City"*/}
                                            {/*        />*/}
                                            {/*    </FormGroup>*/}
                                            {/*</Col>*/}
                                            
                                            {/*<Col lg={6} xl={3} className="mb-3">*/}
                                            {/*    <FormGroup controlId="formGridContactNumber" className="mb-0">*/}
                                            {/*        <label className="col-label form-label">State</label>*/}
                                            {/*        <Field*/}
                                            {/*            type="text"*/}
                                            {/*            name="state"*/}
                                            {/*            className="col-input w-100"*/}
                                            {/*            placeholder="Enter State"*/}
                                            {/*        />*/}
                                            {/*    </FormGroup>*/}
                                            {/*</Col>*/}
                                            
                                            {/*<Col lg={6} xl={3} className="mb-3">*/}
                                            {/*    <FormGroup controlId="formGridContactNumber" className="mb-0">*/}
                                            {/*        <label className="col-label form-label">Country</label>*/}
                                            {/*        <Field*/}
                                            {/*            type="text"*/}
                                            {/*            name="country"*/}
                                            {/*            className="col-input w-100"*/}
                                            {/*            placeholder="Enter Country"*/}
                                            {/*        />*/}
                                            {/*    </FormGroup>*/}
                                            {/*</Col>*/}
                                            
                                            {/*<Col lg={6} xl={3} className="mb-3">*/}
                                            {/*    <FormGroup controlId="formGridContactNumber" className="mb-0">*/}
                                            {/*        <label className="col-label form-label">Zipcode</label>*/}
                                            {/*        <Field*/}
                                            {/*            type="text"*/}
                                            {/*            name="zipcode"*/}
                                            {/*            className="col-input w-100"*/}
                                            {/*            placeholder="Enter Zipcode"*/}
                                            {/*        />*/}
                                            {/*    </FormGroup>*/}
                                            {/*</Col>*/}
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
