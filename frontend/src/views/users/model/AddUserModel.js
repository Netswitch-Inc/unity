/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useCallback, useMemo } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getRoleList } from "../../roles/store/index";
import { createUser, updateUser } from "../store";
import {
  isUserUniqueAction,
  isEmailUniqueAction,
  cleanCompanyMessage,
  getCompanyList,
} from "../../companies/store/index";

import {
  Modal,
  Row,
  Col,
  Form as BootstrapForm,
  InputGroup,
} from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
// ** Utils
import { onImageSrcError } from "utility/Utils";

// ** Constant
import {
  hostRestApiUrl,
  superAdminRole,
  companyAdminRole,
} from "utility/reduxConstant";

// ** SVG Icons
import { EyeView, EyeSlash } from "components/SVGIcons";

// ** Default Avatar
import defaultAvatar from "assets/img/avatar-default.jpg";
import { priviledgesArr } from "utility/reduxConstant";

import "assets/admincss/AdminControl.css";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css"; // Import styles

const AddUser = ({ lgshow, closePopup, title, initialValues, isEditing }) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.roles);
  const companyStore = useSelector((state) => state.company);
  const [passwordShown, setPasswordShown] = useState(true);
  const [roleData, setRoleData] = useState([]);
  const [roleValue, setRoleValue] = useState(
    initialValues?.role_id
      ? {
        value: initialValues?.role_id?._id,
        label: initialValues?.role_id?.name,
        priviledge: initialValues?.role_id?.priviledge,
      }
      : ""
  );
  const [selectedCompany, setSelectedCompany] = useState(
    initialValues?.company_id
      ? {
        value: initialValues?.company_id?._id,
        label: initialValues?.company_id?.name,
      }
      : ""
  );
  const [errMessage, setErrMessage] = useState("");
  const [userErrMessage, setUserErrMessage] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const initialState = {
    ...initialValues,
    role_id: roleValue,
    company_id: selectedCompany,
  };
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");
  const [companyDropdown, setCompanyDropdown] = useState([]);
  const [value, setValue] = useState([1, initialState?.weightIndex || 1]); // Initial single value

  const loginStore = useSelector((state) => state.login);
  const authUserItem = loginStore?.authUserItem?._id
    ? loginStore?.authUserItem
    : null;

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First Name Is Required"),
    last_name: Yup.string().required("Last Name Is Required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email Is Required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone Number Is Required"),
    user_name: Yup.string()
      .required("Username Is Required")
      .matches(/^\S*$/, "Username should not contain spaces"),
    role_id: Yup.object().required("Role is required"),
    company_id: Yup.object().when({
      is: () => authUserItem?.role_id?._id === superAdminRole,
      then: () => Yup.object().required("Location is required"),
    }),
    priviledges: Yup.array().when({
      is: () => initialValues?.role_id?._id !== companyAdminRole,
      then: () =>
        Yup.array()
          .min(1, "At least one Dashboard widget is required")
          .required("Dashboard widgets are required"),
      otherwise: () => Yup.array().notRequired(),
    }),
  });

  // useEffect(() => {
  //   if (authUserItem?.role_id?._id === superAdminRole && loadFirst) {
  //     dispatch(getCompanyList());
  //     setLoadFirst(false);
  //   }
  // }, [loadFirst, dispatch]);

  useMemo(() => {
    if (authUserItem?.role_id?._id === superAdminRole) {
      dispatch(getCompanyList());
    }
  }, [dispatch]);

  useEffect(() => {
    let query = {};
    if (authUserItem?.role_id?._id === superAdminRole && selectedCompany) {
      query.company_id = selectedCompany?.value;
      dispatch(getRoleList(query));
    }
    if (authUserItem?.role_id?._id !== superAdminRole) {
      dispatch(getRoleList());
    }
  }, [dispatch, selectedCompany]);

  const handleRangeChange = (newValue) => {
    setValue(newValue);

    console.log(newValue); // Logs the new value
  };

  // useEffect(() => {
  //     if (user.success) {
  //         setshowSnackbar(true);
  //         setSnakbarMessage(user.success);
  //     }

  //     if (user.error) {
  //         setshowSnackbar(true);
  //         setSnakbarMessage(user.error);
  //     }
  // }, [user.error, user.success]);

  const handleUserChange = useCallback(
    async (event, validateField, values) => {
      const { name, value } = event.target;
      const payload = {
        user_name: value,
      };
      const Editpayload = {
        user_name: value,
        _id: initialValues?._id,
      };
      await validateField(name);
      const errors = await validationSchema
        .validateAt(name, values)
        .catch((err) => err);

      if (!errors || !errors.message) {
        if (title === "Add User") {
          dispatch(isUserUniqueAction(payload));
        }
        if (title === "Edit User") {
          dispatch(isUserUniqueAction(Editpayload));
        }
      }
    },
    [dispatch, initialValues?._id, validationSchema, title]
  );

  useEffect(() => {
    if (initialValues?.image) {
      setImagePreviewUrl(`${hostRestApiUrl}/${initialValues?.image}`);
    }
  }, [initialValues?.image]);

  const handleEmailChange = useCallback(
    async (event, validateField, values) => {
      const { name, value } = event.target;
      const payload = {
        email: value,
      };
      const Editpayload = {
        email: value,
        _id: initialValues?._id,
      };
      await validateField(name);
      const errors = await validationSchema
        .validateAt(name, values)
        .catch((err) => err);

      if (!errors || !errors.message) {
        if (title === "Add User") {
          dispatch(isEmailUniqueAction(payload));
        }
        if (title === "Edit User") {
          dispatch(isEmailUniqueAction(Editpayload));
        }
      }
    },
    [dispatch, initialValues, title, validationSchema]
  );

  useEffect(() => {
    if (companyStore.actionFlag === "CHECK_EMIAL_IS_UNIQUE") {
      if (!companyStore.isEmailUnique) {
        setErrMessage("Email is not unique");
      }
      if (companyStore.isEmailUnique) {
        setErrMessage("");
      }
    }

    if (companyStore.actionFlag === "CHECK_USER_IS_UNIQUE") {
      if (!companyStore.isUserUnique) {
        setUserErrMessage("User is not unique");
      }
      if (companyStore.isUserUnique) {
        setUserErrMessage("");
      }
    }
  }, [companyStore]);

  const setRoleOptions = (roleArr, setVal) => {
    let roleItemsList = [];
    if (roleArr?.length > 0) {
      roleItemsList = roleArr.map((item) => {
        return {
          value: item?._id,
          label: item?.name,
          priviledge: item?.priviledge
        };
      });
    }
    setVal(roleItemsList);
  };


  const setCompOptions = (roleArr, setVal) => {
    let roleItemsList = [];
    if (roleArr?.length > 0) {
      roleItemsList = roleArr.map((item) => {
        return {
          value: item?._id,
          label: item?.name,
        };
      });
    }
    setVal(roleItemsList);
  };

  useEffect(() => {
    if (store.actionFlag === "ROLE_LST") {
      setRoleOptions(store?.roleItems, setRoleData);
    }
    if (companyStore?.actionFlag === "COMPANY_LST") {
      setCompOptions(companyStore?.companyItems, setCompanyDropdown);
    }
  }, [store?.roleItems, store.actionFlag, companyStore?.actionFlag]);

  const handleClose = () => {
    dispatch(cleanCompanyMessage());
    setUserErrMessage("");
    setErrMessage("");
    closePopup();
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleFileUpload = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("image", reader.result);
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(() => false);
    }, 3000);
  }, [showSnackBar]);

  const onSubmit = async (values) => {
    console.log(values, "values");
    if (isEditing) {
      const payload = {
        _id: values?._id,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        priviledges: values.priviledges,
        phone: values.phone,
        user_name: values.user_name,
        password: values?.password,
        role_id: values.role_id?.value
          ? values.role_id?.value
          : values.role_id?._id,
        company_id: values.company_id?.value,
        image: imagePreviewUrl,
        weightIndex: value[1],
        // status: values?.status ? 1 : 0,
        status: values?.status,
      };
      if (errMessage === "" && userErrMessage === "") {
        dispatch(updateUser(payload));
        setUserErrMessage("");
        setErrMessage("");
        dispatch(cleanCompanyMessage());
        closePopup();
      }
    } else {
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        priviledges: values.priviledges,
        phone: values.phone,
        user_name: values.user_name,
        password: values?.password,
        role_id: values.role_id?.value,
        company_id: values.company_id?.value
          ? values.company_id?.value
          : authUserItem?.company_id?._id,
        image: values.image,
        status: values?.status ? 1 : 0,
        weightIndex: value[1],
      };
      if (errMessage === "" && userErrMessage === "") {
        const data = await dispatch(createUser(payload));
        if (data.payload.error !== "") {
          setshowSnackbar(() => true);
          setSnakbarMessage(() => data.payload.error);
        }
        if (data.type === "creat/fulfilled" && data.payload.error === "") {
          setUserErrMessage("");
          setErrMessage("");
          dispatch(cleanCompanyMessage());
          closePopup();
        }
      }
    }
  };

  return (
    <>
      <Modal
        className="UpdateUserPopup"
        size="lg"
        show={lgshow}
        aria-labelledby="example-modal-sizes-title-lg"
        centered
      >
        <Modal.Header>
          <span
            className="modal-title col-sm-12 "
            id="example-modal-sizes-title-lg"
          >
            <h3 className="border-bottom pb-2 mb-0 mt-0">{title}</h3>
          </span>
          <button type="button" className="Close-button" onClick={handleClose}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
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
          <Formik
            initialValues={initialState}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ validateField, values, setFieldValue, errors }) => (
              <Form>
                <Row className="mb-2">
                  <Col as={BootstrapForm.Group} controlId="formGridFirstName">
                    <BootstrapForm.Label>First Name</BootstrapForm.Label>
                    <Field
                      className="form-control"
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Col>

                  <Col as={BootstrapForm.Group} controlId="formGridLastName">
                    <BootstrapForm.Label>Last Name</BootstrapForm.Label>
                    <Field
                      className="form-control"
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="span"
                      style={{ color: "red" }}
                    />
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col md={6}>
                    <BootstrapForm.Group controlId="formGridClientLogo">
                      <BootstrapForm.Label>Profile Photo</BootstrapForm.Label>
                      <div className="d-flex">
                        <input
                          type="file"
                          name="image"
                          onChange={(event) =>
                            handleFileUpload(event, setFieldValue)
                          }
                          className="form-control-file "
                          accept="image/*"
                        />
                        {imagePreviewUrl && (
                          <img
                            width={50}
                            height={50}
                            src={imagePreviewUrl}
                            alt="Client Logo Preview"
                            style={{ marginTop: "10px", maxWidth: "100%" }}
                            onError={(currentTarget) =>
                              onImageSrcError(currentTarget, defaultAvatar)
                            }
                          />
                        )}
                      </div>
                    </BootstrapForm.Group>
                  </Col>

                  <Col as={BootstrapForm.Group} controlId="formGridPhone">
                    <BootstrapForm.Label>Phone</BootstrapForm.Label>
                    <Field
                      className="form-control"
                      type="text"
                      name="phone"
                      placeholder="Enter Phone"
                    />
                    <div>
                      <small>*Phone number must be 10 digits</small>
                    </div>
                    <ErrorMessage
                      name="phone"
                      component="span"
                      style={{ color: "red" }}
                    />
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col as={BootstrapForm.Group} controlId="formGridEmail">
                    <BootstrapForm.Label>Email</BootstrapForm.Label>
                    <Field
                      className="form-control"
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      onBlur={(e) =>
                        handleEmailChange(e, validateField, values)
                      }
                    />
                    <ErrorMessage
                      name="email"
                      component="span"
                      style={{ color: "red" }}
                    />
                    {errMessage !== "" && (
                      <div className="text-danger">{errMessage}</div>
                    )}
                  </Col>

                  <Col as={BootstrapForm.Group} controlId="formGridUserName">
                    <BootstrapForm.Label>User Name</BootstrapForm.Label>
                    <Field
                      className="form-control"
                      type="text"
                      name="user_name"
                      placeholder="Enter User Name"
                      onBlur={(event) =>
                        handleUserChange(event, validateField, values)
                      }
                    />
                    <ErrorMessage
                      name="user_name"
                      component="div"
                      style={{ color: "red" }}
                    />
                    {userErrMessage !== "" && (
                      <div className="text-danger">{userErrMessage}</div>
                    )}
                  </Col>

                  <Col as={BootstrapForm.Group} controlId="formGridPassword">
                    <BootstrapForm.Label>Password</BootstrapForm.Label>
                    <div className="position-relative">
                      <InputGroup className="mb-0">
                        <Field
                          className="form-control"
                          type={passwordShown ? "text" : "password"}
                          name="password"
                        />
                        <InputGroup.Text className="input-eyes-text">
                          <a onClick={togglePasswordVisibility}>
                            {passwordShown ? <EyeView /> : <EyeSlash />}
                          </a>
                        </InputGroup.Text>
                      </InputGroup>
                      <div>
                        <small>
                          *Password must be alphanumeric & Min. 8 characters
                        </small>
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  </Col>
                </Row>

                {/* {initialValues?.role_id?._id !== companyAdminRole && ( */}
                <Row className="mb-2">
                  <Col as={BootstrapForm.Group} className="mb-2 mb-md-0">
                    <label>Dashboard widgets</label>
                    <div className="d-flex">
                      {priviledgesArr.map((privilege) => (
                        <div
                          className="is-active-container col"
                          key={privilege}
                        >
                          <div className="is-active-checked form-check d-flex">
                            <input
                              type="checkbox"
                              name={privilege} // Set the name to the privilege
                              className="is-active-checked form-check-input mt-0"
                              checked={values?.priviledges?.includes(
                                privilege
                              )} // Check if the privilege is included in the selectedPrivileges array
                              id={privilege} // Set the id to the privilege
                              onChange={(event) => {
                                const isChecked = event.target.checked;
                                const updatedPrivileges = isChecked
                                  ? [
                                    ...(values?.priviledges || []),
                                    privilege,
                                  ] // Add privilege if checked
                                  : values?.priviledges.filter(
                                    (p) => p !== privilege
                                  ); // Remove privilege if unchecked
                                setFieldValue(
                                  "priviledges",
                                  updatedPrivileges
                                ); // Update the array of selected privileges
                              }}
                            />
                            <label
                              title={
                                privilege.charAt(0).toUpperCase() +
                                privilege.slice(1)
                              }
                              htmlFor={privilege}
                              className="pl-3 mb-0"
                            >
                              {privilege.charAt(0).toUpperCase() +
                                privilege.slice(1)}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>
                  <Col as={BootstrapForm.Group} className="mb-2 mb-md-0">
                    {values?.priviledges?.length > 0 && (
                      <>
                        <label>Weight Index</label>
                        <div
                          className="slider-container"
                          style={{ position: "relative", width: "300px" }}
                        >
                          <RangeSlider
                            id="range-slider"
                            className="my-3"
                            name="weightIndex"
                            value={value}
                            min={1}
                            max={10}
                            onInput={handleRangeChange}
                            thumbsDisabled={[true, false]}
                            rangeSlideDisabled={false}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "-30px", // Adjust this value based on the positioning of your slider
                              left:
                                value[1] < 5
                                  ? `${((value[1] - 0.7) / 9.3) * 100}%`
                                  : `${((value[1] - 0.9) / 9.3) * 100}%`, // Dynamically position based on the current value
                              transform: "translateX(-50%)",
                              right: "auto",
                              // backgroundColor: '#000',
                              color: "#fff",
                              padding: "2px 5px",
                              borderRadius: "3px",
                            }}
                          >
                            {value[1]}
                          </div>
                        </div>
                      </>
                    )}
                  </Col>
                </Row>
                {/* )} */}
                {errors?.priviledges && (
                  <div style={{ color: "red" }}>{errors?.priviledges}</div>
                )}
                <Row className="mb-2">
                  {authUserItem?.role_id?._id === superAdminRole && (
                    <Col as={BootstrapForm.Group} controlId="formGridRole">
                      <>
                        {/* <Col as={BootstrapForm.Group} controlId="formGridRole"> */}
                        <BootstrapForm.Label>Location</BootstrapForm.Label>
                        {companyDropdown && (
                          <Select
                            name="company_id"
                            className="react-select info"
                            classNamePrefix="react-select"
                            placeholder="Select Location..."
                            value={selectedCompany}
                            options={companyDropdown}
                            onChange={(compVal) => {
                              setFieldValue("company_id", compVal);
                              setSelectedCompany(compVal);
                            }}
                          />
                        )}
                        <ErrorMessage
                          name="company_id"
                          component="div"
                          style={{ color: "red" }}
                        />
                      </>
                    </Col>
                  )}
                  <Col as={BootstrapForm.Group} controlId="formGridRole">
                    <BootstrapForm.Label>Role</BootstrapForm.Label>
                    {roleData && (
                      <Select
                        name="role_id"
                        className="react-select info"
                        classNamePrefix="react-select"
                        placeholder="Select Role..."
                        value={roleValue}
                        options={roleData}
                        onChange={(roleVal) => {
                          setFieldValue("role_id", roleVal);
                          setRoleValue(roleVal);
                          if (["executive", "governor", "technologist"].includes(roleVal?.priviledge)) {
                            setFieldValue("priviledges", [roleVal?.priviledge]);
                          }
                          if (roleVal?.value === companyAdminRole) {
                            setFieldValue("priviledges", ["executive", "governor", "technologist"]);
                          }
                        }}
                      />
                    )}
                    <ErrorMessage
                      name="role_id"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </Col>
                  {console.log(values, 'values')}
                  <Col as={BootstrapForm.Group}>
                    <BootstrapForm.Label>Status</BootstrapForm.Label>
                    <div className="status-container d-flex">
                      <div className="form-check">
                        <input
                          type="radio"
                          name="status"
                          value={1}
                          checked={values?.status === 1}
                          id="Active"
                          className="mx-2"
                          onChange={(event) =>
                            setFieldValue("status", Number(event.target.value))
                          }
                          aria-label="Active Status"
                        />
                        <label htmlFor="Active" className="form-check-label">
                          Active
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          name="status"
                          className="mx-2"
                          value={0}
                          checked={values?.status === 0}
                          id="InActive"
                          onChange={(event) =>
                            setFieldValue("status", Number(event.target.value))
                          }
                          aria-label="Inactive Status"
                        />
                        <label htmlFor="InActive" className="form-check-label">
                          InActive
                        </label>
                      </div>
                    </div>
                  </Col>
                </Row>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default AddUser;
