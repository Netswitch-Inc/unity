// ** React Imports
import React, { useCallback, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { createRole, updateRole } from "../store";

import { Modal, Form as BootstrapForm, Row, Col } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const AddNewRoleModal = ({
    open,
    closeModal,
    roleItemData,
    resetRoleItemData
}) => {
    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.roles);

    const RoleSchema = Yup.object({
        name: Yup.string().required('Role name is required.')
    });

    const handleModalClose = useCallback(() => {
        closeModal();
        resetRoleItemData();
    }, [closeModal, resetRoleItemData])

    useEffect(() => {
        const actionEvent = ["ROLE_CREATED", "ROLE_UPDATED"];
        if (actionEvent.includes(store?.actionFlag)) {
            handleModalClose();
        }
    }, [handleModalClose, store.actionFlag])

    const onSubmit = (values) => {
        if (values) {
            const payload = {
                _id: values?._id || "",
                name: values?.name || "",
                status: 1
            }

            if (payload?._id) {
                dispatch(updateRole(payload));
            } else {
                dispatch(createRole(payload));
            }
        }
    }

    return (
        <Modal
            centered
            size="lg"
            show={open}
            backdrop="static"
            className="UpdateUserPopup modal-design"
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header>
                <span className='modal-title col-sm-12' id="example-modal-sizes-title-lg">
                    <h3 className='mb-0 mt-0'>{roleItemData?._id ? "Edit" : "Add"} Role</h3>
                </span>

                <button type="button" className='Close-button' onClick={handleModalClose}>×</button>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={roleItemData}
                    enableReinitialize={roleItemData}
                    validationSchema={RoleSchema}
                    onSubmit={onSubmit}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Row className="mb-2 mt-3">
                                <Col md={12}>
                                    <BootstrapForm.Group controlId="formGridRoleName">
                                        <BootstrapForm.Label>Role Name</BootstrapForm.Label>
                                        <Field
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="Enter name"
                                        />
                                        {errors.name && touched.name && (
                                            <div className="invalid-feedback d-block">
                                                {errors.name}
                                            </div>
                                        )}
                                    </BootstrapForm.Group>
                                </Col>
                            </Row>
                                        
                            <div className="w-100 PadR0 ItemInfo-right mt-3">
                                <div className="row justify-content-between m-0 buttons">
                                    <button type="submit" className="float-end btnprimary">
                                        Submit
                                    </button>

                                    <button type="button" onClick={handleModalClose} className="float-end btnprimary">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default AddNewRoleModal;
