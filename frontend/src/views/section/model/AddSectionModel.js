import { Modal, Form as BootstrapForm, Row, Col } from "react-bootstrap";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { createSection, cleanSectionMessage, updateSection } from "../store";

const AddSectionModel = ({
  show,
  closePopup,
  title,
  initialValues,
  isEditing,
}) => {
  const assessmentStore = useSelector((state) => state.assessment);
  const store = useSelector((state) => state.sections);
  const dispatch = useDispatch();

  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    // order: Yup.number()
    //   .required("Order is required")
    //   .positive("Order must be a positive number")
    //   .integer("Order must be an integer"),
  });

  useEffect(() => {
    if (
      (store.actionFlag === "SECTION_CREATED" ||
        store.actionFlag === "SECTION_UPDATED") &&
      store.success
    ) {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
    }
    if (
      (store.actionFlag === "SECTION_CREATED_ERROR" ||
        store.actionFlag === "SECTION_UPDATED_ERROR") &&
      store.error
    ) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [store.success, store.error, store.actionFlag]);

  useEffect(() => {
    if (
      (store.actionFlag === "SECTION_CREATED" ||
        store.actionFlag === "SECTION_UPDATED") &&
      showSnackBar
    ) {
      setTimeout(() => {
        setshowSnackbar(false);
        setSnakbarMessage("");
        dispatch(cleanSectionMessage());
        closePopup();
      }, 2000);
    }
  }, [showSnackBar, store.actionFlag, dispatch, closePopup]);

  const onSubmit = (values) => {
    const payload = { ...values };
    // values?.status ? (payload.status = 1) : (payload.status = 0);
    payload.assessment_id = assessmentStore?.assessmentItem?._id;
    if (isEditing) {
      dispatch(updateSection(payload));
    } else {
      dispatch(createSection(payload));
    }
  };

  return (
    <>
      <Modal
        className="UpdateUserPopup"
        size="lg"
        show={show}
        aria-labelledby="example-modal-sizes-title-lg"
        centered
      >
        <Modal.Header>
          <span
            className="modal-title col-sm-12 "
            id="example-modal-sizes-title-lg"
          >
            <h3 className="border-bottom pb-2 mb-0 mt-0">{title}</h3>
          </span>
          <button type="button" className="Close-button" onClick={closePopup}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="content">
            {showSnackBar && (
              <ReactSnackBar
                Icon={
                  <span>
                    <TiMessages size={25} />
                  </span>
                }
                Show={showSnackBar}
              >
                {snakebarMessage}
              </ReactSnackBar>
            )}
            <Row>
              <Col>
                <Formik
                  initialValues={initialValues}
                  enableReinitialize={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, setFieldValue, isSubmitting }) => (
                    <Form>
                      <Row className="mb-2">
                        <Col md={12}>
                          <BootstrapForm.Group controlId="formGridCompanyName">
                            <BootstrapForm.Label>Name</BootstrapForm.Label>
                            <Field
                              type="text"
                              name="name"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="text-danger"
                            />
                          </BootstrapForm.Group>
                        </Col>
                      </Row>

                      <Row className="mb-2">
                        <Col md={12}>
                          <BootstrapForm.Group controlId="formGridContactNumber">
                            <BootstrapForm.Label>
                              Description
                            </BootstrapForm.Label>
                            <Field
                              as="textarea"
                              name="description"
                              className="form-control"
                              rows="3"
                            />
                            <ErrorMessage
                              name="description"
                              component="div"
                              className="text-danger"
                            />
                          </BootstrapForm.Group>
                        </Col>
                      </Row>

                      <Row className="mb-2">
                        <Col md={6} className="d-none">
                          <BootstrapForm.Group controlId="formGridContactNumber">
                            <BootstrapForm.Label>Order</BootstrapForm.Label>
                            <Field
                              type="number"
                              name="order"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="order"
                              component="div"
                              className="text-danger"
                            />
                          </BootstrapForm.Group>
                        </Col>

                        <Col md={6}>
                          <BootstrapForm.Label>Status</BootstrapForm.Label>
                          <div className="status-container d-flex row-cols-2">
                            <div className="form-check">
                              <input
                                type="radio"
                                name="status"
                                value={1}
                                checked={values?.status === 1}
                                id="Active"
                                onChange={(event) =>
                                  setFieldValue(
                                    "status",
                                    Number(event.target.value)
                                  )
                                }
                                aria-label="Active Status"
                              />
                              <label
                                htmlFor="Active"
                                className="form-check-label"
                              >
                                Active
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                type="radio"
                                name="status"
                                value={0}
                                checked={values?.status === 0}
                                id="InActive"
                                onChange={(event) =>
                                  setFieldValue(
                                    "status",
                                    Number(event.target.value)
                                  )
                                }
                                aria-label="Inactive Status"
                              />
                              <label
                                htmlFor="InActive"
                                className="form-check-label"
                              >
                                InActive
                              </label>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <div className="w-100 PadR0 ItemInfo-right mt-3">
                        <div className="row justify-content-end m-0">
                          <button
                            type="submit"
                            className="float-end btn btn-primary"
                            disabled={isSubmitting}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddSectionModel;
