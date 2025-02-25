/* eslint-disable jsx-a11y/anchor-is-valid */

import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import AssignPolicyReviewPopup from "./AssignPolicyReviewPopup";
import Loader from "react-loader";

const AssignedTask = ({ item }) => {
  const [lgShow, setLgShow] = useState(false);

  const handleClose = () => {
    setLgShow(false);
  };

  const [reviewData, setReviewData] = useState([]);
  const [PolicyPopupShow, setPolicyPopupShow] = useState(false);
  const [policyId] = useState();
  const [policyData] = useState();
  const [errors, setErrors] = useState({});
  const [loaded] = useState(true);
  const AssignPopupcallback = () => {
    setPolicyPopupShow(false);
  };

  const handleOnClickPolicy = async (id, tasks) => {
  }

  function updateAssignTaskVal() {
    ["reviewData"].forEach((fieldName) => {
      switch (fieldName) {
        case "reviewData":
          reviewData.length > 0
            ? delete errors.reviewData
            : (errors.reviewData = "Review is required*");
          break;
        default:
          break;
      }
    });

    setErrors({ ...errors });
  }
  const updateAssignTask = async () => {
    updateAssignTaskVal();
    if (Object.keys(errors).length) return;
  };

  return (
    <>
      <a href="#" onClick={() => setLgShow(true)}>
        <i className="tim-icons icon-pencil  btn-info btn btn-secondary btn-sm"></i>
      </a>
      <Modal
        className="UpdateUserPopup"
        size="lg"
        show={lgShow}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <span
            className="modal-title border-bottom col-sm-12 "
            id="example-modal-sizes-title-lg"
          >
            <h3>Review Task</h3>
          </span>
          <button type="button" className="Close-button" onClick={handleClose}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <span className="text-center-task-popup-header col-sm-12">
            <h6 className="mb-4 p-0">
              Following policies have been assigned for Review
            </h6>
          </span>
          <Loader
            loaded={loaded}
            lines={13}
            length={10}
            width={5}
            radius={30}
            corners={1}
            rotate={0}
            direction={1}
            color="#2774f6"
            speed={1}
            trail={60}
            shadow={false}
            hwaccel={false}
            className="spinner"
            zIndex={2e9}
            top="40%"
            left="50%"
            scale={1.0}
            loadedClassName="loadedContent"
          />
          <div className="col-sm-12">
            <div className="task-list">
              <div className="taskblue-box">
                <div className="row">
                  <div className="pr-md-1 col-md-6">
                    <div className="task-list">
                      <label>Selected Tasks:</label>
                      <div className="taskblue-boxx">
                        <ul>
                          <li>
                            <strong>Description</strong>
                            <span className="pull-right">
                              <strong>Failed Controls</strong>
                            </span>
                          </li>
                          <>
                            {item?.tasks?.map((task, index) => {
                              return (
                                <li
                                  onClick={() =>
                                    handleOnClickPolicy(task?.id, task)
                                  }
                                  key={index}
                                >
                                  {task.itemName}
                                  <span className="pull-right">{task.fail}</span>
                                </li>
                              );
                            })}
                          </>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="pr-md-1 col-md-6">
                    <div className="task-list-form">
                      <div className="form-group">
                        <label>Due Date</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={item?.dueDate}
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label>Notes</label>
                        <textarea
                          className="form-control"
                          defaultValue={item?.tasks[0]?.Notes}
                          readOnly
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="pr-md-1 col-md-12">
                    <div className="task-list-form">
                      <div className="form-group">
                        <label>Review</label>
                        <input
                          defaultValue={item?.review}
                          value={reviewData}
                          onChange={(e) => {
                            setReviewData(e.target.value);
                          }}
                          type="text"
                          className="form-control"
                          placeholder="Write your opinion Here"
                        />
                      </div>
                      {errors?.reviewData && (
                        <div style={{ color: "red" }}>{errors.reviewData}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <div className="modal-footer footer-model">
          <div className="col-sm-12">
            <div className="row">
              <div className="col-sm-12 PadR0 ItemInfo-right">
                <div className="pull-right">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => updateAssignTask()}
                    type="button"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm ml-2"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {PolicyPopupShow ? (
        <AssignPolicyReviewPopup
          AssignPopupcallback={AssignPopupcallback}
          id={policyId}
          item={item}
          policyData={policyData}
        />
      ) : (
        ""
      )}
    </>
  );
};
export default AssignedTask;
