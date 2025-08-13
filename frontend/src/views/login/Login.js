/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { login, cleanAuthMessage } from './store';

// ** Reactstrap Imports
import {
    Row,
    Col,
    Input,
    Button,
    InputGroup,
    FormFeedback,
    InputGroupText,
    InputGroupAddon,
} from "reactstrap";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Utils
import { onImageSrcError } from 'utility/Utils';

// ** SVG Icons
import { EyeView, EyeSlash } from 'components/SVGIcons';

// ** Constant
import { defaultLogo, defaultCompanyName } from 'utility/reduxConstant';

// ** Logo and PNG Icons
import Lock from "assets/img/lock.svg";
import logo from "assets/img/react-logo.png";
import mainImage from "assets/img/loginimg.png";

const LoginForm = () => {
    // ** Hooks
    const navigate = useNavigate();

    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.login);
    const settingStore = useSelector((state) => state.globalSetting);

    // ** Const
    const appSettingItem = settingStore?.appSettingItem || null;
    const appLogo = appSettingItem?.logo || defaultLogo;

    // ** States
    const [showSnackBar, setshowSnackbar] = useState(false);
    const [SnackMessage, setSnackMessage] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    }

    // Define validation schema using Yup
    const validationSchema = Yup.object().shape({
        user_name: Yup.string().required('Username is required!'),
        password: Yup.string().required('Password is required!'),
    });

    // Initial form values
    const initialValues = {
        user_name: "",
        password: "",
    }

    const handleDefaults = useCallback(() => {
        navigate(`/admin/dashboard`);
    }, [navigate]);

    useEffect(() => {
        if (store?.actionFlag === "LOGGED") {
            handleDefaults()
        }

        if (store?.actionFlag || store?.success || store?.error) {
            dispatch(cleanAuthMessage());
        }

        if (store?.success) {
            setshowSnackbar(true);
            setSnackMessage(store.success);
        }

        if (store?.error) {
            setshowSnackbar(true);
            setSnackMessage(store.error);
        }
    }, [handleDefaults, store.actionFlag, store.success, store.error, dispatch])

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    // Form submit handler
    const onSubmit = (values, { setSubmitting }) => {
        setSubmitting(false);
        if (values) {
            dispatch(login(values));
        }
    }

    return (
        <div className="auth-wrapper auth-cover">
            <ReactSnackBar Icon={(
                <span><TiMessages size={25} /></span>
            )} Show={showSnackBar}>
                {SnackMessage}
            </ReactSnackBar>
            <Row className='auth-inner m-0 main-left-right row'>
                <div className='d-none d-lg-flex p-0 login-left'>
                    <div className='w-100 h-100 main-img-left'>
                        <img className='img-fluid' src={mainImage} alt='Login Cover' />
                    </div>
                </div>
                <div className="h-100 right-login d-flex align-items-center auth-bg px-2 p-lg-5">
                    <Col className='h-100 px-xl-2 mx-auto main-login col-10 col-sm-8 col-md-7'>
                        <div className='w-100 d-lg-flex align-items-center mb-3 justify-content-center' style={{ textAlign: 'center' }}>
                            <img
                                alt="..."
                                src={appLogo}
                                style={{ height: "150px" }}
                                onError={(currentTarget) => onImageSrcError(currentTarget, logo)}
                            />
                        </div>

                        <div className='login-text'>
                            Welcome to {appSettingItem?.name || defaultCompanyName}!
                        </div>
                        <div className='small-text'>
                            Please sign-in to your account and start the adventure
                        </div>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {({ errors, touched, values, isSubmitting, setFieldValue, setFieldTouched }) => (
                                <Form className="form">
                                    <div className="card-login">
                                        <div className='p-0'>
                                            <div className='mb-3'>
                                                <InputGroup className={`custom-input-group mb-0`}>
                                                    <InputGroupAddon addonType="prepend" className="input-icon">
                                                        <InputGroupText>
                                                            <i className="tim-icons icon-single-02" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input
                                                        type="text"
                                                        name="user_name"
                                                        value={values.user_name}
                                                        placeholder="Username"
                                                        className="custom-input"
                                                        onInput={(event) => setFieldValue(event?.target?.name, event?.target?.value)}
                                                        onBlur={() => setFieldTouched("user_name", true)}
                                                    />
                                                </InputGroup>
                                                {errors.user_name && touched.user_name && (
                                                    <FormFeedback className="d-block p-0">{errors.user_name}</FormFeedback>
                                                )}
                                            </div>
                                            <div className='mb-3'>
                                                <InputGroup className={`custom-input-group mb-0`}>
                                                    <InputGroupAddon addonType="prepend" className="input-icon">
                                                        <InputGroupText>
                                                            <img
                                                                height={16}
                                                                alt='lock'
                                                                src={Lock} />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input
                                                        name="password"
                                                        autoComplete="off"
                                                        placeholder="Password"
                                                        value={values.password}
                                                        type={passwordShown ? "text" : "password"}
                                                        className="custom-input"
                                                        onInput={(event) => setFieldValue(event?.target?.name, event?.target?.value)}
                                                        onBlur={() => setFieldTouched("password", true)}
                                                    />
                                                    <InputGroupText className='input-eyes-text'>
                                                        <a onClick={togglePasswordVisiblity} className="eye-icon">
                                                            {passwordShown ? <EyeView /> : <EyeSlash />}
                                                        </a>
                                                    </InputGroupText>
                                                </InputGroup>
                                                {errors.password && touched.password && (
                                                    <FormFeedback className="d-block p-0">{errors.password}</FormFeedback>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <div className='main-link'>
                                                <Link to={`/forgot-password`} className='forget-link'>Forgot Password ?</Link>
                                            </div>
                                            <Button
                                                block
                                                size="lg"
                                                color="primary"
                                                disabled={isSubmitting}
                                                className='btn-login-page'
                                            >
                                                {store?.loading ? "Login" : "Loading..."}
                                            </Button>
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

export default LoginForm;
