// ** React Imports
import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { updateCompany, getCompany, cleanCompanyMessage } from "../store";
import { getEmailExist, cleanAuthMessage } from "views/login/store";

// ** Reactstrap Imports
import { Card, CardBody, FormFeedback } from "reactstrap";
import { Col, Row, Form as BootstrapForm } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

// ** Utils
import { onImageSrcError } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import PhoneInput from "react-phone-input-2";

// ** Constant
import { initCompanyItem, hostRestApiUrl } from "utility/reduxConstant";

// ** Default Avatar
import defaultAvatar from "assets/img/avatar-default.jpg";

const EditCompany = () => {
  const store = useSelector((state) => state.company);
  const loginStore = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const companySchema = yup.object({
    name: yup.string().required("Name is required."),
    contact_no: yup.string().required("Contact number is required")
      .min(8, "Invalid contact number (Minimum 8 Digits Are Required)")
      .max(15, "Invalid contact number (Must Not Exceed 10 digits)"),
    email: yup.string().email("Invalid email format")
      .required("Email is required."),
    address: yup.string().nullable()
  })

  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [newCompanyItem, setNewCompanyItem] = useState(initCompanyItem);
  const [emailExist, setEmailExist] = useState(false);

  const handleGetCompany = useCallback(() => {
    dispatch(getCompany({ id }));
  }, [dispatch, id]);

  useLayoutEffect(() => {
    handleGetCompany();
  }, [handleGetCompany]);

  const handleFileUpload = (event, func) => {
    if (event) {
      const file = event.currentTarget.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          func("logo", reader.result);
          setImagePreviewUrl(reader.result);
        };

        reader.readAsDataURL(file);
      }
    }
  };

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanCompanyMessage());
    }
    if (
      store?.actionFlag === "COMPANY_ITM" ||
      store?.actionFlag === "COMPANY_ITM_ERR"
    ) {
      let companyItem = { ...initCompanyItem };
      if (store.companyItem?._id) {
        companyItem = { ...store.companyItem };
      }
      setNewCompanyItem(companyItem);
    }
    if (
      store?.actionFlag === "COMPANY_CRTD" ||
      store?.actionFlag === "COMPANY_UPDT"
    ) {
      setTimeout(() => {
        navigate("/admin/companies");
      }, 3000);
    }
    if (store.success) {
      setShowSnackbar(true);
      setSnackMessage(store.success);
    }
    if (store.error) {
      setShowSnackbar(true);
      setSnackMessage(store.error);
    }
  }, [
    store?.error,
    store.success,
    store?.actionFlag,
    navigate,
    dispatch,
    store.companyItem,
  ]);

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(() => false);
    }, 6000);
  }, [showSnackBar]);

  const handleCheckEmailExist = useCallback(
    (email = "") => {
      const query = { id, email };
      dispatch(getEmailExist(query));
    },
    [dispatch, id]
  );

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
  }, [
    dispatch,
    loginStore.actionFlag,
    loginStore.success,
    loginStore.error,
    loginStore.isEmailExist,
  ]);
  /* Login */

  const handleChangeEmail = (value = "") => {
    handleCheckEmailExist(value);
  };

  const onSubmit = async (values) => {
    if (values && !emailExist) {
      const payload = {
        _id: id,
        name: values?.name,
        contact_no: values?.contact_no,
        country_code: values?.country_code,
        email: values?.email,
        address: values?.address,
        user_id: values?.user_id?._id,
      };

      if (values?.password) {
        payload.password = values.password;
      }
      if (imagePreviewUrl) {
        payload.logo = imagePreviewUrl;
      }

      dispatch(updateCompany(payload));
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

        <div className="container-fluid ">
          <Row>
            <Col className="col-md-12 col-xxl-10 mx-auto">
              <Card className="card-content p-0">
                <CardBody>
                  <Formik
                    initialValues={newCompanyItem}
                    enableReinitialize={newCompanyItem}
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
                              readOnly
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="text-danger"
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

                          <Col
                            xl={6}
                            lg={6}
                            as={BootstrapForm.Group}
                            controlId="formGridPhone"
                            className="full-width country-drpdwn"
                          >
                            <BootstrapForm.Label className="col-label">
                              Phone
                            </BootstrapForm.Label>
                            <PhoneInput
                              type="text"
                              name="contact_no"
                              country={"us"}
                              value={values?.contact_no}
                              onChange={(value, data) => {
                                setFieldValue("contact_no", value);
                                setFieldValue("country_code", data);
                              }}
                              onBlur={() => setFieldTouched("contact_no", true)}
                              inputClass="col-input w-100"
                              placeholder="Enter Contact Number"
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
                            <BootstrapForm.Group controlId="formGridCompanyLogo">
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

                                {imagePreviewUrl || store?.companyItem?.logo ? (
                                  <img
                                    width={50}
                                    height={45}
                                    alt="Client Logo Preview"
                                    src={
                                      imagePreviewUrl
                                        ? imagePreviewUrl
                                        : `${hostRestApiUrl}/${store.companyItem?.logo}`
                                    }
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
                        </Row>

                        <Row>
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
                            // rows={4}
                            // style={{ minHeight: "100px" }}
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
                            disabled={emailExist}
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

export default EditCompany;
