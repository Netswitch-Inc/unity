import React, { useState, useEffect } from "react";
import { Button, Table } from "reactstrap";
import { ProgressBar } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { FaDownload } from "react-icons/fa";
import { downloadFromStorage } from "../../views/CompilanceControl/cisstore";
import { useDispatch, useSelector } from "react-redux";
function ScoreReportTable({ data }) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.cis);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = (props) => {
    let originalFileName = props.scan_id + "_" + props.filename;
    dispatch(downloadFromStorage({ fileName: originalFileName }));
    // setDownloading(true);
    setShowProgressModal(true);
  };

  useEffect(() => {
    setProgress(store.downloadProgress);
  }, [store.downloadProgress, progress]);

  useEffect(() => {
    if (store.actionFlag !== "Downloading") {
      setShowProgressModal(false);
    }
  }, [store.actionFlag, showProgressModal]);

  return (
    <>
      {/* Progress Modal */}
      <Table>
        <thead className="thead-fixed">
          <tr>
            <th>Hostname</th>
            <th>Version</th>
            <th>Ip</th>
            <th>System</th>
            <th>Profile</th>
            <th>Last Scan</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((val, index) => (
            <tr key={index}>
              <td>{val.hostname}</td>
              <td>{"v" + val.filename.split(" v")[1]}</td>
              <td>{val.ip}</td>
              <td>{val.filename}</td>
              <td>{val.profile}</td>
              <td>{val.scanned_date}</td>
              <td className="text-center">
                <Button
                  className="btn btn-primary"
                  onClick={() =>
                    handleDownload({
                      filename: val.originalfile,
                      scan_id: val.scan_id,
                    })
                  }
                >
                  <FaDownload className="m-0" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal
        centered
        show={showProgressModal}
        onHide={() => setShowProgressModal(false)}
        backdrop="static"
      >
        <Modal.Header>
          <span className="modal-title col-sm-12">
            <h3 className='border-bottom pb-2 mb-0 mt-0'>File Downloading{" "}</h3>
          </span>
          <button
            type="button"
            className="Close-button"
            onClick={() => setShowProgressModal(false)}
          >
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <ProgressBar animated now={progress} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ScoreReportTable;
