/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { BsFillCaretRightFill, BsFillCaretDownFill } from "react-icons/bs";

const AssignPolicyReviewPopup = ({
  AssignPopupcallback,
  item,
  policyData,
}) => {
  const [showpPop, setShowPopup] = useState(true);
  const [selectedData, setSelectedData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [errors, setErrors] = useState({});
  const handleClose = () => {
    AssignPopupcallback();
    setShowPopup(false);
  };

  console.log(policyData, "policyData");
  const [expand, setExpand] = useState(false);
  const expandColum = (item) => {
    item.expanded = !item.expanded;
    setExpand(!expand);
  }

  function assignVrviewTaskFormVal() {
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
    assignVrviewTaskFormVal();
    if (Object.keys(errors).length) return;
    var TaskData = [];

    for (let i = 0; i < item?.tasks?.length; i++) {
      const element = item.tasks[i];
      const { id, itemName, fail } = element;
      const temp = {
        id,
        itemName,
        fail,
        Notes: element.Notes,
        isReviewed: 0,
        reviewComments: "",
      };

      temp.policies =
        element.policies?.map((elem) => {
          const { id, sequenceNumber, policyName, result } = elem;
          const innerTemp = {
            id,
            sequenceNumber,
            policyName,
            result,
          };
          const selected = selectedData.find((elem) => elem.id === id);
          if (selected) {
            innerTemp.isReviewed = 1;
            innerTemp.reviewComments = reviewData;
          } else {
            innerTemp.isReviewed = elem?.isReviewed;
            innerTemp.reviewComments = elem?.reviewComments;
          }
          return innerTemp;
        }) || [];
      TaskData.push(temp);
    }
  };

  const handleChange = (event, allData, index) => {
    let { checked } = event.target,
      singleRow = allData;
    if (checked) {
      setSelectedData((selectedData) => [...selectedData, singleRow]);
    }
  };

  return (
    <>
      <Modal
        className="UpdateUserPopup"
        size="lg"
        show={showpPop}
        onHide={() => setShowPopup(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <span
            className="modal-title col-sm-12 "
            id="example-modal-sizes-title-lg"
          >
            <h3 className='border-bottom pb-2 mb-0 mt-0'> Review Tasks</h3>
          </span>
          <button type="button" className="Close-button" onClick={handleClose}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="minHeight400">
            <div className="content">
              <div className="AssignedPolicyPopup">
                <div className="tbl-header">
                  <table className="compareTable comparePolicyTable">
                    <thead>
                      <tr>
                        <th>Select</th>
                        <th className="expanded-table">Details</th>
                        <th>SeqNo</th>
                        <th>Policy</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className="tbl-content ">
                  <table className="compareTable comparePolicyTable">
                    <tbody>
                      {policyData?.policies?.map((itemPolicies, index) => {
                        if (itemPolicies?.isReviewed === 0) {
                          return (<>
                            <tr className="table-body-content" key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  onChange={(event) =>
                                    handleChange(
                                      event,
                                      itemPolicies,
                                      itemPolicies.index
                                    )
                                  }
                                  disabled={itemPolicies?.result === "Pass"}
                                />
                              </td>
                              <td
                                className="expanded-table"
                                onClick={() => {
                                  expandColum(itemPolicies);
                                }}
                              >
                                {" "}
                                {itemPolicies.expanded ? (
                                  <BsFillCaretDownFill />
                                ) : (
                                  <BsFillCaretRightFill />
                                )}
                              </td>
                              <td>{itemPolicies?.sequenceNumber}</td>
                              <td>{itemPolicies?.policyName}</td>
                              <td>{itemPolicies?.result}</td>
                            </tr>
                          </>)
                        }
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-sm-12 border-top3 col-sm-12 mt-2 pt-4">
              <div className="taskblue-box assignPolicy-box">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={item?.dueDate}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Notes</label>
                      <input
                        as="textarea"
                        className="form-control"
                        defaultValue={item?.tasks[0]?.Notes}
                        placeholder="Notes"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-9">
                    <div className="form-group">
                      <label>Review</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={item?.review}
                        value={reviewData}
                        onChange={(e) => {
                          setReviewData(e.target.value);
                        }}
                        placeholder="Write your opinion Here"
                      />
                    </div>
                    {errors?.reviewData && (
                      <div style={{ color: "red" }}>{errors.reviewData}</div>
                    )}
                  </div>
                  <div className="col-md-3">
                    <label>&nbsp;</label>
                    <button
                      className="btn btn-secondary btn-block btn-sm"
                      type="button"
                      onClick={() => updateAssignTask()}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AssignPolicyReviewPopup;
