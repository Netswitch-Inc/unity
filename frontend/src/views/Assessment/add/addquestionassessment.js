import AddSectionModel from "views/section/model/AddSectionModel";
import { Row, Col } from "react-bootstrap";
import { CardBody } from "reactstrap";
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuestionModel from "views/questions/model/AddQuestionModel";
import { initQuestion } from "utility/reduxConstant";
import {
  deleteQuestion,
  getQuestionListFilter,
  updateBulkOrderQuestion
} from "../../questions/store";
import Swal from "sweetalert2";
import { deleteSection } from "views/section/store";
import DroppableComp from "components/droppable/assessment";

const AssessmentQuestion = ({ childFunc, triggered, cancelTrigger }) => {
  const dispatch = useDispatch();
  const initialValues = { name: "", description: "", order: "", status: 1 };

  const sectionStore = useSelector((state) => state.sections);
  const questionStore = useSelector((state) => state.questions);
  const assessmentStore = useSelector((state) => state.assessment);

  const [openModel, setOpenModel] = useState(false);
  const [openQuestionModel, setOpenQuestionModel] = useState(false);
  const [initQuestionState] = useState(initQuestion);

  const [questionItems, setQuestionsItems] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [initSectionValues, setInitialSectionValues] =
    useState(initialValues);
  const [title, setTitle] = useState("");

  const closePopup = () => {
    setOpenModel(() => false);
  };

  const closeQuestionPopup = () => {
    setOpenQuestionModel(() => false);
  };

  const handleQuestionsList = useCallback(() => {
    dispatch(
      getQuestionListFilter({
        assessment_id: assessmentStore?.assessmentItem?._id,
      })
    );
  }, [assessmentStore?.assessmentItem, dispatch]);

  useEffect(() => {
    if (sectionStore?.actionFlag === "SCTN_CRTD") {
      handleQuestionsList();
    }
  }, [sectionStore?.actionFlag, handleQuestionsList]);

  useEffect(() => {
    if (
      questionStore?.questionItemsFilterd &&
      (questionStore.actionFlag === "QESTN_CRTD_SCS" ||
        questionStore.actionFlag === "QESTN_BLK_ODR_UPDT_SCS" ||
        questionStore.actionFlag === "QESTN_UPDT_SCS")
    ) {
      handleQuestionsList();
    }
    if (questionStore.actionFlag === "QESTN_LST_FLTRD_SCS") {
      setQuestionsItems(
        () => questionStore?.questionItemsFilterd,
        handleQuestionsList
      );
    }
  }, [
    questionStore.actionFlag,
    questionStore?.questionItemsFilterd,
    handleQuestionsList,
  ]);

  useEffect(() => {
    if (questionStore?.questionItemsFilterd) {
      setQuestionsItems(() => questionStore?.questionItemsFilterd);
    }
  }, [questionStore?.questionItemsFilterd]);

  const handleEditSection = (item) => {
    setIsEditing(() => true);
    setTitle(() => "EDIT SECTION");
    setInitialSectionValues(() => ({ ...item, _id: item?.section_id }));
    setOpenModel(true);
  };

  // eslint-disable-next-line
  const handleAddSection = () => {
    setIsEditing(() => false);
    setTitle(() => "ADD SECTION");
    setInitialSectionValues(initialValues);
    setOpenModel(true);
  };

  useEffect(() => {
    if (triggered) {
      // eslint-disable-next-line
      childFunc.current = handleAddSection();
      cancelTrigger();
    }
    // eslint-disable-next-line
  }, [childFunc, triggered, cancelTrigger, handleAddSection]);

  const handleOnDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Exit if there's no destination or the item is dropped in the same position
    if (!destination || destination.index === source.index) return;

    // Find the section index based on the draggableId
    const sectionIndex = questionItems.findIndex((item) =>
      item.questions.some((question) => question._id === draggableId)
    );
    if (sectionIndex === -1) {
      console.error("Section not found");
      return;
    }

    const updatedItems = [...questionItems];

    const section = { ...updatedItems[sectionIndex] };
    section.questions = [...section.questions];

    const [movedQuestion] = section.questions.splice(source.index, 1);

    section.questions.splice(destination.index, 0, movedQuestion);

    const updatedPayload = section.questions.map((item, index) => ({
      _id: item._id,
      order: index,
    }));

    updatedItems[sectionIndex] = section;

    const payload = {
      bulkItems: updatedPayload,
    };
    setQuestionsItems(() => updatedItems);
    dispatch(updateBulkOrderQuestion(payload));
  };

  const handleDeleteQuestion = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteQuestion(id));
        Swal.fire("Deleted!", "Your user has been deleted.", "success");
        await handleQuestionsList();
      } catch (error) {
        Swal.fire("Error!", "There was an error deleting the user.", "error");
      }
    }
  };

  const handleDeleteSection = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteSection(id));
        Swal.fire("Deleted!", "Your user has been deleted.", "success");
        await handleQuestionsList();
      } catch (error) {
        Swal.fire("Error!", "There was an error deleting the user.", "error");
      }
    }
  }

  return (
    <>
      <Row className="add-edit-form">
        <Col>
          <CardBody className="pl-0 pr-0 pt-0">
            {questionItems?.length === 0 && (
              <div className="buttons">
                <button
                  type="button"
                  className="btnprimary"
                  onClick={() => handleAddSection()}
                >
                  Add Section
                </button>
              </div>
            )}
            {questionItems?.length > 0 && (
              <DroppableComp
                questionItems={questionItems}
                handleEditSection={handleEditSection}
                handleDeleteSection={handleDeleteSection}
                handleOnDragEnd={handleOnDragEnd}
                handleDeleteQuestion={handleDeleteQuestion}
              />

            )}
          </CardBody>
        </Col>
      </Row>

      {openModel && (
        <AddSectionModel
          show={openModel}
          closePopup={closePopup}
          title={title}
          isEditing={isEditing}
          initialValues={initSectionValues}
        />
      )}

      {openQuestionModel && (
        <QuestionModel
          show={openQuestionModel}
          closePopup={closeQuestionPopup}
          title={title}
          initQuestion={initQuestionState}
          isEditing={isEditing}
        />
      )}
    </>
  )
}

export default AssessmentQuestion;
