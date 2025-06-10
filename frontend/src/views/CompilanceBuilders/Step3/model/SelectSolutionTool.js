// ** React Imports
import React, { useCallback, useState } from "react";

// ** Reactstrap Imports
import { Modal } from "react-bootstrap";
import { Col, Row, Label } from "reactstrap";

// ** Utils
import { splitWithPipe, arrayJoinWithPipe } from "utility/Utils";

// ** Third Party Components
import classnames from "classnames";

// ** Tool Icon JSON
import { solutionToolIcons } from "utility/toolIcons";

const SelectSolutionTool = ({
  open,
  closeModal,
  controlItemData,
  handleUpdateToolIcons,
}) => {
  // ** Const
  const min = 1;
  const max = 5;

  // ** States
  const [selectedTools, setSelectedTools] = useState([])

  const handleReset = useCallback(() => {
    closeModal()
    setSelectedTools([])
  }, [closeModal])

  const handleUpdateToolData = useCallback(() => {
    const toolIcons = arrayJoinWithPipe(selectedTools)
    handleUpdateToolIcons(controlItemData, toolIcons)
    handleReset()
  }, [handleUpdateToolIcons, handleReset, controlItemData, selectedTools])

  const handleModalOpen = () => {
    let tools = [];
    if (controlItemData?.tool_icons) {
      tools = splitWithPipe(controlItemData.tool_icons);
    }

    setSelectedTools(tools)
  }

  const handleSelectTool = (item = null) => {
    const toolIcons = [...selectedTools];
    if (item?.key) {
      const ind = toolIcons.findIndex((x) => x === item.key);
      if (ind >= 0 && toolIcons.length === min) {
        return;
      }

      if (ind >= 0) {
        toolIcons.splice(ind, 1);
      } else {
        toolIcons.push(item.key);
      }
    }

    setSelectedTools(toolIcons)
  }

  const handleSubmitTool = () => {
    handleUpdateToolData()
  }

  return (
    <Modal
      centered
      size="xl"
      show={open}
      backdrop="static"
      onShow={handleModalOpen}
      className="modal-design"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header>
        <span
          className="modal-title col-sm-12"
          id="example-modal-sizes-title-lg"
        >
          <h3 className="mb-0 mt-0">Select Solution</h3>
        </span>

        <button type="button" className="Close-button" onClick={handleReset}>
          ×
        </button>
      </Modal.Header>

      <Modal.Body>
        <Row className="mt-3">
          {solutionToolIcons?.length ? (
            solutionToolIcons.map((item, ind) => {
              const isSelected = selectedTools.includes(item?.key);
              const isDisabled = selectedTools?.length >= max && !isSelected;

              return (
                <Col key={`${ind}-${item?.key}`} xl={6} lg={6} className="mb-2 pl-2">
                  <Label className={classnames("modal-checkbox h-100", {
                    'is-selected': isSelected,
                    'is-disabled': isDisabled
                  })}>
                    <input
                      type="checkbox"
                      id={item?.key}
                      name={item?.key}
                      value={item?.key}
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => handleSelectTool(item)}
                      className="form-check-input"
                      style={{ display: "none", cursor: isDisabled ? "not-allowed" : "pointer" }}
                    />
                    <img
                      width={25}
                      height={25}
                      alt="Source"
                      src={item?.source}
                      className="img-fluid"
                    />
                    <span className="form-check-label">{item?.value}</span>
                  </Label>
                </Col>
              )
            })
          ) : null}

          <div className="w-100 text-center mt-3 mb-1 buttons">
            <button
              type="button"
              className="btnprimary"
              onClick={handleSubmitTool}
            >
              Submit
            </button>
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default SelectSolutionTool;
