// ** React Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import {
    createOpenVASScanReport,
    cleanOpenVASScanReportMessage
} from "../store";

// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    Input,
    Button,
    CardBody,
    FormGroup,
    FormFeedback,
} from "reactstrap";

import { Formik, Form, Field } from "formik";
import * as yup from "yup";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages, TiArrowLeft } from "react-icons/ti";

// ** Constant
import { initOpenVASScanReportItem } from "utility/reduxConstant";

// ** Styles
import "react-js-cron/dist/styles.css";

const AddOpenVASScanReport = () => {
    // ** Hooks
    const navigate = useNavigate();

    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.openVASScanReport);

    const OpenVASScanReportSchema = yup.object({
        ip: yup.string().required("IP is required."),
        cvss: yup.number().required("CVSS is required."),
        severity: yup.string().required("Severity is required."),
        qod: yup.number().required("QoD is required."),
        solution_type: yup.string().required("Solution type is required."),
        nvt_name: yup.string().required("NVT name is required."),
        summary: yup.string().required("Summary is required."),
        specific_result: yup.string().required("Specific result is required."),
        nvt_oid: yup.string().required("NVT OID is required."),
        task_id: yup.string().required("Task ID is required."),
        task_name: yup.string().required("Task name is required."),
        timestamp: yup.date().required("Timestamp is required."),
        result_id: yup.string().required("Result ID is required."),
    });

    // ** States
    const [showSnackBar, setShowSnackbar] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");

    useEffect(() => {
        if (store?.actionFlag || store?.success || store?.error) {
            dispatch(cleanOpenVASScanReportMessage());
        }

        if (store?.actionFlag === "OVSR_SCH_CRET" || store?.actionFlag === "OVSR_SCH_UPDT") {
            navigate("/admin/openvas-scan-reports");
        }

        if (store.success) {
            setShowSnackbar(true);
            setSnackMessage(store.success);
        }

        if (store.error) {
            setShowSnackbar(true);
            setSnackMessage(store.error);
        }
    }, [store.error, store.success, store.actionFlag, navigate, dispatch]);

    useEffect(() => {
        setTimeout(() => {
            setShowSnackbar(false);
        }, 6000);
    }, [showSnackBar]);

    const handleSubmit = (values) => {
        if (values) {
            const openVASScanReportPayload = {
                ip: values?.ip || "",
                hostname: values?.hostname || "",
                port: values?.port || "",
                port_protocol: values?.port_protocol || "",
                cvss: values?.cvss || 0,
                severity: values?.severity || "",
                qod: values?.qod || 0,
                solution_type: values?.solution_type || "",
                nvt_name: values?.nvt_name || "",
                summary: values?.summary || "",
                specific_result: values?.specific_result || "",
                nvt_oid: values?.nvt_oid || "",
                cves: values?.cves || "",
                task_id: values?.task_id || "",
                task_name: values?.task_name || "",
                timestamp: values?.timestamp || new Date(),
                result_id: values?.result_id || "",
                impact: values?.impact || "",
                solution: values?.solution || "",
                affected_software_os: values?.affected_software_os || "",
                vulnerability_insight: values?.vulnerability_insight || "",
                vulnerability_detection_method: values?.vulnerability_detection_method || "",
                product_detection_result: values?.product_detection_result || "",
                bids: values?.bids || "",
                certs: values?.certs || "",
                other_references: values?.other_references || "",
            };

            // console.log("handleSubmit >>> ", values, openVASScanReportPayload)
            dispatch(createOpenVASScanReport(openVASScanReportPayload));
        }
    };

    return (
        <div className="content data-list">
            {!store?.loading ? <SimpleSpinner /> : null}

            <ReactSnackBar
                Icon={
                    <span>
                        <TiMessages size={25} />
                    </span>
                }
                Show={showSnackBar}
            >
                {snackMessage}
            </ReactSnackBar>

            <div className="container-fluid">
                <Row>
                    <Col className="col-md-12 col-xxl-10 ml-auto mr-auto">
                        <Card className="card-category card-subcategories m-0">
                            <div className="p-0 border-bottom pb-2 card-header row justify-content-between m-0">
                                <h3 className="card-title mb-0 mt-0">Add OpenVAS Scan Report</h3>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => navigate("/admin/openvas-scan-reports")}
                                >
                                    Back
                                    <TiArrowLeft size={25} title="Back" className="ml-2" />
                                </button>
                            </div>

                            <CardBody className="m-0 p-0">
                                <Formik
                                    initialValues={initOpenVASScanReportItem}
                                    enableReinitialize={initOpenVASScanReportItem}
                                    validationSchema={OpenVASScanReportSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ values, errors, touched, setFieldValue }) => (
                                        <Form className="mt-2">
                                            <Row>

                                                {/* IP Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>IP</label>
                                                        <Field
                                                            type="text"
                                                            name="ip"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter IP"
                                                        />
                                                        {errors.ip && touched.ip && (
                                                            <FormFeedback className="d-block">{errors?.ip}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Hostname Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Hostname</label>
                                                        <Field
                                                            type="text"
                                                            name="hostname"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter hostname"
                                                        />
                                                        {errors.hostname && touched.hostname && (
                                                            <FormFeedback className="d-block">{errors?.hostname}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Port Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Port</label>
                                                        <Field
                                                            type="text"
                                                            name="port"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter port"
                                                        />
                                                        {errors.port && touched.port && (
                                                            <FormFeedback className="d-block">{errors?.port}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Port Protocol Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Port Protocol</label>
                                                        <Field
                                                            type="text"
                                                            name="port_protocol"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter port protocol"
                                                        />
                                                        {errors.port_protocol && touched.port_protocol && (
                                                            <FormFeedback className="d-block">{errors?.port_protocol}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* CVSS Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>CVSS</label>
                                                        <Field
                                                            type="number"
                                                            name="cvss"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter CVSS"
                                                        />
                                                        {errors.cvss && touched.cvss && (
                                                            <FormFeedback className="d-block">{errors?.cvss}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Severity Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Severity</label>
                                                        <Field
                                                            type="text"
                                                            name="severity"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter severity"
                                                        />
                                                        {errors.severity && touched.severity && (
                                                            <FormFeedback className="d-block">{errors?.severity}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* QoD Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>QoD</label>
                                                        <Field
                                                            type="number"
                                                            name="qod"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter QoD"
                                                        />
                                                        {errors.qod && touched.qod && (
                                                            <FormFeedback className="d-block">{errors?.qod}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Solution Type Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Solution Type</label>
                                                        <Field
                                                            type="text"
                                                            name="solution_type"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter solution type"
                                                        />
                                                        {errors.solution_type && touched.solution_type && (
                                                            <FormFeedback className="d-block">{errors?.solution_type}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* NVT Name Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>NVT Name</label>
                                                        <Field
                                                            type="text"
                                                            name="nvt_name"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter NVT name"
                                                        />
                                                        {errors.nvt_name && touched.nvt_name && (
                                                            <FormFeedback className="d-block">{errors?.nvt_name}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Summary Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Summary</label>
                                                        <Field
                                                            type="text"
                                                            name="summary"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter summary"
                                                        />
                                                        {errors.summary && touched.summary && (
                                                            <FormFeedback className="d-block">{errors?.summary}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Specific Result Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Specific Result</label>
                                                        <Field
                                                            type="text"
                                                            name="specific_result"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter specific result"
                                                        />
                                                        {errors.specific_result && touched.specific_result && (
                                                            <FormFeedback className="d-block">{errors?.specific_result}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* NVT OID Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>NVT OID</label>
                                                        <Field
                                                            type="text"
                                                            name="nvt_oid"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter NVT OID"
                                                        />
                                                        {errors.nvt_oid && touched.nvt_oid && (
                                                            <FormFeedback className="d-block">{errors?.nvt_oid}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* CVEs Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>CVEs</label>
                                                        <Field
                                                            type="text"
                                                            name="cves"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter CVEs"
                                                        />
                                                        {errors.cves && touched.cves && (
                                                            <FormFeedback className="d-block">{errors?.cves}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Task ID Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Task ID</label>
                                                        <Field
                                                            type="text"
                                                            name="task_id"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter task ID"
                                                        />
                                                        {errors.task_id && touched.task_id && (
                                                            <FormFeedback className="d-block">{errors?.task_id}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Task Name Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Task Name</label>
                                                        <Field
                                                            type="text"
                                                            name="task_name"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter task name"
                                                        />
                                                        {errors.task_name && touched.task_name && (
                                                            <FormFeedback className="d-block">{errors?.task_name}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Timestamp Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Timestamp</label>
                                                        <Field
                                                            type="datetime-local"
                                                            name="timestamp"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter timestamp"
                                                        />
                                                        {errors.timestamp && touched.timestamp && (
                                                            <FormFeedback className="d-block">{errors?.timestamp}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Result ID Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Result ID</label>
                                                        <Field
                                                            type="text"
                                                            name="result_id"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter result ID"
                                                        />
                                                        {errors.result_id && touched.result_id && (
                                                            <FormFeedback className="d-block">{errors?.result_id}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Impact Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Impact</label>
                                                        <Field
                                                            type="text"
                                                            name="impact"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter impact"
                                                        />
                                                        {errors.impact && touched.impact && (
                                                            <FormFeedback className="d-block">{errors?.impact}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Solution Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Solution</label>
                                                        <Field
                                                            type="text"
                                                            name="solution"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter solution"
                                                        />
                                                        {errors.solution && touched.solution && (
                                                            <FormFeedback className="d-block">{errors?.solution}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Affected Software/OS Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Affected Software/OS</label>
                                                        <Field
                                                            type="text"
                                                            name="affected_software_os"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter affected software/OS"
                                                        />
                                                        {errors.affected_software_os && touched.affected_software_os && (
                                                            <FormFeedback className="d-block">{errors?.affected_software_os}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Vulnerability Insight Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Vulnerability Insight</label>
                                                        <Field
                                                            type="text"
                                                            name="vulnerability_insight"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter vulnerability insight"
                                                        />
                                                        {errors.vulnerability_insight && touched.vulnerability_insight && (
                                                            <FormFeedback className="d-block">{errors?.vulnerability_insight}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Vulnerability Detection Method Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Vulnerability Detection Method</label>
                                                        <Field
                                                            type="text"
                                                            name="vulnerability_detection_method"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter vulnerability detection method"
                                                        />
                                                        {errors.vulnerability_detection_method && touched.vulnerability_detection_method && (
                                                            <FormFeedback className="d-block">{errors?.vulnerability_detection_method}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Product Detection Result Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Product Detection Result</label>
                                                        <Field
                                                            type="text"
                                                            name="product_detection_result"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter product detection result"
                                                        />
                                                        {errors.product_detection_result && touched.product_detection_result && (
                                                            <FormFeedback className="d-block">{errors?.product_detection_result}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* BIDs Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>BIDs</label>
                                                        <Field
                                                            type="text"
                                                            name="bids"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter BIDs"
                                                        />
                                                        {errors.bids && touched.bids && (
                                                            <FormFeedback className="d-block">{errors?.bids}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* CERTs Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>CERTs</label>
                                                        <Field
                                                            type="text"
                                                            name="certs"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter CERTs"
                                                        />
                                                        {errors.certs && touched.certs && (
                                                            <FormFeedback className="d-block">{errors?.certs}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                {/* Other References Field */}
                                                <Col className="" md="6">
                                                    <FormGroup className="mb-3">
                                                        <label>Other References</label>
                                                        <Field
                                                            type="text"
                                                            name="other_references"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter other references"
                                                        />
                                                        {errors.other_references && touched.other_references && (
                                                            <FormFeedback className="d-block">{errors?.other_references}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <div className="my-3">
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                    className="btn-fill"
                                                >
                                                    Submit
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default AddOpenVASScanReport;
