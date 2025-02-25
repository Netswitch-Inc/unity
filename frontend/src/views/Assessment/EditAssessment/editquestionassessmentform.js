import AddSectionModel from "views/section/model/AddSectionModel";
import { Row, Col } from "react-bootstrap";
import { Card, CardBody } from "reactstrap";
import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateBulkOrderQuestion,
  deleteQuestion,
  getQuestionListFilter,
} from "views/questions/store";
import { useNavigate, useParams } from "react-router-dom";
import { deleteSection } from "views/section/store";
import Swal from "sweetalert2";
import DroppableComp from "components/droppable/assessment";

const EditAssessmentQuestion = ({
  childFunc,
  triggered,
  cancelTrigger,
  goPrevious,
}) => {
  const initialValues = { name: "", description: "", order: "", status: 1 };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const sectionStore = useSelector((state) => state.sections);
  const questionStore = useSelector((state) => state.questions);

  const [openModel, setOpenModel] = useState(false);

  const [questionItems, setQuestionsItems] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [initialSectionValues, setInitialSectionValues] =
    useState(initialValues);
  const [title, setTitle] = useState("");

  const closePopup = () => {
    setOpenModel(() => false);
  };

  const handleQuestionsList = useCallback(() => {
    dispatch(
      getQuestionListFilter({
        assessment_id: id,
      })
    );
  }, [id, dispatch]);

  useEffect(() => {
    if (
      sectionStore?.actionFlag === "SECTION_CREATED" ||
      sectionStore?.actionFlag === "SECTION_UPDATED"
    ) {
      handleQuestionsList();
    }
  }, [sectionStore?.actionFlag, handleQuestionsList]);

  useLayoutEffect(() => {
    handleQuestionsList();
  }, [handleQuestionsList, dispatch]);

  useEffect(() => {
    if (questionStore.actionFlag === "QUESTION_LIST_FILTERED_SUCCESS") {
      setQuestionsItems(() => questionStore?.questionItemsFilterd);
    }
  }, [questionStore.actionFlag, questionStore?.questionItemsFilterd]);

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
  };

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
      questionOrder: true,
      sectionOrder: false
    };
    setQuestionsItems(() => updatedItems);
    dispatch(updateBulkOrderQuestion(payload));
  };

  const handleDragSections = (result) => {
    const { destination, source, draggableId } = result;

    // Exit if there's no destination or the section is dropped in the same position
    if (!destination || destination.index === source.index) return;

    // Find the index of the section based on draggableId
    const movedSectionIndex = questionItems.findIndex(
      (section) => section.section_id === draggableId
    );

    if (movedSectionIndex === -1) {
      console.error("Section not found");
      return;
    }

    const updatedSections = [...questionItems];

    // Move the section in the array
    const [movedSection] = updatedSections.splice(movedSectionIndex, 1);
    updatedSections.splice(destination.index, 0, movedSection);

    // Create a payload with updated section order
    const updatedPayload = updatedSections.map((section, index) => ({

      _id: section.section_id,
      order: index, // update the order field based on the new index
    }));
    console.log(updatedSections, 'updatedSections')
    // Update the section order state
    setQuestionsItems(() => updatedSections);

    // Dispatch the updated section order payload to update the backend
    const payload = {
      bulkItems: updatedPayload,
      questionOrder: false,
      sectionOrder: true
    };
    dispatch(updateBulkOrderQuestion(payload));

  }

  return (
    <>
      <Row className="add-edit-form">
        <Col>
          <Card>
            <CardBody className="pl-0 pr-0">
              {questionItems?.length === 0 && (
                <div className="buttons">
                  <button
                    type="button"
                    className="btn btn-primary mt-0"
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
                  handleDragSections={handleDragSections}
                />

              )}
              <div className="w-100 PadR0 ItemInfo-right mt-3">
                <div className="row justify-content-end m-0">
                  <button
                    type="button"
                    className="float-end btn btn-primary"
                    onClick={() => goPrevious()}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="float-end btn btn-primary"
                    onClick={() => navigate("/admin/assessment-forms")}
                  >
                    Back
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {openModel && (
        <AddSectionModel
          show={openModel}
          closePopup={closePopup}
          title={title}
          isEditing={isEditing}
          initialValues={initialSectionValues}
        />
      )}

    </>
  );
};
export default EditAssessmentQuestion;
