/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { verifyemail, cleanAuthMessage } from "views/login/store";

// ** Reactstrap Imports
import {
  Input,
  Button,
  InputGroup,
  FormFeedback,
  InputGroupText,
  InputGroupAddon
} from "reactstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Row, Col } from "react-bootstrap";

// ** Utils
import { onImageSrcError } from 'utility/Utils';

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { defaultLogo } from 'utility/reduxConstant';

// ** Logo and PNG Icons
import logo from "assets/img/react-logo.png";
import mainImage from "assets/img/loginimg.png";

const ForgotPassword = () => {
  // ** Store vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.login);
  const settingStore = useSelector((state) => state.globalSetting);

  // ** Const
  const appSettingItem = settingStore?.appSettingItem || null;
  const appLogo = appSettingItem?.logo || defaultLogo;

  // ** States
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");

  // Define the validation schema
  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address")
      .required("Email is required")
  })

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanAuthMessage());
    }

    if (store.actionFlag === "VERIFY_EMAIL" && store.success) {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
    }

    if (store.actionFlag === "VERIFY_EMAIL" && store.error) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [store.actionFlag, store.success, store.error, dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar]);

  const onSubmit = (values) => {
    // Submit the form data to the server
    dispatch(verifyemail(values));
  }

  return (
    <div className="auth-wrapper auth-cover">
      <ReactSnackBar Icon={(
        <span><TiMessages size={25} /></span>
      )} Show={showSnackBar}>
        {snakebarMessage}
      </ReactSnackBar>

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

            <div className="login-text">Forgot Password?</div>
            <div className="small-text">
              Enter your registerd email to reset your password
            </div>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={forgotPasswordSchema}
              onSubmit={onSubmit}
            >
              {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                <Form className="form">
                  <div className="card-login">
                    <div className="p-0">
                      <div className="mb-3">
                        <InputGroup className={`custom-input-group mb-0`}>
                          <InputGroupAddon addonType="prepend" className="input-icon">
                            <InputGroupText>
                              <i className="tim-icons icon-email-85" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="email"
                            name="email"
                            value={values.email}
                            className="custom-input"
                            placeholder="Enter email"
                            onInput={(event) => setFieldValue(event?.target?.name, event?.target?.value)}
                            onBlur={() => setFieldTouched("email", true)}
                          />
                        </InputGroup>
                        {errors.email && touched.email ? (
                          <FormFeedback className="d-block p-0">
                            {errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <Button
                        block
                        size="lg"
                        type="submit"
                        className="btn-login-page btn-primary"
                      >
                        Send Email
                      </Button>
                      <div className="main-back-login">
                        <Link
                          to={`/`}
                          className="d-block text-center w-100 pt-3 back-login"
                        >
                          Back to login
                        </Link>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </div>
      </Row>
    </div>
  )
}

export default ForgotPassword;
