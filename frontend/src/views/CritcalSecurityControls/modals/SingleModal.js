import React from "react";
import { Button, Row, Col, ModalBody, Modal } from "reactstrap";

export default function BulkModel(props) {
  let { ModalToggle, setModalToggle, data, type } = props;

  const closeModal = () => {
    setModalToggle(!ModalToggle);
  };

  return (
    <Modal isOpen={ModalToggle} className="assigntask-modal">
      <div className="modal-header justify-content-center assign-task-modal-heading">
        <button
          aria-hidden={true}
          className="close"
          data-dismiss="modal"
          type="button"
          onClick={(e) => {
            setModalToggle(!ModalToggle);
          }}
        >
          <i className="tim-icons icon-simple-remove" />
        </button>
        <h6 className="title title-up">{type} TASK </h6>
        <h6 className="title title-up"> {data[0].Description} </h6>
      </div>

      <ModalBody>
        <div>
          <Row>
            <Col className="pr-md-1" md="12">
              <div className="task-list">
                <Row>
                  <Col className="pr-md-1" md="3">
                    <div className="taskdescription right">
                      <p>Description</p>
                    </div>
                  </Col>
                  <Col className="pr-md-1" md="9">
                    <div className="taskdescription">
                      <p> {data[0].Description}</p>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col className="pr-md-1" md="3">
                    <div className="taskdescription right">
                      <p>Rationale:</p>
                    </div>
                  </Col>
                  <Col className="pr-md-1" md="9">
                    <div className="taskdescription">
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Maxime mollitia, molestiae quas
                      </p>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col className="pr-md-1" md="3">
                    <div className="taskdescription right">
                      <p>Remediation</p>
                    </div>
                  </Col>
                  <Col className="pr-md-1" md="9">
                    <div className="taskdescription">
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Maxime mollitia, molestiae quas
                      </p>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col className="pr-md-1" md="3">
                    <div className="taskdescription right">
                      <p>Impact</p>
                    </div>
                  </Col>
                  <Col className="pr-md-1" md="9">
                    <div className="taskdescription">
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Maxime mollitia, molestiae quas
                      </p>
                    </div>
                  </Col>
                </Row>

                <div className="task-list-form taskdescription-form">
                  {type === "Assign" ? (
                    <>
                      <Row>
                        <Col className="pr-md-1" md="3">
                          <div className="form-group">
                            <label>Due Date:</label>
                          </div>
                        </Col>
                        <Col className="pr-md-1" md="5">
                          <div className="form-group">
                            <input type="date" className="form-control"></input>
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col className="pr-md-1" md="3">
                          <div className="form-group">
                            <label>Assign To:</label>
                          </div>
                        </Col>
                        <Col className="pr-md-1" md="4">
                          <div className="form-group">
                            <select className="form-control"></select>
                          </div>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <Row>
                        <Col className="pr-md-1" md="3">
                          <div className="form-group">
                            <label>Reason:</label>
                          </div>
                        </Col>
                        <Col className="pr-md-1" md="6">
                          <div className="form-group">
                            <textarea className="form-control"></textarea>
                            <label>
                              <input
                                type="checkbox"
                                className="cursor-pointer"
                              ></input>{" "}
                              Apply to all the hosts
                            </label>
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <hr />
      </ModalBody>
      <div className="modal-footer">
        <Button color="default" type="button" onClick={() => closeModal()}>
          Confirm
        </Button>
        <Button
          color="danger"
          data-dismiss="modal"
          type="button"
          onClick={() => closeModal()}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
}
