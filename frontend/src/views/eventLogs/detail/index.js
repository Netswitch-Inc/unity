/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getEventLog, cleanEventLogMessage } from "../store";

// ** Reactstrap Imports
import { Col, Row, FormGroup } from "reactstrap";

// ** Utils
import { isObjEmpty, getFormatDate } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { statusEnum } from "utility/reduxConstant";

const EventLogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const store = useSelector((state) => state.eventLogs);

  // ** States
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  useLayoutEffect(() => {
    dispatch(getEventLog({ id }));
  }, [dispatch, id])

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanEventLogMessage(null));
    }

    if (store?.success) {
      setShowSnackbar(true);
      setSnakbarMessage(store.success);
    }

    if (store?.error) {
      setShowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [dispatch, navigate, store.actionFlag, store.success, store.error, store.userItem])

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

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

        if (typeof value === "object") {
          value = JSON.stringify(value);
        }

        return (
          <tr key={key}>
            <th>{key}:</th>
            <td>{value}</td>
          </tr>
        );
      }
    }

    return null;
  };

  return (
    <div className="content">
      {!store?.loading ? <SimpleSpinner /> : null}

      <ReactSnackBar Icon={(
        <span><TiMessages size={25} /></span>
      )} Show={showSnackBar}>
        {snakebarMessage}
      </ReactSnackBar>

      <div className="p-0 role-name d-flex justify-content-between mb-3">
        <h3 className="card-title mb-0 mt-0">{""}</h3>
        <div className="buttons black-btn">
        <button
          type="button"
          className="btnprimary"
          onClick={() => navigate("/admin/event-logs")}
        >
          Back
        </button>
        </div>
      </div>

      <div>
        {store.eventLogItem?._id ? (<>
          <Row className="log-details mb-4">
            {/* Event Type and Event Action in the same row */}
            <Col md={6}>
              <FormGroup className="d-flex mb-2">
                <label className="mb-0 font-weight-bold">Event Type:</label>
                <p className="mb-0 text-white ml-1">
                  {store.eventLogItem?.type || ""}
                </p>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="d-flex mb-2">
                <label className="mb-0 font-weight-bold">
                  Event Action:
                </label>
                <p className="mb-0 text-white ml-1">
                  {store.eventLogItem?.action || ""}
                </p>
              </FormGroup>
            </Col>

            {/* Updated Date and Created Date in the same row */}
            <Col md={6}>
              <FormGroup className="d-flex mb-2">
                <label className="mb-0 font-weight-bold">
                  Updated Date:
                </label>
                <p className="mb-0 text-white ml-1">
                  {store.eventLogItem?.updatedAt
                    ? getFormatDate(
                      store.eventLogItem.updatedAt,
                      "DD-MMM-YYYY HH:mm:ss"
                    )
                    : null}
                </p>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="d-flex mb-2">
                <label className="mb-0 font-weight-bold">
                  Created Date:
                </label>
                <p className="mb-0 text-white ml-1">
                  {store.eventLogItem?.createdAt
                    ? getFormatDate(
                      store.eventLogItem.createdAt,
                      "DD-MMM-YYYY HH:mm:ss"
                    )
                    : null}
                </p>
              </FormGroup>
            </Col>

            {/* Action by field (if present) */}
            {store.eventLogItem?.action_user_id?.name && (
              <Col md={6}>
                <FormGroup className="d-flex mb-2">
                  <label className="mb-0 font-weight-bold">
                    Action by:
                  </label>
                  <p className="mb-0 text-white ml-1">
                    {store.eventLogItem.action_user_id.name}
                  </p>
                </FormGroup>
              </Col>
            )}

            {/* Description field taking full width */}
            <Col md={6}>
              <FormGroup className="d-flex mb-2">
                <label className="mb-0 font-weight-bold">
                  Description:
                </label>
                <p className="mb-0 text-white ml-1">
                  {store.eventLogItem?.description || ""}
                </p>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            {store.eventLogItem?.previous_data &&
              !isObjEmpty(store.eventLogItem.previous_data) ? (
              <Col lg={6} className="event-log-details-table">
                <div className="content-wrap h-100">
                  <h4 className="mb-0">Previous Version</h4>
                  <div className="table-container">
                    <table className="w-100">
                      <tbody>
                        {Object.keys(store.eventLogItem.previous_data).map(
                          (key) =>
                            handleDisplayJsonData(
                              key,
                              store.eventLogItem.previous_data
                            )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
            ) : null}

            {store.eventLogItem?.current_data &&
              !isObjEmpty(store.eventLogItem.current_data) ? (

              <Col
                lg={store.eventLogItem?.previous_data ? 6 : 12}
                className="event-log-details-table"
              >
                <div className="content-wrap h-100">
                  <h4 className="mb-0">Current Version</h4>
                  <div className="table-container">
                    <table className="w-100">
                      <tbody>
                        {Object.keys(store.eventLogItem.current_data).map(
                          (key) =>
                            handleDisplayJsonData(
                              key,
                              store.eventLogItem.current_data
                            )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>

            ) : null}
          </Row>
        </>) : null}
      </div>
    </div>
  )
}

export default EventLogDetail;
