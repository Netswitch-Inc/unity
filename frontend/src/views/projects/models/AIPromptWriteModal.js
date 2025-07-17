// ** React Imports
import React, { useState, useEffect, useCallback, Fragment } from "react";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { updateProject } from "../store";
import { cleanAIPromptMessage, writeDescriptionWithAI } from "views/aiPrompts/store";

// ** Reactstrap Imports
import { Col, Row, FormFeedback, Label } from "reactstrap";
import { Modal, Form as BootstrapForm } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

// ** Utils
import { getFormatDate } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Icons
import editIcon from "assets/img/edit.svg";

const AIPromptWriteModal = ({
    isOpen,
    projectId,
    closeModal,
    authUserItem,
    handleGetProject,
    currentUserIsSuper,
    currentUserIsAdmin,
    selectedProjectItem,
    handleUpdateProject,
    isUserGeneratedAIDescription
}) => {
    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.aiPrompt);
    const projectStore = useSelector((state) => state.projects);

    // ** Const
    const initValues = { name: selectedProjectItem?.name || "", description: selectedProjectItem?.description || "", keywords: "" }

    // ** States
    const [showSnackBar, setShowSnackbar] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");
    const [formItem, setFormItem] = useState(initValues);
    const [viewType, setViewType] = useState("");
    const [optDecInd, setOptDecInd] = useState("");
    const [usersDescription, setUsersDescription] = useState([]);
    const [enableEditDesc, setEnableEditDesc] = useState(false);

    const ValidationSchema = yup.object({
        // keywords: yup.string().required("Keywords is required.")
    })

    const DescriptionSchema = yup.object({
        description: yup.string().required("Description is required.")
    })

    const handleReset = useCallback(() => {
        closeModal();
        setViewType("");
        setOptDecInd("");
        setEnableEditDesc(false);
        setUsersDescription([]);
    }, [closeModal])

    const handleModalOpen = () => {
        setViewType("");
        setOptDecInd("");
        const frmItem = initValues;
        let enblDesEdt = false;
        let usrDescriptions = selectedProjectItem?.users_ai_description || [];
        const userId = authUserItem?._id || null;
        if (currentUserIsSuper || currentUserIsAdmin) {
            usrDescriptions = selectedProjectItem?.users_ai_description || [];
            enblDesEdt = false;
        } else {
            enblDesEdt = true;
        }

        if (isOpen.includes("edit-dec") && isUserGeneratedAIDescription()?.user_id) {
            if (selectedProjectItem?.users_ai_description?.length) {
                const ind = selectedProjectItem.users_ai_description.findIndex((x) => x.user_id._id === userId);
                if (ind >= 0 && selectedProjectItem.users_ai_description?.[ind]?.description) { frmItem.description = selectedProjectItem.users_ai_description[ind]?.description; }
            }

            usrDescriptions = selectedProjectItem.users_ai_description.filter((x) => x.user_id._id !== userId);
        }

        setEnableEditDesc(enblDesEdt);
        setFormItem(frmItem);
        setUsersDescription(usrDescriptions);
    }

    const handleRegenerate = () => {
        setViewType("");
        setOptDecInd("");
        setEnableEditDesc(false);
    }

    useEffect(() => {
        if (store?.actionFlag === "WRT_AI_DEC_SCS") {
            setViewType("generated");
        }

        if (projectStore.actionFlag === "PRJCT_UPDT_SCS" && isOpen) {
            if (handleGetProject) { handleGetProject(); }
            handleReset();
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
    }, [dispatch, handleReset, handleGetProject, store.error, store.success, store.actionFlag, projectStore.actionFlag, isOpen])

    useEffect(() => {
        setTimeout(() => {
            setShowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    const handleSubmit = (values) => {
        if (values) {
            const payload = { ...values }

            if (selectedProjectItem?.framework_id?.label) {
                payload.framework_name = selectedProjectItem?.framework_id?.label;
            }

            dispatch(writeDescriptionWithAI(payload));
        }
    }

    const handleAISaveDescription = () => {
        const userId = authUserItem?._id || null;
        if (optDecInd >= 0) {
            const usersAiDescription = selectedProjectItem?.users_ai_description || [];

            const payload = {
                _id: selectedProjectItem?._id || "",
                users_ai_description: [...usersAiDescription]
            }

            const description = store?.aiDescriptionItems[optDecInd]?.description || "";
            const ind = payload.users_ai_description.findIndex((x) => x.user_id._id === userId);
            if (ind >= 0) {
                payload.users_ai_description[ind] = { ...payload.users_ai_description[ind], description, createdAt: new Date().getTime() }
            } else {
                payload.users_ai_description.push({
                    user_id: authUserItem?._id || null,
                    description,
                    createdAt: new Date().getTime()
                })
            }

            // console.log("handleAISaveDescription ==== ", optDecInd, payload);
            if (payload?._id && payload?.users_ai_description?.length) {
                dispatch(updateProject(payload));
            }
        }
    }

    const handleSubmitDescription = (values) => {
        const userId = authUserItem?._id || null;
        if (values) {
            const usersAiDescription = selectedProjectItem?.users_ai_description || [];

            const payload = {
                _id: selectedProjectItem?._id || "",
                users_ai_description: [...usersAiDescription]
            }

            const description = values?.description || "";
            const ind = payload.users_ai_description.findIndex((x) => x.user_id._id === userId);
            if (ind >= 0) {
                payload.users_ai_description[ind] = {
                    ...payload.users_ai_description[ind],
                    description,
                    createdAt: new Date().getTime(),
                    user_id: payload.users_ai_description[ind]?.user_id?._id || payload.users_ai_description[ind]?.user_id
                }
            } else {
                payload.users_ai_description.push({
                    user_id: authUserItem?._id || null,
                    description,
                    createdAt: new Date().getTime()
                })
            }

            // console.log("handleSubmitDescription >>> ", values, payload);
            if (payload?._id && payload?.users_ai_description?.length) {
                dispatch(updateProject(payload));
            }
        }
    }

    const handleSaveHistory = () => {
        if (optDecInd !== "" || optDecInd >= 0) {
            let description = "";
            if (optDecInd === "self") {
                description = formItem?.description || "";
            } else {
                description = usersDescription?.[optDecInd]?.description || "";
            }

            if (description) {
                const payload = {
                    _id: projectId,
                    projectHistoryDescription: description,
                    type: 'Sub-Control Description',
                    company_id: authUserItem?.company_id?._id || authUserItem?.company_id,
                    user_id: authUserItem?._id
                }

                handleUpdateProject(payload);
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
                        Sub-Control Description
                    </h3>
                </span>

                <button type="button" className='Close-button' onClick={handleReset}>×</button>
            </Modal.Header>

            {!store?.loading ? (<SimpleSpinner />) : null}

            <Modal.Body>
                {isOpen.includes("edit-dec") ? (
                    <Formik
                        initialValues={formItem}
                        enableReinitialize={formItem}
                        validationSchema={DescriptionSchema}
                        onSubmit={handleSubmitDescription}
                    >
                        {({ errors, touched }) => (
                            <Form className="my-2">
                                {(currentUserIsSuper || currentUserIsAdmin) && usersDescription?.length && !enableEditDesc ? (
                                    <Row>
                                        {usersDescription.map((item, ind) => (<Fragment key={`usr-dec-${ind}`}>
                                            <Col xl={12} lg={12} as={BootstrapForm.Group} controlId={`formGrid-${ind}`} className="full-width mb-0">
                                                <div className="d-inline-block frame-modal d-flex">
                                                    <label className="checkbox-box text-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`description-${ind}`}
                                                            name={`description-${ind}`}
                                                            className="form-check-input pointer"
                                                            checked={ind === optDecInd}
                                                            onChange={(event) => setOptDecInd(event?.target?.checked ? ind : "")}
                                                        />
                                                        <span className="checkmark mt-1" htmlFor={`description-${ind}`}></span>
                                                    </label>
                                                    <Label
                                                        for={`description-${ind}`}
                                                        className="form-check-label user-select-none pointer d-flex justify-content-between mb-0 w-100"
                                                    >
                                                        <span>{item?.user_id?.name}</span>

                                                        {item?.createdAt ? (
                                                            <span className="text-right">{getFormatDate(item?.createdAt, "DD-MMM-YYYY HH:mm:ss")}</span>
                                                        ) : null}
                                                    </Label>
                                                </div>
                                                <Label
                                                    for={`description-${ind}`}
                                                    className="col-label form-check-label user-select-none pointer mb-0"
                                                >
                                                    {item?.description || ""}
                                                </Label>

                                                {isUserGeneratedAIDescription()?.user_id && usersDescription?.length - 1 === ind ? (
                                                    <hr className="d-block border-bottom mt-1" />
                                                ) : (usersDescription?.length - 1 !== ind) ? (
                                                    <hr className="d-block border-bottom mt-1" />
                                                ) : null}
                                            </Col>
                                        </Fragment>))}
                                    </Row>
                                ) : null}

                                {isUserGeneratedAIDescription()?.user_id ? (<>
                                    <Row>
                                        <Col xl={12} lg={12} as={BootstrapForm.Group} controlId="formGridDescription" className="full-width">
                                            {enableEditDesc ? (<>
                                                <BootstrapForm.Label className="col-label">Description</BootstrapForm.Label>
                                                <Field
                                                    as="textarea"
                                                    type="textarea"
                                                    name="description"
                                                    disabled={optDecInd !== ""}
                                                    className="col-input w-100 ml-2"
                                                    placeholder="Please enter description"
                                                />
                                                {errors.description && touched.description && (
                                                    <FormFeedback className="d-block">{errors?.description}</FormFeedback>
                                                )}
                                            </>) : (<>
                                                {/* <div className="d-block border-top mt-1"></div> */}
                                                <div className="d-inline-block frame-modal d-flex">
                                                    <label className="checkbox-box text-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`usr-description`}
                                                            name={`usr-description`}
                                                            className="form-check-input pointer"
                                                            checked={optDecInd === "self"}
                                                            onChange={(event) => setOptDecInd(event?.target?.checked ? "self" : "")}
                                                        />
                                                        <span className="checkmark mt-1" htmlFor={`usr-description`}></span>
                                                    </label>

                                                    <Label
                                                        for={`usr-description`}
                                                        className="form-check-label user-select-none pointer d-flex justify-content-between mb-0 w-100"
                                                    >
                                                        <span>
                                                            {isUserGeneratedAIDescription()?.user_id?.name} (Self)
                                                            <img
                                                                width={18}
                                                                height={18}
                                                                alt="Edit"
                                                                title="Edit"
                                                                src={editIcon}
                                                                className="cursor-pointer mx-2"
                                                                onClick={(event) => { event?.stopPropagation(); setEnableEditDesc(true) }}
                                                            />
                                                        </span>

                                                        {isUserGeneratedAIDescription()?.createdAt ? (
                                                            <span className="text-right">{getFormatDate(isUserGeneratedAIDescription()?.createdAt, "DD-MMM-YYYY HH:mm:ss")}</span>
                                                        ) : null}
                                                    </Label>
                                                </div>
                                                <Label
                                                    for={`usr-description`}
                                                    className="col-label form-check-label user-select-none pointer mb-0"
                                                >
                                                    {formItem?.description || ""}
                                                </Label>
                                            </>)}
                                        </Col>
                                    </Row>

                                    <div className="buttons text-center">
                                        {enableEditDesc ? (
                                            <button
                                                type="submit"
                                                className="btnprimary"
                                                disabled={!store?.loading}
                                            >
                                                Submit
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btnprimary"
                                                disabled={!store?.loading || optDecInd === ""}
                                                onClick={() => handleSaveHistory()}
                                            >
                                                Save History
                                            </button>
                                        )}
                                    </div>
                                </>) : usersDescription?.length ? (
                                    <div className="buttons text-center">
                                        <button
                                            type="button"
                                            className="btnprimary"
                                            disabled={!store?.loading || optDecInd === ""}
                                            onClick={() => handleSaveHistory()}
                                        >
                                            Save History
                                        </button>
                                    </div>
                                ) : null}
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
