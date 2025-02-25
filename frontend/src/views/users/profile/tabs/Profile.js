// ** React Imports
import React, { useState, useEffect, useCallback } from "react";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { editProfile, updateProfile } from "views/login/store/index";
// import {
//     isUserUniqueAction,
//     isEmailUniqueAction,
//     cleanCompanyMessage,
// } from "../../companies/store/index";
import { isEmailUniqueAction, isUserUniqueAction } from "views/companies/store";

import {
    Col,
    Row,
    Card,
    Input,
    Button,
    CardBody,
    CardText,
    FormGroup,
} from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// ** Utils
import { onImageSrcError } from "utility/Utils";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages, TiContacts } from "react-icons/ti";

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
        phone: Yup.string()
            .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
            .required("Phone Number Is Required"),
        user_name: Yup.string().required("Username Is Required"),
    });

    const dispatch = useDispatch();
    const store = useSelector((state) => state.login);
    const companyStore = useSelector((state) => state.company);

    const [user, setUser] = useState(profileItem);
    const [loadFirst, setLoadFirst] = useState(true);
    const [showSnackBar, setshowSnackbar] = useState(false);
    const [snakebarMessage, setSnakbarMessage] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [userErrMessage, setUserErrMessage] = useState("");

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

        if (store.success && store.actionFlag === 'PROFILE_UPDATED') {
            setshowSnackbar(true);
            setSnakbarMessage(store.success);
        }

        if (store.error && store.actionFlag === 'PROFILE_UPDATED') {
            setshowSnackbar(true);
            setSnakbarMessage(store.error);
        }
    }, [user, store.profile, store.success, store.error, store.actionFlag]);

    const handleEmailChange = useCallback(
        async (event, validateField, values) => {
            const { name, value } = event.target;
            const Editpayload = {
                email: value,
                _id: values?._id,
            };
            await validateField(name);
            const errors = await ProfileSchema.validateAt(name, values).catch(
                (err) => err
            );

            if (!errors || !errors.message) {
                dispatch(isEmailUniqueAction(Editpayload));
            }
        },
        [dispatch, ProfileSchema]
    );

    const handleUserChange = useCallback(
        async (event, validateField, values) => {
            const { name, value } = event.target;
            const Editpayload = {
                user_name: value,
                _id: values?._id,
            };
            await validateField(name);
            const errors = await ProfileSchema
                .validateAt(name, values)
                .catch((err) => err);

            if (!errors || !errors.message) {

                dispatch(isUserUniqueAction(Editpayload));

            }
        },
        [dispatch, ProfileSchema]
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

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
        }, 6000);
    }, [showSnackBar]);

    const handleSubmit = (values) => {
        dispatch(updateProfile(values));
    };

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
                    <Col md="8" className="mb-3">
                        <Card className="mb-0">
                            <div className="p-0 card-header">
                                <h3 className="card-title border-bottom pb-2 mt-0">Profile</h3>
                            </div>

                            <CardBody className="pl-0 pr-0">
                                <Formik
                                    initialValues={user}
                                    enableReinitialize={user}
                                    validationSchema={ProfileSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ validateField, values }) => (
                                        <Form>
                                            <Row>
                                                <Col className="" md="4">
                                                    <FormGroup>
                                                        <label>Username</label>
                                                        <Field
                                                            as={Input}
                                                            type="text"
                                                            name="user_name"
                                                            placeholder="Username"
                                                            onBlur={(event) =>
                                                                handleUserChange(event, validateField, values)
                                                            }
                                                        />
                                                        {userErrMessage !== "" && (
                                                            <div style={{ color: 'red' }}>{userErrMessage}</div>
                                                        )}
                                                        <ErrorMessage
                                                            name="user_name"
                                                            component="span"
                                                            style={{ color: "red" }}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col className="" md="4">
                                                    <FormGroup>
                                                        <label>Email address</label>
                                                        <Field
                                                            name="email"
                                                            type="email"
                                                            placeholder="Enter email"
                                                            onBlur={(e) =>
                                                                handleEmailChange(e, validateField, values)
                                                            }
                                                            as={Input}
                                                        />
                                                        {errMessage !== "" && (
                                                            <div style={{ color: 'red' }}>{errMessage}</div>
                                                        )}
                                                        <ErrorMessage
                                                            name="email"
                                                            component="span"
                                                            style={{ color: "red" }}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col className="" md="4">
                                                    <FormGroup>
                                                        <label>Contact Number</label>
                                                        <Field
                                                            as={Input}
                                                            name="phone"
                                                            placeholder="Enter contact number"
                                                        />
                                                        <ErrorMessage
                                                            name="phone"
                                                            component="span"
                                                            style={{ color: "red" }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col className="" md="6">
                                                    <FormGroup>
                                                        <label>First Name</label>
                                                        <Field
                                                            type="text"
                                                            as={Input}
                                                            name="first_name"
                                                            placeholder="First Name"
                                                        />
                                                        <ErrorMessage
                                                            name="first_name"
                                                            component="span"
                                                            style={{ color: "red" }}
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col className="" md="6">
                                                    <FormGroup>
                                                        <label>Last Name</label>
                                                        <Field
                                                            name="last_name"
                                                            placeholder="Last Name"
                                                            type="text"
                                                            as={Input}
                                                        />
                                                        <ErrorMessage
                                                            name="last_name"
                                                            component="span"
                                                            style={{ color: "red" }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Button
                                                type="submit"
                                                color="primary"
                                                className="btn-fill"
                                            >
                                                Submit
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col md="4" className="mb-3">
                        <Card className="card-user mb-0">
                            <CardBody>
                                <CardText />
                                <div className="author">
                                    <div className="block block-one" />
                                    <div className="block block-two" />
                                    <div className="block block-three" />
                                    <div className="block block-four" />

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
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default UserProfile;
