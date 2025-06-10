/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { updateCompany, getCompany } from "views/companies/store/index";

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardText } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Form as BootstrapForm } from "react-bootstrap";

// ** Utils
import { onImageSrcError } from "utility/Utils";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { hostRestApiUrl, companyAdminRole } from "utility/reduxConstant";
import PhoneInput from "react-phone-input-2";

// ** Default Avatar
import defaultAvatar from "assets/img/avatar-default.jpg";
import Mail from "assets/img/mail.svg";
import Phone from "assets/img/call.svg";
import { initCompanyItem } from "utility/reduxConstant";
import { cleanCompanyMessage } from "../store";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Location name is required"),
  country_code: Yup.object().nullable(),
  contact_no: Yup.string()
    .min(8, "Invalid contact number (Minimum 8 Digits Are Required)")
    .max(15, "Invalid contact number (Must Not Exceed 10 digits)")
    .required("Contact number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  address: Yup.string().required("Physical address is required"),
});

const CompanyProfile = () => {
  // ** Hooks
  const navigate = useNavigate();

  // ** Store vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.company);

  const loginStore = useSelector((state) => state.login);

  // ** Const
  const userRoleId =
    loginStore?.authUserItem?.role_id?._id ||
    loginStore?.authUserItem?.role_id ||
    "";

  const [loadFirst, setLoadFirst] = useState(true);
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [initialCompanyItem, setInitialCompanyItem] = useState(initCompanyItem);

  const getInitials = () => {
    if (initialCompanyItem?.name) {
      return `${initialCompanyItem?.name[0]}`.toUpperCase();
    }
    return initialCompanyItem?.email
      ? initialCompanyItem?.email[0].toUpperCase()
      : "?";
  };

  useEffect(() => {
    if (companyAdminRole !== userRoleId) {
      navigate("/admin");
    }
  }, [userRoleId, navigate]);

  useEffect(() => {
    if (loadFirst) {
      const query = { id: loginStore?.authUserItem?.company_id?._id };
      dispatch(getCompany(query));
      setLoadFirst(false);
    }
  }, [dispatch, loadFirst, loginStore?.authUserItem?.company_id?._id]);

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanCompanyMessage());
    }
    if (store?.companyItem) {
      setInitialCompanyItem(store?.companyItem);
      setImagePreviewUrl(`${hostRestApiUrl}/${store?.companyItem?.logo}`);
    }

    if (
      store.actionFlag === "COMPANY_ITM" ||
      store.actionFlag === "COMPANY_ITM_ERR"
    ) {
      let companyItem = { ...initCompanyItem };
      if (store.companyItem?._id) {
        companyItem = { ...store.companyItem };
      }
      setInitialCompanyItem(companyItem);
    }

    if (store.success) {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
    }

    if (store.error) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [
    store.actionFlag,
    store.success,
    store.error,
    store.companyItem,
    dispatch,
  ]);

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar]);

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

  const onSubmit = (values) => {
    // const payload = { ...values };
    const payload = {
      _id: values?._id,
      name: values?.name,
      country_code: values?.country_code,
      contact_no: values?.contact_no,
      email: values?.email,
      address: values?.address,
    };

    if (values?.user_id) {
      payload.user_id = values.user_id?._id || values.user_id;
    }

    if (imagePreviewUrl) {
      payload.logo = imagePreviewUrl;
    }

    if (payload?._id) {
      dispatch(updateCompany(payload));
    }
  };

  return (
    <>
      <div className="content profile-management">
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
          <Col md="4" className="mb-3">
            <Card className="card-user mb-0 main-profile-card">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="profile-name-img">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      {initialCompanyItem?.logo ? (
                        <img
                          alt="Location Profile"
                          className="avatar"
                          src={imagePreviewUrl}
                        />
                      ) : (
                        <div className="avatar-text">
                          <div className="avatar-border">
                            <div className="avatar">{getInitials()}</div>
                          </div>
                        </div>
                      )}
                      <h4 className="title mt-2">{initialCompanyItem?.name}</h4>
                    </a>
                  </div>
                  <p className="description">
                    <img src={Mail} height={18} className="mr-2" />
                    {initialCompanyItem?.email}
                  </p>
                  {initialCompanyItem?.contact_no && (
                    <p className="description">
                      <img src={Phone} height={18} className="mr-1" />
                      {"+" + initialCompanyItem?.contact_no || ""}
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="8">
            <Card>
              <CardBody className="pl-0 pr-0">
                <Formik
                  initialValues={initialCompanyItem}
                  enableReinitialize={initialCompanyItem}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ setFieldValue, values, setFieldTouched }) => (
                    <Form>
                      <Row>
                        <Col
                          xl={6}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridCompanyName"
                          className="full-width"
                        >
                          <BootstrapForm.Group controlId="formGridCompanyName">
                            <BootstrapForm.Label className="col-label">
                              Location Name
                            </BootstrapForm.Label>
                            <Field
                              type="text"
                              name="name"
                              className="col-input w-100"
                              placeholder="Enter location name"
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="d-block invalid-feedback"
                            />
                          </BootstrapForm.Group>
                        </Col>

                        <Col
                          xl={6}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridEmail"
                          className="full-width"
                        >
                          <BootstrapForm.Group controlId="formGridEmailAddress">
                            <BootstrapForm.Label className="col-label">
                              Email Address
                            </BootstrapForm.Label>
                            <Field
                              type="email"
                              name="email"
                              className="col-input w-100"
                              placeholder="Enter Your Email Address"
                              //   readOnly
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="d-block invalid-feedback"
                            />
                          </BootstrapForm.Group>
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
                                  // className="col-photo w-100"
                                  onChange={(event) =>
                                    handleFileUpload(event, setFieldValue)
                                  }
                                />
                              </span>
                              {imagePreviewUrl || store.companyItem?.logo ? (
                                <img
                                  height={45}
                                  width={50}
                                  src={
                                    imagePreviewUrl
                                      ? imagePreviewUrl
                                      : `${hostRestApiUrl}/${store.companyItem?.logo}`
                                  }
                                  alt="Client Logo Preview"
                                  style={{
                                    marginLeft: "10px",
                                    maxWidth: "100%",
                                  }}
                                  onError={(currentTarget) =>
                                    onImageSrcError(
                                      currentTarget,
                                      defaultAvatar
                                    )
                                  }
                                />
                              ) : null}
                            </div>
                          </BootstrapForm.Group>
                        </Col>

                        <Col
                          xl={6}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridPhoneNumber"
                          className="full-width country-drpdwn"
                        >
                          <BootstrapForm.Label className="col-label">
                            Contact Number
                          </BootstrapForm.Label>
                          <PhoneInput
                            value={values?.contact_no}
                            onChange={(val, data) => {
                              // console.log("val", val);
                              // handleChangeMobile(val, data, setFieldValue);
                              setFieldValue("contact_no", val);
                              setFieldValue("country_code", data);
                            }}
                            onBlur={() => setFieldTouched("contact_no", true)}
                            inputClass="col-input w-100"
                            placeholder="Enter contact number"
                          />
                          <ErrorMessage
                            name="contact_no"
                            component="div"
                            className="d-block invalid-feedback"
                          />
                        </Col>

                        <Col
                          xl={6}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridPhysicalAddress"
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
                            placeholder="Enter Your Physical Address"
                          />
                          <ErrorMessage
                            name="address"
                            component="div"
                            className="d-block invalid-feedback"
                          />
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
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CompanyProfile;
