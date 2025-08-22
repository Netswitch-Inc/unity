// ** React Imports
import React, { useState, useEffect, useCallback } from "react";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { cleanContactMessage, toolSolutionContact } from "views/contacts/store";

// ** Reactstrap Imports
import { Col, Row, FormFeedback } from "reactstrap";
import { Modal, Form as BootstrapForm } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

const ContactUsModal = ({
    isOpen,
    closeModal,
    authUserItem,
    toolItemData,
    selectedControl
}) => {
    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.contact);

    // ** Const
    const initContactSchema = { name: authUserItem?.name || "", email: authUserItem?.email || "", subject: `UnityRI Solution Inquiry`, message: "" }

    // ** States
    const [showSnackBar, setShowSnackbar] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");

    const ContactSchema = yup.object({
        name: yup.string().required("Name is required."),
        email: yup.string().required("Email is required.")
            .email("Invalid email address."),
        message: yup.string().required("Message is required.")
    })

    const handleReset = useCallback(() => {
        closeModal();
    }, [closeModal])

    const handleModalOpen = () => {
    }

    useEffect(() => {
        if (store.actionFlag === "TOOL_SOL_CONT") {
            setTimeout(() => { handleReset(); }, 1000)
        }

        if (store.actionFlag || store.success || store.error) {
            dispatch(cleanContactMessage(null));
        }

        if (store.success) {
            setShowSnackbar(true);
            setSnackMessage(store.success);
        }

        if (store.error) {
            setShowSnackbar(true);
            setSnackMessage(store.error);
        }
    }, [dispatch, handleReset, store.error, store.success, store.actionFlag])

    useEffect(() => {
        setTimeout(() => {
            setShowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    const handleSubmit = (values) => {
        if (values) {
            const payload = { ...values }

            if (selectedControl?.framework_id?.label) {
                payload.framework_name = selectedControl.framework_id.label;
            }

            if (selectedControl?.name) {
                payload.control_name = selectedControl.name;
            }

            if (toolItemData?.value) {
                payload.tool_name = toolItemData.value;
            }

            // console.log("handleSubmit >>> ", payload);
            dispatch(toolSolutionContact(payload));
        }
    }

    return (
        <Modal
            centered
            size="xl"
            backdrop="static"
            show={isOpen !== ""}
            onShow={handleModalOpen}
            className="UpdateUserPopup modal-design"
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <ReactSnackBar Icon={(
                <span><TiMessages size={25} /></span>
            )} Show={showSnackBar}>
                {snackMessage}
            </ReactSnackBar>

            <Modal.Header>
                <span className='modal-title col-sm-12' id="example-modal-sizes-title-lg">
                    <h3 className='mb-0 mt-0'>Contact Us</h3>
                </span>

                <button type="button" className='Close-button' onClick={handleReset}>×</button>
            </Modal.Header>

            {!store?.loading ? (<SimpleSpinner />) : null}

            <Modal.Body>
                <Formik
                    initialValues={initContactSchema}
                    validationSchema={ContactSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="my-2">
                            <Row>
                                <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridName" className="full-width">
                                    <BootstrapForm.Label className="col-label">Name</BootstrapForm.Label>
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        className="col-input w-100"
                                    />
                                    {errors.name && touched.name && (
                                        <FormFeedback className="d-block">{errors?.name}</FormFeedback>
                                    )}
                                </Col>

                                <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridEmail" className="full-width">
                                    <BootstrapForm.Label className="col-label">Email</BootstrapForm.Label>
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="Enter email"
                                        className="col-input w-100"
                                    />
                                    {errors.email && touched.email && (
                                        <FormFeedback className="d-block">{errors?.email}</FormFeedback>
                                    )}
                                </Col>

                                <Col xl={12} lg={12} as={BootstrapForm.Group} controlId="formGridMessage" className="full-width">
                                    <BootstrapForm.Label className="col-label">Message</BootstrapForm.Label>
                                    <Field
                                        as="textarea"
                                        type="textarea"
                                        name="message"
                                        placeholder="Enter message"
                                        className="col-input w-100"
                                    />
                                    {errors.message && touched.message && (
                                        <FormFeedback className="d-block">
                                            {errors?.message}
                                        </FormFeedback>
                                    )}
                                </Col>
                            </Row>

                            <div className="buttons text-center">
                                <button
                                    type="submit"
                                    className="btnprimary"
                                    disabled={!store?.loading}
                                >
                                    Submit
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default ContactUsModal;
