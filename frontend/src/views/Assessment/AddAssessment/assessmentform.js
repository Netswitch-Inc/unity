/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, FormGroup } from "reactstrap";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import { initialAssessment } from "utility/reduxConstant";
import * as Yup from "yup";
import { createAssessment } from "../store";
import { cleanQuestionMessage } from "views/questions/store";
import { cleanAssessmentMessage } from "../store";
import { useNavigate } from "react-router-dom";

const AssessmentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state.assessment);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    // order: Yup.number()
    //   .required("Order is required")
    //   .positive("Order must be a positive number")
    //   .integer("Order must be an integer"),
  });

  useEffect(() => {
    if (store.actionFlag === "ASSESSMENT_CREATED_SUCCESS" && store.success) {
      // setshowSnackbar(true);
      // setSnakbarMessage(store.success);
      dispatch(cleanQuestionMessage());
      // toggleQuestion();
      // toggle("2");
      dispatch(cleanAssessmentMessage());
      navigate(`/admin/assessment-forms/${store?.assessmentItem?._id}`);
    }
    if (store.actionFlag === "ASSESSMENT_CREATED_ERROR" && store.error) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [
    store.actionFlag,
    dispatch,
    store.success,
    store.error,
    // toggleQuestion,
    // toggle,
  ]);

  useEffect(() => {
    if (showSnackBar) {
      setTimeout(() => {
        setshowSnackbar(() => false);
        setSnakbarMessage(() => "");
      }, 2000);
    }
  }, [showSnackBar]);

  const handleSubmit = (values) => {
    const payload = { ...values };
    console.log(payload,'payload')
    // values?.status ? (payload.status = 1) : (payload.status = 0);
    dispatch(createAssessment(payload));
  };

  return (
    <>
      <div className="content">
        {showSnackBar && (
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
        )}
        <Row>
          <Col>
            <Card>
              <CardBody className="pl-0 pr-0">
                <Formik
                  initialValues={initialAssessment}
                  enableReinitialize={initialAssessment}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, setFieldValue, isSubmitting }) => (
                    <Form>
                      <Row>
                        <Col md={6}>
                          <FormGroup controlId="formGridCompanyName">
                            <label>Name</label>
                            <Field
                              type="text"
                              name="name"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <label>Status</label>
                          <div className="status-container d-flex row-cols-4">
                            <div className="form-check">
                              <input
                                type="radio"
                                name="status"
                                value={1}
                                checked={values?.status === 1}
                                id="Active"
                                onChange={(event) =>
                                  setFieldValue(
                                    "status",
                                    Number(event.target.value)
                                  )
                                }
                                aria-label="Active Status"
                              />
                              <label
                                htmlFor="Active"
                                className="form-check-label"
                              >
                                Active
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                type="radio"
                                name="status"
                                value={0}
                                checked={values?.status === 0}
                                id="InActive"
                                onChange={(event) =>
                                  setFieldValue(
                                    "status",
                                    Number(event.target.value)
                                  )
                                }
                                aria-label="InActive Status"
                              />
                              <label
                                htmlFor="Inactive"
                                className="form-check-label"
                              >
                                InActive
                              </label>
                            </div>
                          </div>
                        </Col>
                        <Col md={2}>
                          <label>Show Calculation</label>
                          <div className="is-active-container col">
                            <div className="is-active-checked form-check">
                              <input
                                type="checkbox"
                                name="show_score_calculation"
                                className="is-active-checked form-check-input mt-0"
                                checked={values?.show_score_calculation}
                                id="Yes"
                                onChange={(event) =>
                                  setFieldValue(
                                    event?.target?.name,
                                    event?.target?.checked
                                  )
                                }
                              />
                              <label
                                title="Yes"
                                htmlFor="Yes"
                                className="pl-3 mb-0"
                              >
                                Yes
                              </label>
                              {/* {errors?.isActive && <div style={{ color: 'red' }}>{errors.isActive}</div>} */}
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <Row className="mb-2">
                        <Col md={12}>
                          <FormGroup controlId="formGridContactNumber">
                            <label>Description</label>
                            <Field
                              as="textarea"
                              name="description"
                              className="form-control"
                              rows="5"
                            />
                            <ErrorMessage
                              name="description"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="w-100 PadR0 ItemInfo-right mt-3">
                        <div className="row justify-content-end m-0">
                          <button
                            type="button"
                            className="float-end btn btn-primary"
                            onClick={() => navigate("/admin/assessment-forms")}
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="float-end btn btn-primary"
                            disabled={isSubmitting}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AssessmentForm;
