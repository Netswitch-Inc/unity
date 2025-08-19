// ** React Imports
import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { deleteSection, cleanSectionMessage } from "../../section/store";
import {
  deleteQuestion,
  cleanQuestionMessage,
  getQuestionListFilter,
  updateBulkOrderQuestion
} from "../../questions/store";

// ** Reactstrap Imports
import { Row, Col } from "react-bootstrap";
import { Card, CardBody } from "reactstrap";

// ** Custom Components
import DroppableComp from "components/droppable/assessment";

// ** Third Party Components
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Modal
import AddSectionModel from "views/section/model/AddSectionModel";

const EditAssessmentQuestion = ({
  childFunc,
  triggered,
  goPrevious,
  cancelTrigger
}) => {
  // ** Hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const mySwal = withReactContent(Swal);

  // ** Store vars
  const dispatch = useDispatch();
  const sectionStore = useSelector((state) => state.sections);
  const questionStore = useSelector((state) => state.questions);

  // ** Const
  const initialValues = { name: "", description: "", order: "", status: 1 };

  // ** States
  const [openModel, setOpenModel] = useState(false);
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  const [questionItems, setQuestionsItems] = useState([]);
  const [initSectionValues, setInitialSectionValues] = useState(initialValues);

  const closePopup = () => {
    setOpenModel(() => false);
  }

  const handleQuestionsList = useCallback(() => {
    dispatch(getQuestionListFilter({ assessment_id: id }))
  }, [id, dispatch]);

  useEffect(() => {
    if (sectionStore.actionFlag || sectionStore?.success || sectionStore?.error) {
      dispatch(cleanSectionMessage(null))
    }

    if (sectionStore?.actionFlag === "SCTN_CRTD" || sectionStore?.actionFlag === "SCTN_UPDT" || sectionStore?.actionFlag === "SCTN_DLT_SCS") {
      handleQuestionsList();
    }

    if (sectionStore?.success) {
      setShowSnackbar(true);
      setSnakbarMessage(sectionStore.success);
    }

    if (sectionStore?.error) {
      setShowSnackbar(true);
      setSnakbarMessage(sectionStore.error);
    }
  }, [sectionStore?.actionFlag, sectionStore.success, sectionStore.error, handleQuestionsList, dispatch]);

  useLayoutEffect(() => {
    handleQuestionsList();
  }, [handleQuestionsList]);

  useEffect(() => {
    if (questionStore.actionFlag || questionStore?.success || questionStore?.error) {
      dispatch(cleanQuestionMessage(null))
    }

    if (questionStore.actionFlag === "QESTN_DLT_SCS") {
      handleQuestionsList()
    }

    if (questionStore.actionFlag === "QESTN_LST_FLTRD_SCS") {
      setQuestionsItems(() => questionStore?.questionItemsFilterd);
    }

    if (questionStore?.success) {
      setShowSnackbar(true);
      setSnakbarMessage(questionStore.success);
    }

    if (questionStore?.error) {
      setShowSnackbar(true);
      setSnakbarMessage(questionStore.error);
    }
  }, [handleQuestionsList, questionStore.actionFlag, questionStore.success, questionStore.error, questionStore?.questionItemsFilterd, dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  const handleEditSection = (item) => {
    setInitialSectionValues(() => ({ ...item, _id: item?.section_id }));
    setOpenModel(true);
  }

  // eslint-disable-next-line
  const handleAddSection = () => {
    setInitialSectionValues(initialValues);
    setOpenModel(true);
  }

  useEffect(() => {
    if (triggered) {
      // eslint-disable-next-line

      childFunc.current = handleAddSection();
      cancelTrigger();
    }
    // eslint-disable-next-line
  }, [childFunc, triggered, cancelTrigger, handleAddSection])

  const handleDeleteQuestion = async (id) => {
    mySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteQuestion(id))
      }
    })
  }

  const handleDeleteSection = async (id) => {
    mySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteSection(id))
      }
    })
  }

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
      sectionOrder: false,
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
      order: index // update the order field based on the new index
    }));
    // console.log(updatedSections, "updatedSections");
    // Update the section order state
    setQuestionsItems(() => updatedSections);

    // Dispatch the updated section order payload to update the backend
    const payload = {
      bulkItems: updatedPayload,
      questionOrder: false,
      sectionOrder: true
    };

    dispatch(updateBulkOrderQuestion(payload))
  }

  return (
    <Row className="add-edit-form">
      <ReactSnackBar Icon={(
        <span><TiMessages size={25} /></span>
      )} Show={showSnackBar}>
        {snakebarMessage}
      </ReactSnackBar>

      <Col>
        <Card>
          <CardBody className="pl-0 pr-0 pt-0">
            {questionItems?.length === 0 && (
              <div className="buttons">
                <button
                  type="button"
                  className="btnprimary mt-0 mb-2"
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

            <div className="buttons">
              <button
                type="button"
                className="btnprimary"
                onClick={() => goPrevious()}
              >
                Previous
              </button>

              <button
                type="button"
                className="btnsecondary ml-3"
                onClick={() => navigate("/admin/assessment-forms")}
              >
                Back
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>

      <AddSectionModel
        show={openModel}
        closePopup={closePopup}
        initialValues={initSectionValues}
      />
    </Row>
  )
}

export default EditAssessmentQuestion;
