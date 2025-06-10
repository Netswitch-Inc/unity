// ** React Imports
import React, { useCallback, useState } from 'react';

// ** Reactstrap Imports
import { Modal } from 'react-bootstrap';
import { Col, Row, Label } from 'reactstrap';

const SelectFramewroksModal = ({
    open,
    closeModal,
    compliance,
    frameworkItems,
    handleSetTiles,
    updateComplianceTiles
}) => {
    // ** States
    const [selectFramework, setSelectFramework] = useState([])

    const handleReset = useCallback(() => {
        closeModal();
        setSelectFramework([]);
    }, [closeModal])

    const handleModalOpen = () => {
        setSelectFramework(compliance || []);
    }

    const getCheckedSelectedValues = (item = null) => {
        if (item?._id) {
            const frameItem = selectFramework.find((x) => x._id === item._id) || null;
            if (frameItem?._id) { return true; }
        }

        return false
    }

    const handleSelectFramework = (item = null, checked = false) => {
        const selectedItms = [...selectFramework]
        if (item?._id) {
            const ind = selectedItms.findIndex((x) => x._id === item._id)
            if (ind === -1 && checked) { selectedItms.push(item) }
            if (ind !== -1 && !checked) {
                selectedItms.splice(ind, 1)
            }
        }

        setSelectFramework(selectedItms)
    }

    const handleSubmit = () => {
        if (handleSetTiles) {
            handleSetTiles(selectFramework)
        }

        if (updateComplianceTiles) {
            updateComplianceTiles(selectFramework)
        }

        handleReset();
    }

    return (
        <Modal
            centered
            size="xl"
            show={open}
            backdrop="static"
            onShow={handleModalOpen}
            className="UpdateUserPopup modal-design"
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header>
                <span className='modal-title col-sm-12' id="example-modal-sizes-title-lg">
                    <h3 className='mb-0 mt-0'>Select Framework</h3>
                </span>

                <button type="button" className='Close-button' onClick={handleReset}>×</button>
            </Modal.Header>

            <Modal.Body>
                {frameworkItems?.length ? (
                    <Row className="mt-3">
                        {frameworkItems.map((item, ind) => (
                            <Col key={`${item?._id}-${ind}`} xl={4} lg={6}>
                                <div className="d-inline-block frame-modal d-flex">
                                    <label className="checkbox-box text-center">
                                        <input
                                            type="checkbox"
                                            id={`${item?._id}-${ind}`}
                                            name={`${item?._id}-${ind}`}
                                            className="form-check-input pointer"
                                            checked={getCheckedSelectedValues(item) || false}
                                            onChange={(event) => handleSelectFramework(item, event?.target?.checked)}
                                        />
                                        <span className="checkmark mt-1" htmlFor={`${item?._id}-${ind}`}></span>
                                    </label>
                                    <Label
                                        for={`${item?._id}-${ind}`}
                                        className="form-check-label user-select-none pointer mb-0"
                                    >
                                        {item?.label || ""}
                                    </Label>
                                </div>
                            </Col>
                        ))}

                        <div className="w-100 text-center mt-3 mb-1 buttons">
                            <button
                                type="button"
                                className=" btnprimary"
                                onClick={() => handleSubmit()}
                            >
                                Submit
                            </button>
                        </div>
                    </Row>
                ) : null}
            </Modal.Body>
        </Modal>
    )
}

export default SelectFramewroksModal;
