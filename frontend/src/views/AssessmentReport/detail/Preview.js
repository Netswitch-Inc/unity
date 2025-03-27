/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import React, { Fragment, useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getAssessmentReportAnswersList } from "views/userAssest/store";

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  Label,
  Button,
  Collapse,
  CardBody
} from "reactstrap";

// ** Third Party Components
import classNames from "classnames";

// ** SVG Icons
import openedIcon from "../../../assets/img/openedPolygon.svg"
import closedIcon from "../../../assets/img/closedPolygon.svg"

const AssessmentReportPreview = () => {
  // ** Hooks
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const assessmentId = queryParams.get("asessmentId");

  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.assessmentReport);

  // ** Const
  const optionsType = ["text", "textarea", "date", "radio", "checkbox"]

  // ** State
  const [selectedAccordion, setSelectedAccordion] = useState();
  const [totalPoints, setTotalPoints] = useState([]);
  const [totalMaxPoints, setTotalMaxPoints] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState("0%");

  const handlePreviewReport = useCallback(() => {
    const query = {
      assessment_id: assessmentId,
      asessment_report_id: id
    }

    dispatch(getAssessmentReportAnswersList(query));
  }, [assessmentId, id, dispatch])

  useEffect(() => {
    handlePreviewReport()
  }, [handlePreviewReport])

  useEffect(() => {
    // Only proceed if score calculation is enabled
    if (store?.asessmentReportAnswers?.assessment_show_score_calculation) {
      // Make a copy of the current totalPoints to avoid direct mutation
      const updatedPoints = [...totalPoints];
      const updatedOverAllSectionScore = [...totalMaxPoints];
      let OverAllPontsTotal = 0;
      let OverAllPoints = 0;
      // Loop through each section
      store?.asessmentReportAnswers?.sections.forEach((section, sectionIndex) => {
        let sectionTotalPoints = 0;
        let overAllSectionScore = 0;
        // Loop through the questions in the section
        section.questions.forEach((question) => {
          if (question.option_type === "radio") {
            // Get the options and the user's selected answer
            const selectedAnswer = question.answerDetails?.value;
            const options = question.options;

            // Find the option with the maximum points (if needed)
            const maxPointsOption = options.reduce(
              (max, current) => {
                return current.points > max.points ? current : max;
              },
              { points: 0 }
            );

            // If the selected answer matches an option, get the points for that option
            const selectedOption = options.find(
              (option) => option?.value === selectedAnswer
            );
            const selectedPoints = selectedOption ? selectedOption.points : 0;

            // Add the selected points to the total for this section
            sectionTotalPoints += selectedPoints;
            overAllSectionScore += maxPointsOption?.points || 0;
            OverAllPoints += maxPointsOption?.points || 0;
            OverAllPontsTotal += selectedPoints;
          }
        });

        // Update the totalPoints array at the specific index of the section
        updatedPoints[sectionIndex] = sectionTotalPoints;
        updatedOverAllSectionScore[sectionIndex] = overAllSectionScore;
      })

      // Set the updated total points for each section
      setTotalPoints(updatedPoints);
      setTotalMaxPoints(updatedOverAllSectionScore);

      setTotalPercentage(`${((OverAllPontsTotal * 100) / OverAllPoints).toFixed(2)}%`);
    }
  }, [store?.asessmentReportAnswers])

  return (
    <div className="global-management">
      <div className="container-fluid">
        <Row>
          <Col xl={12} lg={12} md={12} className="mb-4 p-0">
            <Card className="m-0">
              <div className="role-name d-flex justify-content-between border-bottom mb-3 pb-2">
                <h3 className="card-title mb-0 mt-0 pr-1">{store.asessmentReportAnswers?.assessment_name}</h3>
                <h4 className="card-title mb-0 mt-0 text-right">{store?.asessmentReportAnswers?.assessment_show_score_calculation ? `Overall score: ${totalPercentage}` : null}</h4>
              </div>

              <CardBody className="m-0 p-0 assesment-detail">
                {store.asessmentReportAnswers?.sections?.length ? (
                  store.asessmentReportAnswers?.sections.map((section, sInd) => (
                    section?.questions?.length ? (
                      <div key={`div_${sInd}_${section?.name}`} className={classNames("accrodion-permi mt-2", {
                        "accordion-border-left": selectedAccordion === sInd
                      })}>
                        <Button
                          color="link"
                          className="permission-accordion d-flex align-items-center"
                          onClick={() => {
                            setSelectedAccordion(sInd);
                            if (sInd === selectedAccordion) {
                              setSelectedAccordion();
                            }
                          }}
                          aria-expanded={selectedAccordion === sInd}
                        >
                          <div className="d-flex justify-content-between w-100 pr-4">
                            <span className="pr-2 w-75">{section?.name}</span>

                            {store?.asessmentReportAnswers?.assessment_show_score_calculation ? (
                              <span className="text-white mb-0 w-25 text-right right-percent">
                                {totalMaxPoints[sInd] > 0 ? `${((totalPoints[sInd] * 100) / totalMaxPoints[sInd]).toFixed(2)}%` : "0%"}
                                {`(${totalPoints[sInd]} / ${totalMaxPoints[sInd]})`}
                              </span>
                            ) : null}
                          </div>

                          {selectedAccordion === sInd ? (
                            <span className="check-box-permission"><img alt="Open" src={openedIcon} /></span>
                          ) : (
                            <span className="check-box-permission"><img alt="Close" src={closedIcon} /></span>
                          )}
                        </Button>

                        <Collapse isOpen={selectedAccordion === sInd} className='gobal-input border-top-0'>
                          {section?.questions?.length ? (
                            <Row>
                              {section?.questions?.map((question, qInd) => (
                                <Fragment key={`custom_${question?._id}-${qInd}`}>
                                  <Col xl={10} lg={10} md={8}>
                                    <Label className="col-label w-100">{`Q${qInd + 1}`}: {question.question}</Label>
                                  </Col>

                                  <Col xl={2} lg={2} md={4} className="text-right">
                                    <Label className="col-label w-100">{question.option_type}</Label>
                                  </Col>

                                  {optionsType.includes(question.option_type) ? (
                                    <Col xl={12} lg={12} md={12} className="full-width">
                                      {question?.options?.length && question.option_type === "checkbox" ? (
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
                                                  checked={question.value?.split(",")?.includes(option.value)}
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
                                      ) : question?.options?.length && question.option_type === "radio" ? (
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
                                                checked={option.value === question.value}
                                              />
                                              <label htmlFor={`${option.value}-${optInd}`} className="form-check-label">
                                                {option.value}
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="mb-0 text-white">
                                          Ans: {question?.value || ""}
                                        </p>
                                      )}
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

export default AssessmentReportPreview;
