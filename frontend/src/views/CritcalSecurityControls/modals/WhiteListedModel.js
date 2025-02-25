import { useState } from "react";

import Modal from "react-bootstrap/Modal";

const WhiteListedModel = ({ AssignPopupcallback, id }) => {
  const [showpPop, setShowPopup] = useState(true);
  const handleClose = () => {
    AssignPopupcallback();
    setShowPopup(false);
  };
  const [policyData] = useState([]);

  return (<>
    <Modal
      className="UpdateUserPopup"
      size="lg"
      show={showpPop}
      onHide={() => setShowPopup(false)}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header>
        <span
          className="modal-title col-sm-12 "
          id="example-modal-sizes-title-lg"
        >
          <h3 className="border-bottom pb-2 mb-0 mt-0">White Listed</h3>
        </span>
        <button type="button" className="Close-button" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="minHeight400">
          <div className="content">
            <div className="AssignedPolicyPopup">
              <div className="tbl-header">
                <table className="compareTable comparePolicyTable">
                  <thead>
                    <tr>
                      <th>SeqNo</th>
                      <th>Policy</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div className="tbl-content ">
                <table className="compareTable comparePolicyTable">
                  <tbody>
                    {policyData.map((item, index) => {
                      return (<>
                        {item.result === "Pass" && (
                          <tr className="table-body-content" key={index}>
                            <td>{item?.sequenceNumber}</td>
                            <td>{item.policyName}</td>
                            <td>{item?.result}</td>
                          </tr>
                        )}
                      </>);
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </>)
}

export default WhiteListedModel;
