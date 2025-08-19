/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { cleanQuestionMessage } from "../../questions/store";
import { getAssessment, updateAssessment, cleanAssessmentMessage } from "../store";

// ** Reactstrap Imports
import { Row, Col, Form as BootstrapForm } from "react-bootstrap";
import { Card, CardBody, FormFeedback, Label } from "reactstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// ** Utils
import { getDomailUrl, htmlToString } from "utility/Utils";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import { TbCheckbox, TbCopyright } from "react-icons/tb";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { EditorState, ContentState, convertToRaw } from "draft-js";

// ** Constant
import { draftEditorToolbarConfig } from "utility/reduxConstant";

// ** Styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EditAssessmentForm = () => {
  // ** Hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const url = getDomailUrl();

  // ** Store vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.assessment);

  // ** States
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [editorHtmlContent, setEditorHtmlContent] = useState("");
  const [editorStateContent, setEditorStateContent] = useState(null);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required."),
    // description: Yup.string().required("Description is required.")
  })

  const handleEditorStateChange = (state) => {
    // console.log("handleEditorStateChange >>> ", state)
    setEditorStateContent(state);
    setEditorHtmlContent(draftToHtml(convertToRaw(state.getCurrentContent())));
  }

  /* set initial html while edit */
  const getInitialHTML = (value) => {
    const contentBlock = htmlToDraft(value);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      handleEditorStateChange(editorState);
      return editorState;
    }

    return value;
  }

  const handleReset = () => {
    if (store?.assessmentItem?.additional_description) {
      getInitialHTML(store.assessmentItem.additional_description)
    }
  }

  useLayoutEffect(() => {
    setEditorHtmlContent("")
    setEditorStateContent(null)

    const query = { id: id };
    dispatch(getAssessment(query));
  }, [dispatch, id]);

  useEffect(() => {
    if (store.actionFlag === "ASESMNT_ITM_SCS") {
      handleReset();
    }

    if (store.actionFlag === "ASESMNT_UPDT_SCS" && store.success) {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
      dispatch(cleanQuestionMessage());
      dispatch(cleanAssessmentMessage());
    }

    if (store.actionFlag === "ASESMNT_UPDT_ERR" && store.error) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [store.actionFlag, store.error, store.success]);

  useEffect(() => {
    if (showSnackBar) {
      setTimeout(() => {
        setshowSnackbar(false);
        setSnakbarMessage("");
      }, 1000);
    }
  }, [showSnackBar]);

  const handleSubmit = (values) => {
    if (values) {
      const payload = {
        _id: id,
        name: values?.name || "",
        description: values?.description || "",
        status: values?.status || 0,
        show_score_calculation: values?.show_score_calculation || ""
      }

      if (editorHtmlContent) {
        payload.additional_description = editorHtmlContent;
      }

      dispatch(updateAssessment(payload));
    }
  }

  return (
    <div className="content">
      <ReactSnackBar Icon={(
        <span><TiMessages size={25} /></span>
      )} Show={showSnackBar}>
        {snakebarMessage}
      </ReactSnackBar>

      <Row>
        <Col>
          <Card>
            <CardBody className="pl-0 pr-0">
              <Formik
                initialValues={store?.assessmentItem}
                enableReinitialize={store?.assessmentItem}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form>
                    <Row>
                      <Col xl={12} lg={12} md={12} as={BootstrapForm.Group} controlId="formGridName" className="full-width">
                        <BootstrapForm.Label className="col-label">Name</BootstrapForm.Label>
                        <Field
                          type="text"
                          name="name"
                          className="col-input w-100"
                        />
                        {errors.name && touched.name && (
                          <FormFeedback className="d-block">{errors?.name}</FormFeedback>
                        )}
                      </Col>

                      <Col xl={6} lg={6} as={BootstrapForm.Group} className="full-width">
                        <BootstrapForm.Label className="col-label">Status</BootstrapForm.Label>
                        <div className="radio-container d-flex">
                          <div className="form-check">
                            <input
                              value={1}
                              id="Active"
                              type="radio"
                              name="status"
                              className="mx-2"
                              aria-label="Active Status"
                              checked={values?.status === 1}
                              onChange={(event) => setFieldValue("status", Number(event.target.value))}
                            />
                            <label htmlFor="Active" className="form-check-label">Active</label>
                          </div>

                          <div className="form-check">
                            <input
                              value={0}
                              type="radio"
                              name="status"
                              id="InActive"
                              className="mx-2"
                              aria-label="InActive Status"
                              checked={values?.status === 0}
                              onChange={(event) => setFieldValue("status", Number(event.target.value))}
                            />
                            <label htmlFor="InActive" className="form-check-label">InActive</label>
                          </div>
                        </div>
                      </Col>

                      <Col xl={6} lg={6} as={BootstrapForm.Group} className="full-width">
                        <BootstrapForm.Label className="col-label">Show Calculation</BootstrapForm.Label>
                        <div className="d-flex align-items-center checkbox-container">
                          <label className="checkbox-box text-center">
                            <input
                              type="checkbox"
                              id="show_score_calculation"
                              name="show_score_calculation"
                              className="pointer mr-1 align-middle"
                              checked={values?.show_score_calculation}
                              onChange={(event) => setFieldValue(event?.target?.name, event?.target?.checked)}
                            />
                            <span className="checkmark" for="show_score_calculation"></span>
                          </label>

                          <Label for="show_score_calculation" className="form-check-label user-select-none pointer mb-0 ml-2">Yes</Label>
                        </div>
                      </Col>

                      <Col xl={12} lg={12} md={12} as={BootstrapForm.Group} controlId="formGridDescription" className="full-width">
                        <BootstrapForm.Label className="col-label">Description</BootstrapForm.Label>
                        <Field
                          as="textarea"
                          type="textarea"
                          name="description"
                          className="col-input w-100"
                          placeholder="Enter Description"
                        />
                        {errors.description && touched.description && (
                          <FormFeedback className="d-block">{errors?.description}</FormFeedback>
                        )}
                      </Col>

                      <Col xl={12} lg={12} md={12} as={BootstrapForm.Group} controlId="formGridDescription" className="full-width">
                        <BootstrapForm.Label className="col-label">Additional Description</BootstrapForm.Label>
                        <Editor
                          id="additional_description"
                          name="additional_description"
                          wrapperClassName="col-draft-wrapper"
                          toolbar={draftEditorToolbarConfig}
                          placeholder=""
                          editorState={editorStateContent}
                          onEditorStateChange={handleEditorStateChange}
                        // onBlur={() => setFieldTouched("additional_description", true)}
                        />
                        {touched.additional_description && (
                          !htmlToString(editorHtmlContent.trim()) ? (
                            <FormFeedback className="d-block">Additional Description is required.</FormFeedback>
                          ) : errors.additional_description ? (
                            <FormFeedback className="d-block">{errors?.additional_description}</FormFeedback>
                          ) : null
                        )}
                      </Col>

                      <Col xl={12} lg={12} md={12} className="mb-2">
                        <p>
                          <a
                            target="_blank"
                            rel="noreferrer"
                            className="text-white"
                            href={`${url}/assessment-form/${id}`}
                          >
                            {`${url}/assessment-form/${id}`}
                          </a>{" "}
                          <CopyToClipboard
                            text={`${url}/assessment-form/${id}`}
                            onCopy={() => setCopiedUrl(true)}
                          >
                            {copiedUrl ? (
                              <TbCheckbox
                                size={25}
                                className="cursor-pointer"
                              />
                            ) : (
                              <TbCopyright
                                size={25}
                                className="cursor-pointer"
                              />
                            )}
                          </CopyToClipboard>
                        </p>
                      </Col>
                    </Row>

                    <div className="buttons">
                      <button type="submit" className="btnprimary">
                        Submit
                      </button>

                      <button
                        type="button"
                        className="btnsecondary ml-3"
                        onClick={() => navigate("/admin/assessment-forms")}
                      >
                        Back
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EditAssessmentForm;
