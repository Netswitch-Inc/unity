// ** React Imports
import React, { useCallback } from "react";

// ** Reactstrap Imports
import { Button, Table } from "reactstrap";
import { Modal } from "react-bootstrap";

// ** Utils
import { getFormatDate } from "utility/Utils";

const CompliancePrioritiesList = ({
  open,
  closeModal,
  compliancePriorities = []
}) => {
  const handleReset = useCallback(() => {
    closeModal();
  }, [closeModal])

  const handleModalOpen = () => {
  }
  
  return (
    <Modal
      centered
      size="lg"
      show={open}
      backdrop="static"
      onShow={handleModalOpen}
      className="UpdateUserPopup modal-design"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header>
        <span
          className="modal-title col-sm-12"
          id="example-modal-sizes-title-lg"
        >
          <h3 className="mb-0 mt-0">Saved Priorities</h3>
        </span>
        <Button
          type="button"
          className="Close-button d-flex align-item-center justify-content-center"
          onClick={handleReset}
        >
          ×
        </Button>
      </Modal.Header>

      <Modal.Body>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {compliancePriorities.map((item, index) => (
              <tr key={index}>
                <td className="text-white">{item?.name}</td>
                <td>{item?.createdAt ? getFormatDate(item.createdAt, "DD-MM-YYYY HH:mm"): ""}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  )
}

export default CompliancePrioritiesList;
