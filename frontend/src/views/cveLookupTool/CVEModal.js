import React from "react";
import { Button, Col, Modal, ModalBody, Row } from "reactstrap";

const CVEModal = (props) => {
  let { ModalToggle, setModalToggle, data } = props;

  const closeModal = () => {
    setModalToggle(!ModalToggle);
  };

  return (<>
    <Modal isOpen={ModalToggle} className="assigntask-modal">
      <div className="modal-header justify-content-center">
        <button
          aria-hidden={true}
          className="close"
          data-dismiss="modal"
          type="button"
          onClick={closeModal}
        >
          <i className="tim-icons icon-simple-remove" />
        </button>
        <h4 className="title title-up">
          <i className="tim-icons icon-upload" /> {data.ID}
        </h4>
      </div>

      <ModalBody className="text-left">
        <div>
          <Row>
            <Col className="pr-md-1" md="12">
              <div className="task-list">
                <Row>
                  <Col className="pr-md-1" md="3">
                    <div className="taskdescription right">
                      <p>Description: </p>
                    </div>
                  </Col>

                  <Col className="pr-md-1" md="9">
                    <div className="taskdescription">
                      <p> {data.description}</p>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col className="pr-md-1" md="3">
                    <div className="taskdescription right">
                      <p>Published Date:</p>
                    </div>
                  </Col>

                  <Col className="pr-md-1" md="9">
                    <div className="taskdescription">
                      <p>{data.publishedDate}</p>
                    </div>
                  </Col>
                </Row>

                <Row>
                  {data.reference ? (<>
                    <Col className="pr-md-1" md="3">
                      <div className="taskdescription right">
                        <p>
                          Reference
                          <i className="tim-icons icon-link-72"></i> :{" "}
                        </p>
                        <span> </span>
                      </div>
                    </Col>

                    <Col className="pr-md-1" md="9">
                      <div className="taskdescription">
                        <p>
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={data.reference[0].url}
                          >
                            {data.reference[0].url}
                          </a>
                        </p>
                      </div>
                    </Col>
                  </>) : null}
                </Row>
              </div>
            </Col>
          </Row>
          <hr />

          <Row>
            <Col className="pr-md-1" md="6">
              <div className="task-list">
                <p> 2 Affected Hosts:</p>
                <div className="taskblue-box">
                  <ul>
                    <li>
                      <strong>Host</strong>{" "}
                      <span>
                        <strong>IP</strong>
                      </span>
                    </li>

                    <li>
                      esxi-host-SAC01<span>10.10.10.26</span>
                    </li>

                    <li>
                      esxi-host-SAC02<span>10.10.10.27</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>

            <Col className="pr-md-1" md="6">
              <div className="task-list-form">
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" className="form-control"></input>
                </div>

                <div className="form-group">
                  <label>Assign To</label>
                  <select className="form-control">
                    <option>John Don</option>
                    <option>Billy Jones</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea className="form-control"></textarea>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </ModalBody>

      <div className="modal-footer">
        <Button color="default" type="button" onClick={closeModal}>
          Assign
        </Button>

        <Button
          color="danger"
          data-dismiss="modal"
          type="button"
          onClick={closeModal}
        >
          Close
        </Button>
      </div>
    </Modal>
  </>)
}

export default CVEModal;
