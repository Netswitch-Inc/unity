import React from "react";
import { TiEdit, TiTrash } from "react-icons/ti";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const DroppableComp = ({
  questionItems,
  handleEditSection,
  handleDeleteSection,
  handleOnDragEnd,
  handleDeleteQuestion,
  handleDragSections,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const assessmentStore = useSelector((state) => state.assessment);

  return (
    <>
      <DragDropContext onDragEnd={handleDragSections}>
        <Droppable droppableId="droppable-sections" type="SECTION">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="sections-container"
            >
              {questionItems.map((item, sectionIndex) => (
                <Draggable
                  key={item.section_id}
                  draggableId={item.section_id}
                  index={sectionIndex}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="section mb-2"
                    >
                      <div className="row mb-3 border-bottom card-header align-items-center justify-content-between pt-0 pl-0 pr-0 pb-2">
                        <div className="col-12 col-sm-5">
                          <h3 className="card-title mb-0 mt-0">{item.name}</h3>
                        </div>
                        <div className="col-12 col-sm-7">
                          <div className="row align-items-center justify-content-end m-0">
                            <TiEdit
                              size={24}
                              color="#fff"
                              cursor="pointer"
                              onClick={() => handleEditSection(item)}
                              className="mr-1"
                            />
                            <TiTrash
                              size={24}
                              color="#fff"
                              cursor="pointer"
                              onClick={() =>
                                handleDeleteSection(item?.section_id)
                              }
                              className="mr-1"
                            />
                            <button
                              className="btn btn-primary mt-0"
                              onClick={() =>
                                navigate(
                                  `/admin/questions/add?assessmentId=${assessmentStore?.assessmentItem?._id}&sectionId=${item?.section_id}`
                                )
                              }
                            >
                              Add Question
                            </button>
                          </div>
                        </div>
                      </div>

                      {item.questions?.length > 0 && (
                        <div className="mt-2 assesment-data-list">
                          <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable
                              droppableId={`droppable-${sectionIndex}`}
                              type="QUESTION"
                            >
                              {(provided) => (
                                <table
                                  className="table table-bordered"
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  <tbody>
                                    {item.questions.map(
                                      (question, questionIndex) => (
                                        <Draggable
                                          key={question._id}
                                          draggableId={question._id}
                                          index={questionIndex}
                                        >
                                          {(provided) => (
                                            <tr
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                            >
                                              <td>
                                                {question.question}
                                                {question?.child_questions
                                                  ?.length > 0 && (
                                                  <div>
                                                    {question?.child_questions?.map(
                                                      (Queitem, index) => {
                                                        return (
                                                          <div
                                                            key={Queitem._id}
                                                            className="mt-1"
                                                          >
                                                            {/* Display each child question */}
                                                            <span>
                                                              {`(${
                                                                index + 1
                                                              }) ${
                                                                Queitem.question
                                                              }`}
                                                            </span>
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                )}
                                              </td>
                                              <td>
                                                {question.option_type}
                                                {question?.child_questions
                                                  ?.length > 0 && (
                                                  <div>
                                                    {question?.child_questions?.map(
                                                      (Queitem, index) => {
                                                        return (
                                                          <div
                                                            key={Queitem._id}
                                                            className="mt-1"
                                                          >
                                                            {/* Display each child question */}
                                                            <span>
                                                              {`(${
                                                                index + 1
                                                              }) ${
                                                                Queitem.option_type
                                                              }`}
                                                            </span>
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                )}
                                              </td>
                                              {/* <td>
                                                {question.description}
                                                {question?.child_questions
                                                  ?.length > 0 && (
                                                  <div>
                                                    {question?.child_questions?.map(
                                                      (Queitem, index) => {
                                                        return (
                                                          <div
                                                            key={Queitem._id}
                                                            className="mt-1"
                                                          >
                                                            <span>
                                                              {`(${
                                                                index + 1
                                                              }) ${
                                                                Queitem.description
                                                              }`}
                                                            </span>
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                )}
                                              </td> */}
                                              <td>
                                                {/* <TiPlus
                                                  size={20}
                                                  cursor="pointer"
                                                  onClick={() =>
                                                    navigate(
                                                      `/admin/questions/add?assessmentId=${assessmentStore?.assessmentItem?._id}&sectionId=${item?.section_id}`,
                                                      {
                                                        state: {
                                                          parentQuestionId:
                                                            question?._id,
                                                        },
                                                      }
                                                    )
                                                  }
                                                  className="mr-1"
                                                /> */}
                                                <div className="d-flex">
                                                <TiEdit
                                                  size={20}
                                                  cursor="pointer"
                                                  onClick={() =>
                                                    navigate(
                                                      `/admin/questions/${question?._id}?assessmentId=${id}`
                                                    )
                                                  }
                                                  className="mr-1"
                                                />
                                                <TiTrash
                                                  size={20}
                                                  cursor="pointer"
                                                  onClick={() =>
                                                    handleDeleteQuestion(
                                                      question?._id
                                                    )
                                                  }
                                                />
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                        </Draggable>
                                      )
                                    )}
                                    {provided.placeholder}
                                  </tbody>
                                </table>
                              )}
                            </Droppable>
                          </DragDropContext>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default DroppableComp;
