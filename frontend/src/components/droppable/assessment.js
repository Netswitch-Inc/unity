// ** React Imports
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// ** Store & Actions
import { useSelector } from "react-redux";

// ** Third Party Components
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// ** SVG Icons
import editIcon from "assets/img/edit.svg";
import deleteIcon from "assets/img/delete.svg";

const DroppableComp = ({
  questionItems,
  handleEditSection,
  handleDeleteSection,
  handleOnDragEnd,
  handleDeleteQuestion,
  handleDragSections
}) => {
  // ** Hooks
  const { id } = useParams();
  const navigate = useNavigate();

  const assessmentStore = useSelector((state) => state.assessment);

  return (
    <DragDropContext onDragEnd={handleDragSections}>
      <Droppable droppableId="droppable-sections" type="SECTION">
        {(provided) => (
          // <Card>
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
                      className="section mb-3 col-input"
                    >
                      <div className="row mb-1 border-bottom card-header align-items-center justify-content-between pt-0 pl-0 pr-0 pb-2">
                        <div className="col-12 col-sm-5">
                          <h3 className="card-title mb-0 mt-0">{item.name}</h3>
                        </div>

                        <div className="col-12 col-sm-7">
                          <div className="row align-items-center justify-content-end m-0">
                            <img
                              alt="Edit"
                              title="Edit"
                              src={editIcon}
                              height={20}
                              className="cursor-pointer mr-2"
                              onClick={() => handleEditSection(item)}
                            />

                            <img
                              height={19}
                              alt="Delete"
                              title="Delete"
                              cursor="pointer"
                              src={deleteIcon}
                              className="cursor-pointer mr-2"
                              onClick={() => handleDeleteSection(item?.section_id)}
                            />

                            <div className="buttons blue-btn">
                              <button
                                className="btnprimary"
                                onClick={() => navigate(`/admin/questions/add?assessmentId=${assessmentStore?.assessmentItem?._id}&sectionId=${item?.section_id}`)}
                              >
                                Add Question
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {item.questions?.length > 0 ? (
                        <div className="assesment-data-list">
                          <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable
                              type="QUESTION"
                              droppableId={`droppable-${sectionIndex}`}
                            >
                              {(provided) => (
                                <table
                                  className="table"
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
                                              <td className="question-td">
                                                {question.question}
                                                {question?.child_questions
                                                  ?.length > 0 ? (
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
                                                              {`(${index + 1}) ${Queitem.question}`}
                                                            </span>
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                ) : null}
                                              </td>

                                              <td className="type-td"> 
                                                {question.option_type}
                                                {question?.child_questions
                                                  ?.length > 0 ? (
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
                                                              {`(${index + 1}) ${Queitem.option_type}`}
                                                            </span>
                                                          </div>
                                                        )
                                                      }
                                                    )}
                                                  </div>
                                                ) : null}
                                              </td>

                                              <td className="main-icon-td"> 
                                                <div className="icon-td">
                                                  <img
                                                    alt="Edit"
                                                    height={20}
                                                    title="Edit"
                                                    src={editIcon}
                                                    className="cursor-pointer mr-2"
                                                    onClick={() =>
                                                      navigate(`/admin/questions/edit/${question?._id}?assessmentId=${id}`)
                                                    }
                                                  />

                                                  <img
                                                    alt="Delete"
                                                    title="Delete"
                                                    src={deleteIcon}
                                                    height={19}
                                                    className="cursor-pointer"
                                                    onClick={() => handleDeleteQuestion(question?._id)}
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
                      ) : null}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
        //  </Card>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default DroppableComp;
