/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { login, cleanAuthMessage } from './store';

// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    Input,
    Button,
    CardBody,
    Container,
    CardFooter,
    InputGroup,
    FormFeedback,
    InputGroupText,
    InputGroupAddon,
} from "reactstrap";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// ** Third Party Components
import classnames from "classnames";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** SVG Icons
import { EyeView, EyeSlash } from 'components/SVGIcons';

import 'assets/css/AdminControl.css';

import reactLogo from "assets/img/react-logo.png";

// import securliLogo from "assets/img/securli-logo.png";
// const isSecurli = process.env?.REACT_APP_COM === 'sec';
// const logo = isSecurli ? securliLogo : reactLogo;

const logo = reactLogo;

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const store = useSelector((state) => state.login);

    const [state, setState] = useState({});
    const [showSnackBar, setshowSnackbar] = useState(false);
    const [SnackMessage, setSnackMessage] = useState("");
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    // Define validation schema using Yup
    const validationSchema = Yup.object().shape({
        user_name: Yup.string().required('Username is required!'),
        password: Yup.string().required('Password is required!'),
    });

    // Initial form values
    const initialValues = {
        user_name: '',
        password: ''
    };

    useEffect(() => {
        if (store?.actionFlag === "LOGGED") {
            navigate(`/admin/dashboard`);
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
    }, [store.actionFlag, store.success, store.error, navigate, dispatch])

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    // Form submit handler
    const onSubmit = (values, { setSubmitting }) => {
        // Example of what you might do with the form values
        dispatch(login(values));
        // You can make API calls, validate credentials, etc.
        setSubmitting(false);
    };

    return (
        <div className="content login">
            <ReactSnackBar Icon={(
                <span><TiMessages size={25} /></span>
            )} Show={showSnackBar}>
                {SnackMessage}
            </ReactSnackBar>

            <Container className='h-100'>
                <Row className='align-items-center justify-content-center h-100'>
                    <Col className="ml-auto mr-auto" lg={4} md={6}>
                        <img
                            alt="..."
                            src={logo}
                            style={{ padding: "40px 40px 40px" }}
                        />

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {({ errors, touched, values, isSubmitting, setFieldValue }) => (
                                <Form className="form">
                                    <Card className="card-login">
                                        <CardBody className='p-0'>
                                            <InputGroup
                                                className={classnames({
                                                    "input-group-focus": state?.emailFocus,
                                                })}
                                            >
                                                <InputGroupAddon addonType="prepend" style={{ padding: '3px 0px' }}>
                                                    <InputGroupText>
                                                        <i className="tim-icons icon-single-02" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    type="text"
                                                    name="user_name"
                                                    value={values.user_name}
                                                    placeholder="User Name"
                                                    onInput={(event) => setFieldValue(event?.target?.name, event?.target?.value)}
                                                    onFocus={(e) => setState({ ...state, emailFocus: true })}
                                                    onBlur={(e) => setState({ ...state, emailFocus: false })}
                                                />
                                            </InputGroup>
                                            {errors.user_name && touched.user_name ? (
                                                <FormFeedback className="d-block p-0">
                                                    {errors.user_name}
                                                </FormFeedback>
                                            ) : null}

                                            <InputGroup
                                                className={classnames({
                                                    "input-eyes": true,
                                                    "input-group-focus": state?.passFocus,
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
                                                    placeholder="Password"
                                                    value={values.password}
                                                    type={passwordShown ? "text" : "password"}
                                                    onInput={(event) => setFieldValue(event?.target?.name, event?.target?.value)}
                                                    onFocus={(e) => setState({ ...state, passFocus: true })}
                                                    onBlur={(e) => setState({ ...state, passFocus: false })}
                                                />
                                                <InputGroupText className='input-eyes-text'>
                                                    <a onClick={togglePasswordVisiblity}>
                                                        {passwordShown ? (
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
                                        </CardBody>

                                        <CardFooter>
                                            <Link to={`/forgot-passowrd`} className='forget-link'>Forgot Password ?</Link>
                                            <Button
                                                block
                                                size="lg"
                                                color="primary"
                                                disabled={isSubmitting}
                                            >
                                                {store?.loading ? "Login" : "Loading..."}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Form>
                            )}
                        </Formik>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoginForm;
