import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Card, CardBody, Button, Col, Row, Table } from "reactstrap";
import Loader from "react-loader";
import * as moment from "moment";

const UploadStatus = ({ tagInputSelectData }) => {
  const [lgShow, setLgShow] = useState(false);
  const [loaded] = useState(true);
  const [uploadStatus] = useState([]);

  const handleClose = () => {
    setLgShow(false);
  };

  const fetchUploadStatus = async () => {
    // console.log("status");
  };

  useEffect(() => {
    fetchUploadStatus();
  }, [lgShow]);

  if (
    uploadStatus.some((elem) => {
      return (
        elem.status?.toLowerCase() === "Uploaded".toLowerCase() ||
        elem.status?.toLowerCase() === "In process".toLowerCase()
      );
    })
  ) {
    setTimeout(() => {
      fetchUploadStatus();
    }, [30000]);
  }

  return (
    <div>
      <Button
        className="btn btn-primary mr-3 "
        onClick={() => setLgShow(true)}
        disabled={
          (tagInputSelectData?.label === "CIS V7.1" ||
            tagInputSelectData?.label === "CIS V8") === true
            ? false
            : true
        }
      >
        Upload Status
      </Button>

      <Modal
        centered
        className="UpdateUserPopup"
        size="lg"
        show={lgShow}
        backdrop="static"
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <span className="modal-title col-sm-12">
            <h3 className='border-bottom pb-2 mb-0 mt-0'>File Upload Status</h3>
          </span>
          <button type="button" className="Close-button" onClick={handleClose}>
            ×
          </button>
        </Modal.Header>

        <Loader
          loaded={loaded}
          lines={13}
          length={10}
          width={5}
          radius={30}
          corners={1}
          rotate={0}
          direction={1}
          color="#2774f6"
          speed={1}
          trail={60}
          shadow={false}
          hwaccel={false}
          className="spinner"
          zIndex={2e9}
          top="40%"
          left="50%"
          scale={1.0}
          loadedClassName="loadedContent"
        />
        <Modal.Body>
          <div className="content ">
            <Row>
              <Col lg="12">
                <Card className="p-3 border">
                  <CardBody>
                    <div className="scroll">
                      <Table className="uploadStatus">
                        <thead>
                          <tr>
                            <th>File Name</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {uploadStatus.map((status) => (
                            <tr key={status.id}>
                              <td>{status.fileName}</td>
                              <td>
                                {moment(status.uploaded_at).format(
                                  "YYYY-MM-DD"
                                )}
                              </td>
                              <td>{status.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UploadStatus;
