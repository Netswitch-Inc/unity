import { Modal } from "react-bootstrap";

import { Col, Row, FormGroup } from "reactstrap";

// ** Utils
import { isObjEmpty, getFormatDate } from "utility/Utils";

// ** Constant
import { statusEnum } from "utility/reduxConstant";

const EventLogDetailModal = ({ open, closeModal, eventLogDetailItem }) => {

  const handleModalClose = () => {
    closeModal();
  }

  const handleDisplayJsonData = (key = "", jsonData = null) => {
    const exceptKeys = [
      "_id",
      "company_id",
      "role_id",
      "user_id",
      "framework_id",
      "involved_parties",
      "submitted_by",
      "company_compliance_control_id",
      "password",
      "logo",
      "image",
      "retry_count",
      "is_super",
      "is_default",
      "weightIndex",
      "priviledges",
      "users_ai_description",
      "__v",
    ];

    if (key && jsonData && !isObjEmpty(jsonData) && !exceptKeys.includes(key)) {
      if (jsonData[key] || jsonData[key] === 0) {
        let value = jsonData[key];
        if (key === "status" && typeof value === "number") {
          value = statusEnum[value] || ""; // Ensure statusEnum is defined or imported
        }

        return (
          <tr key={key}>
            <th>
              {key}:
            </th>
            <td>
              {value}
            </td>
          </tr>
        )
      }
    }

    return null;
  }

  return (
    <Modal
      centered
      size="lg"
      show={open}
      backdrop="static"
      className=""
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header>
        <span
          className="modal-title col-sm-12"
          id="example-modal-sizes-title-lg"
        >
          <h3 className="border-bottom pb-2 mb-0 mt-0">Event Log Detail</h3>
        </span>

        <button
          type="button"
          className="Close-button"
          onClick={handleModalClose}
        >
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        {eventLogDetailItem?._id ? (<>
          <div className="event-log-details mb-4 border-bottom">
            <Row>
              {/* Event Type and Event Action in the same row */}
              <Col lg={6}>
                <FormGroup className="d-flex mb-2">
                  <label className="mb-0 font-weight-bold">Event Type:</label>
                  <p className="mb-0 text-white">
                    {eventLogDetailItem?.type || ""}
                  </p>
                </FormGroup>
              </Col>

              <Col lg={6}>
                <FormGroup className="d-flex mb-2">
                  <label className="mb-0 font-weight-bold">Event Action:</label>
                  <p className="mb-0 text-white">
                    {eventLogDetailItem?.action || ""}
                  </p>
                </FormGroup>
              </Col>

              {/* Updated Date and Created Date in the same row */}
              <Col lg={6}>
                <FormGroup className="d-flex mb-2">
                  <label className="mb-0 font-weight-bold">Updated Date:</label>
                  <p className="mb-0 text-white">
                    {eventLogDetailItem?.updatedAt ? getFormatDate(eventLogDetailItem.updatedAt, "DD-MMM-YYYY HH:mm:ss") : null}
                  </p>
                </FormGroup>
              </Col>

              <Col lg={6}>
                <FormGroup className="d-flex mb-2">
                  <label className="mb-0 font-weight-bold">Created Date:</label>
                  <p className="mb-0 text-white">
                    {eventLogDetailItem?.createdAt ? getFormatDate(eventLogDetailItem.createdAt, "DD-MMM-YYYY HH:mm:ss") : null}
                  </p>
                </FormGroup>
              </Col>

              {/* Action by field (if present) */}
              {eventLogDetailItem?.action_user_id?.name && (
                <Col lg={12}>
                  <FormGroup className="d-flex mb-2">
                    <label className="mb-0 font-weight-bold">Action by:</label>
                    <p className="mb-0 text-white">
                      {eventLogDetailItem.action_user_id.name}
                    </p>
                  </FormGroup>
                </Col>
              )}

              {/* Description field taking full width */}
              <Col lg={12}>
                <FormGroup className="d-flex mb-2">
                  <label className="mb-0 font-weight-bold">Description:</label>
                  <p className="mb-0 text-white">
                    {eventLogDetailItem?.description || ""}
                  </p>
                </FormGroup>
              </Col>
            </Row>
          </div>

          <Row>
            {eventLogDetailItem?.previous_data && !isObjEmpty(eventLogDetailItem.previous_data) ? (
              <Col lg={6} className="event-log-details-table">
                <div className="content-wrap h-100">
                  <h4 className="mb-2">Previous Version</h4>
                  <table className="w-100">
                    <tbody>
                      {Object.keys(eventLogDetailItem.previous_data).map(
                        (key) => handleDisplayJsonData(key, eventLogDetailItem.previous_data)
                      )}
                    </tbody>
                  </table>
                </div>
              </Col>
            ) : null}

            {eventLogDetailItem?.current_data && !isObjEmpty(eventLogDetailItem.current_data) ? (<>
              <Col lg={eventLogDetailItem?.previous_data ? 6 : 12} className="event-log-details-table">
                <div className="content-wrap h-100">
                  <h4 className="mb-2">Current Version</h4>
                  <table className="w-100">
                    <tbody>
                      {Object.keys(eventLogDetailItem.current_data).map(
                        (key) => handleDisplayJsonData(key, eventLogDetailItem.current_data)
                      )}
                    </tbody>
                  </table>
                </div>
              </Col>
            </>) : null}
          </Row>
        </>) : null}
      </Modal.Body>
    </Modal>
  )
}

export default EventLogDetailModal;
