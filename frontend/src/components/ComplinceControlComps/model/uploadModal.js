import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-bootstrap/Modal";
import { Card, CardBody, Button, Col, Row } from "reactstrap";
import { FaCloudUploadAlt } from "react-icons/fa";
import ReactSnackBar from "react-js-snackbar";
import Loader from "react-loader";
import { TiMessages } from "react-icons/ti";

const UploadModal = ({
  tagInputSelectData,
  isComplianceGraphLoaded = true,
}) => {
  const [lgShow, setLgShow] = useState(false);
  const [file, setFile] = useState(null);
  const [loaded, setLoaded] = useState(true);
  const [uploadOnceClick, setuploadOnceClick] = useState(false);
  const [SnackMessage] = useState();
  const [showSnackBar, setshowSnackbar] = useState(false);

  const handleClose = () => {
    setuploadOnceClick(true);
    setLgShow(false);
    setFile(null);
  };

  function handleChange(event) {
    setFile(event.target.files[0]);
    setuploadOnceClick(false);
  }

  let handleSubmit = async (event) => {
    setuploadOnceClick(true);
    event.preventDefault();
    setLoaded(false);
    const formData = new FormData();
    const uuid = uuidv4();
    formData.append("file", file);
    formData.append("uuid", uuid);
    formData.append("fileName", file.name);
    setLoaded(true);
    handleClose();
  };

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
      //  setLgShow(false);
    }, 5000);
  }, [showSnackBar]);

  return (
    <div>
      <Button
        className="btn btn-primary mr-3 "
        onClick={() => setLgShow(true)}
        disabled={
          (tagInputSelectData?.label === "CIS V7.1" ||
            tagInputSelectData?.label === "CIS V8") &&
            isComplianceGraphLoaded
            ? false
            : true
        }
      >
        Upload Report <FaCloudUploadAlt size={20} />
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
            <h3 className='border-bottom pb-2 mb-0 mt-0'>Choose CIS Benchmark File for Upload</h3>
          </span>
          <button type="button" className="Close-button" onClick={handleClose}>
            ×
          </button>
        </Modal.Header>

        <ReactSnackBar
          Icon={
            <span>
              <TiMessages size={25} />
            </span>
          }
          Show={showSnackBar}
        >
          {SnackMessage}
        </ReactSnackBar>

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
                    <form onSubmit={handleSubmit}>
                      <div className="d-flex flex-wrap align-items-baseline justify-content-between mx-4 px-4">
                        <div className="py-4">
                          <input
                            type="file"
                            name="file"
                            accept="text/html"
                            onChange={handleChange}
                          />
                          <div>
                            <small>
                              *CIS HTML Benchmark File are Supported
                            </small>
                          </div>
                        </div>
                        <div className="py-4">
                          <button
                            className="btn btn-primary m-0"
                            disabled={
                              file === null || uploadOnceClick === true
                                ? true
                                : false
                            }
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    </form>
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

export default UploadModal;
