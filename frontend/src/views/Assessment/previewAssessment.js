import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuestionListFilter,
  cleanQuestionMessage,
} from "views/questions/store";
import { useParams, useNavigate } from "react-router-dom";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

const PreviewAssessment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  //   const sectionStore = useSelector((state) => state.sections);
  const questionStore = useSelector((state) => state.questions);
  const [questionItems, setQuestionsItems] = useState([]);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  const handleQuestionsList = useCallback(() => {
    dispatch(
      getQuestionListFilter({
        assessment_id: id,
      })
    );
  }, [id, dispatch]);

  useLayoutEffect(() => {
    handleQuestionsList();
  }, [handleQuestionsList, dispatch]);

  useEffect(() => {
    if (questionStore.actionFlag === "QUESTION_LIST_FILTERED_SUCCESS") {
      setQuestionsItems(() => questionStore?.questionItemsFilterd);
    }
    if (
      questionStore.actionFlag === "QUESTION_LIST_FILTERED_ERROR" &&
      questionStore.error
    ) {
      setshowSnackbar(true);
      setSnakbarMessage(questionStore.error);
    }
  }, [
    questionStore.actionFlag,
    questionStore.error,
    questionStore?.questionItemsFilterd,
  ]);

  useEffect(() => {
    if (showSnackBar) {
      setTimeout(() => {
        setshowSnackbar(() => false);
        setSnakbarMessage(() => "");
        dispatch(cleanQuestionMessage());
        navigate("/admin/assessment-forms");
      }, 2000);
    }
    // eslint-disable-next-line
  }, [showSnackBar]);

  return (
    <div className="content data-list">
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
      {questionItems?.length > 0 &&
        questionItems.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="font-weight-bold">{item.name}</div>
            <hr />
            {item.questions?.length > 0 && (
              <div className="mt-2">
                <table className="table table-bordered">
                  <tbody>
                    {item.questions.map((question, questionIndex) => (
                      <tr key={question?._id}>
                        <td>
                          <strong>{question.question}</strong>
                        </td>
                        <td>
                          <strong>{question.option_type}</strong>
                        </td>
                        <td>
                          {/* Display different input types based on question.option_type */}
                          {question.option_type === "checkbox" && (
                            <div className="d-flex flex-wrap">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  style={{ marginRight: "10px" }}
                                >
                                  <input
                                    type="checkbox"
                                    id={`checkbox-${optionIndex}`}
                                    disabled={true}
                                  />
                                  <label htmlFor={`checkbox-${optionIndex}`}>
                                    {option.value}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                          {question.option_type === "radio" && (
                            <div className="d-flex flex-wrap">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  style={{ marginRight: "10px" }}
                                >
                                  <input
                                    type="radio"
                                    id={`radio-${optionIndex}`}
                                    disabled={true}
                                  />
                                  <label htmlFor={`checkbox-${optionIndex}`}>
                                    {option.value}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td>{question.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default PreviewAssessment;
