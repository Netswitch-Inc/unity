/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { createConnection, cleanConnectionMessage } from "../store";

// ** Reactstrap Imports
import { Row, Col, InputGroup, Form as BootstrapForm } from "react-bootstrap";
import { Card, CardBody, FormFeedback } from "reactstrap";

import { Formik, Form, Field } from "formik";
import * as yup from "yup";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** SVG Icons
import { EyeView, EyeSlash } from "components/SVGIcons";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { initialConnectionItem } from "utility/reduxConstant";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";

// ** Styles
import "react-js-cron/dist/styles.css";

const AddConnection = () => {
  // ** Hooks
  const navigate = useNavigate();
  // ** Store vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.connection);

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    type: yup.string().required("Connection Type is required"),
    ip_address: yup.string().required("IP Address/Url is required"),
    // port: yup.string().required('Port is required'),
    // username: yup.string().required("Username is required"),
    // password: yup.string().required("Password is required"),
  });

  // ** States
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  }

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanConnectionMessage());
    }

    if (store?.actionFlag === "CONN_CRET") {
      setTimeout(() => { navigate("/admin/connections"); }, 2000);
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

  const onSubmit = (values) => {
    if (values) {
      const payload = {
        name: values?.name || "",
        type: values?.type || "",
        ip_address: values?.ip_address || "",
        port: values?.port || "",
        username: values?.username || "",
        password: values?.password || "",
        description: values?.description || "",
      }

      dispatch(createConnection(payload));
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
          <Col className="col-md-12 col-xxl-10 mx-auto">
            <Card className="card-content p-0">
              {/* <div className="p-0 border-bottom pb-2 card-header row justify-content-between m-0">
                <h3 className="card-title mb-0 mt-0">Add Connection</h3>
              </div> */}

              <CardBody>
                <Formik
                  initialValues={initialConnectionItem}
                  enableReinitialize={initialConnectionItem}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <Row>
                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridName" className="full-width">
                          <BootstrapForm.Label className="col-label">Name</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            className="col-input w-100"
                          />
                          {errors.name && touched.name && (
                            <FormFeedback className="d-block">{errors?.name}</FormFeedback>
                          )}
                        </Col>

                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridType" className="full-width">
                          <BootstrapForm.Label className="col-label">Type</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="type"
                            placeholder="Enter Type"
                            className="col-input w-100"
                          />
                          {errors.type && touched.type && (
                            <FormFeedback className="d-block">{errors?.type}</FormFeedback>
                          )}
                        </Col>

                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridIP" className="full-width">
                          <BootstrapForm.Label className="col-label">
                            IP Address/Url
                          </BootstrapForm.Label>
                          <Field
                            type="text"
                            name="ip_address"
                            placeholder="Enter IP Address"
                            className="col-input w-100"
                          />
                          {errors.ip_address && touched.ip_address && (
                            <FormFeedback className="d-block">{errors?.ip_address}</FormFeedback>
                          )}
                        </Col>

                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridPort" className="full-width">
                          <BootstrapForm.Label className="col-label">Port</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="port"
                            placeholder="Enter Port"
                            className="col-input w-100"
                          />
                          {errors.port && touched.port && (
                            <FormFeedback className="d-block">{errors?.port}</FormFeedback>
                          )}
                        </Col>

                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridUsername" className="full-width">
                          <BootstrapForm.Label className="col-label">Username</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="username"
                            placeholder="Enter User Name"
                            className="col-input w-100"
                          />
                          {errors.username && touched.username && (
                            <FormFeedback className="d-block">{errors?.username}</FormFeedback>
                          )}
                        </Col>

                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridPassword" className="full-width password">
                          <BootstrapForm.Label className="col-label">Password</BootstrapForm.Label>
                          <div className="position-relative">
                            <InputGroup className="mb-0">
                              <Field
                                name="password"
                                className="col-input"
                                type={passwordShown ? "text" : "password"}
                                placeholder="Enter Password"
                              />
                              <InputGroup.Text className="input-eyes-text">
                                <a onClick={togglePasswordVisibility}>
                                  {passwordShown ? <EyeView /> : <EyeSlash />}
                                </a>
                              </InputGroup.Text>
                            </InputGroup>
                            <div className="notes">
                              {/* <small>
                                *Password must be alphanumeric & Min. 8 characters.
                              </small> */}
                              {errors.password && touched.password && (
                                <FormFeedback className="d-block">{errors?.password}</FormFeedback>
                              )}
                            </div>
                          </div>
                        </Col>

                        <Col md={12} as={BootstrapForm.Group} controlId="formGridDescription" className="full-width">
                          <BootstrapForm.Label className="col-label">
                            Description
                          </BootstrapForm.Label>
                          <Field
                            as="textarea"
                            type="textarea"
                            name="description"
                            placeholder="Enter Description"
                            className="col-input w-100"
                          />
                          {errors.description && touched.description && (
                            <FormFeedback className="d-block">{errors?.description}</FormFeedback>
                          )}
                        </Col>
                      </Row>

                      <div className="buttons">
                        <button
                          type="submit"
                          color="primary"
                          className="btnprimary"
                        >
                          Submit
                        </button>

                        <button
                          type="button"
                          className="btnsecondary ml-3"
                          onClick={() => navigate("/admin/connections")}
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

export default AddConnection;
