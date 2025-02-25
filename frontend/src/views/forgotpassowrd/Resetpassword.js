/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, cleanAuthMessage } from 'views/login/store';

import { Row, Col, Card, CardBody, Input, Button, Container, InputGroup, InputGroupAddon, InputGroupText, FormFeedback, CardFooter } from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Third Party Components
import classnames from "classnames";

// ** SVG Icons
import { EyeView, EyeSlash } from 'components/SVGIcons';

import reactLogo from "assets/img/react-logo.png";

// import securliLogo from "assets/img/securli-logo.png";
// const isSecurli = process.env?.REACT_APP_COM === 'sec';
// const logo = isSecurli ? securliLogo : reactLogo;

const logo = reactLogo;

const ResetPassword = () => {
    const { token } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginStore = useSelector((state) => state.login);

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required('New Password is required')
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
    });

    const [state, setState] = useState({});
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [showSnackBar, setshowSnackbar] = useState(false)
    const [snakebarMessage, setSnakbarMessage] = useState("")
    const [initialValues] = useState({ password: "", confirmPassword: "" })

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

        if (loginStore?.actionFlag === 'RESET_PASSWORD' && loginStore.success) {
            setshowSnackbar(true);
            setSnakbarMessage(loginStore.success);
            navigate('/');
        }

        if (loginStore?.actionFlag === 'RESET_PASSWORD' && loginStore.error) {
            setshowSnackbar(true);
            setSnakbarMessage(loginStore.error);
        }
    }, [loginStore.success, loginStore.error, loginStore?.actionFlag, navigate, dispatch])

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    const onSubmit = (values) => {
        const payload = { password: values.password, token: token }
        dispatch(resetPassword(payload))
    }

    return (
        <div className="content login">
            {showSnackBar && <ReactSnackBar Icon={<span><TiMessages size={25} /></span>} Show={showSnackBar}>
                {snakebarMessage}
            </ReactSnackBar>}
            <Container className='h-100'>
                <Row className='align-items-center justify-content-center h-100'>
                    <Col className="ml-auto mr-auto" lg={4} md={6}>
                        <img
                            alt="..."
                            src={logo}
                            style={{ padding: "40px 40px 40px" }}
                        />

                        <Formik
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                        >
                            {({ errors, touched, values, setFieldValue }) => (
                                <Form>
                                    <Card className="card-login">
                                        <CardBody className='p-0'>
                                            <div className="card-title border-bottom pb-2 mt-0 text-md">Reset Password</div>
                                            <InputGroup
                                                className={classnames({
                                                    "input-eyes": true,
                                                    "input-group-focus": state?.passFocus
                                                })}
                                            >
                                                <InputGroupAddon addonType="prepend" style={{ padding: '3px 0px' }}>
                                                    <InputGroupText>
                                                        <i className="tim-icons icon-lock-circle" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    name="password"
                                                    autoComplete="off"
                                                    placeholder="New Password"
                                                    value={values.password}
                                                    type={newPasswordVisible ? "text" : "password"}
                                                    onInput={(event) => setFieldValue(event?.target?.name, event?.target?.value)}
                                                    onFocus={(e) => setState({ ...state, passFocus: true })}
                                                    onBlur={(e) => setState({ ...state, passFocus: false })}
                                                />
                                                <InputGroupText className='input-eyes-text'>
                                                    <a onClick={toggleNewPasswordVisibility}>
                                                        {newPasswordVisible ? (
                                                            <EyeView />
                                                        ) : (
                                                            <EyeSlash />
                                                        )}
                                                    </a>
                                                </InputGroupText>
                                            </InputGroup>
                                            {errors.password && touched.password ? (
                                                <FormFeedback className="d-block p-0">
                                                    {errors.password}
                                                </FormFeedback>
                                            ) : null}

                                            <InputGroup
                                                className={classnames({
                                                    "input-eyes": true,
                                                    "input-group-focus": state?.newPassFocus
                                                })}
                                            >
                                                <InputGroupAddon addonType="prepend" style={{ padding: '3px 0px' }}>
                                                    <InputGroupText>
                                                        <i className="tim-icons icon-lock-circle" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    autoComplete="off"
                                                    name="confirmPassword"
                                                    placeholder="Confirm Password"
                                                    value={values.confirmPassword}
                                                    type={confirmPasswordVisible ? "text" : "password"}
                                                    onInput={(event) => setFieldValue(event?.target?.name, event?.target?.value)}
                                                    onFocus={(e) => setState({ ...state, newPassFocus: true })}
                                                    onBlur={(e) => setState({ ...state, newPassFocus: false })}
                                                />
                                                <InputGroupText className='input-eyes-text'>
                                                    <a onClick={toggleConfirmPasswordVisibility}>
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
                                        </CardBody>

                                        <CardFooter>

                                            <Button
                                                block
                                                size="lg"
                                                className="btn-fill" color="primary" type="submit">
                                                Reset Password
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Form>
                            )}
                        </Formik>
                    </Col >
                </Row>
            </Container>
        </div >
    );
};

export default ResetPassword;
