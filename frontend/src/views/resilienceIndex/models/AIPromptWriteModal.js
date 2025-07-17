// ** React Imports
import React, { useState, useEffect, useCallback } from "react";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { cleanAIPromptMessage, writeDescriptionWithAI } from "views/aiPrompts/store";
import { updateCompanyComplianceControl } from "views/companyComplianceControls/store";

// ** Reactstrap Imports
import { Col, Row, FormFeedback, Label } from "reactstrap";
import { Modal, Form as BootstrapForm } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

const AIPromptWriteModal = ({
    isOpen,
    closeModal,
    selectedControl,
    handleUpdateDescription
}) => {
    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.aiPrompt);
    const companyComplianceControlStore = useSelector((state) => state.companyComplianceControls);

    // ** Const
    const writeTypes = ["cis", "sub-edit-dec"];
    const initValues = { name: selectedControl?.name || "", description: selectedControl?.description || "", keywords: "" }

    // ** States
    const [showSnackBar, setShowSnackbar] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [formItem, setFormItem] = useState(initValues);
    const [viewType, setViewType] = useState("");
    const [optDecInd, setOptDecInd] = useState("");
    const [decValue, setDecValue] = useState("");

    const ValidationSchema = yup.object({
        // keywords: yup.string().required("Keywords is required.")
    })

    const DescriptionSchema = yup.object({
        description: yup.string().required("Description is required.")
    })

    const handleReset = useCallback(() => {
        closeModal();
        setDecValue("");
        setViewType("");
        setOptDecInd("");
    }, [closeModal])

    const handleModalOpen = () => {
        setDecValue("");
        setViewType("");
        setOptDecInd("");
        const frmItem = initValues;
        const writeType = isOpen?.split("@");
        const cisControls = selectedControl?.cis_control_id || [];
        if (cisControls?.length && writeType?.length > 1 && writeTypes.includes(writeType[0])) {
            const control = cisControls.find((x) => x._id === writeType[1]);
            if (control?._id) {
                frmItem.name = control?.name || "";
                frmItem.description = control?.description || "";
            }
        }

        setFormItem(frmItem);
    }

    const handleRegenerate = () => {
        setViewType("");
        setOptDecInd("");
    }

    const handleUpdateDescriptionLocally = useCallback(() => {
        if (optDecInd >= 0 && handleUpdateDescription) {
            const description = decValue;
            handleUpdateDescription(isOpen, description);
            handleReset();
        }
    }, [handleReset, handleUpdateDescription, isOpen, decValue, optDecInd])

    useEffect(() => {
        if (companyComplianceControlStore?.actionFlag === "CMPN_CONTRL_UPDT") {
            handleUpdateDescriptionLocally();
        }

        if (store?.actionFlag === "WRT_AI_DEC_SCS") {
            setViewType("generated");
        }

        if (store?.actionFlag || store?.success || store?.error) {
            dispatch(cleanAIPromptMessage(null));
        }

        if (store?.success) {
            setShowSnackbar(true);
            setSnackMessage(store.success);
        }

        if (store?.error) {
            setShowSnackbar(true);
            setSnackMessage(store.error);
        }
    }, [dispatch, handleReset, handleUpdateDescriptionLocally, store.error, store.success, store.actionFlag, companyComplianceControlStore.actionFlag])

    useEffect(() => {
        setTimeout(() => {
            setShowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    const handleSubmit = (values) => {
        if (values) {
            const payload = { ...values }

            if (selectedControl?.framework_id?.label) {
                payload.framework_name = selectedControl?.framework_id?.label;
            }

            // console.log("handleSubmit >>> ", payload);
            dispatch(writeDescriptionWithAI(payload));
        }
    }

    const handleAISaveDescription = () => {
        if (optDecInd >= 0) {
            const payload = { _id: selectedControl?.company_compliance_control_id || "" }

            const description = store?.aiDescriptionItems[optDecInd]?.description || "";
            if (isOpen?.includes("cis@") && isOpen?.split("@")?.length > 1) {
                const cisControlId = isOpen?.split("@")[1];
                const subCisDescrip = [...selectedControl?.cis_control_descriptions];
                const ind = subCisDescrip?.findIndex((x) => x.cis_control_id === cisControlId);
                if (ind >= 0) {
                    subCisDescrip[ind] = { ...subCisDescrip[ind], description };
                } else {
                    subCisDescrip.push({ cis_control_id: cisControlId, description })
                }

                payload.cis_control_descriptions = subCisDescrip;
            } else {
                payload.control_description = description;
            }

            // console.log("handleAISaveDescription ==== ", optDecInd, payload);
            if (payload?._id && (payload?.control_description || payload?.cis_control_descriptions?.length)) {
                setDecValue(description);
                dispatch(updateCompanyComplianceControl(payload));
            }
        }
    }

    const handleSubmitDescription = (values) => {
        if (values) {
            const payload = { _id: selectedControl?.company_compliance_control_id || "" }
            const description = values?.description || "";
            if (isOpen?.includes("sub-edit-dec@") && isOpen?.split("@")?.length > 1) {
                const cisControlId = isOpen?.split("@")[1];
                const subCisDescrip = [...selectedControl?.cis_control_descriptions];
                const ind = subCisDescrip?.findIndex((x) => x.cis_control_id === cisControlId);
                if (ind >= 0) {
                    subCisDescrip[ind] = { ...subCisDescrip[ind], description };
                } else {
                    subCisDescrip.push({ cis_control_id: cisControlId, description })
                }

                payload.cis_control_descriptions = subCisDescrip;
            } else {
                payload.control_description = description;
            }

            // console.log("handleSubmitDescription >>> ", values, payload);
            if (payload?._id && (payload?.control_description || payload?.cis_control_descriptions?.length)) {
                setDecValue(description);
                dispatch(updateCompanyComplianceControl(payload));
            }
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
                <span className="modal-title col-sm-12" id="example-modal-sizes-title-lg">
                    <h3 className="mb-0 mt-0">
                        {isOpen.includes("edit-dec@") ? ("Edit Description") : ("Write with Sara")}
                    </h3>
                </span>

                <button type="button" className='Close-button' onClick={handleReset}>×</button>
            </Modal.Header>

            {!companyComplianceControlStore?.loading ? (<SimpleSpinner />) : null}
            {!store?.loading ? (<SimpleSpinner />) : null}

            <Modal.Body>
                {isOpen.includes("edit-dec@") ? (
                    <Formik
                        initialValues={formItem}
                        enableReinitialize={formItem}
                        validationSchema={DescriptionSchema}
                        onSubmit={handleSubmitDescription}
                    >
                        {({ errors, touched }) => (
                            <Form className="my-2">
                                <Row>
                                    <Col xl={12} lg={12} as={BootstrapForm.Group} controlId="formGridDescription" className="full-width">
                                        <BootstrapForm.Label className="col-label">Description</BootstrapForm.Label>
                                        <Field
                                            as="textarea"
                                            type="textarea"
                                            name="description"
                                            className="col-input w-100"
                                            placeholder="Please enter description"
                                        />
                                        {errors.description && touched.description && (
                                            <FormFeedback className="d-block">{errors?.description}</FormFeedback>
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
                ) : (
                    viewType === "generated" ? (
                        <Row className="mt-3">
                            {store.aiDescriptionItems?.length ? (<>
                                <h3 className="px-3 pb-0 mb-0">AI Descriptions</h3>
                                {store.aiDescriptionItems.map((item, ind) => (
                                    <Col key={`description-${ind}`} xl={12} lg={12}>
                                        <div className="d-inline-block frame-modal d-flex">
                                            <label className="checkbox-box text-center">
                                                <input
                                                    type="checkbox"
                                                    id={`description-${ind}`}
                                                    name={`description-${ind}`}
                                                    className="form-check-input pointer"
                                                    checked={ind === optDecInd}
                                                    onChange={() => setOptDecInd(ind)}
                                                />
                                                <span className="checkmark mt-1" htmlFor={`description-${ind}`}></span>
                                            </label>
                                            <Label
                                                for={`description-${ind}`}
                                                className="form-check-label user-select-none pointer mb-0"
                                            >
                                                {item?.description || ""}
                                            </Label>
                                        </div>
                                    </Col>
                                ))}
                            </>) : (
                                <p className="text-center text-white mb-2">No AI description found!</p>
                            )}

                            <div className="w-100 text-center mt-3 mb-1 buttons">
                                {store.aiDescriptionItems?.length ? (
                                    <button
                                        type="button"
                                        className="btnprimary mr-2"
                                        disabled={optDecInd === ""}
                                        onClick={() => handleAISaveDescription()}
                                    >
                                        Save
                                    </button>
                                ) : null}

                                <button
                                    type="button"
                                    className="btnprimary"
                                    onClick={() => handleRegenerate()}
                                >
                                    Re-Generate
                                </button>
                            </div>
                        </Row>
                    ) : (
                        <Formik
                            initialValues={formItem}
                            enableReinitialize={formItem}
                            validationSchema={ValidationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched }) => (
                                <Form className="my-2">
                                    <Row>
                                        <Col xl={12} lg={12} as={BootstrapForm.Group} controlId="formGridName" className="full-width">
                                            <BootstrapForm.Label className="col-label">Name</BootstrapForm.Label>
                                            <p className="text-white">{values?.name || ""}</p>
                                        </Col>

                                        <Col xl={12} lg={12} as={BootstrapForm.Group} controlId="formGridDescription" className="full-width">
                                            <BootstrapForm.Label className="col-label">Description</BootstrapForm.Label>
                                            <p className="text-white">{values?.description || ""}</p>
                                        </Col>

                                        <Col xl={12} lg={12} as={BootstrapForm.Group} controlId="formGridKeywords" className="full-width">
                                            <BootstrapForm.Label className="col-label">Your Intents</BootstrapForm.Label>
                                            <Field
                                                type="text"
                                                name="keywords"
                                                className="col-input w-100"
                                                placeholder='Please enter "Your Intents" with comma separated'
                                            />
                                            {errors.keywords && touched.keywords && (
                                                <FormFeedback className="d-block">{errors?.keywords}</FormFeedback>
                                            )}
                                        </Col>
                                    </Row>

                                    <div className="buttons text-center">
                                        <button
                                            type="submit"
                                            className="btnprimary"
                                            disabled={!store?.loading}
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    )
                )}
            </Modal.Body>
        </Modal>
    )
}

export default AIPromptWriteModal;
