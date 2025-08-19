// ** React Imports
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { createQuestion, cleanQuestionMessage } from "./store";
import { getSectionList, cleanSectionMessage } from "../section/store";

// ** Reactstrap Imports
import { Card, CardBody, FormGroup, Label, FormFeedback } from "reactstrap";
import { Row, Col, Form as BootstrapForm } from "react-bootstrap";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";

import Select from "react-select";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constants
import { questionTypeOptions, initQuestion } from "utility/reduxConstant";

// ** SVG Icons
import deleteIcon from "assets/img/delete.svg";

const AddQuestion = () => {
  // ** Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Create a URLSearchParams object from the query string
  const queryParams = new URLSearchParams(location.search);
  const parentQuestion = location?.state?.parentQuestionId;

  // Extract parameters from the query string
  const assessmentId = queryParams.get("assessmentId");
  const sectionId = queryParams.get("sectionId");

  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.sections);
  const questionStore = useSelector((state) => state.questions);

  const validationSchema = Yup.object().shape({
    section_id: Yup.object().required("Section is required."),
    question: Yup.string().required("Question is required."),
    option_type: Yup.object().shape({
      value: Yup.string().required("Option type is required.")
    }).required("Option type is required.").nullable(),
    options: Yup.array().when("option_type", {
      is: (optionType) => ["checkbox", "radio"].includes(optionType?.value),
      then: () => Yup.array().of(
        Yup.object().shape({
          // value: Yup.string().required("Value is required"),
          points: Yup.string().required("Points is required.")
        })
      )
    }),
    point: Yup.number().when("option_type", {
      is: (optionType) => ["note", "textarea", "text"].includes(optionType?.value),
      then: () => Yup.number().required("Points is required.")
    })
  });

  // ** States
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");
  const [sectionList, setSectionList] = useState([]);
  const [initQuestionVal, setInitialQuestionVal] = useState(initQuestion);

  useLayoutEffect(() => {
    dispatch(getSectionList());
  }, [dispatch]);

  useEffect(() => {
    if (store.actionFlag) {
      dispatch(cleanSectionMessage(null))
    }

    if (store?.sectionItems && store.actionFlag === "SCTN_LST") {
      let sectionList = [];
      if (store?.sectionItems?.length > 0) {
        sectionList = store?.sectionItems?.map((item) => {
          return {
            value: item?._id,
            label: item?.name
          }
        })
      }

      setSectionList(sectionList);
    }
  }, [store.sectionItems, store.actionFlag, dispatch]);

  useEffect(() => {
    if (sectionId) {
      const section = sectionList?.find((item) => item?.value === sectionId);
      if (section) {
        setInitialQuestionVal({
          ...initQuestionVal,
          section_id: { label: section?.label, value: section?.value },
        });
      }
    }
    // eslint-disable-next-line
  }, [sectionId, sectionList]);

  useEffect(() => {
    if (questionStore.actionFlag || questionStore.success || questionStore.error) {
      dispatch(cleanQuestionMessage(null))
    }

    if (questionStore.actionFlag === "QESTN_CRTD_SCS") {
      setTimeout(() => {
        if (assessmentId) {
          navigate(`/admin/assessment-forms/edit/${assessmentId}?active_tab=2`);
        } else {
          navigate("/admin/questions");
        }
      }, 2000);
    }

    if (questionStore?.success) {
      setshowSnackbar(true);
      setSnakbarMessage(questionStore.success);
    }

    if (questionStore?.error) {
      setshowSnackbar(true);
      setSnakbarMessage(questionStore.error);
    }
  }, [questionStore.success, questionStore.error, questionStore.actionFlag, assessmentId, navigate, dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  const onSubmit = (values) => {
    const payload = { ...values };
    payload?.status ? (payload.status = 1) : (payload.status = 0);
    payload.option_type = payload.option_type?.value || payload.option_type;
    payload.section_id = payload.section_id?.value || payload.section_id;
    assessmentId ? (payload.assessment_id = assessmentId) : (payload.assessment_id = null);
    parentQuestion ? (payload.parent_question_id = parentQuestion) : (payload.parent_question_id = null);

    dispatch(createQuestion(payload))
  }

  const handleChangeOptionType = (values, setFieldValue) => {
    let optionValues = [{ value: "", points: "" }];
    if (["note", "textarea", "text"].includes(values?.option_type?.value)) {
      setFieldValue("options", optionValues);
    }
  }

  const goBack = () => {
    if (assessmentId) {
      navigate(`/admin/assessment-forms/edit/${assessmentId}?active_tab=2`)
    } else {
      navigate("/admin/questions")
    }
  }

  return (<>
    <div className="content">
      {!questionStore?.loading ? (<SimpleSpinner />) : null}

      <ReactSnackBar Icon={(
        <span><TiMessages size={25} /></span>
      )} Show={showSnackBar}>
        {snakebarMessage}
      </ReactSnackBar>

      <Row>
        <Col>
          <Card>
            <CardBody className="pl-0 pr-0">
              <Formik
                initialValues={initQuestionVal}
                enableReinitialize={initQuestionVal}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
                  <Form>
                    <Row className="mb-2">
                      <Col xl={12} lg={6} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                        <BootstrapForm.Label className="col-label">Section</BootstrapForm.Label>
                        {sectionList && (
                          <Select
                            name="section_id"
                            options={sectionList}
                            value={values.section_id}
                            classNamePrefix="react-select"
                            placeholder="Select Section..."
                            className="react-select col-select w-100"
                            openMenuOnClick={sectionId ? false : true}
                            onBlur={() => setFieldTouched("section_id", true)}
                            onChange={(secVal) => setFieldValue("section_id", secVal)}
                          />
                        )}
                        {errors.section_id && touched.section_id && (
                          <FormFeedback className="d-block">{errors?.section_id}</FormFeedback>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col xl={12} lg={6} as={BootstrapForm.Group} controlId="formGridContactNumber" className="full-width">
                        <BootstrapForm.Label className="col-label">Question</BootstrapForm.Label>
                        <Field
                          as="textarea"
                          name="question"
                          className="col-input w-100"
                        />
                        {errors.question && touched.question && (
                          <FormFeedback className="d-block">{errors?.question}</FormFeedback>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col xl={12} lg={6} as={BootstrapForm.Group} controlId="formGridContactNumber" className="full-width">
                        <BootstrapForm.Label className="col-label">Description</BootstrapForm.Label>
                        <Field
                          as="textarea"
                          name="description"
                          className="col-input w-100"
                        />
                        {errors.description && touched.description && (
                          <FormFeedback className="d-block">{errors?.description}</FormFeedback>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col xl={12} lg={6} as={BootstrapForm.Group} controlId="formGridRole" className="full-width">
                        <BootstrapForm.Label className="col-label">Option Type</BootstrapForm.Label>
                        <Select
                          name="option_type"
                          value={values?.option_type}
                          options={questionTypeOptions}
                          placeholder="Select Section..."
                          classNamePrefix="react-select"
                          className="react-select col-select w-100"
                          onChange={(question) => {
                            setFieldValue("option_type", question);
                            handleChangeOptionType(values, setFieldValue);
                          }}
                        />
                        {errors.option_type && touched.option_type && (
                          <FormFeedback className="d-block">{errors?.option_type}</FormFeedback>
                        )}
                      </Col>
                    </Row>

                    {["note", "textarea", "text"]?.includes(values?.option_type?.value) ? (
                      <Row className="mb-2">
                        <Col
                          xl={12} lg={6} as={BootstrapForm.Group} controlId="formGridRole" className="full-width">
                          <BootstrapForm.Label className="col-label">Point</BootstrapForm.Label>
                          <Field
                            name="point"
                            type="number"
                            className="col-input w-100"
                            placeholder="Enter Points"
                          />
                          {errors.point && touched.point && (
                            <FormFeedback className="d-block">{errors?.point}</FormFeedback>
                          )}
                        </Col>
                      </Row>
                    ) : null}

                    {!["note", "textarea", "text", 'date'].includes(values?.option_type?.value) ? (
                      <div className="d-block">
                        <BootstrapForm.Label className="col-label">Options</BootstrapForm.Label>
                        <FieldArray name="options">
                          {({ remove, push }) => (
                            <div className="mb-3">
                              {values.options.map((option, index) => (
                                <Row key={index} className="mb-2">
                                  <Col md={5} className="mb-2 mb-md-0">
                                    <Field
                                      type="text"
                                      placeholder="Option Value"
                                      className="col-input w-100"
                                      name={`options.${index}.value`}
                                    />
                                    {touched?.options && errors?.options && errors?.options[index]?.value && touched?.options[index]?.value && (
                                      <FormFeedback className="d-block">{errors.options[index]?.value}</FormFeedback>
                                    )}
                                  </Col>

                                  <Col md={5} className="mb-2 mb-md-0">
                                    <Field
                                      name={`options.${index}.points`}
                                      type="number"
                                      className="col-input w-100"
                                      placeholder="Points"
                                    />
                                    {touched?.options && errors?.options && errors?.options[index]?.points && touched?.options[index]?.points && (
                                      <FormFeedback className="d-block">{errors.options[index]?.points}</FormFeedback>
                                    )}
                                  </Col>

                                  {!["note", "textarea", "text"].includes(values?.option_type?.value) && values.options?.length > 1 ? (
                                    <Col md={2}>
                                      <img
                                        height={19}
                                        alt="Delete"
                                        title="Delete"
                                        cursor="pointer"
                                        src={deleteIcon}
                                        onClick={() => remove(index)}
                                        className="mt-3"
                                      />
                                    </Col>
                                  ) : null}
                                </Row>
                              ))}

                              <div className="buttons">
                                <button
                                  type="button"
                                  className="btnprimary"
                                  onClick={() => push({ value: "", points: "" })}
                                >
                                  Add Option
                                </button>
                              </div>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    ) : null}

                    <Row className="mb-2">
                      <Col md={6} className="d-none">
                        <FormGroup controlId="formGridContactNumber">
                          <label>Order Number</label>
                          <Field
                            type="number"
                            name="order"
                            className="form-control"
                          />
                          {errors.order && touched.order && (
                            <FormFeedback className="d-block">{errors?.order}</FormFeedback>
                          )}
                        </FormGroup>
                      </Col>

                      {!["note", "textarea", "text"].includes(values?.option_type?.value) ? (
                        <Col md={3} className="mb-2 mb-md-0">
                          <BootstrapForm.Label className="col-label">Is Mandatory ?</BootstrapForm.Label>
                          <div className="d-flex align-items-center checkbox-container">
                            <label className="checkbox-box text-center">
                              <input
                                type="checkbox"
                                id="is_mandatory"
                                name="is_mandatory"
                                className="pointer mr-1 align-middle"
                                checked={values?.is_mandatory}
                                onChange={(event) => setFieldValue(event?.target?.name, event?.target?.checked)}
                              />
                              <span className="checkmark" for="is_mandatory"></span>
                            </label>

                            <Label for="is_mandatory" className="form-check-label user-select-none pointer mb-0 ml-2">Yes</Label>
                          </div>
                        </Col>
                      ) : null}

                      <Col xl={4} lg={6} as={BootstrapForm.Group} className="full-width">
                        <BootstrapForm.Label className="col-label">Status</BootstrapForm.Label>
                        <div className="radio-container d-flex">
                          <div className="form-check">
                            <input
                              value={1}
                              id="Active"
                              type="radio"
                              name="status"
                              className="mx-2"
                              aria-label="Active Status"
                              checked={values?.status === 1}
                              onChange={(event) => setFieldValue("status", Number(event.target.value))}
                            />
                            <label htmlFor="Active" className="form-check-label">Active</label>
                          </div>

                          <div className="form-check">
                            <input
                              value={0}
                              type="radio"
                              id="InActive"
                              name="status"
                              className="mx-2"
                              aria-label="Inactive Status"
                              checked={values?.status === 0}
                              onChange={(event) => setFieldValue("status", Number(event.target.value))}
                            />
                            <label htmlFor="InActive" className="form-check-label">InActive</label>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="buttons">
                      <button
                        type="submit"
                        className="btnprimary"
                        disabled={isSubmitting}
                      >
                        Submit
                      </button>

                      <button
                        type="button"
                        className="btnsecondary ml-3"
                        onClick={() => goBack()}
                      >
                        Back
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
  </>)
}

export default AddQuestion;
