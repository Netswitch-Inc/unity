/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

import Loader from "react-loader";

import { BsFillCaretRightFill, BsFillCaretDownFill } from "react-icons/bs";
const AssignPolicyPopup = ({
  checkboxSelectData,
  AssignPopupcallback,
  id,
  props,
  type
}) => {
  const [WhiteListedReason, setWhiteListedReason] = useState([]);
  const [whiteListType, setWhiteListType] = useState(true);
  const [showpPop, setShowPopup] = useState(true);
  const [userData] = useState([]);
  const [AssignUserId, setSelectedUserId] = useState();
  const [selectedData, setSelectedData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loaded] = useState(true);
  const [alreadyAssignedPopUp, setalreadyAssignedPopUp] = useState(false);
  const [assignedShowPopup, setAssignedShowPopup] = useState(false);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [SnackMessage] = useState();

  let { ModalToggle, setModalToggle } = props;
  const handleClose = () => {
    AssignPopupcallback();
    setShowPopup(false);
  };
  const [policyData] = useState([]);
  const [expand, setExpand] = useState(false);
  const expandColum = (item) => {
    item.expanded = !item.expanded;
    setExpand(!expand);
  };

  function assignTaskFormVal() {
    ["AssignUserId", "date", "notes"].forEach((fieldName) => {
      switch (fieldName) {
        case "AssignUserId":
          AssignUserId
            ? delete errors.AssignUserId
            : (errors.AssignUserId = "User Id is required*");
          break;
        case "date":
          taskData?.date !== ""
            ? delete errors.date
            : (errors.date = "DueDate is required*");
          break;
        case "notes":
          taskData.notes
            ? delete errors.notes
            : (errors.notes = "Notes is required*");
          break;
        default:
          break;
      }
    });
    setErrors({ ...errors });
  }
  function WishListTaskFormVal() {
    ["whiteListType", "WhiteListedReason"].forEach((fieldName) => {
      switch (fieldName) {
        case "WhiteListedReason":
          WhiteListedReason.length > 0
            ? delete errors.WhiteListedReason
            : (errors.WhiteListedReason = "Reason is required*");
          break;
        case "whiteListType":
          whiteListType
            ? delete errors.whiteListType
            : (errors.whiteListType = "white List Type is required*");
          break;
        default:
          break;
      }
    });
    setErrors({ ...errors });
  }

  const [taskData, seTaskData] = useState({
    date: "",
    description: "",
    notes: "",
    hostname: "",
    scannedDate: "",
    TargetIP: "",
  });

  const assignTask = async () => {
    assignTaskFormVal();
    if (Object.keys(errors).length) return;
    var TaskData = [];
    var policyid = "";
    selectedData.map((item, index) => {
      let assignItem = {};
      if (item.id !== undefined) {
        assignItem["id"] = item.id;
        if (index === 0) {
          policyid = item.id;
        } else {
          policyid = policyid + "," + item.id;
        }
      }
      if (item.policyName !== undefined) {
        assignItem["itemName"] = item.policyName;
      }
      if (item.result !== undefined) {
        assignItem["fail"] = 1;
      }
      if (item !== undefined) {
        assignItem["Notes"] = taskData.notes;
      }
      if (item !== undefined) {
        assignItem["isReviewed"] = 0;
      }
      if (item !== undefined) {
        assignItem["reviewComments"] = "";
      }
      TaskData.push(assignItem);
    })
  }

  useEffect(() => {
    setTimeout(() => {
      setAssignedShowPopup(false);
    }, 4000);
  }, [assignedShowPopup]);

  const WishListTask = async () => {
    WishListTaskFormVal();
    if (Object.keys(errors).length) return;
    var policies = [];
    var Ids = [];
    var itemNo = [];
    var parentId = [];
    if (id !== undefined) {
      props?.data?.map((item) => {
        let assignItem = {};
        if (item.id === id) {
          if (item.id !== undefined) {
            assignItem["id"] = item.id;
            parentId.push(item.id.toString());
          }
          if (item.policyName !== undefined) {
            assignItem["itemName"] = item.policyName;
          }
          if (item.fail !== undefined) {
            assignItem["fail"] = 1;
          }
          if (item.itemNo !== undefined) {
            itemNo.push(item.itemNo);
          }

          policies.push(assignItem);
        }
      })
    }

    selectedData.map((item) => {
      if (item.id !== undefined) {
        Ids.push(item.id.toString());
      }
    });
    console.log(" Ids.push  Ids.push", Ids);
  };

  const handleChange = (event, allData, index) => {
    let { checked } = event.target,
      singleRow = allData;
    if (checked) {
      setSelectedData((selectedData) => [...selectedData, singleRow]);
    } else {
      setSelectedData(
        selectedData.filter((ele) => {
          return ele.id.toString() !== singleRow.id.toString();
        })
      );
    }
  }

  const confrimYesClose = () => {
    setalreadyAssignedPopUp(false);

    assignTask().then(() => {
      AssignPopupcallback();
      handleClose();
      setModalToggle(!ModalToggle);
      checkboxSelectData();
    }).catch((error) => {
      console.log("Error in Confirm Update error", error);
    });
  };

  const confrimNoClose = () => {
    setalreadyAssignedPopUp(false);
  }

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 4000);
  }, [showSnackBar]);

  return (<>
    <ReactSnackBar
      Icon={
        <span>
          <TiMessages size={25} />
        </span>
      }
      Show={showSnackBar}
    >
      {SnackMessage}
    </ReactSnackBar>

    <Modal
      className="UpdateUserPopup"
      size="lg"
      show={showpPop}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header>
        <span
          className="modal-title  col-sm-12 "
          id="example-modal-sizes-title-lg"
        >
          {type !== "WhiteList" ? (
            <h3>Assigned Policy</h3>
          ) : (
            <h3>Add White List</h3>
          )}
        </span>
        <button type="button" className="Close-button" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>

      <Modal.Body className="border mb-2">
        <div className="minHeight400">
          <div className="content">
            <div className="AssignedPolicyPopup text-left">
              <div className="tbl-header">
                <table className="compareTable comparePolicyTable">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th className="expanded-table">Details</th>
                      <th>SeqNo</th>
                      <th>Policy</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                    </tr>
                  </thead>
                </table>
              </div>
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
                top="50%"
                left="50%"
                scale={1.0}
                loadedClassName="loadedContent"
              />
              <div className="tbl-content">
                <table className="compareTable comparePolicyTable">
                  <tbody>
                    {policyData?.map((item, index) => {
                      return item?.result === "Fail" ? (<>
                        <tr className="table-body-content" key={index}>
                          <td>
                            <input
                              type="checkbox"
                              className="checkbox pointer"
                              onChange={(event) =>
                                handleChange(event, item, item.index)
                              }
                              disabled={item?.result === "Pass"}
                            />
                          </td>
                          <td
                            className="expanded-table"
                            onClick={() => {
                              expandColum(item);
                            }}
                          >
                            {" "}
                            {item.expanded ? (
                              <BsFillCaretDownFill />
                            ) : (
                              <BsFillCaretRightFill />
                            )}
                          </td>
                          <td>{item?.sequenceNumber}</td>
                          <td>{item.policyName}</td>
                          <td className="pl-2">{item?.result}</td>
                          <td
                            className="textEllipsis"
                            title={item?.userName}
                          >
                            {item?.userName == null ? "-" : item?.userName}
                          </td>
                        </tr>

                        {item.expanded ? (<>
                          <tr className="expandInnerTable" key={`expanded-${index}`}>
                            <th align="top">Description: </th>
                            <td className="text-justify pl-4" colSpan="4">
                              {item?.description}
                            </td>
                          </tr>
                          <tr className="expandInnerTable">
                            <th align="top">Impact: </th>
                            <td className="text-justify pl-4" colSpan="4">
                              {item?.impact}
                            </td>
                          </tr>
                          <tr className="expandInnerTable">
                            <th align="top">Rationale: </th>
                            <td className="text-justify pl-4" colSpan="4">
                              {item?.rationale}
                            </td>
                          </tr>
                        </>) : null}
                      </>) : null;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-sm-12 border-top3 col-sm-12 mt-2 pt-4">
            <div className="taskblue-box assignPolicy-box">
              <div className="row">
                {type !== "WhiteList" ? (
                  <>
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label>Assign To</label>
                        <select
                          className="form-control pointer"
                          onChange={(e) => {
                            setSelectedUserId(e.target.value);
                          }}
                          value={AssignUserId}
                        >
                          <option selected>Please Select User</option>
                          {userData.map((user, index) => {
                            return (
                              <option value={user.userId} key={index}>
                                {user.firstName} {user.lastName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      {errors?.AssignUserId && (
                        <div style={{ color: "red" }}>
                          {errors.AssignUserId}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Due Date</label>
                        <input
                          type="date"
                          onChange={(e) =>
                            seTaskData({ ...taskData, date: e.target.value })
                          }
                          className="form-control"
                        />
                      </div>
                      {errors?.date && (
                        <div style={{ color: "red" }}>{errors.date}</div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="col-sm-12">
                    <div className="pr-md-1">
                      <div className="task-list-form">
                        <div className="form-group">
                          <label>Reason:*</label>
                          <textarea
                            className="form-control CustomTextArea"
                            onChange={(e) => {
                              setWhiteListedReason(e.target.value);
                            }}
                          ></textarea>
                        </div>
                        {errors?.WhiteListedReason && (
                          <div style={{ color: "red" }}>
                            {errors.WhiteListedReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="row">
                {type !== "WhiteList" ? (
                  <div className="col-md-9">
                    <div className="form-group">
                      <label>Notes</label>
                      <input
                        as="textarea"
                        className="form-control"
                        placeholder="Notes"
                        onChange={(e) =>
                          seTaskData({ ...taskData, notes: e.target.value })
                        }
                      />
                    </div>
                    {errors?.notes && (
                      <div style={{ color: "red" }}>{errors.notes}</div>
                    )}
                  </div>
                ) : (
                  <div className="col-sm-9">
                    <div className="form-group">
                      <label>WhiteList Type:*</label>
                      <select
                        className="form-control"
                        value={whiteListType}
                        onChange={(e) => {
                          setWhiteListType(e.target.value);
                        }}
                      >
                        <option value={true}>WhiteList to all Scans:</option>
                        <option value={false}>
                          WhiteList for this target machine(HostName,
                          TargetIp, Benchmark Version) only:
                        </option>
                      </select>
                    </div>
                    {errors?.whiteListType && (
                      <div style={{ color: "red" }}>
                        {errors.whiteListType}
                      </div>
                    )}
                  </div>
                )}
                <div className="col-md-3">
                  <label>&nbsp;</label>
                  {type !== "WhiteList" ? (
                    <button
                      className="btn btn-secondary btn-block btn-sm"
                      type="button"
                      disabled={selectedData.length === 0}
                      onClick={assignTask}
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary btn-block btn-sm"
                      type="button"
                      onClick={WishListTask}
                    >
                      Add White List
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>

    <Modal
      size="sm"
      show={alreadyAssignedPopUp}
      aria-labelledby="example-modal-sizes-title-sm"
    >
      <Modal.Header>
        <span
          className="modal-title text-white mx-4"
          id="example-modal-sizes-title-lg"
        >
          <span>
            <strong>Assign Policy for review</strong>
          </span>
        </span>
      </Modal.Header>
      <Modal.Body>
        <div className="text-white mx-4">
          <span>
            Policy already assigned. Do you want to reassign with updated
            notes?
          </span>
        </div>
      </Modal.Body>
      <div className="justify-content-end d-flex">
        <button
          type="submit"
          className="btn btn-secondary mb-2"
          onClick={async (e) => await confrimYesClose(e)}
        >
          Yes
        </button>
        <button
          type="submit"
          className="btn btn-secondary mr-3 mb-2"
          onClick={async (e) => await confrimNoClose(e)}
        >
          No
        </button>
      </div>
    </Modal>
  </>)
}

export default AssignPolicyPopup;
