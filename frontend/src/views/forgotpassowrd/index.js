import React, { useEffect, useState } from 'react';
import { Container, Button, Card, CardBody, CardFooter, InputGroupAddon, InputGroupText, InputGroup, Input, FormFeedback } from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { verifyemail, cleanAuthMessage } from 'views/login/store';
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";
import { Link } from 'react-router-dom';

// ** Third Party Components
import classnames from "classnames";

import reactLogo from "assets/img/react-logo.png";

// import securliLogo from "assets/img/securli-logo.png";
// const isSecurli = process.env?.REACT_APP_COM === 'sec';
// const logo = isSecurli ? securliLogo : reactLogo;
const logo = reactLogo;

// Define the validation schema
const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
});

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state.login)

    const [state, setState] = useState({});
    const [showSnackBar, setshowSnackbar] = useState(false)
    const [snakebarMessage, setSnakbarMessage] = useState("")

    useEffect(() => {
        if (store?.actionFlag || store?.success || store?.error) {
            dispatch(cleanAuthMessage());
        }

        if (store.actionFlag === 'VERIFY_EMAIL' && store.success) {
            setshowSnackbar(true)
            setSnakbarMessage(store.success)
        }

        if (store.actionFlag === 'VERIFY_EMAIL' && store.error) {
            setshowSnackbar(true)
            setSnakbarMessage(store.error)
        }
    }, [store.actionFlag, store.success, store.error, dispatch])

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    const onSubmit = (values) => {
        // Submit the form data to the server
        dispatch(verifyemail(values));

    };
    return (
        <div className="content login">
            <ReactSnackBar Icon={(
                <span><TiMessages size={25} /></span>
            )} Show={showSnackBar}>
                {snakebarMessage}
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
                            initialValues={{ email: '' }}
                            validationSchema={forgotPasswordSchema}
                            onSubmit={onSubmit}
                        >
                            {({ errors, touched, values, setFieldValue }) => (
                                <Form className="form">
                                    <Card className="card-login">
                                        <CardBody className='p-0'>
                                            <div className="card-title border-bottom pb-2 mt-0 text-md">Please enter your email id to reset password</div>
                                            <InputGroup
                                                className={classnames({
                                                    "input-group-focus": state?.emailFocus,
                                                })}
                                            >
                                                <InputGroupAddon addonType="prepend" style={{ padding: '3px 0px' }}>
                                                    <InputGroupText>
                                                        <i className="tim-icons icon-email-85" />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    className="form-control"
                                                    type="email"
                                                    name="email"
                                                    value={values.email}
                                                    placeholder="Enter email"
                                                    onInput={(event) => setFieldValue(event?.target?.name, event?.target?.value)}
                                                    onFocus={(e) => setState({ ...state, emailFocus: true })}
                                                    onBlur={(e) => setState({ ...state, emailFocus: false })}
                                                >
                                                </Input>
                                            </InputGroup>
                                            {errors.email && touched.email ? (
                                                <FormFeedback className="d-block p-0">
                                                    {errors.email}
                                                </FormFeedback>
                                            ) : null}
                                        </CardBody>

                                        <CardFooter>
                                            <Button
                                                block
                                                size="lg" className="btn-fill" color="primary" type="submit">
                                                Send Email
                                            </Button>
                                            <Link to={`/`} className='d-block text-center w-100 pt-3 back-login'>Back to login</Link>
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

export default ForgotPassword;


