/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useState, useEffect } from "react";


// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, cleanAuthMessage } from "views/login/store";

// ** Reactstrap Imports
import {
  Card,
  Input,
  CardBody,
  InputGroup,
  FormFeedback,
  InputGroupText
} from "reactstrap";
import { Col, Row, Form as BootstrapForm } from "react-bootstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** SVG Icons
import { EyeView, EyeSlash } from "components/SVGIcons";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const loginStore = useSelector((state) => state.login);

  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required("Old password is required."),
    password: Yup.string().required("New Password is required.")
      .min(8, "Password must be at least 8 characters long.")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .matches(/[0-9]/, "Password must contain at least one number.")
      .matches(/[!@#$%^&*]/, "Password must contain at least one special character."),
    confirmPassword: Yup.string().required("Confirm password is required.")
      .oneOf([Yup.ref("password"), null], "Passwords must match.")
  })

  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");
  const [initialValues, setInitialValues] = useState({ old_password: "", password: "", confirmPassword: "" });

  const toggleOldPasswordVisibility = () => {
    setOldPasswordVisible(!oldPasswordVisible);
  }

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  }

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  }

  useEffect(() => {
    if (loginStore?.actionFlag || loginStore?.success || loginStore?.error) {
      dispatch(cleanAuthMessage(null));
    }

    if (loginStore?.actionFlag === "PASSWORD_UPDATED") {
      setInitialValues({ old_password: "", password: "", confirmPassword: "" });
    }

    if (loginStore.success) {
      setshowSnackbar(true);
      setSnakbarMessage(loginStore.success);
    }

    if (loginStore.error) {
      setshowSnackbar(true);
      setSnakbarMessage(loginStore.error);
    }
  }, [dispatch, loginStore.success, loginStore.error, loginStore?.actionFlag])

  useEffect(() => {
    setTimeout(() => { setshowSnackbar(false); }, 6000);
  }, [showSnackBar])

  const onSubmit = (values) => {
    dispatch(updatePassword(values))
  }

  return (
    <div className="h-100">
      <ReactSnackBar Icon={(
        <span><TiMessages size={25} /></span>
      )} Show={showSnackBar}>
        {snakebarMessage}
      </ReactSnackBar>

      <div className="change-pass-profile">
        <Card className="mb-0">
          <CardBody className="pl-0 pr-0">
            <Formik
              initialValues={initialValues}
              enableReinitialize={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Row>
                    <Col xl={6} lg={12} as={BootstrapForm.Group} controlId="formGridPassword" className="full-width password">
                      <BootstrapForm.Label className="col-label">Old Password</BootstrapForm.Label>
                      <div className="position-relative">
                        <InputGroup className="mb-0">
                          <Field
                            as={Input}
                            autoComplete="off"
                            name="old_password"
                            className="col-input"
                            placeholder="Old Password"
                            type={oldPasswordVisible ? "text" : "password"}
                          />
                          <InputGroupText className="input-eyes-text">
                            <a onClick={toggleOldPasswordVisibility}>
                              {oldPasswordVisible ? <EyeView /> : <EyeSlash />}
                            </a>
                          </InputGroupText>
                        </InputGroup>
                        {errors.old_password && touched.old_password && (
                          <FormFeedback className="d-block">{errors?.old_password}</FormFeedback>
                        )}
                      </div>
                    </Col>

                    <Col xl={6} lg={12} as={BootstrapForm.Group} controlId="formGridPassword" className="full-width password">
                      <BootstrapForm.Label className="col-label">New Password</BootstrapForm.Label>
                      <div className="position-relative">
                        <InputGroup className="mb-0">
                          <Field
                            as={Input}
                            name="password"
                            autoComplete="off"
                            className="col-input"
                            placeholder="New Password"
                            type={newPasswordVisible ? "text" : "password"}
                          />
                          <InputGroupText className="input-eyes-text">
                            <a onClick={toggleNewPasswordVisibility}>
                              {newPasswordVisible ? <EyeView /> : <EyeSlash />}
                            </a>
                          </InputGroupText>
                        </InputGroup>
                      </div>
                      {errors.password && touched.password && (
                        <FormFeedback className="d-block">{errors?.password}</FormFeedback>
                      )}
                    </Col>

                    <Col xl={6} lg={12} as={BootstrapForm.Group} controlId="formGridPassword" className="full-width password">
                      <BootstrapForm.Label className="col-label">Confirm Password</BootstrapForm.Label>
                      <div className="position-relative">
                        <InputGroup className="mb-0">
                          <Field
                            as={Input}
                            autoComplete="off"
                            name="confirmPassword"
                            className="col-input"
                            placeholder="Confirm Password"
                            type={confirmPasswordVisible ? "text" : "password"}
                          />
                          <InputGroupText className="input-eyes-text">
                            <a onClick={toggleConfirmPasswordVisibility}>
                              {confirmPasswordVisible ? (<EyeView />) : (<EyeSlash />)}
                            </a>
                          </InputGroupText>
                        </InputGroup>
                      </div>
                      {errors.confirmPassword && touched.confirmPassword && (
                        <FormFeedback className="d-block">{errors?.confirmPassword}</FormFeedback>
                      )}
                    </Col>
                  </Row>

                  <div className="buttons">
                    <button type="submit" className="btnprimary">
                      Save
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ChangePassword;
