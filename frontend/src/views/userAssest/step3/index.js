/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import React, { useEffect, useState, useLayoutEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getAssessmentReportAnswersList } from "../store";
import { createAnswer, updateAnswer, cleanAnswerMessage } from "../assessment-report-answer-store";

// ** Reactstrap Imports
import { Card } from "reactstrap";
import { Row, Col } from "react-bootstrap";

// ** Custom Components
import AssessmentSidebar from "../sidebar";
import SimpleSpinner from "components/spinner/simple-spinner";
import DynamicInput from "components/AssessmentReportQuestionType/DynamicInput";

const AsessmentReport = () => {
  // ** Hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // ** Store vars
  const dispatch = useDispatch();
  const assessmentReport = useSelector((state) => state.assessmentReport);
  const assessmentReportAnswerList = useSelector((state) => state.questionAnswer)

  // ** Const
  const assessmentReportId = queryParams.get("id");

  const [show, setShow] = useState(true);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [value, setValue] = useState();
  const [error, setError] = useState(false);
  const [childVal, setChildVal] = useState();
  const [childOptions, setChildOptions] = useState([]);

  // const [totalQuestionCount, setTotalQuestionCount] = useState(0);
  const [proggress, setProggress] = useState(0);
  const [perQuestionProggressRate, setPerQuestionProggressRate] = useState(0);

  useLayoutEffect(() => {
    const params = {
      assessment_id: id,
      asessment_report_id: assessmentReportId,
    };
    dispatch(getAssessmentReportAnswersList(params));
    // handleAssemmentReportAnswerList()
  }, [dispatch, assessmentReportId, id]);

  useMemo(() => {
    let currentQuestionCount = 0;
    assessmentReport?.asessmentReportAnswers?.sections &&
      assessmentReport?.asessmentReportAnswers?.sections.map((section) => {
        // section.questions.map((item) => {
        currentQuestionCount += section?.questions.length;
        // });
        return currentQuestionCount;
      });
    const perQuestionProgressRate = Math.ceil(100 / currentQuestionCount);
    // setTotalQuestionCount(currentQuestionCount);
    setPerQuestionProggressRate(Math.ceil(perQuestionProgressRate));
  }, [assessmentReport.asessmentReportAnswers]);

  useEffect(() => {
    if (assessmentReport?.actionFlag === "ASSESSMENT_REPORT_ANSWER_LISTING") {
      if (!assessmentReport?.asessmentReportAnswers?.sections) {
        navigate(`/thank-you/${id}?id=${assessmentReportId}`, {
          state: {
            aseesmentCalculation: assessmentReport?.asessmentReportAnswers,
          },
        });
        return;
      }
    }
  }, [assessmentReport?.actionFlag]);

  useEffect(() => {
    const sections = assessmentReport?.asessmentReportAnswers?.sections;

    if (
      questionIndex !== -1 &&
      sections[sectionIndex]?.questions[questionIndex]?.childQuestions?.length >
      0
    ) {
      const childValues = sections[sectionIndex].questions[
        questionIndex
      ].childQuestions.map(
        (childQuestion) => childQuestion?.answerDetails?.value || null // If answerDetails.value exists, use it, otherwise use null
      );
      setChildVal(() => childValues);
    }
    if (
      questionIndex !== -1 &&
      sections[sectionIndex]?.questions[questionIndex]?.childQuestions?.length >
      0
    ) {
      const childQuestion = sections[sectionIndex].questions[
        questionIndex
      ].childQuestions.find((child) => child.option_type === "checkbox");

      // If a matching child question is found, return its options; otherwise, return an empty array
      setChildOptions(
        () => childQuestion?.answerDetails?.question_data?.options || []
      );
    }
  }, [questionIndex]);

  const handleNextClick = () => {
    const sections = assessmentReport?.asessmentReportAnswers?.sections;

    if (!sections || sections.length === 0) return;

    const currentSection = sections[sectionIndex];
    const questions = currentSection?.questions;

    if (!questions || questions.length === 0) return;

    if (questionIndex < questions.length - 1) {
      if (questions[questionIndex]?.is_mandatory && value?.length === 0) {
        setError(true);
        return;
      }
      setQuestionIndex((prev) => prev + 1);
      setProggress((prev) => prev + perQuestionProggressRate);
      setError(false);
    } else if (sectionIndex < sections.length - 1) {
      if (questions[questionIndex]?.is_mandatory && value?.length === 0) {
        setError(true);
        return;
      }
      setSectionIndex((prev) => prev + 1);
      setQuestionIndex(0);
      setProggress((prev) => prev + perQuestionProggressRate);
      setError(false);
    } else {
      if (questions[questionIndex]?.is_mandatory && value?.length === 0) {
        setError(true);
        return;
      }
      navigate(`/thank-you/${id}?id=${assessmentReportId}`, {
        state: {
          aseesmentCalculation: assessmentReport?.asessmentReportAnswers,
        },
      });
      setError(false);
    }
    const payload = {
      section_id: sections[sectionIndex]?._id,
      question_id: sections[sectionIndex]?.questions[questionIndex]?._id,
      question_data: {
        description:
          sections[sectionIndex]?.questions[questionIndex]?.description,
        question: sections[sectionIndex]?.questions[questionIndex]?.question,
        option_type:
          sections[sectionIndex]?.questions[questionIndex]?.option_type,
        options: sections[sectionIndex]?.questions[questionIndex]?.options,
        is_mandatory:
          sections[sectionIndex]?.questions[questionIndex]?.is_mandatory,
      },
      asessment_report_id: assessmentReportId,
      value: value,
    };
    if (
      sections[sectionIndex]?.questions[questionIndex]?.option_type ===
      "radio" &&
      value
    ) {
      payload.question_data.score = sections[sectionIndex]?.questions[
        questionIndex
      ]?.options?.find((option) => option?.value === value)?.points;
    }
    if (
      !sections[sectionIndex]?.questions[questionIndex]?.answerDetails?._id &&
      questionIndex !== -1
    ) {
      if (
        sections[sectionIndex]?.questions[questionIndex]?.option_type ===
        "checkbox"
      ) {
        payload.value = Array.isArray(value) ? value.join(",") : "";
      }

      dispatch(createAnswer(payload));
      setValue(() => "");
    }
    if (sections[sectionIndex]?.questions[questionIndex]?.answerDetails?._id) {
      payload._id =
        sections[sectionIndex]?.questions[questionIndex]?.answerDetails?._id;
      if (
        sections[sectionIndex]?.questions[questionIndex]?.option_type ===
        "checkbox"
      ) {
        payload.value = Array.isArray(value) ? value.join(",") : "";
      }
      if (
        sections[sectionIndex]?.questions[questionIndex]?.childQuestions
          ?.length > 0
      ) {
        sections[sectionIndex]?.questions[
          questionIndex
        ]?.childQuestions.forEach((child, index) => {
          const childPayload = {
            _id: child?.answerDetails?._id,
            section_id: sections[sectionIndex]?._id,
            question_id: child?._id,
            question_data: {
              description: child?.description,
              question: child?.question,
              option_type: child?.option_type,
              is_mandatory: child?.is_mandatory,
              options:
                child?.option_type === "checkbox" &&
                  child?.options[0]?.value === ""
                  ? childOptions.map((option, index) => ({
                    value: option.value,
                    points: child?.options[index]?.points || 0, // Ensure points are provided or fallback to 0
                  }))
                  : child?.options,
            },
            asessment_report_id: assessmentReportId,
            value: childVal[index],
            parent_question_id:
              sections[sectionIndex]?.questions[questionIndex]?._id,
          };
          if (child?.answerDetails?._id) {
            dispatch(updateAnswer(childPayload));
          } else {
            dispatch(createAnswer(childPayload));
          }
        });
      }
      dispatch(updateAnswer(payload));
      setValue(() => "");
    }
  };

  const handlePreviousClick = () => {
    if (error) {
      setError((prev) => !prev);
    }
    const sections = assessmentReport?.asessmentReportAnswers?.sections;
    if (!sections || sections.length === 0) return;
    const currentSection = sections[sectionIndex];
    const questions = currentSection?.questions;

    if (!questions || questions.length === 0) return;
    if (questionIndex > 0) {
      // Move to the previous question in the current section
      setQuestionIndex((prev) => prev - 1);
      setProggress((prev) => prev - perQuestionProggressRate);
    } else if (sectionIndex > 0) {
      // if (sections[sectionIndex - 1]?.questions?.length === 0) {
      //   setSectionIndex((prev) => prev - 1);
      // }
      setSectionIndex((prev) => prev - 1);
      setQuestionIndex(sections[sectionIndex - 1].questions.length - 1);
      setProggress((prev) => prev - perQuestionProggressRate);
    } else {
      setProggress(0);
      setQuestionIndex(-1);
      setShow((prev) => !prev);
    }
    if (show) {
      setShow((prev) => !prev);
      navigate(`/assessment-form/${id}?id=${assessmentReportId}`);
    }
  };

  useEffect(() => {
    if (
      assessmentReport?.asessmentReportAnswers?.sections?.length > 0 &&
      assessmentReport?.asessmentReportAnswers?.sections[sectionIndex]
        ?.questions[questionIndex]?.answerDetails?._id
    ) {
      if (
        assessmentReport?.asessmentReportAnswers?.sections[sectionIndex]
          ?.questions[questionIndex]?.option_type === "checkbox"
      ) {
        const answerDetails =
          assessmentReport?.asessmentReportAnswers?.sections[sectionIndex]
            ?.questions[questionIndex]?.answerDetails?.value;
        setValue(() => (answerDetails ? answerDetails.split(",") : []));
      } else {
        setValue(
          () =>
            assessmentReport?.asessmentReportAnswers?.sections[sectionIndex]
              ?.questions[questionIndex]?.answerDetails?.value
        );
      }
    }
  }, [sectionIndex, questionIndex, assessmentReport.asessmentReportAnswers]);

  useEffect(() => {
    if (
      assessmentReportAnswerList?.actionFlag === "ANSR_CRTD_SCS" ||
      assessmentReportAnswerList?.actionFlag === "ANSR_UPDT_SCS"
    ) {
      const params = {
        assessment_id: id,
        asessment_report_id: assessmentReportId,
      };
      dispatch(getAssessmentReportAnswersList(params));
      dispatch(cleanAnswerMessage());
    }
  }, [assessmentReportAnswerList?.actionFlag]);

  return (
    <div className="step-wise-content">

      <Row className="sticky--- m-0">
        <AssessmentSidebar activeStep={3} step1Filled={true} step2Filled={true} />

        <Col className="right-side self-assesement col-md-9">
          <div className="card-header">
            <h3 className="m-0">Self Assessment
              {/* {
                assessmentReport?.asessmentReportAnswers
                  ?.assessment_name
              } */}
            </h3>
          </div>
          <Card className="assesment-card">
            <div className="pl-0 pr-0 assesment-content">
              {!assessmentReportAnswerList?.loading ? <SimpleSpinner /> : null}
              {show && (
                <>
                  <div className="assesment-heading">
                    <h3 className="m-0 ">
                      {
                        assessmentReport?.asessmentReportAnswers
                          ?.assessment_name
                      }
                    </h3>
                  </div>
                  <p className="description">
                    {
                      assessmentReport?.asessmentReportAnswers
                        ?.assessment_description
                    }
                  </p>
                  <ol className="li-section-title">
                    {assessmentReport?.asessmentReportAnswers?.allSections
                      ?.length > 0 &&
                      assessmentReport?.asessmentReportAnswers?.allSections?.map(
                        (section) => {
                          return <li key={section._id}>{section.name}</li>;
                        }
                      )}
                  </ol>
                </>
              )}
              {!show &&
                assessmentReport?.asessmentReportAnswers?.sections?.length >
                0 && (
                  <>
                    {questionIndex !== -1 && (
                      <div className="assesment-heading">
                        <h3 className="m-0">
                          {
                            assessmentReport?.asessmentReportAnswers?.sections[
                              sectionIndex
                            ]?.name
                          }
                        </h3>
                      </div>
                    )}
                    {questionIndex !== -1 && (
                      <p className="description">
                        {
                          assessmentReport?.asessmentReportAnswers?.sections[
                            sectionIndex
                          ]?.description
                        }
                      </p>
                    )}
                    {questionIndex !== -1 && (
                      <div className="section-title">
                        {questionIndex !== -1 && `Q ${questionIndex + 1} -`}
                        {
                          assessmentReport?.asessmentReportAnswers?.sections[
                            sectionIndex
                          ]?.questions[questionIndex]?.question
                        }
                      </div>
                    )}
                    {assessmentReport?.asessmentReportAnswers?.sections[
                      sectionIndex
                    ]?.questions[questionIndex]?.option_type !== "note" && (
                        <DynamicInput
                          type={
                            assessmentReport?.asessmentReportAnswers?.sections[
                              sectionIndex
                            ]?.questions[questionIndex]?.option_type
                          }
                          label={
                            assessmentReport?.asessmentReportAnswers?.sections[
                              sectionIndex
                            ]?.questions[questionIndex]?.question
                          }
                          options={
                            assessmentReport?.asessmentReportAnswers?.sections[
                              sectionIndex
                            ]?.questions[questionIndex]?.options
                          }
                          value={value}
                          onChange={(val) => setValue(val)}
                        />
                      )}
                    {assessmentReport?.asessmentReportAnswers?.sections[
                      sectionIndex
                    ]?.questions[questionIndex]?.childQuestions?.length > 0 &&
                      assessmentReport?.asessmentReportAnswers?.sections[
                        sectionIndex
                      ]?.questions[questionIndex]?.childQuestions.map(
                        (childQuestion, childIndex) => {
                          return (
                            <div key={childQuestion._id} className="mt-1">
                              <p>
                                {`(${assessmentReport?.asessmentReportAnswers?.sections[
                                  sectionIndex
                                ]?.questions[
                                  questionIndex
                                ]?.childQuestions.indexOf(childQuestion) + 1
                                  }) ${childQuestion.question}`}
                              </p>
                              <DynamicInput
                                type={childQuestion.option_type}
                                label={childQuestion.question}
                                options={childQuestion.options}
                                value={childVal ? childVal[childIndex] : ""}
                                onChange={(val) =>
                                  setChildVal((prev) => ({
                                    ...prev,
                                    [childIndex]: val,
                                  }))
                                }
                                onChangeOptions={(val) => setChildOptions(val)}
                                writtenOptions={childOptions}
                              />
                            </div>
                          );
                        }
                      )}

                    {error && value?.length === 0 && (
                      <div className="text-danger">Question Is Required</div>
                    )}
                    <div className="question-description">
                      <p>
                        {
                          assessmentReport?.asessmentReportAnswers?.sections[
                            sectionIndex
                          ]?.questions[questionIndex]?.description
                        }
                      </p>
                    </div>
                  </>
                )}
              {!show && (
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${proggress.toString()}%` }}
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {`${proggress.toString()}%`}
                  </div>
                </div>
              )}
              <div className="w-100">
                <div className="buttons d-flex justify-content-between btn-position">
                  <button
                    type="button"
                    className="btnprimary"
                    onClick={() => handlePreviousClick()}
                    disabled={!assessmentReportAnswerList?.loading}
                  >
                    Previous
                  </button>
                  <button
                    className="btnprimary"
                    onClick={() => {
                      handleNextClick();
                      setShow(() => false);
                    }}
                    disabled={!assessmentReportAnswerList?.loading}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AsessmentReport;
