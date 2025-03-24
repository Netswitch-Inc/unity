/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { createCompany, cleanCompanyMessage } from "../store";
import { cleanAuthMessage, getEmailExist, getUsernameExist } from "views/login/store";

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { Col, Row, Form as BootstrapForm } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import PhoneInput from "react-phone-input-2";

// ** Constant
import { initCompanyItem } from "utility/reduxConstant";

// ** SVG Icons
import { EyeView, EyeSlash } from "components/SVGIcons";

const AddComapny = () => {
  const store = useSelector((state) => state.company);
  const loginStore = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [emailExist, setEmailExist] = useState(false);
  const [usernameExist, setUsernameExist] = useState(false);

  const companySchema = yup.object({
    name: yup.string().required("Name is required."),
    logo: yup.string().nullable(),
    user_name: yup.string().required("Username is required."), // Ensures username is not empty
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required."),
    contact_no: yup.string()
      .required("Contact number is required")
      .min(8, "Invalid contact number (Minimum 8 Digits Are Required)")
      .max(15, "Invalid contact number (Must Not Exceed 10 digits)"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required."),
    address: yup.string().nullable(),
  });

  const handleCheckEmailExist = useCallback(
    (email = "") => {
      const query = { email };
      dispatch(getEmailExist(query));
    },
    [dispatch]
  );

  const handleCheckUsernameExist = useCallback(
    (userName = "") => {
      const query = { user_name: userName };
      dispatch(getUsernameExist(query));
    },
    [dispatch]
  );

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleFileUpload = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("logo", reader.result); // Store base64 encoded image
        setImagePreviewUrl(reader.result); // Set image preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanCompanyMessage());
    }

    if (
      store?.actionFlag === "COMPANY_CRTD" ||
      store?.actionFlag === "COMPANY_UPDT"
    ) {
      setTimeout(() => {
        navigate("/admin/companies");
      }, 2000);
    }

    if (store.success) {
      setShowSnackbar(true);
      setSnackMessage(store.success);
    }

    if (store.error) {
      setShowSnackbar(true);
      setSnackMessage(store.error);
    }
  }, [store.error, store.success, store.actionFlag, navigate, dispatch]);

  /* Login */
  useEffect(() => {
    if (loginStore?.actionFlag || loginStore?.success || loginStore?.error) {
      dispatch(cleanAuthMessage(null));
    }

    if (
      loginStore?.actionFlag === "EML_EXST" ||
      loginStore?.actionFlag === "EML_EXST_ERR"
    ) {
      setEmailExist(loginStore?.isEmailExist || false);
    }

    if (
      loginStore?.actionFlag === "USRNM_EXST" ||
      loginStore?.actionFlag === "USRNM_EXST_ERR"
    ) {
      setUsernameExist(loginStore?.isUsernameExist || false);
    }
  }, [
    dispatch,
    loginStore.actionFlag,
    loginStore.success,
    loginStore.error,
    loginStore.isEmailExist,
    loginStore.isUsernameExist,
  ]);
  /* Login */

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 6000);
  }, [showSnackBar]);

  const handleChangeEmail = (value = "") => {
    handleCheckEmailExist(value);
  };

  const handleChangeUsername = (value = "") => {
    handleCheckUsernameExist(value);
  };

  const onSubmit = async (values) => {
    if (values && !emailExist && !usernameExist) {
      const payload = {
        _id: values?._id || "",
        name: values?.name || "",
        email: values?.email || "",
        contact_no: values?.contact_no || "",
        country_code: values?.country_code || "",
        user_name: values?.user_name || "",
        address: values?.address || 0,
      };
      if (values?.password) {
        payload.password = values.password;
      }
      if (imagePreviewUrl) {
        payload.logo = imagePreviewUrl;
      }

      dispatch(createCompany(payload));
    }
  };

  return (
    <>
      <div className="content">
        {!store?.loading ? <SimpleSpinner /> : null}

        <ReactSnackBar
          Icon={
            <span>
              <TiMessages size={25} />
            </span>
          }
          Show={showSnackBar}
        >
          {snackMessage}
        </ReactSnackBar>

        <div className="container-fluid">
          <Row>
            <Col className="col-md-12 col-xxl-10 mx-auto">
              <Card className="card-content p-0">
                <CardBody>
                  <Formik
                    initialValues={initCompanyItem}
                    validationSchema={companySchema}
                    onSubmit={onSubmit}
                  >
                    {({ setFieldValue, values, errors, touched, setFieldTouched }) => (
                      <Form>
                        <Row>
                          <Col
                            xl={6}
                            lg={6}
                            as={BootstrapForm.Group}
                            controlId="formGridFirstName"
                            className="full-width"
                          >
                            <BootstrapForm.Label className="col-label">
                              Location Name
                            </BootstrapForm.Label>
                            <Field
                              type="text"
                              name="name"
                              className="col-input w-100"
                              placeholder="Enter Location Name"
                            />
                            {errors.name && touched.name && (
                              <FormFeedback className="d-block">
                                {errors.name}
                              </FormFeedback>
                            )}
                          </Col>

                          <Col
                            xl={6}
                            lg={6}
                            as={BootstrapForm.Group}
                            controlId="formGridEmail"
                            className="full-width"
                          >
                            <BootstrapForm.Label className="col-label">
                              Email Address
                            </BootstrapForm.Label>
                            <Field
                              type="email"
                              name="email"
                              className="col-input w-100"
                              placeholder="Enter Your Email Address"
                              value={values?.email}
                              onInput={(event) =>
                                handleChangeEmail(event?.target?.value || "")
                              }
                            />
                            {errors.email && touched.email && (
                              <FormFeedback className="d-block">
                                {errors?.email}
                              </FormFeedback>
                            )}
                            {emailExist && touched.email && (
                              <FormFeedback className="d-block">
                                Email already taken.
                              </FormFeedback>
                            )}
                          </Col>
                        </Row>

                        <div className="location-border">
                          <BootstrapForm.Label className="col-label location-label">
                            Location Admin
                          </BootstrapForm.Label>
                          <Row>
                            <Col
                              xl={6}
                              lg={6}
                              as={BootstrapForm.Group}
                              controlId="formGridFirstName"
                              className="full-width"
                            >
                              <BootstrapForm.Label className="col-label">
                                User Name
                              </BootstrapForm.Label>
                              <Field
                                type="text"
                                name="user_name"
                                placeholder="Enter User Name"
                                className="col-input w-100"
                                onInput={(event) =>
                                  handleChangeUsername(event?.target?.value)
                                }
                              />
                              {touched?.user_name &&
                                values?.user_name === "" && (
                                  <FormFeedback className="d-block">
                                    Username is required
                                  </FormFeedback>
                                )}
                              {usernameExist && touched.user_name && (
                                <FormFeedback className="d-block">
                                  Username already taken.
                                </FormFeedback>
                              )}
                            </Col>

                            <Col
                              xl={6}
                              lg={6}
                              as={BootstrapForm.Group}
                              controlId="formGridPassword"
                              className="full-width password"
                            >
                              <BootstrapForm.Label className="col-label">
                                Password
                              </BootstrapForm.Label>
                              <div className="position-relative">
                                <InputGroup className="mb-0">
                                  <Field
                                    name="password"
                                    className="col-input"
                                    placeholder="Enter Your Password"
                                    type={passwordShown ? "text" : "password"}
                                  />
                                  <InputGroupText className="input-eyes-text">
                                    <a onClick={togglePasswordVisibility}>
                                      {passwordShown ? (
                                        <EyeView />
                                      ) : (
                                        <EyeSlash />
                                      )}
                                    </a>
                                  </InputGroupText>
                                </InputGroup>
                                <div className="notes">
                                  {/* <small>
                                    *Password must be alphanumeric & Min. 8
                                    characters.
                                  </small> */}
                                </div>
                                {errors.password && touched.password && (
                                  <FormFeedback className="d-block">
                                    {errors?.password}
                                  </FormFeedback>
                                )}
                              </div>
                            </Col>
                          </Row>
                        </div>

                        <Row>
                          <Col
                            xl={6}
                            lg={6}
                            as={BootstrapForm.Group}
                            controlId="formGridPhone"
                            className="full-width country-drpdwn"
                          >
                            <BootstrapForm.Label className="col-label">
                              Contact Number
                            </BootstrapForm.Label>
                            <PhoneInput
                              type="text"
                              name="contact_no"
                              country={"us"}
                              value={values?.contact_no}
                              onChange={(value, data) => {
                                setFieldValue("contact_no", value);
                                setFieldValue("country_code", data);
                                // setFieldTouched({ ...touched, contact_no: true }); 
                              }}
                              onBlur={() => setFieldTouched("contact_no", true)}
                              placeholder="Enter Contact Number"
                              inputClass="col-input w-100"
                            />
                            {/* <div className="notes">
                              <small>*Phone number must be 10 digits.</small>
                            </div> */}
                            {errors?.contact_no && touched?.contact_no && (
                              <FormFeedback className="d-block">
                                {errors?.contact_no}
                              </FormFeedback>
                            )}
                          </Col>

                          <Col xl={6} lg={6} className="full-width">
                            <BootstrapForm.Group controlId="formGridClientLogo">
                              <BootstrapForm.Label className="col-label">
                                Logo
                              </BootstrapForm.Label>
                              <div className="d-flex">
                                <span className="col-photo">
                                  <input
                                    type="file"
                                    name="logo"
                                    accept="image/*"
                                    // className="w-100"
                                    onChange={(event) =>
                                      handleFileUpload(event, setFieldValue)
                                    }
                                  />
                                </span>

                                {imagePreviewUrl && (
                                  <img
                                    src={imagePreviewUrl}
                                    alt="Client Logo Preview"
                                    width={50}
                                    height={45}
                                    style={{
                                      marginLeft: "10px",
                                      maxWidth: "100%",
                                    }}
                                  />
                                )}
                              </div>
                            </BootstrapForm.Group>
                          </Col>

                          <Col
                            xl={12}
                            lg={6}
                            as={BootstrapForm.Group}
                            controlId="formGridPhone"
                            className="full-width"
                          >
                            <BootstrapForm.Label className="col-label">
                              Physical Address
                            </BootstrapForm.Label>
                            <Field
                              as="textarea"
                              type="text"
                              name="address"
                              className="col-input w-100"
                              placeholder="Enter Physical Address"
                            />
                            {errors.address && touched.address && (
                              <FormFeedback className="d-block">
                                {errors.address}
                              </FormFeedback>
                            )}
                          </Col>
                        </Row>

                        <div className="buttons">
                          <button
                            type="submit"
                            className="btnprimary"
                            disabled={emailExist || usernameExist}
                          >
                            Submit
                          </button>

                          <button
                            type="button"
                            className="btnsecondary ml-3"
                            onClick={() => navigate("/admin/companies")}
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
      </div>
    </>
  );
};

export default AddComapny;
