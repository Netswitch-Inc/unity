// ** React Imports
import React, { useEffect } from "react";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { createSection, updateSection } from "../store";

// ** Reactstrap Imports
import { Modal, Form as BootstrapForm, Row, Col } from "react-bootstrap";
import { FormFeedback } from "reactstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const AddSectionModel = ({
  show,
  closePopup,
  initialValues
}) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.sections);
  const assessmentStore = useSelector((state) => state.assessment);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required."),
    description: Yup.string().required("Description is required.")
  });

  useEffect(() => {
    if (store.actionFlag === "SCTN_CRTD" || store.actionFlag === "SCTN_UPDT") {
      closePopup();
    }
  }, [store.actionFlag, closePopup]);

  const onSubmit = (values) => {
    if (values) {
      const payload = { ...values };
      payload.assessment_id = assessmentStore?.assessmentItem?._id;
      if (payload?._id) {
        dispatch(updateSection(payload));
      } else {
        dispatch(createSection(payload));
      }
    }
  }

  return (
    <Modal
      size="lg"
      centered
      show={show}
      className="UpdateUserPopup modal-design "
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header>
        <span className='modal-title col-sm-12' id="example-modal-sizes-title-lg">
          <h3 className='mb-0 mt-0'>{initialValues?._id ? ("Edit") : ("Add")} Section</h3>
        </span>
        <button type="button" className="Close-button" onClick={closePopup}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="content">
          <Row>
            <Col>
              <Formik
                initialValues={initialValues}
                enableReinitialize={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                  <Form>
                    <Row className="mb-2">
                      <Col xl={12} lg={12} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                        <BootstrapForm.Label className="col-label mt-2">Name</BootstrapForm.Label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Name"
                          className="col-input w-100 "
                        />
                        {errors.name && touched.name && (
                          <FormFeedback className="d-block">{errors?.name}</FormFeedback>
                        )}
                      </Col>

                      <Col xl={12} lg={12} as={BootstrapForm.Group} controlId="formGridDescription" className="full-width">
                        <BootstrapForm.Label className="col-label">Description</BootstrapForm.Label>
                        <Field
                          as="textarea"
                          name="description"
                          placeholder="Description"
                          className="col-input w-100"
                        />
                        {errors.description && touched.description && (
                          <FormFeedback className="d-block">{errors?.description}</FormFeedback>
                        )}
                      </Col>

                      <Col md={6} className="d-none">
                        <BootstrapForm.Group controlId="formGridContactNumber">
                          <BootstrapForm.Label>Order</BootstrapForm.Label>
                          <Field
                            type="number"
                            name="order"
                            className="form-control"
                          />
                          {errors.order && touched.order && (
                            <FormFeedback className="d-block">{errors?.order}</FormFeedback>
                          )}
                        </BootstrapForm.Group>
                      </Col>

                      <Col xl={6} lg={6} as={BootstrapForm.Group} className="full-width">
                        <BootstrapForm.Label className="col-label">Status</BootstrapForm.Label>
                        <div className="radio-container d-flex">
                          <div className="form-check">
                            <input
                              value={1}
                              id="active"
                              type="radio"
                              name="status"
                              className="mx-2"
                              aria-label="active Status"
                              checked={values?.status === 1}
                              onChange={(event) => setFieldValue("status", Number(event.target.value))}
                            />
                            <label htmlFor="active" className="form-check-label">Active</label>
                          </div>

                          <div className="form-check">
                            <input
                              value={0}
                              type="radio"
                              name="status"
                              id="Inactive"
                              className="mx-2"
                              aria-label="Inactive Status"
                              checked={values?.status === 0}
                              onChange={(event) => setFieldValue("status", Number(event.target.value))}
                            />
                            <label htmlFor="Inactive" className="form-check-label">InActive</label>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="buttons text-center">
                      <button
                        type="submit"
                        className="btnprimary"
                        disabled={isSubmitting}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AddSectionModel;
