// ** React Imports
import React, { useState, useEffect, useCallback } from "react";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { editProfile, updateProfile } from "views/login/store/index";

import {
  getEmailExist,
  getUsernameExist,
  cleanAuthMessage,
} from "views/login/store";
import { Col, Row, Form as BootstrapForm } from "react-bootstrap";
import { Card, CardBody, FormFeedback } from "reactstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";

// ** Utils
import { onImageSrcError } from "utility/Utils";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { profileItem, hostRestApiUrl } from "utility/reduxConstant";

// ** Default Avatar
import defaultAvatar from "assets/img/avatar-default.jpg";

const UserProfile = () => {
  const ProfileSchema = Yup.object({
    first_name: Yup.string().required("First Name Is Required"),
    last_name: Yup.string().required("Last Name Is Required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email Is Required"),
    phone: Yup.string().required("Phone number is required")
      .min(8, "Invalid phone number (Minimum 8 Digits Are Required)")
      .max(15, "Invalid phone number (Must Not Exceed 10 digits)"),
    user_name: Yup.string().required("Username Is Required"),
    country_code: Yup.object().nullable(),
  });

  const dispatch = useDispatch();
  const store = useSelector((state) => state.login);
  const id = store.profile?._id;

  const [user, setUser] = useState(profileItem);
  const [loadFirst, setLoadFirst] = useState(true);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");
  const [emailExist, setEmailExist] = useState(false);
  const [usernameExist, setUsernameExist] = useState(false);
  const [imgBase64Data, setImgBase64Data] = useState("");

  useEffect(() => {
    if (loadFirst) {
      dispatch(editProfile());
      setLoadFirst(false);
    }
  }, [dispatch, loadFirst]);

  useEffect(() => {
    if (store.profile) {
      setUser(store.profile);
    }

    if (store.success && store.actionFlag === "PROFILE_UPDATED") {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
      dispatch(editProfile());
    }

    if (store.error && store.actionFlag === "PROFILE_UPDATED") {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [user, store.profile, store.success, store.error, store.actionFlag, dispatch]);

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanAuthMessage(null));
    }

    if (
      store?.actionFlag === "EML_EXST" ||
      store?.actionFlag === "EML_EXST_ERR"
    ) {
      setEmailExist(store?.isEmailExist || false);
    }

    if (
      store?.actionFlag === "USRNM_EXST" ||
      store?.actionFlag === "USRNM_EXST_ERR"
    ) {
      setUsernameExist(store?.isUsernameExist || false);
    }
  }, [
    dispatch,
    store.actionFlag,
    store.success,
    store.error,
    store.isEmailExist,
    store.isUsernameExist,
  ]);
  /* Login */

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar]);

  const handleCheckEmailExist = useCallback(
    (email = "") => {
      const query = { id, email };
      dispatch(getEmailExist(query));
    },
    [dispatch, id]
  );

  const handleCheckUsernameExist = useCallback(
    (userName = "") => {
      const query = { id, user_name: userName };
      dispatch(getUsernameExist(query));
    },
    [dispatch, id]
  );

  const handleChangeEmail = (value = "") => {
    handleCheckEmailExist(value);
  };

  const handleChangeUsername = (value = "") => {
    handleCheckUsernameExist(value);
  };

  const handleFileUpload = (event, func) => {
    if (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          func("image", reader.result)
          setImgBase64Data(reader.result)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleSubmit = (values) => {
    dispatch(updateProfile(values));
  }

  return (
    <div className="h-100">
      {showSnackBar && (
        <ReactSnackBar Icon={(
          <span><TiMessages size={25} /></span>
        )} Show={showSnackBar}>
          {snakebarMessage}
        </ReactSnackBar>
      )}

      {/* <Col md="4" className="mb-3">
        <Card className="card-user mb-0">
          <CardBody>
            <CardText />
            <div className="author">
              <a href="#pablo" onClick={(event) => event.preventDefault()}>
                {user?.image ? (
                  <img
                    alt="Profile"
                    className="avatar"
                    src={`${hostRestApiUrl}/${user?.image}`}
                    onError={(currentTarget) =>
                      onImageSrcError(currentTarget, defaultAvatar)
                    }
                  />
                ) : (
                  <img
                    alt="Profile"
                    className="avatar"
                    src={defaultAvatar}
                  />
                )}
                <h5 className="title">{user?.user_name}</h5>
              </a>

              <p className="description">{user?.email}</p>
              {user?.phone && (
                <p className="description">
                  <TiContacts size={20} /> {user?.phone || ""}
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </Col> */}

      <div className="profile-card">
        <Card className="mb-0 ">

          <CardBody className="pl-0 pr-0">
            <Formik
              initialValues={user}
              enableReinitialize={user}
              validationSchema={ProfileSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
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
                        First Name
                      </BootstrapForm.Label>
                      <Field
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className="col-input w-100"
                      />
                      {errors.first_name && touched.first_name && (
                        <FormFeedback className="d-block">{errors?.first_name}</FormFeedback>
                      )}
                    </Col>

                    <Col
                      xl={6}
                      lg={6}
                      as={BootstrapForm.Group}
                      controlId="formGridLastName"
                      className="full-width"
                    >
                      <BootstrapForm.Label className="col-label">
                        Last Name
                      </BootstrapForm.Label>
                      <Field
                        name="last_name"
                        placeholder="Last Name"
                        type="text"
                        className="col-input w-100"
                      />

                      {errors.last_name && touched.last_name && (
                        <FormFeedback className="d-block">{errors?.last_name}</FormFeedback>
                      )}
                    </Col>
                    <Col
                      xl={6}
                      lg={6}
                      as={BootstrapForm.Group}
                      controlId="formGridUserName"
                      className="full-width"
                    >
                      <BootstrapForm.Label className="col-label">
                        Email address
                      </BootstrapForm.Label>
                      <Field
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        className="col-input w-100"
                        onInput={(event) => handleChangeEmail(event?.target?.value || "")}
                      />

                      {errors.email && (
                        <FormFeedback className="d-block">{errors?.email}</FormFeedback>
                      )}
                      {emailExist && (
                        <FormFeedback className="d-block">Email already taken.</FormFeedback>
                      )}
                    </Col>
                    <Col
                      xl={6}
                      lg={6}
                      as={BootstrapForm.Group}
                      controlId="formGridPhoneNumber"
                      className="full-width country-drpdwn"
                    >
                      <BootstrapForm.Label className="col-label">
                        Mobile Number
                      </BootstrapForm.Label>
                      <PhoneInput
                        country={"us"}
                        value={values?.phone}
                        onChange={(val, data) => {
                          setFieldValue('phone', val);
                          setFieldValue('country_code', data);
                        }}
                        inputClass="col-input w-100"
                        placeholder="Enter contact number"
                        onBlur={() => setFieldTouched("phone", true)}
                      />
                      {errors.phone && (
                        <FormFeedback className="d-block">
                          {errors?.phone}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col
                      xl={6}
                      lg={6}
                      as={BootstrapForm.Group}
                      controlId="formGridUserName"
                      className="full-width"
                    >
                      <BootstrapForm.Label className="col-label">
                        Username
                      </BootstrapForm.Label>
                      <Field
                        type="text"
                        name="user_name"
                        className="col-input w-100"
                        placeholder="Username"
                        onInput={(event) => handleChangeUsername(event?.target?.value)}
                      />

                      {errors.user_name && (
                        <FormFeedback className="d-block">{errors?.user_name}</FormFeedback>
                      )}
                      {usernameExist && (
                        <FormFeedback className="d-block">Username already taken.</FormFeedback>
                      )}
                    </Col>

                    <Col xl={6} lg={6} className="full-width">
                      <BootstrapForm.Group controlId="formGridClientLogo">
                        <BootstrapForm.Label className="col-label">Photo</BootstrapForm.Label>
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
                          {imgBase64Data || store?.profile?.image ? (
                            <img
                              width={50}
                              height={45}
                              alt="Profile"
                              src={imgBase64Data ? imgBase64Data : `${hostRestApiUrl}/${store.profile?.image}`}
                              style={{
                                marginLeft: "10px",
                                maxWidth: "100%",
                              }}
                              onError={(currentTarget) => onImageSrcError(currentTarget, defaultAvatar)}
                            />
                          ) : null}
                        </div>
                      </BootstrapForm.Group>
                    </Col>
                  </Row>

                  <div className="buttons">
                    <button type="submit" className="btnprimary">
                      save
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

export default UserProfile;
