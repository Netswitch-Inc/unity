/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { createUser, cleanUserMessage } from "../store";
import { getRoleList, cleanRoleMessage } from "views/roles/store";
import { getCompanyList, cleanCompanyMessage } from "views/companies/store";
import { getEmailExist, getUsernameExist, cleanAuthMessage } from "views/login/store";

// ** Reactstrap Imports
import {
  Col,
  Row,
  InputGroup,
  Form as BootstrapForm
} from "react-bootstrap";
import { Card, CardBody, FormFeedback } from "reactstrap";

import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import Select from "react-select";

// ** Utils
import { onImageSrcError } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import PhoneInput from "react-phone-input-2";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { superAdminRole, initUserItem } from "utility/reduxConstant";

// ** SVG Icons
import { EyeView, EyeSlash } from "components/SVGIcons";

// ** Default Avatar
import defaultAvatar from "assets/img/avatar-default.jpg";

// ** Styles
import "assets/admincss/AdminControl.css";
import "react-range-slider-input/dist/style.css"; // Import styles


const AddUser = () => {
  // ** Hooks
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const store = useSelector((state) => state.user);
  const roleStore = useSelector((state) => state.roles);
  const companyStore = useSelector((state) => state.company);
  const loginStore = useSelector((state) => state.login);
  const authUserItem = loginStore?.authUserItem?._id ? loginStore?.authUserItem : null;

  // ** States
  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [imgBase64Data, setImgBase64Data] = useState("")
  const [companyOptions, setCompanyOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [emailExist, setEmailExist] = useState(false);
  const [usernameExist, setUsernameExist] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  }

  const UserSchema = yup.object().shape({
    first_name: yup.string().required("First name is required."),
    last_name: yup.string().required("Last name is required."),
    email: yup.string().required("Email is required.")
      .email("Invalid email address."),
    phone: yup.string().required("Phone number is required")
      .min(8, "Invalid phone number (Minimum 8 Digits Are Required)")
      .max(15, "Invalid phone number (Must Not Exceed 10 digits)"),
    user_name: yup.string().required("Username is required.")
      .matches(/^\S*$/, "Username should not contain spaces."),
    password: yup.string().required("Password is required.")
      .min(8, "Password must be at least 8 characters long."),
    role_id: yup.object().required("Role is required."),
    company_id: yup.object().when("role_id", {
      is: () => authUserItem?.role_id?._id === superAdminRole,
      then: (schema) => schema.required("Location is required")
    }).notRequired()
  })

  const handleResetDefault = useCallback(() => {
    setEmailExist(false)
    setUsernameExist(false)
  }, [])

  const handleGetRole = useCallback((companyId = "") => {
    const query = { status: "active" }
    if (companyId) { query.company_id = companyId; }

    dispatch(getRoleList(query));
  }, [dispatch])

  const handleCheckEmailExist = useCallback((email = "") => {
    const query = { email }
    dispatch(getEmailExist(query))
  }, [dispatch])

  const handleCheckUsernameExist = useCallback((userName = "") => {
    const query = { user_name: userName }
    dispatch(getUsernameExist(query))
  }, [dispatch])


  useLayoutEffect(() => {
    handleResetDefault()
    if (authUserItem?.role_id?._id === superAdminRole) {
      dispatch(getCompanyList({ status: "active" }))
    }

    handleGetRole()
  }, [dispatch, handleResetDefault, handleGetRole, authUserItem])

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanUserMessage(null))
    }

    if (store?.actionFlag === "USR_CRET" || store?.actionFlag === "USR_UPDT") {
      setTimeout(() => { navigate('/admin/users') }, 2000);
    }

    if (store?.success) {
      setShowSnackbar(true);
      setSnakbarMessage(store.success);
    }

    if (store?.error) {
      setShowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [dispatch, navigate, store.actionFlag, store.success, store.error, store.userItem])

  useEffect(() => {
    if (companyStore?.actionFlag || companyStore?.success || companyStore?.error) {
      dispatch(cleanCompanyMessage(null))
    }

    if (companyStore?.actionFlag === "COMPANY_LST") {
      let cmpList = [];
      if (companyStore?.companyItems?.length) {
        cmpList = companyStore.companyItems.map((item) => {
          return {
            ...item,
            label: item?.name || "",
            value: item?._id || ""
          }
        })
      }

      setCompanyOptions(cmpList)
    }
  }, [dispatch, companyStore.actionFlag, companyStore.success, companyStore.error, companyStore.companyItems])

  useEffect(() => {
    if (roleStore?.actionFlag || roleStore?.success || roleStore?.error) {
      dispatch(cleanRoleMessage(null))
    }

    if (roleStore?.actionFlag === "ROLE_LST") {
      let roleList = [];
      if (roleStore?.roleItems?.length) {
        roleList = roleStore.roleItems.map((item) => {
          return {
            ...item,
            label: item?.name || "",
            value: item?._id || ""
          }
        })
      }

      setRoleOptions(roleList)
    }
  }, [dispatch, roleStore.actionFlag, roleStore.success, roleStore.error, roleStore.roleItems])

  /* Login */
  useEffect(() => {
    if (loginStore?.actionFlag || loginStore?.success || loginStore?.error) {
      dispatch(cleanAuthMessage(null));
    }

    if (loginStore?.actionFlag === "EML_EXST" || loginStore?.actionFlag === "EML_EXST_ERR") {
      setEmailExist(loginStore?.isEmailExist || false);
    }

    if (loginStore?.actionFlag === "USRNM_EXST" || loginStore?.actionFlag === "USRNM_EXST_ERR") {
      setUsernameExist(loginStore?.isUsernameExist || false);
    }
  }, [dispatch, loginStore.actionFlag, loginStore.success, loginStore.error, loginStore.isEmailExist, loginStore.isUsernameExist])
  /* Login */

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  const handleChangeEmail = (value = "") => {
    handleCheckEmailExist(value)
  }

  const handleChangeUsername = (value = "") => {
    handleCheckUsernameExist(value)
  }

  const handleFileUpload = (event, func) => {
    if (event) {
      const file = event.currentTarget.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          func("image", reader.result)
          setImgBase64Data(reader.result)
        }

        reader.readAsDataURL(file)
      }
    }
  }

  const handleChangeCompany = (item, func) => {
    func('company_id', item)
    handleGetRole(item?.value)
  }

  const handleChangeRole = (item, func) => {
    func('role_id', item)
  }

  const onSubmit = async (values) => {
    if (values && (!emailExist && !usernameExist)) {
      const payload = {
        _id: values?._id || "",
        first_name: values?.first_name || "",
        last_name: values?.last_name || "",
        email: values?.email || "",
        phone: values?.phone || "",
        user_name: values?.user_name || "",
        status: values?.status || 0,
        country_code: values?.country_code || ""
      }

      if (values?.password) { payload.password = values.password; }
      if (imgBase64Data) { payload.image = imgBase64Data; }

      if (values?.company_id) {
        payload.company_id = values.company_id?.value || values.company_id;
      }

      if (!values?.company_id && authUserItem?.role_id?._id !== superAdminRole) {
        payload.company_id = authUserItem?.company_id?._id || authUserItem?.company_id || null;
      }

      if (values?.role_id) {
        payload.role_id = values.role_id?.value || values.role_id;
      }

      // console.log("onSubmit >>> ", values, payload);
      dispatch(createUser(payload));
    }
  }

  return (<>
    <div className="content">
      {!store?.loading ? (<SimpleSpinner />) : null}

      <ReactSnackBar Icon={(
        <span><TiMessages size={25} /></span>
      )} Show={showSnackBar}>
        {snakebarMessage}
      </ReactSnackBar>

      <div className="container-fluid">
        <Row>
          <Col className="col-md-12 col-xxl-10 mx-auto">
            <Card className="card-content p-0">
              <CardBody >
                <Formik
                  initialValues={initUserItem}
                  validationSchema={UserSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
                    <Form>
                      <Row>
                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                          <BootstrapForm.Label className="col-label">First Name</BootstrapForm.Label>
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

                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridLastName" className="full-width">
                          <BootstrapForm.Label className="col-label">Last Name</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            className="col-input w-100"
                          />
                          {errors.last_name && touched.last_name && (
                            <FormFeedback className="d-block">{errors?.last_name}</FormFeedback>
                          )}
                        </Col>

                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridEmail" className="full-width">
                          <BootstrapForm.Label className="col-label">Email</BootstrapForm.Label>
                          <Field
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            className="col-input w-100"
                            onInput={(event) => handleChangeEmail(event?.target?.value || "")}
                          />
                          {errors.email && touched.email && (
                            <FormFeedback className="d-block">{errors?.email}</FormFeedback>
                          )}
                          {emailExist && touched.email && (
                            <FormFeedback className="d-block">Email already taken.</FormFeedback>
                          )}
                        </Col>

                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridPhone " className="full-width country-drpdwn">
                          <BootstrapForm.Label className="col-label">Phone</BootstrapForm.Label>
                          <PhoneInput
                            country={"us"}
                            value={values?.phone}
                            onChange={(val, data) => {
                              // console.log("val", val);
                              // console.log(data, "data");
                              setFieldValue('phone', val);
                              setFieldValue('country_code', data);
                            }}
                            onBlur={() => setFieldTouched("phone", true)}
                            inputClass="col-input w-100"
                            placeholder="Enter contact number"
                          />
                          {/* <div className="notes">
                            <small>*Phone number must be 10 digits.</small>
                          </div> */}
                          {errors.phone && touched.phone && (
                            <FormFeedback className="d-block">{errors?.phone}</FormFeedback>
                          )}
                        </Col>

                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridUserName" className="full-width">
                          <BootstrapForm.Label className="col-label">User Name</BootstrapForm.Label>
                          <Field
                            type="text"
                            name="user_name"
                            placeholder="Enter User Name"
                            className="col-input w-100"
                            onInput={(event) => handleChangeUsername(event?.target?.value)}
                          />
                          {errors.user_name && touched.user_name && (
                            <FormFeedback className="d-block">{errors?.user_name}</FormFeedback>
                          )}
                          {usernameExist && touched.user_name && (
                            <FormFeedback className="d-block">Username already taken.</FormFeedback>
                          )}
                        </Col>

                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridPassword" className="full-width password">
                          <BootstrapForm.Label className="col-label">Password</BootstrapForm.Label>
                          <div className="position-relative">
                            <InputGroup className="mb-0">
                              <Field
                                name="password"
                                className="col-input"
                                type={passwordShown ? "text" : "password"}
                              />
                              <InputGroup.Text className="input-eyes-text">
                                <a onClick={togglePasswordVisibility}>
                                  {passwordShown ? (<EyeView />) : (<EyeSlash />)}
                                </a>
                              </InputGroup.Text>
                            </InputGroup>
                            {/* <div className="notes">
                              <small>*Password must be alphanumeric & Min. 8 characters.</small>
                            </div> */}
                            {errors.password && touched.password && (
                              <FormFeedback className="d-block">{errors?.password}</FormFeedback>
                            )}
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col xl={4} lg={6} className="full-width">
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
                              {imgBase64Data ? (
                                <img
                                  width={50}
                                  height={45}
                                  alt="Profile"
                                  src={imgBase64Data}
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
                      <Row>
                        {authUserItem?.role_id?._id === superAdminRole ? (
                          <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridRole" className="full-width">
                            <BootstrapForm.Label className="col-label">Location</BootstrapForm.Label>
                            <Select
                              name="company_id"
                              options={companyOptions}
                              className="react-select col-select w-100"
                              classNamePrefix="react-select"
                              placeholder="Select Location..."
                              value={values?.company_id || null}
                              onChange={(val) => handleChangeCompany(val, setFieldValue)}
                            />
                            {errors.company_id && touched.company_id && (
                              <FormFeedback className="d-block">{errors?.company_id}</FormFeedback>
                            )}
                          </Col>
                        ) : null}

                        <Col xl={4} lg={6} as={BootstrapForm.Group} controlId="formGridRole" className="full-width">
                          <BootstrapForm.Label className="col-label">Role</BootstrapForm.Label>
                          <Select
                            name="role_id"
                            options={roleOptions}
                            placeholder="Select Role..."
                            className="react-select col-select w-100"
                            classNamePrefix="react-select"
                            value={values?.role_id || null}
                            onChange={(val) => handleChangeRole(val, setFieldValue)}
                          />
                          {errors.role_id && touched.role_id && (
                            <FormFeedback className="d-block">{errors?.role_id}</FormFeedback>
                          )}
                        </Col>

                        <Col xl={4} lg={6} as={BootstrapForm.Group} className="full-width">
                          <BootstrapForm.Label className="col-label">Status</BootstrapForm.Label>
                          <div className="radio-container d-flex">
                            <div className="form-check">
                              <input
                                value={1}
                                id="Active"
                                type="radio"
                                name="status"
                                className="mx-2"
                                aria-label="Active Status"
                                checked={values?.status === 1}
                                onChange={(event) => setFieldValue("status", Number(event.target.value))}
                              />
                              <label htmlFor="Active" className="form-check-label">
                                Active
                              </label>
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
                              <label htmlFor="InActive" className="form-check-label">
                                InActive
                              </label>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <div className="buttons">
                        <button
                          type="submit"
                          className="btnprimary"
                          disabled={(emailExist || usernameExist)}
                        >
                          Submit
                        </button>

                        <button
                          type="button"
                          className="btnsecondary ml-3"
                          onClick={() => navigate("/admin/users")}
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
  </>)
}

export default AddUser;
