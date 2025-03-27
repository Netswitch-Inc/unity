// ** React Imports
import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import {
  getCronScheduler,
  createCronScheduler,
  updateCronScheduler,
  cleanCronSchedulerMessage
} from "../store";

// ** Reactstrap Imports
import { Card, CardBody, FormFeedback } from "reactstrap";
import { Col, Row, Form as BootstrapForm } from "react-bootstrap";

import { Formik, Form, Field } from "formik";
import * as yup from "yup";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import { Cron } from "react-js-cron";
import { Divider } from "antd";

// ** Constant
import { initCronSchedulerItem } from "utility/reduxConstant";

const EditCronScheduler = () => {
  // ** Hooks
  const { id } = useParams();
  const navigate = useNavigate();

  // ** Store vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.cronScheduler);

  const CronSchedulerSchema = yup.object({
    name: yup.string().required("Name is required."),
    slug: yup.string().required("Slug is required.")
  })

  // ** States
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const [error, setError] = useState(undefined); // For handling errors

  const [cronSchedulerItem, setCronSchedulerItem] = useState(initCronSchedulerItem)

  const handleGetCronScheduler = useCallback(() => {
    dispatch(getCronScheduler({ id }))
  }, [dispatch, id])

  useLayoutEffect(() => {
    handleGetCronScheduler()
  }, [handleGetCronScheduler])

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanCronSchedulerMessage());
    }

    if (store?.actionFlag === "CRN_SCH_ITM" || store?.actionFlag === "CRN_SCH_ITM_ERR") {
      let cronSchedulerItm = { ...initCronSchedulerItem };
      if (store.cronSchedulerItem?._id) {
        cronSchedulerItm = { ...store.cronSchedulerItem };
      }

      setCronSchedulerItem(cronSchedulerItm);
    }

    if (store?.actionFlag === "CRN_SCH_CRET" || store?.actionFlag === "CRN_SCH_UPDT") {
      setTimeout(() => { navigate("/admin/cron-schedulers"); }, 2000)
    }

    if (store.success) {
      setShowSnackbar(true);
      setSnackMessage(store.success);
    }

    if (store.error) {
      setShowSnackbar(true);
      setSnackMessage(store.error);
    }
  }, [store.error, store.success, store.actionFlag, store.cronSchedulerItem, navigate, dispatch])

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  const handleSubmit = (values) => {
    if (values) {
      const crnSchPayload = {
        _id: values?._id || "",
        name: values?.name || "",
        type: values?.slug || "",
        slug: values?.slug || "",
        cron_style: values?.cron_style || "",
        description: values?.description || "",
        status: values?.status || false
      }

      // console.log("handleSubmit >>> ", values, crnSchPayload)
      if (crnSchPayload?._id) {
        dispatch(updateCronScheduler(crnSchPayload));
      } else {
        dispatch(createCronScheduler(crnSchPayload));
      }
    }
  }

  return (
    <div className="content">
      {!store?.loading ? <SimpleSpinner /> : null}

      <ReactSnackBar Icon={(
        <span><TiMessages size={25} /></span>
      )} Show={showSnackBar}>
        {snackMessage}
      </ReactSnackBar>

      <div className="container-fluid">
        <Row>
          <Col className="col-md-12 col-xxl-10 mx-auto main-cron-scheduler">
            <Card className="card-content p-0">
              {/* <div className="p-0 border-bottom pb-2 card-header row justify-content-between align-items-center m-0">
                <h3 className='card-title mb-0 mt-0'>Edit Cron Scheduler</h3>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate('/admin/cron-schedulers')}
                >
                  Back
                  <TiArrowLeft size={25} title="Back" className='ml-2' />
                </button>
              </div> */}

              <CardBody>
                <Formik
                  initialValues={cronSchedulerItem}
                  enableReinitialize={cronSchedulerItem}
                  validationSchema={CronSchedulerSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, touched, setFieldValue }) => (
                    <Form>
                      <Row>
                        <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                          <BootstrapForm.Label className="col-label">Name</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="name"
                            placeholder="Enter name"
                            className="col-input w-100"
                          />
                          {errors.name && touched.name && (
                            <FormFeedback className="d-block">
                              {errors?.name}
                            </FormFeedback>
                          )}
                        </Col>

                        <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                          <BootstrapForm.Label className="col-label">Slug</BootstrapForm.Label>
                          <Field
                            readOnly
                            type="text"
                            name="slug"
                            placeholder="Enter slug"
                            className="col-input w-100"
                          />
                          {errors.slug && touched.slug && (
                            <FormFeedback className="d-block">
                              {errors?.slug}
                            </FormFeedback>
                          )}
                        </Col>

                        <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                          <BootstrapForm.Label className="col-label">Cron Style</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="cron_style"
                            className="col-input w-100"
                            placeholder="Enter cron style"
                            readOnly={values?.cron_style_disabled || false}
                            onChange={(event) => setFieldValue("cron_style", event.target.value)}
                          />
                        </Col>

                        <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                          <BootstrapForm.Label className="col-label">Status</BootstrapForm.Label>
                          <div className="radio-container d-flex">
                            <div className="form-check">
                              <input
                                id="Active"
                                type="radio"
                                name="status"
                                value={true}
                                className="mx-2"
                                aria-label="Active Status"
                                checked={values?.status === true}
                                onChange={(event) => setFieldValue(event?.target?.name, true)}
                              />
                              <label
                                htmlFor="Active"
                                className="form-check-label"
                              >
                                Enable
                              </label>
                            </div>

                            <div className="form-check">
                              <input
                                type="radio"
                                id="InActive"
                                name="status"
                                value={false}
                                className="mx-2"
                                aria-label="InActive Status"
                                checked={values?.status === false}
                                onChange={(event) => setFieldValue(event?.target?.name, false)}
                              />
                              <label
                                htmlFor="InActive"
                                className="form-check-label"
                              >
                                Disable
                              </label>
                            </div>
                          </div>
                          {errors.status && touched.status && (
                            <FormFeedback className="d-block">
                              {errors?.status}
                            </FormFeedback>
                          )}
                        </Col>

                        <Divider>OR</Divider>
                        <Col xl={12} lg={12} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                          <Cron
                            clearButton={false}
                            value={values?.cron_style || ""}
                            disabled={values?.cron_style_disabled || false}
                            setValue={(newValue) => setFieldValue("cron_style", newValue)}
                            onError={setError}
                          />
                          {errors.cron_style && touched.cron_style && (
                            <FormFeedback className="d-block">
                              {errors?.cron_style}
                            </FormFeedback>
                          )}

                          {error && error?.description && (
                            <FormFeedback className="d-block">
                              {error?.description}
                            </FormFeedback>
                          )}
                        </Col>

                        <Col xl={12} lg={12} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                          <BootstrapForm.Label className="col-label">Description</BootstrapForm.Label>
                          <Field
                            as="textarea"
                            type="textarea"
                            name="description"
                            className="col-input w-100"
                            placeholder="Enter description"
                          />
                          {errors.description && touched.description && (
                            <FormFeedback className="d-block">
                              {errors?.description}
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
                          onClick={() => navigate("/admin/cron-schedulers")}
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
  )
}

export default EditCronScheduler;