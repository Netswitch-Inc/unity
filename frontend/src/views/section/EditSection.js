import React, { useEffect, useState } from "react";
import { Row, Col, Form as BootstrapForm } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { updateSection, editSectionRequest } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import * as Yup from "yup";

const EditSection = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const store = useSelector((state) => state.sections);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  useEffect(() => {
    const query = { id: id };
    dispatch(editSectionRequest(query));
  }, [dispatch, id]);

  useEffect(() => {
    if (store.actionFlag === "SECTION_UPDATED" && store.success) {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
    }
    if (store.error) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [store.success, store.error, store.actionFlag]);

  useEffect(() => {
    if (store.actionFlag === "SECTION_UPDATED" && showSnackBar) {
      setTimeout(() => {
        setshowSnackbar(false);
        setSnakbarMessage("");
        navigate("/admin/sections");
      }, 3000);
    }
    if (store.error && showSnackBar) {
      setTimeout(() => {
        setshowSnackbar(false);
        setSnakbarMessage("");
      }, 3000);
    }
  }, [showSnackBar, navigate, store.actionFlag, store.error]);

  const onSubmit = (values) => {
    const payload = { ...values };
    values?.status ? (payload.status = 1) : (payload.status = 0);
    dispatch(updateSection(payload));
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    order: Yup.number()
      .required("Order is required")
      .positive("Order must be a positive number")
      .integer("Order must be an integer"),
  });
  return (
    <>
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
            <Card>
              <div className="p-0 border-bottom pb-2 card-header row justify-content-between m-0">
                <h3 className="card-title mb-0 mt-0">Edit Section</h3>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate("/admin/sections")}
                >
                  Back
                  {/* <TiArrowLeft size={25} title="Back" className="ml-2" /> */}
                </button>
              </div>

              <CardBody className="pl-0 pr-0">
                <Formik
                  initialValues={store?.sectionItem}
                  enableReinitialize={store?.sectionItem}
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
                        <Col md={6}>
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
                          <div className="status-container d-flex row-cols-6">
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
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EditSection;
