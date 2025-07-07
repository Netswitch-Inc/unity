// ** React Imports
import React, { useState, useCallback } from "react";

// ** Reactstrap Imports
import {
  Col,
  Row,
  Modal,
  Table,
  Button,
  ModalBody
} from "reactstrap";

// ** Utils
import { solutionToolIcons } from "utility/toolIcons";

// ** Modals
import ContactUsModal from "./ContactUsModal";

const ToolDetailModal = ({
  isOpen,
  closeModal,
  authUserItem,
  selectedControl
}) => {
  // ** States
  const [toolItemData, setToolItemData] = useState(null)
  const [openModal, setOpenModal] = useState("")

  const openContactModal = () => {
    setOpenModal("tool")
  }

  const closeContactModal = () => {
    setOpenModal("")
  }

  const handleReset = useCallback(() => {
    closeModal();
    setToolItemData(null);
  }, [closeModal])

  const handleModalOpen = () => {
    const toolData = solutionToolIcons.find((x) => x.key === isOpen) || null;
    setToolItemData(toolData)
  }

  const rowCount = Math.max(
    toolItemData?.functions?.length || 0,
    toolItemData?.paid_tools?.length || 0,
    toolItemData?.os_tools?.length || 0
  )

  const rows = Array.from({ length: rowCount }, (_, idx) => (
    <tr key={idx}>
      <td>{toolItemData?.functions[idx]?.name || ""}</td>
      <td>{toolItemData?.paid_tools[idx]?.name || ""}</td>
      <td>{toolItemData?.os_tools[idx]?.name || ""}</td>
    </tr>
  ))

  return (
    <Modal
      size="xl"
      toggle={handleReset}
      isOpen={isOpen !== ""}
      onOpened={handleModalOpen}
      className="assigntask-modal assigntask-modalssss bg-white assessment-modal"
    >
      <div className="modal-header justify-content-center bg-white">
        <button
          type="button"
          className="close"
          aria-hidden={true}
          data-dismiss="modal"
          onClick={handleReset}
        >
          <i className="tim-icons icon-simple-remove" />
        </button>
        <h4 className="title title-up">{toolItemData?.value}</h4>
      </div>

      <ModalBody className="bg-white mb-4">
        <div>
          <Row>
            <Col className="pr-md-1" md={12}>
              <Row>
                <Col className="center" md={12}>
                  <div className="">
                    <p>{toolItemData?.description}</p>
                  </div>
                </Col>
              </Row>

              <Row className="common-table">
                <Col>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Function</th>
                        <th>Paid Tools</th>
                        <th>OS Tools</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </ModalBody>

      <div className="modal-footer justify-content-end bg-white">
        <Button
          type="button"
          color="btn-wd"
          data-dismiss="modal"
          onClick={openContactModal}
        >
          Contact us
        </Button>
      </div>

      <ContactUsModal
        isOpen={openModal}
        closeModal={closeContactModal}
        authUserItem={authUserItem}
        toolItemData={toolItemData}
        selectedControl={selectedControl}
      />
    </Modal>
  )
}

export default ToolDetailModal;
