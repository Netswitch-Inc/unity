import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { downloadFromStorage } from "../../views/resilienceIndex/cisstore";

import { Row, Col } from "reactstrap";
import { ProgressBar } from "react-bootstrap";

import DatatablePagination from "components/DatatablePagination";

import downloadIcon from "../../assets/img/download.png";

import Modal from "react-bootstrap/Modal";

function ScoreReportTable({ data }) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.cis);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = (props) => {
    let originalFileName = props.scan_id + "_" + props.filename;
    dispatch(downloadFromStorage({ fileName: originalFileName }));
    setShowProgressModal(true);
  }

  useEffect(() => {
    setProgress(store.downloadProgress);
  }, [store.downloadProgress, progress]);

  useEffect(() => {
    if (store.actionFlag !== "Downloading") {
      setShowProgressModal(false);
    }
  }, [store.actionFlag, showProgressModal]);

  const columns = [
    {
      name: "Hostname",
      selector: row => row.hostname,
      sortable: true,
    },
    {
      name: "Version",
      selector: row => "v" + (row.filename?.split(" v")[1] || ""),
      sortable: true,
    },
    {
      name: "Ip",
      selector: row => row.ip,
      sortable: true,
    },
    {
      name: "System",
      selector: row => row.filename,
      sortable: true,
    },
    {
      name: "Profile",
      selector: row => (
        <div>{row.profile}</div>
      ),
      sortable: true,
    },
    {
      name: "Last Scan",
      center: true,
      selector: row => (
        <div>{row.scanned_date}</div>
      ),
      sortable: true,
    },
    {
      name: "Download",
      center: true,
      cell: row => (
        <img
          src={downloadIcon}
          alt="download"
          height={25}
          className="cursor-pointer"
          onClick={() =>
            handleDownload({
              filename: row.originalfile,
              scan_id: row.scan_id,
            })
          }
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
    }
  ]


  return (<>
    <div className="content data-list">
      <Row className="resilience-table">
        <Col className="pb-2" md="12">
          <div className="pl-3 pr-3">
            <DatatablePagination
              data={data}
              columns={columns}
              pagination={false}
            // handleSort={false}
            // handlePagination={false}
            // handleRowPerPage={false}
            // rowsPerPage={false}
            />
          </div>
        </Col>
      </Row>
    </div>

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
  </>)
}

export default ScoreReportTable;
