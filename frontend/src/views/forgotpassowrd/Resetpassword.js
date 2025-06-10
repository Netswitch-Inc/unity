/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, cleanAuthMessage } from "views/login/store";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Input,
  Button,
  InputGroup,
  FormFeedback,
  InputGroupText,
  InputGroupAddon
} from "reactstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// ** Utils
import { onImageSrcError } from 'utility/Utils';

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { defaultLogo } from 'utility/reduxConstant';

// ** SVG Icons
import { EyeView, EyeSlash } from "components/SVGIcons";

// ** Logo and PNG Icons
import Lock from "assets/img/lock.svg";
import logo from "assets/img/react-logo.png";
import mainImage from "assets/img/loginimg.png";

const ResetPassword = () => {
  // ** Hooks
  const { token } = useParams();
  const navigate = useNavigate();

  // ** Store vars
  const dispatch = useDispatch();
  const loginStore = useSelector((state) => state.login);
  const settingStore = useSelector((state) => state.globalSetting);

  // ** Const
  const appSettingItem = settingStore?.appSettingItem || null;
  const appLogo = appSettingItem?.logo || defaultLogo;

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("New password is required.")
      .min(8, "Password must be at least 8 characters long.")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .matches(/[0-9]/, "Password must contain at least one number.")
      .matches(/[!@#$%^&*]/, "Password must contain at least one special character."),
    confirmPassword: Yup.string().required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match")
  })

  // ** States
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");
  const [initialValues] = useState({ password: "", confirmPassword: "" });

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  useEffect(() => {
    if (loginStore?.actionFlag || loginStore?.success || loginStore?.error) {
      dispatch(cleanAuthMessage());
    }

    if (loginStore?.actionFlag === "RESET_PASSWORD" && loginStore.success) {
      setshowSnackbar(true);
      setSnakbarMessage(loginStore.success);
      navigate("/");
    }

    if (loginStore?.actionFlag === "RESET_PASSWORD" && loginStore.error) {
      setshowSnackbar(true);
      setSnakbarMessage(loginStore.error);
    }
  }, [loginStore.success, loginStore.error, loginStore?.actionFlag, navigate, dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar]);

  const onSubmit = (values) => {
    const payload = { password: values.password, token: token };
    dispatch(resetPassword(payload));
  }

  return (<>
    <div className="auth-wrapper auth-cover">
      {showSnackBar && (
        <ReactSnackBar Icon={(
          <span><TiMessages size={25} /></span>
        )} Show={showSnackBar}>
          {snakebarMessage}
        </ReactSnackBar>
      )}

      <Row className="auth-inner m-0 main-left-right row">
        <div className="d-none d-lg-flex p-0 login-left">
          <div className="w-100 h-100 main-img-left">
            <img className="img-fluid" src={mainImage} alt="Login Cover" />
          </div>
        </div>

        <div className="h-100 right-login d-flex align-items-center auth-bg px-2 p-lg-5">
          <Col className="h-100 px-xl-2 mx-auto main-login col-10 col-sm-8 col-md-7">
            <div
              className="w-100 d-lg-flex align-items-center mb-3 justify-content-center"
              style={{ textAlign: "center" }}
            >
              <img alt="..." src={appLogo} style={{ height: "150px" }} onError={(currentTarget) => onImageSrcError(currentTarget, logo)} />
            </div>

            <div className="login-text">Reset Your Password</div>
            <div className="small-text">
              Create new password for your account
            </div>

            <Formik
              onSubmit={onSubmit}
              initialValues={initialValues}
              validationSchema={validationSchema}
            >
              {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                <Form className="form">
                  <div className="card-login">
                    <div className="p-0">
                      <div className="mb-3">
                        <InputGroup className={`custom-input-group mb-0`}>
                          <InputGroupAddon addonType="prepend" className="input-icon">
                            <InputGroupText>
                              <img height={16} alt="lock" src={Lock} />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            name="password"
                            autoComplete="off"
                            className="custom-input"
                            value={values.password}
                            placeholder="New Password"
                            type={newPasswordVisible ? "text" : "password"}
                            onInput={(event) => setFieldValue(event?.target?.name, event?.target?.value)}
                            onBlur={(e) => setFieldTouched("password", true)}
                          />
                          <InputGroupText className="input-eyes-text">
                            <a
                              onClick={toggleNewPasswordVisibility}
                              className="eye-icon"
                            >
                              {newPasswordVisible ? <EyeView /> : <EyeSlash />}
                            </a>
                          </InputGroupText>
                        </InputGroup>
                        {errors.password && touched.password ? (
                          <FormFeedback className="d-block p-0">
                            {errors.password}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <InputGroup className={`custom-input-group mb-0`}>
                          <InputGroupAddon addonType="prepend" className="input-icon">
                            <InputGroupText>
                              <img height={16} alt="lock" src={Lock} />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            autoComplete="off"
                            name="confirmPassword"
                            className="custom-input"
                            placeholder="Confirm Password"
                            value={values.confirmPassword}
                            type={confirmPasswordVisible ? "text" : "password"}
                            onInput={(event) => setFieldValue(event?.target?.name, event?.target?.value)}
                            onBlur={() => setFieldTouched("confirmPassword", true)}
                          />
                          <InputGroupText className="input-eyes-text">
                            <a
                              onClick={toggleConfirmPasswordVisibility}
                              className="eye-icon"
                            >
                              {confirmPasswordVisible ? (
                                <EyeView />
                              ) : (
                                <EyeSlash />
                              )}
                            </a>
                          </InputGroupText>
                        </InputGroup>
                        {errors.confirmPassword && touched.confirmPassword ? (
                          <FormFeedback className="d-block p-0">
                            {errors.confirmPassword}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>

                    <Button
                      block
                      type="submit"
                      size="lg"
                      className="btn-login-page btn-primary"
                    >
                      Reset Password
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </div>
      </Row>
    </div>
  </>)
}

export default ResetPassword;
