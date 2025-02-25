/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from 'views/login/store';

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, FormGroup, Input, Button, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// ** Third Party Components
import classnames from "classnames";
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** SVG Icons
import { EyeView, EyeSlash } from 'components/SVGIcons';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const loginStore = useSelector((state) => state.login);

    const validationSchema = Yup.object().shape({
        old_password: Yup.string()
            .required('Old Password is required'),
        password: Yup.string()
            .required('New Password is required')
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    });

    const [state, setState] = useState({});
    const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [showSnackBar, setshowSnackbar] = useState(false)
    const [snakebarMessage, setSnakbarMessage] = useState("")
    const [initialValues, setInitialValues] = useState({ old_password: '', password: '', confirmPassword: '' })

    const toggleOldPasswordVisibility = () => {
        setOldPasswordVisible(!oldPasswordVisible);
    };

    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisible(!newPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    useEffect(() => {
        if (loginStore?.actionFlag === 'PASSWORD_UPDATED' && loginStore.success) {
            setshowSnackbar(true)
            setSnakbarMessage(loginStore.success)
            setInitialValues({ old_password: '', password: '', confirmPassword: '' })

        }

        if (loginStore?.actionFlag === 'PASSWORD_UPDATED' && loginStore.error) {
            setshowSnackbar(true)
            setSnakbarMessage(loginStore.error)
            setInitialValues({ old_password: '', password: '', confirmPassword: '' })
        }
    }, [loginStore.success, loginStore.error, initialValues, loginStore?.actionFlag])

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    const onSubmit = (values) => {
        dispatch(updatePassword(values));
    }

    return (
        <div className="content">
            {showSnackBar && (
                <ReactSnackBar
                    Icon={(<span><TiMessages size={25} /></span>)}
                    Show={showSnackBar}
                >
                    {snakebarMessage}
                </ReactSnackBar>
            )}

            <Row>
                <Col md="12" className="mb-3">
                    <Card className="mb-0">
                        <div className="p-0 card-header">
                            <h3 className="card-title border-bottom pb-2 mt-0">Change Password</h3>
                        </div>

                        <CardBody className="pl-0 pr-0">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                {() => (
                                    <Form>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <label>Old Password</label>
                                                    <InputGroup
                                                        className={classnames({
                                                            "input-group-focus": state?.oldPass,
                                                        })}
                                                    >
                                                        <InputGroupAddon addonType="prepend" style={{ padding: '3px 0px' }}>
                                                            <InputGroupText>
                                                                <i className="tim-icons icon-lock-circle" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Field
                                                            name="old_password"
                                                            autoComplete="off"
                                                            placeholder="Old Password"
                                                            type={oldPasswordVisible ? 'text' : 'password'}
                                                            as={Input}
                                                            onFocus={(e) => setState({ ...state, oldPass: true })}
                                                            onBlur={(e) => setState({ ...state, oldPass: false })}
                                                        />
                                                        <InputGroupText className='input-eyes-text'>
                                                            <a onClick={toggleOldPasswordVisibility}>
                                                                {oldPasswordVisible ? (
                                                                    <EyeView />
                                                                ) : (
                                                                    <EyeSlash />
                                                                )}
                                                            </a>
                                                        </InputGroupText>
                                                    </InputGroup>
                                                    <ErrorMessage name="old_password" component="span" style={{ color: 'red' }} />
                                                </FormGroup>
                                            </Col>

                                            <Col md="12">
                                                <FormGroup>
                                                    <label>New Password</label>
                                                    <InputGroup
                                                        className={classnames({
                                                            "input-group-focus": state?.newPass,
                                                        })}
                                                    >
                                                        <InputGroupAddon addonType="prepend" style={{ padding: '3px 0px' }}>
                                                            <InputGroupText>
                                                                <i className="tim-icons icon-lock-circle" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Field
                                                            name="password"
                                                            autoComplete="off"
                                                            placeholder="New Password"
                                                            type={newPasswordVisible ? 'text' : 'password'}
                                                            as={Input}
                                                            onFocus={(e) => setState({ ...state, newPass: true })}
                                                            onBlur={(e) => setState({ ...state, newPass: false })}
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
                                                    <ErrorMessage name="password" component="span" style={{ color: 'red' }} />
                                                </FormGroup>
                                            </Col>

                                            <Col md="12">
                                                <FormGroup>
                                                    <label>Confirm Password</label>
                                                    <InputGroup
                                                        className={classnames({
                                                            "input-group-focus": state?.conPass,
                                                        })}
                                                    >
                                                        <InputGroupAddon addonType="prepend" style={{ padding: '3px 0px' }}>
                                                            <InputGroupText>
                                                                <i className="tim-icons icon-lock-circle" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Field
                                                            autoComplete="off"
                                                            name="confirmPassword"
                                                            placeholder="Confirm Password"
                                                            type={confirmPasswordVisible ? 'text' : 'password'}
                                                            as={Input}
                                                            onFocus={(e) => setState({ ...state, conPass: true })}
                                                            onBlur={(e) => setState({ ...state, conPass: false })}
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
                                                    <ErrorMessage name="confirmPassword" component="span" style={{ color: 'red' }} />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Button className="btn-fill" color="primary" type="submit">
                                            Change Password
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ChangePassword;
