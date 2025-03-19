/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import React, { useEffect, useCallback, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getAssessmentReportAnswersList } from "views/userAssest/store";

// ** Reactstrap Imports
import {
  Card,
  Button,
  Collapse,
  CardBody,
  CardTitle,
  CardHeader
} from "reactstrap";

const AssessmentReportPreview = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.assessmentReport);
  const { id } = useParams();

  const queryParams = new URLSearchParams(location.search);
  const assessmentId = queryParams.get("asessmentId");
  const [selectedAccordion, setSelectedAccordion] = useState();
  const [totalPoints, setTotalPoints] = useState([]);
  const [totalMaxPoints, setTotalMaxPoints] = useState([]);
  const [totalPercentage, setTotalPercentage] = useState("0%");

  const handlePreviewReport = useCallback(() => {
    const query = {
      assessment_id: assessmentId,
      asessment_report_id: id,
    };
    dispatch(getAssessmentReportAnswersList(query));
  }, [assessmentId, id, dispatch]);

  useEffect(() => {
    handlePreviewReport();
  }, [handlePreviewReport]);

  useEffect(() => {
    // Only proceed if score calculation is enabled
    if (store?.asessmentReportAnswers?.assessment_show_score_calculation) {
      // Make a copy of the current totalPoints to avoid direct mutation
      const updatedPoints = [...totalPoints];
      const updatedOverAllSectionScore = [...totalMaxPoints];
      let OverAllPontsTotal = 0;
      let OverAllPoints = 0;
      // Loop through each section
      store?.asessmentReportAnswers?.sections.forEach(
        (section, sectionIndex) => {
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
        }
      );

      // Set the updated total points for each section
      setTotalPoints(updatedPoints);
      setTotalMaxPoints(updatedOverAllSectionScore);

      setTotalPercentage(
        `${((OverAllPontsTotal * 100) / OverAllPoints).toFixed(2)}%`
      );
    }
  }, [store?.asessmentReportAnswers]);
  console.log(store, totalMaxPoints, totalPoints, "total");

  return (
    <div className="content data-list global-management">
      <Card>
        <CardHeader className="d-flex justify-content-between p-0 border-bottom">
          <CardTitle tag="h3">
            {store.asessmentReportAnswers?.assessment_name}
          </CardTitle>
          <CardTitle tag="h3">
            {store?.asessmentReportAnswers?.assessment_show_score_calculation &&
              `Overall score
:${totalPercentage}`}
          </CardTitle>
        </CardHeader>
        <CardBody className="pl-0 pr-0 mt-2">
          {store.asessmentReportAnswers?.sections?.length > 0 &&
            store.asessmentReportAnswers?.sections.map(
              (section, sectionIndex) => (
                <div
                  className="accrodion-permi mt-2"
                  key={`div_${sectionIndex}`}
                >
                  <Button
                    color="link"
                    className="permission-accordion d-flex align-items-center justify-content-between"
                    onClick={() => {
                      setSelectedAccordion(sectionIndex);
                      if (sectionIndex === selectedAccordion) {
                        setSelectedAccordion();
                      }
                    }}
                    aria-expanded={selectedAccordion === sectionIndex}
                  >
                    <div className="d-flex">
                      {selectedAccordion === sectionIndex ? (
                        <span className="check-box-permission">
                          <p className="mb-0">-</p>
                        </span>
                      ) : (
                        <span className="check-box-permission">
                          <p className="mb-0">+</p>
                        </span>
                      )}{" "}
                      <span>{section?.name} </span>
                    </div>
                    {store?.asessmentReportAnswers
                      ?.assessment_show_score_calculation && (
                      <span>
                        {" "}
                        {totalMaxPoints[sectionIndex] > 0
                          ? `${(
                              (totalPoints[sectionIndex] * 100) /
                              totalMaxPoints[sectionIndex]
                            ).toFixed(2)}%`
                          : "0%"}
                        {`(${totalPoints[sectionIndex]} / ${totalMaxPoints[sectionIndex]})`}
                      </span>
                    )}
                  </Button>
                  <Collapse
                    isOpen={selectedAccordion === sectionIndex}
                    className="gobal-input border-top-0"
                  >
                    <div key={sectionIndex} className="section mt-4">
                      {/* <h3>{section?.name}</h3> */}

                      {section?.questions?.length > 0 &&
                        section?.questions?.map((item, questionIndex) => (
                          <div key={questionIndex} className="question">
                            <p className="my-3">
                              <strong>
                                {`Q${questionIndex + 1}- ${item?.question}`}
                              </strong>
                            </p>
                            {item?.option_type === "checkbox" ||
                            item?.option_type === "radio" ? (
                              item?.option_type &&
                              item?.options && (
                                <Card className="border rounded p-3 mb-2">
                                  {/* <div className="options">
                                    {item?.options.map(
                                      (option, optionIndex) => (
                                        <div key={optionIndex}>
                                          <label>
                                            {console.log(item.value === option.value, 'item.value === option.value')}
                                            {item?.option_type === "radio" ? (
                                              <input
                                                type={item?.option_type}
                                                className="mx-2"
                                                name={`question-${optionIndex}`}
                                                value={option.value}
                                                checked={
                                                  item.value === option.value
                                                }
                                                readOnly
                                              />
                                            ) : (
                                              <input
                                                type={item?.option_type}
                                                className="mx-2"
                                                name={`question-${optionIndex}`}
                                                value={option?.value}
                                                checked={item?.value
                                                  ?.split(",")
                                                  ?.includes(option?.value)}
                                                readOnly
                                              />
                                            )}
                                            {option?.value}
                                          </label>
                                        </div>
                                      )
                                    )}
                                  </div> */}
                                  <div className="options">
                                    {item?.options.map(
                                      (option, optionIndex) => (
                                        <div key={optionIndex}>
                                          <label>
                                            {console.log(
                                              item.value === option.value,
                                              "item.value === option.value"
                                            )}

                                            {/* Radio button logic */}
                                            {item?.option_type === "radio" ? (
                                              <input
                                                type="radio"
                                                className="mx-2"
                                                // name={`question-${questionIndex}`}
                                                value={option.value}
                                                checked={
                                                  option.value === item.value
                                                } // Check if the value matches the selected value
                                                id={`question-${questionIndex}-option-${optionIndex}`} // Unique ID for accessibility
                                                readOnly
                                              />
                                            ) : (
                                              // Checkbox logic
                                              <input
                                                type="checkbox"
                                                className="mx-2"
                                                name={`question-${questionIndex}`} // Group checkboxes by question
                                                value={option.value}
                                                checked={item.value
                                                  ?.split(",")
                                                  ?.includes(option.value)} // Check if value is in the list for multi-select
                                                readOnly
                                              />
                                            )}
                                            {option.value}
                                          </label>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </Card>
                              )
                            ) : (
                              <p>
                                <Card className="border rounded p-3 mb-2">
                                  <strong>{item?.value}</strong>
                                </Card>
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </Collapse>
                </div>
              )
            )}
        </CardBody>
      </Card>
    </div>
  );
};
export default AssessmentReportPreview;
