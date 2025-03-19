// ** React Imports
import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getQuestionListFilter, cleanQuestionMessage } from "views/questions/store";

// ** Reactstrap Imports
import { Col, Row, FormGroup, Label } from "reactstrap";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import classNames from "classnames";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

const AssessmentFormDetail = () => {
  // ** Hooks
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const questionStore = useSelector((state) => state.questions);

  const [questionItems, setQuestionsItems] = useState([]);
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  const handleQuestionsList = useCallback(() => {
    dispatch(getQuestionListFilter({ assessment_id: id }))
  }, [id, dispatch])

  useLayoutEffect(() => {
    handleQuestionsList();
  }, [handleQuestionsList]);

  useEffect(() => {
    if (questionStore?.actionFlag || questionStore?.error) {
      dispatch(cleanQuestionMessage(null))
    }

    if (questionStore.actionFlag === "QUESTION_LIST_FILTERED_SUCCESS") {
      setQuestionsItems(() => questionStore?.questionItemsFilterd);
    }

    if (questionStore.error) {
      setShowSnackbar(true);
      setSnakbarMessage(questionStore.error);
    }
  }, [questionStore.actionFlag, questionStore.error, questionStore.questionItemsFilterd, dispatch]);

  useEffect(() => {
    if (showSnackBar) {
      setTimeout(() => {
        setShowSnackbar(false);
      }, 6000)
    }
  }, [showSnackBar])

  const optionsType = ["radio", "checkbox"]

  return (
    <div className="content global-management">
      {!questionStore?.loading ? <SimpleSpinner /> : null}

      <ReactSnackBar Icon={(
        <span><TiMessages size={25} /></span>
      )} Show={showSnackBar}>
        {snakebarMessage}
      </ReactSnackBar>

      <div className="p-0 role-name d-flex justify-content-between mb-3">
        <h3 className="card-title mb-0 mt-0">{""}</h3>
        {/* <h3 className="card-title mb-0 mt-0">Assessment Form Detail</h3> */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/admin/assessment-forms")}
        >
          Back
        </button>
      </div>

      <div className="d-block">
        {questionItems?.length ? (
          questionItems.map((item, index) => (
            <Row key={index} className="log-details mb-4">
              <Col md={12} className={classNames({
                'border-bottom': item?.questions?.length
              })}>
                <FormGroup className="d-flex mb-2">
                  <h4 className="mb-0">{item?.name || ""}</h4>
                </FormGroup>
              </Col>

              {item.questions?.length ? (
                <Col md={12} className="mt-2">
                  <div className="d-block gobal-input">
                    {item.questions.map((question, qInd) => (
                      <Row key={`${question?._id}-${qInd}`} className="mb-2">
                        <Col xl={10} lg={10} md={8}>
                          <label>{question.question}</label>
                        </Col>

                        <Col xl={2} lg={2} md={4}>
                          <label>{question.option_type}</label>
                        </Col>

                        {question?.options?.length && optionsType.includes(question.option_type) ? (
                          <Col xl={12} lg={12} md={12} className="full-width">
                            {question.option_type === "checkbox" ? (
                              <div className="row m-0">
                                {question.options.map((option, optInd) => (
                                  <div key={`${option.value}-${optInd}`} className="d-flex align-items-center checkbox-container mr-3 mb-2">
                                    <label className="checkbox-box text-center">
                                      <input
                                        disabled
                                        type="checkbox"
                                        id={`${option.value}-${optInd}`}
                                        name={`${option.value}-${optInd}`}
                                        className="pointer mr-1 align-middle"
                                      />
                                      <span className="checkmark" for={`${option.value}-${optInd}`}></span>
                                    </label>

                                    <Label
                                      htmlFor={`${option.value}-${optInd}`}
                                      className="form-check-label user-select-none pointer mb-0 ml-2"
                                    >
                                      {option?.value || ""}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            ) : question.option_type === "radio" ? (
                              <div className="radio-container d-flex">
                                {question.options.map((option, optInd) => (
                                  <div key={`${option.value}-${optInd}`} className="form-check">
                                    <input
                                      disabled
                                      type="radio"
                                      className="mx-2"
                                      value={option.value}
                                      aria-label={option.value}
                                      id={`${option.value}-${optInd}`}
                                      name={`${question?._id}-${qInd}`}
                                    />
                                    <label htmlFor={`${option.value}-${optInd}`} className="form-check-label">
                                      {option.value}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </Col>
                        ) : null}
                      </Row>
                    ))}
                  </div>
                </Col>
              ) : null}
            </Row>
          ))
        ) : null}
      </div>
    </div>
  )
}

export default AssessmentFormDetail;
