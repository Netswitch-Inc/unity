// ** React Imports
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useParams, useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import {
  getOpenVASScanReport,
  createOpenVASScanReport,
  updateOpenVASScanReport,
  cleanOpenVASScanReportMessage,
} from "../store";

// ** Reactstrap Imports
import { Form as BootstrapForm } from "react-bootstrap";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormFeedback,
} from "reactstrap";

import { Formik, Form, Field } from "formik";
import * as yup from "yup";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import Flatpickr from "react-flatpickr";

// ** Styles
import "flatpickr/dist/themes/material_blue.css";

// ** Constant
import { initOpenVASScanReportItem } from "utility/reduxConstant";

const EditOpenVASScanReport = () => {
  // ** Hooks
  const { id } = useParams();
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

  const [openVASScanReportItem, setOpenVASScanReportItem] = useState(
    store.openVASScanReportItem || initOpenVASScanReportItem
  );

  const handleGetOpenVASScanReport = useCallback(() => {
    dispatch(getOpenVASScanReport({ id }));
  }, [dispatch, id]);

  useLayoutEffect(() => {
    handleGetOpenVASScanReport();
  }, [handleGetOpenVASScanReport]);

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanOpenVASScanReportMessage());
    }

    if (
      store?.actionFlag === "OVSR_SCH_ITM" ||
      store?.actionFlag === "OVSR_SCH_ITM_ERR"
    ) {
      let openVASScanReportItm = { ...initOpenVASScanReportItem };
      if (store.openVASScanReportItem?._id) {
        openVASScanReportItm = { ...store.openVASScanReportItem };
      }

      setOpenVASScanReportItem(openVASScanReportItm);
    }

    if (
      store?.actionFlag === "OVSR_SCH_CRET" ||
      store?.actionFlag === "OVSR_SCH_UPDT"
    ) {
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
  }, [
    store.error,
    store.success,
    store.actionFlag,
    store.openVASScanReportItem,
    navigate,
    dispatch,
  ]);

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 6000);
  }, [showSnackBar]);

  const handleSubmit = (values) => {
    if (values) {
      const openVASScanReportPayload = {
        _id: values._id,
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
        vulnerability_detection_method:
          values?.vulnerability_detection_method || "",
        product_detection_result: values?.product_detection_result || "",
        bids: values?.bids || "",
        certs: values?.certs || "",
        other_references: values?.other_references || "",
      };

      // console.log("handleSubmit >>> ", values, openVASScanReportPayload)
      if (openVASScanReportPayload?._id) {
        dispatch(updateOpenVASScanReport(openVASScanReportPayload));
      } else {
        dispatch(createOpenVASScanReport(openVASScanReportPayload));
      }
    }
  };

  return (
    <div className="content">
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
          <Col className="col-md-12 col-xxl-10 mx-auto">
            <Card className="card-content p-0">
              {/* <div className="p-0 border-bottom pb-2 card-header row justify-content-between m-0">
                    <h3 className='card-title mb-0 mt-0'>Edit OpenVAS Scan Report</h3>
                    </div> */}
              <CardBody>
                <Formik
                  initialValues={openVASScanReportItem}
                  enableReinitialize={openVASScanReportItem}
                  validationSchema={OpenVASScanReportSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <Row>
                        {/* IP Field */}
                        <Col xl={4} lg={6} className="full-width">
                          <BootstrapForm.Label className="col-label">IP</BootstrapForm.Label>

                          <Field
                            type="text"
                            name="ip"
                            className="col-input w-100"
                          />
                          {errors.ip && touched.ip && (
                            <FormFeedback className="d-block">
                              {errors?.ip}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Hostname Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label"> Hostname</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="hostname"
                            className="col-input w-100"
                            placeholder="Enter hostname"
                          />
                          {errors.hostname && touched.hostname && (
                            <FormFeedback className="d-block">
                              {errors?.hostname}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Port Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Port</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="port"
                            className="col-input w-100"
                            placeholder="Enter port"
                          />
                          {errors.port && touched.port && (
                            <FormFeedback className="d-block">
                              {errors?.port}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Port Protocol Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Port Protocol</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="port_protocol"
                            className="col-input w-100"
                            placeholder="Enter port protocol"
                          />
                          {errors.port_protocol && touched.port_protocol && (
                            <FormFeedback className="d-block">
                              {errors?.port_protocol}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* CVSS Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">CVSS</BootstrapForm.Label>
                          <Field
                            type="number"
                            name="cvss"
                            className="col-input w-100"
                            placeholder="Enter CVSS"
                          />
                          {errors.cvss && touched.cvss && (
                            <FormFeedback className="d-block">
                              {errors?.cvss}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Severity Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Severity</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="severity"
                            className="col-input w-100"
                            placeholder="Enter severity"
                          />
                          {errors.severity && touched.severity && (
                            <FormFeedback className="d-block">
                              {errors?.severity}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* QoD Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">QoD</BootstrapForm.Label>
                          <Field
                            type="number"
                            name="qod"
                            className="col-input w-100"
                            placeholder="Enter QoD"
                          />
                          {errors.qod && touched.qod && (
                            <FormFeedback className="d-block">
                              {errors?.qod}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Solution Type Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Solution Type</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="solution_type"
                            className="col-input w-100"
                            placeholder="Enter solution type"
                          />
                          {errors.solution_type && touched.solution_type && (
                            <FormFeedback className="d-block">
                              {errors?.solution_type}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* NVT Name Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">NVT Name</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="nvt_name"
                            className="col-input w-100"
                            placeholder="Enter NVT name"
                          />
                          {errors.nvt_name && touched.nvt_name && (
                            <FormFeedback className="d-block">
                              {errors?.nvt_name}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Summary Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Summary</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="summary"
                            className="col-input w-100"
                            placeholder="Enter summary"
                          />
                          {errors.summary && touched.summary && (
                            <FormFeedback className="d-block">
                              {errors?.summary}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Specific Result Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Specific Result</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="specific_result"
                            className="col-input w-100"
                            placeholder="Enter specific result"
                          />
                          {errors.specific_result &&
                            touched.specific_result && (
                              <FormFeedback className="d-block">
                                {errors?.specific_result}
                              </FormFeedback>
                            )}
                        </Col>

                        {/* NVT OID Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">NVT OID</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="nvt_oid"
                            className="col-input w-100"
                            placeholder="Enter NVT OID"
                          />
                          {errors.nvt_oid && touched.nvt_oid && (
                            <FormFeedback className="d-block">
                              {errors?.nvt_oid}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* CVEs Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">CVEs</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="cves"
                            className="col-input w-100"
                            placeholder="Enter CVEs"
                          />
                          {errors.cves && touched.cves && (
                            <FormFeedback className="d-block">
                              {errors?.cves}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Task ID Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Task ID</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="task_id"
                            className="col-input w-100"
                            placeholder="Enter task ID"
                          />
                          {errors.task_id && touched.task_id && (
                            <FormFeedback className="d-block">
                              {errors?.task_id}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Task Name Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Task Name</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="task_name"
                            className="col-input w-100"
                            placeholder="Enter task name"
                          />
                          {errors.task_name && touched.task_name && (
                            <FormFeedback className="d-block">
                              {errors?.task_name}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Timestamp Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Timestamp</BootstrapForm.Label>
                          <Field name="timestamp">
                            {({ field, form }) => {
                              return (
                                <Flatpickr
                                  data-enable-time
                                  options={{
                                    enableTime: true,
                                    enableSeconds: true, // Include seconds
                                    time_24hr: true, // Use 24-hour format
                                    dateFormat: "Y-m-d H:i:S", // Format including seconds
                                  }}
                                  value={field.value}
                                  onChange={(selectedDates) => {
                                    form.setFieldValue("timestamp", selectedDates[0]); // Set value in Formik
                                  }}
                                  className="col-input w-100" // Apply Bootstrap styles
                                />
                              );
                            }}
                          </Field>
                          {errors.timestamp && touched.timestamp && (
                            <FormFeedback className="d-block">{errors?.timestamp}</FormFeedback>
                          )}
                        </Col>

                        {/* Result ID Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Result ID</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="result_id"
                            className="col-input w-100"
                            placeholder="Enter result ID"
                          />
                          {errors.result_id && touched.result_id && (
                            <FormFeedback className="d-block">
                              {errors?.result_id}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Impact Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Impact</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="impact"
                            className="col-input w-100"
                            placeholder="Enter impact"
                          />
                          {errors.impact && touched.impact && (
                            <FormFeedback className="d-block">
                              {errors?.impact}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Solution Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Solution</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="solution"
                            className="col-input w-100"
                            placeholder="Enter solution"
                          />
                          {errors.solution && touched.solution && (
                            <FormFeedback className="d-block">
                              {errors?.solution}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Affected Software/OS Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Affected Software/OS</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="affected_software_os"
                            className="col-input w-100"
                            placeholder="Enter affected software/OS"
                          />
                          {errors.affected_software_os &&
                            touched.affected_software_os && (
                              <FormFeedback className="d-block">
                                {errors?.affected_software_os}
                              </FormFeedback>
                            )}
                        </Col>

                        {/* Vulnerability Insight Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Vulnerability Insight</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="vulnerability_insight"
                            className="col-input w-100"
                            placeholder="Enter vulnerability insight"
                          />
                          {errors.vulnerability_insight &&
                            touched.vulnerability_insight && (
                              <FormFeedback className="d-block">
                                {errors?.vulnerability_insight}
                              </FormFeedback>
                            )}
                        </Col>

                        {/* Vulnerability Detection Method Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Vulnerability Detection Method</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="vulnerability_detection_method"
                            className="col-input w-100"
                            placeholder="Enter vulnerability detection method"
                          />
                          {errors.vulnerability_detection_method &&
                            touched.vulnerability_detection_method && (
                              <FormFeedback className="d-block">
                                {errors?.vulnerability_detection_method}
                              </FormFeedback>
                            )}
                        </Col>

                        {/* Product Detection Result Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Product Detection Result</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="product_detection_result"
                            className="col-input w-100"
                            placeholder="Enter product detection result"
                          />
                          {errors.product_detection_result &&
                            touched.product_detection_result && (
                              <FormFeedback className="d-block">
                                {errors?.product_detection_result}
                              </FormFeedback>
                            )}
                        </Col>

                        {/* BIDs Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">BIDs</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="bids"
                            className="col-input w-100"
                            placeholder="Enter BIDs"
                          />
                          {errors.bids && touched.bids && (
                            <FormFeedback className="d-block">
                              {errors?.bids}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* CERTs Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">CERTs</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="certs"
                            className="col-input w-100"
                            placeholder="Enter CERTs"
                          />
                          {errors.certs && touched.certs && (
                            <FormFeedback className="d-block">
                              {errors?.certs}
                            </FormFeedback>
                          )}
                        </Col>

                        {/* Other References Field */}
                        <Col
                          xl={4}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">Other References</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="other_references"
                            className="col-input w-100"
                            placeholder="Enter other references"
                          />
                          {errors.other_references &&
                            touched.other_references && (
                              <FormFeedback className="d-block">
                                {errors?.other_references}
                              </FormFeedback>
                            )}
                        </Col>
                      </Row>
                      <div className="buttons">
                        <button
                          type="submit"
                          className="btnprimary"
                        >
                          Submit
                        </button>

                        <button
                          type="button"
                          className="btnsecondary ml-3"
                          onClick={() => navigate("/admin/openvas-scan-reports")}
                        >
                          Back
                          {/* <TiArrowLeft
                            size={25}
                            title="Back"
                            className=""
                          /> */}
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
    </div>
  );
};

export default EditOpenVASScanReport;
