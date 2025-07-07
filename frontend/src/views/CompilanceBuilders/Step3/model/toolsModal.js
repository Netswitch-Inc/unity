import { Button, Col, Row, Media, Modal, ModalBody, } from "reactstrap";
import StarRatings from "react-star-ratings";
import React, { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";

function RenderToolsModal(props) {
  const { data, isOpen, toggle } = props

  const [alert, setAlert] = useState(null);

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Great!"
        onConfirm={() => hideAlert(setAlert)}
        onCancel={() => hideAlert(setAlert)}
        confirmBtnBsStyle="info"
      >
        Thank you for your interest. One of our team will contact you soon!
      </SweetAlert>
    );
  };
  const hideAlert = (setAlert) => {
    toggle(false);
    setAlert(null);
  };

  const closeModal = () => {
    toggle(false);
  }

  function handleContactUS() {
    return successAlert();
  }

  return (
    <Modal
      isOpen={isOpen}
      className="assigntask-modal assigntask-modalssss bg-white assessment-modal"
      toggle={closeModal}
      size="lg"
    >
      <div className="modal-header justify-content-center bg-white">
        <button
          aria-hidden={true}
          className="close"
          data-dismiss="modal"
          type="button"
          onClick={closeModal}
        >
          <i className="tim-icons icon-simple-remove" />
        </button>
        <h4 className="title title-up">{data.toolType}</h4>
      </div>

      <ModalBody className="bg-white">
        <div>
          {/* recommendation text */}
          {alert}
          <Row>
            <Col className="pr-md-1" md="12">
              <Row>
                <Col className="center" md="11">
                  <div className="">
                    <p>{data?.toolTypeDescription}</p>
                  </div>
                </Col>
              </Row>
              <hr />

              <Row>
                {data?.data?.map((tool) => (
                  <Media key={tool?.id} className="tools-media">
                    <Media>
                      <Media
                        src={tool.logoPath}
                        alt="Generic placeholder image"
                        width={100}
                      // height={100}
                      />
                    </Media>
                    <Media body>
                      <Media heading style={{ color: "black" }}>
                        {tool.name}
                      </Media>
                      <StarRatings
                        rating={tool.rating}
                        starDimension="15px"
                        starSpacing="1px"
                      />
                      <br />
                      <p > {tool.desc}</p>

                    </Media>
                  </Media>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </ModalBody>
      <div className="modal-footer justify-content-end bg-white">
        <Button
          color="btn-wd"
          data-dismiss="modal"
          type="button"
          onClick={handleContactUS}
        >
          Contact us
        </Button>
      </div>
      {alert}
    </Modal>
  )
}

export default RenderToolsModal;