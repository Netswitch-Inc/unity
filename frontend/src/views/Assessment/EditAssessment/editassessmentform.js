/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useLayoutEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, FormGroup } from "reactstrap";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import * as Yup from "yup";
import {
  updateAssessment,
  editAssessmentRequest,
  cleanAssessmentMessage,
} from "../store";
import { cleanQuestionMessage } from "views/questions/store";
import { getDomailUrl } from "utility/Utils";
import { TbCheckbox, TbCopyright } from "react-icons/tb";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const EditAssessmentForm = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const url = getDomailUrl();

  const store = useSelector((state) => state.assessment);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    // order: Yup.number()
    //   .required("Order is required")
    //   .positive("Order must be a positive number")
    //   .integer("Order must be an integer"),
  });

  useLayoutEffect(() => {
    const query = { id: id };
    dispatch(editAssessmentRequest(query));
  }, [dispatch, id]);

  useEffect(() => {
    if (store.actionFlag === "ASSESSMENT_UPDATED" && store.success) {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
      dispatch(cleanQuestionMessage());
      dispatch(cleanAssessmentMessage());
    }
    if (store.actionFlag === "ASSESSMENT_UPDATED_ERROR" && store.error) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [store.actionFlag, store.error, store.success]);

  useEffect(() => {
    if (showSnackBar) {
      setTimeout(() => {
        setshowSnackbar(false);
        setSnakbarMessage("");
      }, 1000);
    }
  }, [showSnackBar]);

  const handleSubmit = (values) => {
    const payload = { ...values };
    dispatch(updateAssessment(payload));
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
                  initialValues={store?.assessmentItem}
                  enableReinitialize={store?.assessmentItem}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, setFieldValue }) => (
                    <Form>
                      <Row>
                        <Col md={6}>
                          <FormGroup id="formGridCompanyName">
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
                          <FormGroup id="formGridContactNumber">
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

                        <Col md={12}>
                          <p>
                            <a
                              target="_blank"
                              rel="noreferrer"
                              className="text-white"
                              href={`${url}/assessment-form/${id}`}
                            >
                              {`${url}/assessment-form/${id}`}
                            </a>
                            {" "}
                            <CopyToClipboard
                              text={`${url}/assessment-form/${id}`}
                              onCopy={() => setCopiedUrl(true)}
                            >
                              {copiedUrl ? (
                                <TbCheckbox size={25} className="cursor-pointer" />
                              ) : (
                                <TbCopyright size={25} className="cursor-pointer" />
                              )}
                            </CopyToClipboard>
                          </p>
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
                          // disabled={isSubmitting}
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

export default EditAssessmentForm;
