/* eslint-disable array-callback-return */

import React, { useEffect, useState } from "react";
import { Row, Col, ModalBody, Modal } from "reactstrap";

import AssignPolicyPopup from "../AssignedpolicyPopup";
import ReactSnackBar from "react-js-snackbar";

export default function BulkModel(props) {
  let {
    ModalToggle,
    setModalToggle,
    data,
    type,
    checkboxSelectData,
    whiteListFailCount,
  } = props;

  console.log("WishListTask data WishListTask data", data);
  const closeModal = () => {
    setModalToggle(!ModalToggle);
  };

  const [userData] = useState([]);
  const [AssignUserId, setSelectedUserId] = useState();
  const [policyId] = useState();
  const [WhiteListedReason, setWhiteListedReason] = useState([]);
  const [whiteListType, setWhiteListType] = useState(true);
  const [errors, setErrors] = useState({});
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [SnackMessage, setSnackMessage] = useState();
  const [PolicyPopupShow, setPolicyPopupShow] = useState(false);
  const [confirmDisable, setconfirmDisable] = useState(false);

  const handleOnClickPolicy = async (id) => {
  }

  const AssignPopupcallback = () => {
    setPolicyPopupShow(false);
  };

  const [taskData, seTaskData] = useState({
    date: "",
    description: "",
    notes: "",
    review: "",
    hostname: "",
    scannedDate: "",
    TargetIP: "",
  });

  console.log("seTaskData check line 100", taskData);
  const assignTask = async () => {
    assignTaskFormVal();

    if (Object.keys(errors).length) return;
    setconfirmDisable(true);
  };

  const WishListTask = async () => {
    console.log("whitelist data check 225", data);
    WishListTaskFormVal();
    if (Object.keys(errors).length) return;
    var policies = [];
    var itemNo = [];
    var Ids = [];
    data.map((item) => {
      let assignItem = {};
      if (item.id !== undefined) {
        assignItem["id"] = item.id;
        Ids.push(item.id.toString());
      }
      if (item.itemName !== undefined) {
        assignItem["itemName"] = item.itemName;
      }
      if (item.fail !== undefined) {
        assignItem["fail"] = item.fail;
      }
      if (item.itemNo !== undefined) {
        itemNo.push(item.itemNo);
      }
      policies.push(assignItem);
    });

    console.log("whitelist data check 225", data);
    setconfirmDisable(true);
    setshowSnackbar(true);
    setSnackMessage("Policy Successfully Whitelisted");
  }

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 3000);
  }, [showSnackBar]);

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

  return (<>
    <div>
      <Modal isOpen={ModalToggle} className="assigntask-modal">
        <div className="modal-header justify-content-center assign-task-modal-heading">
          <span
            className="modal-title col-sm-12 "
            id="example-modal-sizes-title-lg"
          >
            <h6>{type} TASK</h6>
            <h6>
              You have selected {data.length} policies to {type}{" "}
            </h6>
          </span>
          <button
            type="button"
            className="Close-button"
            aria-hidden={true}
            data-dismiss="modal"
            onClick={(e) => {
              setModalToggle(!ModalToggle);
            }}
          >
            ×
          </button>
        </div>

        <ReactSnackBar Icon={<span>🦄</span>} Show={showSnackBar}>
          {SnackMessage}
        </ReactSnackBar>

        <ModalBody className=" border">
          <div>
            <Row>
              <Col className="pr-md-1 col-md-6">
                <div className="task-list">
                  <label>Selected Tasks:</label>
                  <div className="taskblue-boxx">
                    <ul>
                      <li>
                        <strong>Description</strong>{" "}
                        <span>
                          <strong className="pull-right ">Failed Controls</strong>
                        </span>
                      </li>
                      {data.map(function (item, key) {
                        return (
                          <li
                            style={{ color: "#56d6fd" }}
                            onClick={() => handleOnClickPolicy(item?.id)}
                            key={key}
                          >
                            {item.itemName}
                            <span className="pull-right">{item.fail}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </Col>
              {type === "WhiteList" ? (
                <div className="col-sm-6">
                  <Col className="pr-md-1">
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
                  </Col>
                </div>
              ) : (
                <Col className="pr-md-1" md="6">
                  <div className="task-list-form">
                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        onChange={(e) =>
                          seTaskData({ ...taskData, date: e.target.value })
                        }
                        type="date"
                        className="form-control"
                      ></input>
                    </div>
                    {errors?.date && (
                      <div style={{ color: "red" }}>{errors.date}</div>
                    )}
                    <div className="form-group">
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
                      {errors?.AssignUserId && (
                        <div style={{ color: "red" }}>
                          {errors.AssignUserId}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Notes</label>
                      <textarea
                        onChange={(e) =>
                          seTaskData({ ...taskData, notes: e.target.value })
                        }
                        className="form-control"
                      ></textarea>
                    </div>
                    {errors?.notes && (
                      <div style={{ color: "red" }}>{errors.notes}</div>
                    )}
                  </div>
                </Col>
              )}
            </Row>
            <Row>
              {type === "WhiteList" ? (
                <div className="col-sm-12">
                  <Col className="pr-md-1">
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
                  </Col>
                </div>
              ) : (
                ""
              )}
            </Row>
          </div>
          <hr />
        </ModalBody>

        <div className="modal-footer footer-model">
          <div className="col-sm-12">
            <div className="row">
              <div className="col-sm-12 PadR0 ItemInfo-right">
                <div className="pull-right">
                  {type === "WhiteList" ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={confirmDisable}
                      type="button"
                      onClick={WishListTask}
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      type="button"
                      disabled={confirmDisable}
                      onClick={assignTask}
                    >
                      Confirm
                    </button>
                  )}

                  <button
                    type="button"
                    data-dismiss="modal"
                    className="btn btn-secondary btn-sm ml-2"
                    onClick={() => closeModal()}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>

    {PolicyPopupShow ? (
      <AssignPolicyPopup
        AssignPopupcallback={AssignPopupcallback}
        whiteListFailCount={whiteListFailCount}
        checkboxSelectData={checkboxSelectData}
        id={policyId}
        props={props}
        type={type}
      />
    ) : (
      ""
    )}
  </>)
}
