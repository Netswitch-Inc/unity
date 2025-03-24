// ** React Imports
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { updateSection, getSection, cleanSectionMessage } from "./store";

// ** Reactstrap Imports
import { Row, Col, Form as BootstrapForm } from "react-bootstrap";
import { Card, CardBody, FormFeedback } from "reactstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

const EditSection = () => {
  // ** Hooks
  const { id } = useParams();

  // ** Store Vars
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state.sections);

  // ** States
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  useEffect(() => {
    const query = { id: id };
    dispatch(getSection(query));
  }, [dispatch, id]);

  useEffect(() => {
    if (store.actionFlag || store?.success || store?.error) {
      dispatch(cleanSectionMessage());
    }

    if (store.actionFlag === "SCTN_UPDT") {
      setTimeout(() => {
        navigate("/admin/sections");
      }, 2000);
    }

    if (store?.success) {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
    }

    if (store?.error) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [store.success, store.error, store.actionFlag, navigate, dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  const onSubmit = (values) => {
    if (values) {
      const payload = { ...values };
      values?.status ? (payload.status = 1) : (payload.status = 0);
      dispatch(updateSection(payload));
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required."),
    description: Yup.string().required("Description is required."),
    order: Yup.number().required("Order is required.")
      .positive("Order must be a positive number.")
      .integer("Order must be an integer.")
  })

  return (
    <div className="content">
      {!store?.loading ? (<SimpleSpinner />) : null}
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
                initialValues={store?.sectionItem}
                enableReinitialize={store?.sectionItem}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                  <Form>
                    <Row className="mb-2">
                      <Col xl={12} lg={12} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                        <BootstrapForm.Group controlId="formGridCompanyName">
                          <BootstrapForm.Label className="col-label mt-2">Name</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="name"
                            className="col-input w-100"
                          />
                          {errors.name && touched.name && (
                            <FormFeedback className="d-block">{errors?.name}</FormFeedback>
                          )}
                        </BootstrapForm.Group>
                      </Col>

                      <Col xl={12} lg={12} as={BootstrapForm.Group} className="full-width">
                        <BootstrapForm.Label className="col-label">
                          Description
                        </BootstrapForm.Label>
                        <Field
                          as="textarea"
                          name="description"
                          className="col-input w-100"
                          rows="3"
                        />
                        {errors.description && touched.description && (
                          <FormFeedback className="d-block">{errors?.description}</FormFeedback>
                        )}
                      </Col>

                      <Col xl={6} lg={6} as={BootstrapForm.Group} className="full-width">
                        <BootstrapForm.Label className="col-label">Order</BootstrapForm.Label>
                        <Field
                          type="number"
                          name="order"
                          className="col-input w-100"
                        />
                        {errors.order && touched.order && (
                          <FormFeedback className="d-block">{errors?.order}</FormFeedback>
                        )}
                      </Col>

                      <Col xl={6} lg={6} as={BootstrapForm.Group} className="full-width">
                        <BootstrapForm.Label className="col-label">Status</BootstrapForm.Label>
                        <div className="radio-container d-flex">
                          <div className="form-check">
                            <input
                              value={1}
                              type="radio"
                              id="Active"
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
                              aria-label="Inactive Status"
                              checked={values?.status === 0}
                              onChange={(event) => setFieldValue("status", Number(event.target.value))}
                            />
                            <label htmlFor="InActive" className="form-check-label">InActive</label>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <div className="buttons">
                      <button
                        type="submit"
                        className="btnprimary"
                        disabled={isSubmitting}
                      >
                        Submit
                      </button>

                      <button
                        type="button"
                        className="btnsecondary ml-3"
                        onClick={() => navigate("/admin/sections")}
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

export default EditSection;
