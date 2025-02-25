import React, { useEffect, useState, useLayoutEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { updateQuestion, editQuestionRequest } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Card, CardBody, FormGroup } from "reactstrap";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages, TiArrowLeft, TiTrash } from "react-icons/ti";
import { getSectionList } from "views/section/store";
import { questionTypeOptions, initialQuestion } from "utility/reduxConstant";
import * as Yup from "yup";
import Select from "react-select";

const EditQuestion = () => {
  const { id } = useParams();
  const location = useLocation();

  // Create a URLSearchParams object from the query string
  const queryParams = new URLSearchParams(location.search);

  // Extract parameters from the query string
  const assessmentId = queryParams.get("assessmentId");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state.questions);
  const sectionStore = useSelector((state) => state.sections);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  const [sectionList, setSectionList] = useState([]);
  const [initialState, setInitialState] = useState(initialQuestion);

  const validationSchema = Yup.object().shape({
    section_id: Yup.object().required("Section is required"),
    question: Yup.string().required("Question is required"),
    description: Yup.string(),
    option_type: Yup.object()
      .shape({
        value: Yup.string().required("Option type is required"),
      })
      .required("Option type is required!")
      .nullable(),
    // order: Yup.number().required("Order number is required"),
    options: Yup.array().when("option_type", {
      is: (optionType) => ["checkbox", "radio"].includes(optionType?.value),
      then: () =>
        Yup.array().of(
          Yup.object().shape({
            value: Yup.string().required("Value is required"),
            points: Yup.string().required("Points is required"),
          })
        ),
    }),
    point: Yup.number().when("option_type", {
      is: (optionType) =>
        ["note", "textarea", "text"].includes(optionType?.value),
      then: () => Yup.number().required("Points is required"),
    }),
  });

  useLayoutEffect(() => {
    dispatch(getSectionList());
  }, [dispatch]);

  const getQuestionTypeOption = (typeValue) => {
    return (
      questionTypeOptions.find((option) => option.value === typeValue) || {
        label: "",
        value: "",
      }
    );
  };

  useEffect(() => {
    if (
      sectionStore?.sectionItems &&
      sectionStore.actionFlag === "SECTION_LISTING"
    ) {
      if (sectionStore?.sectionItems?.length > 0) {
        let sectionList = [];
        sectionList = sectionStore?.sectionItems?.map((item) => {
          return {
            value: item?._id,
            label: item?.name,
          };
        });
        setSectionList(sectionList);
      }
    }
  }, [sectionStore?.sectionItems, sectionStore.actionFlag]);

  const handleChangeOptionType = (values, setFieldValue) => {
    let optionValues = [{ value: "", points: "" }];
    if (["note", "textarea", "text"].includes(values?.option_type?.value)) {
      setFieldValue("options", optionValues);
    }
  };

  useEffect(() => {
    const query = { id: id };
    dispatch(editQuestionRequest(query));
  }, [dispatch, id]);

  useEffect(() => {
    if (store.actionFlag === "QUESTION_UPDATED_SUCCESS" && store.success) {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
    }
    if (store.actionFlag === "QUESTION_UPDATED_SUCCESS" && store.error) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
    if (store.actionFlag === "GET_QUESTION_DATA_SUCCESS") {
      const transformedQuestionItem = {
        ...store?.questionItem,
        section_id: {
          label: store?.questionItem?.section_id?.name || "", // Fallback to empty string if undefined
          value: store?.questionItem?.section_id?._id || "", // Fallback to empty string if undefined
        },
        option_type: getQuestionTypeOption(store?.questionItem?.option_type),
      };
      setInitialState(() => transformedQuestionItem);
    }
  }, [store.success, store.error, store.actionFlag, store?.questionItem]);

  useEffect(() => {
    if (store.actionFlag === "QUESTION_UPDATED_SUCCESS" && showSnackBar) {
      setTimeout(() => {
        setshowSnackbar(false);
        setSnakbarMessage("");
        if (assessmentId) {
          navigate(`/admin/assessment-forms/${assessmentId}?active_tab=2`);
        } else {
          navigate("/admin/questions");
        }
      }, 3000);
    }
  }, [showSnackBar, navigate, store.actionFlag, assessmentId]);

  const onSubmit = (values) => {
    const payload = { ...values };
    // payload?.status ? payload.status = 1 : payload.status = 0
    payload.option_type = payload.option_type?.value || payload.option_type;
    payload.section_id = payload.section_id?.value || payload.section_id;

    dispatch(updateQuestion(payload));
  };

  const goBack = () => {
    if (assessmentId) {
      navigate(`/admin/assessment-forms/${assessmentId}?active_tab=2`);
    } else {
      navigate("/admin/questions");
    }
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
              <div className="p-0 border-bottom pb-2 card-header row justify-content-between align-items-center m-0 mb-2">
                <h3 className="card-title mb-0 mt-0">Edit Question</h3>
                <button
                  type="button"
                  className="btn btn-primary mt-0"
                  onClick={() => goBack()}
                >
                  Back
                  <TiArrowLeft size={25} title="Back" className="ml-2" />
                </button>
              </div>

              <CardBody className="pl-0 pr-0">
                <Formik
                  initialValues={initialState}
                  enableReinitialize={initialState}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ setFieldValue, values, isSubmitting }) => (
                    <Form>
                      <Row className="mb-2">
                        <Col
                          as={FormGroup}
                          controlId="formGridRole"
                          className="mb-0"
                        >
                          <label>Section</label>
                          {sectionList && (
                            <Select
                              name="section_id"
                              className="react-select info"
                              classNamePrefix="react-select"
                              placeholder="Select Section..."
                              options={sectionList}
                              value={values?.section_id}
                              onChange={(secVal) => {
                                setFieldValue("section_id", secVal);
                              }}
                            />
                          )}
                          <ErrorMessage
                            name="section_id"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </Col>
                      </Row>

                      <Row className="mb-2">
                        <Col md={12}>
                          <FormGroup
                            controlId="formGridContactNumber"
                            className="mb-0"
                          >
                            <label>Question</label>
                            <Field
                              as="textarea"
                              name="question"
                              className="form-control mb-0"
                              rows="3"
                            />
                            <ErrorMessage
                              name="question"
                              component="div"
                              style={{ color: "red" }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="mb-2">
                        <Col md={12}>
                          <FormGroup
                            controlId="formGridContactNumber"
                            className="mb-0"
                          >
                            <label>Description</label>
                            <Field
                              as="textarea"
                              name="description"
                              className="form-control mb-0"
                              rows="3"
                            />
                            <ErrorMessage
                              name="description"
                              component="div"
                              style={{ color: "red" }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="mb-2">
                        <Col
                          as={FormGroup}
                          controlId="formGridRole"
                          className="mb-0"
                        >
                          <label>Option Type</label>
                          <Select
                            name="option_type"
                            className="react-select info"
                            classNamePrefix="react-select"
                            placeholder="Select Section..."
                            options={questionTypeOptions}
                            value={values?.option_type}
                            onChange={(question) => {
                              setFieldValue("option_type", question);
                              handleChangeOptionType(values, setFieldValue);
                            }}
                          />
                          <ErrorMessage
                            name="option_type"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </Col>
                      </Row>
                      {["note", "textarea", "text"]?.includes(
                        values?.option_type?.value
                      ) && (
                        <Row className="mb-2">
                          <Col as={FormGroup} controlId="formGridRole">
                            <label>Point</label>
                            <Field
                              name={`point`}
                              type="number"
                              className="form-control mb-0"
                              placeholder="Enter Points"
                            />
                            <ErrorMessage
                              name={`point`}
                              component="div"
                              style={{ color: "red" }}
                            />
                          </Col>
                        </Row>
                      )}
                      {!["note", "textarea", "text"].includes(
                        values?.option_type?.value
                      ) && <label>Options</label>}
                      {!["note", "textarea", "text"].includes(
                        values?.option_type?.value
                      ) && (
                        <FieldArray name="options">
                          {({ remove, push }) => (
                            <div>
                              {values.options.map((option, index) => (
                                <Row key={index} className="mb-2">
                                  <Col md={5} className="mb-2 mb-md-0">
                                    <Field
                                      name={`options.${index}.value`}
                                      type="text"
                                      className="form-control"
                                      placeholder="Option Value"
                                    />
                                    <ErrorMessage
                                      name={`options.${index}.value`}
                                      component="div"
                                      style={{ color: "red" }}
                                    />
                                  </Col>
                                  <Col md={5} className="mb-2 mb-md-0">
                                    <Field
                                      name={`options.${index}.points`}
                                      type="number"
                                      className="form-control"
                                      placeholder="Points"
                                    />
                                    <ErrorMessage
                                      name={`options.${index}.points`}
                                      component="div"
                                      style={{ color: "red" }}
                                    />
                                  </Col>
                                  {!["note", "textarea", "text"].includes(
                                    values?.option_type?.value
                                  ) &&
                                    values.options?.length > 1 && (
                                      <Col md={2}>
                                        <TiTrash
                                          size={20}
                                          color="#fff"
                                          cursor="pointer"
                                          onClick={() => remove(index)}
                                          className="mt-3"
                                        />
                                      </Col>
                                    )}
                                </Row>
                              ))}
                              <button
                                type="button"
                                className="btn btn-primary mb-2"
                                onClick={() => push({ value: "", points: "" })}
                              >
                                Add Option
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      )}

                      <Row className="mb-2">
                        <Col md={6} className="d-none">
                          <FormGroup
                            controlId="formGridContactNumber"
                            className="mb-0"
                          >
                            <label>Order Number</label>
                            <Field
                              type="number"
                              name="order"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="order"
                              component="div"
                              style={{ color: "red" }}
                            />
                          </FormGroup>
                        </Col>
                        {!["note", "textarea", "text"].includes(
                          values?.option_type?.value
                        ) && (
                          <Col md={3} className="mb-2 mb-md-0">
                            <label>Is Mandatory ?</label>
                            <div className="is-active-container col">
                              <div className="is-active-checked form-check">
                                <input
                                  type="checkbox"
                                  name="is_mandatory"
                                  className="is-active-checked form-check-input mt-0"
                                  checked={values?.is_mandatory}
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
                        )}

                        <Col md={3}>
                          <label>Status</label>
                          <div className="status-container d-flex row-cols-2">
                            <div className="form-check">
                              <input
                                type="radio"
                                name="status" // Ensure the name is the same for both radio buttons
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
                                htmlFor="Active" // Ensure htmlFor matches the id
                                className="form-check-label"
                              >
                                Active
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                type="radio"
                                name="status" // Ensure the name is the same for both radio buttons
                                value={0}
                                checked={values?.status === 0}
                                id="InActive"
                                onChange={(event) =>
                                  setFieldValue(
                                    "status",
                                    Number(event.target.value)
                                  )
                                }
                                aria-label="Inactive Status" // Corrected aria-label
                              />
                              <label
                                htmlFor="InActive" // Ensure htmlFor matches the id
                                className="form-check-label"
                              >
                                InActive
                              </label>
                            </div>
                          </div>
                        </Col>
                      </Row>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        Submit
                      </button>
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

export default EditQuestion;
