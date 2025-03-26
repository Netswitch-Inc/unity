// ** React Imports
import React, { Fragment, useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getQuestionListFilter, cleanQuestionMessage } from "views/questions/store";

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  Label,
  Button,
  CardBody,
  Collapse
} from "reactstrap";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import classNames from "classnames";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** SVG Icons
import openedIcon from "../../../assets/img/openedPolygon.svg"
import closedIcon from "../../../assets/img/closedPolygon.svg"

const AssessmentFormDetail = () => {
  // ** Hooks
  const { id } = useParams();
  const navigate = useNavigate();

  // ** Store Vars
  const dispatch = useDispatch();
  const questionStore = useSelector((state) => state.questions);

  // ** Const
  const optionsType = ["radio", "checkbox"]

  // ** State
  const [selectedAccordion, setSelectedAccordion] = useState();
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

    if (questionStore.actionFlag === "QESTN_LST_FLTRD_SCS") {
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

  return (
    <div className="content global-management">
      <div className="container-fluid">
        {!questionStore?.loading ? <SimpleSpinner /> : null}

        <ReactSnackBar Icon={(
          <span><TiMessages size={25} /></span>
        )} Show={showSnackBar}>
          {snakebarMessage}
        </ReactSnackBar>

        <Row>
          <Col xl={12} lg={12} md={12} className="mb-4">
            <div className="p-0 role-name d-flex justify-content-between mb-3">
              <h3 className="card-title mb-0 mt-0">{""}</h3>
              {/* <h3 className="card-title mb-0 mt-0">Assessment Form Detail</h3> */}
              <div className="buttons black-btn">
              <button
                type="button"
                className="btnprimary"
                onClick={() => navigate("/admin/assessment-forms")}
              >
                Back
              </button>
              </div>
            </div>

            <Card className="m-0">
              <CardBody className="m-0 p-0 assesment-detail">
                {questionItems?.length ? (
                  questionItems.map((item, index) => (
                    item.questions?.length ? (
                      <div key={`div_${index}_${item?.name}`} className={classNames("accrodion-permi mt-2", {
                        "accordion-border-left": selectedAccordion === index
                      })}>
                        <Button
                          color="link"
                          className="permission-accordion d-flex align-items-center"
                          onClick={() => {
                            setSelectedAccordion(index);
                            if (index === selectedAccordion) {
                              setSelectedAccordion();
                            }
                          }}
                          aria-expanded={selectedAccordion === index}
                        >
                          {selectedAccordion === index ? (
                            <span className="check-box-permission"><img alt="Open" src={openedIcon} /></span>
                          ) : (
                            <span className="check-box-permission"><img alt="Close" src={closedIcon} /></span>
                          )} <span>{item?.name} </span>
                        </Button>

                        <Collapse isOpen={selectedAccordion === index} className='gobal-input border-top-0'>
                          {item?.questions?.length ? (
                            <Row>
                              {item.questions.map((question, qInd) => (
                                <Fragment key={`custom_${question?._id}-${qInd}`}>
                                  <Col xl={10} lg={10} md={8}>
                                    <Label className="col-label w-100">{`Q${qInd + 1}`}: {question.question}</Label>
                                  </Col>

                                  <Col xl={2} lg={2} md={4} className="text-right">
                                    <Label className="col-label w-100">{question.option_type}</Label>
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
                                </Fragment>
                              ))}
                            </Row>
                          ) : null}
                        </Collapse>
                      </div>
                    ) : null
                  ))
                ) : null}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default AssessmentFormDetail;
