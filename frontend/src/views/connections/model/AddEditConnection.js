/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useState } from 'react';

import { createConnection, updateConnection } from '../store';
import { useDispatch } from 'react-redux';

import { Modal, Form as BootstrapForm, Row, Col, InputGroup } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

// ** SVG Icons
import { EyeView, EyeSlash } from 'components/SVGIcons';

// Validation schema using Yup
const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    type: yup.string().required('Connection Type is required'),
    ip_address: yup.string().required('IP Address/Url is required'),
    // port: yup.string().required('Port is required'),
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required')
});

const ConnectionProfileForm = ({ show, closePopup, initialValues, title }) => {
    const dispatch = useDispatch()
    const [passwordShown, setPasswordShown] = useState(true)

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown)
    }

    const onSubmit = (values) => {
        if (title === 'Add Connection') {
            dispatch(createConnection(values))
        }

        if (title === 'Edit Connection') {
            dispatch(updateConnection(values))
        }
        closePopup()
    }

    return (
        <Modal className="UpdateUserPopup" size="lg" show={show} aria-labelledby="example-modal-sizes-title-lg" centered>
            <Modal.Header>
                <span className='modal-title col-sm-12 ' id="example-modal-sizes-title-lg">
                    <h3 className='border-bottom pb-2 mb-0 mt-0'>{title}</h3>
                </span>
                <button type="button" className='Close-button' onClick={closePopup}>×</button>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {() => (
                        <Form>
                            <Row className="mb-2">
                                <Col md={12}>
                                    <BootstrapForm.Group controlId="formGridCompanyName">
                                        <BootstrapForm.Label>Name</BootstrapForm.Label>
                                        <Field type="text" name="name" className="form-control" />
                                        <ErrorMessage name="name" component="div" className="text-danger" />
                                    </BootstrapForm.Group>
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col md={12}>
                                    <BootstrapForm.Group controlId="formGridCompanyName">
                                        <BootstrapForm.Label>Type</BootstrapForm.Label>
                                        <Field
                                            type="text"
                                            name="type"
                                            className="form-control text-white"
                                            readOnly={initialValues?._id ? true : false}
                                        />
                                        <ErrorMessage name="type" component="div" className="text-danger" />
                                    </BootstrapForm.Group>
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col md={6}>
                                    <BootstrapForm.Group controlId="formGridContactNumber">
                                        <BootstrapForm.Label>IP Address/Url</BootstrapForm.Label>
                                        <Field type="text" name="ip_address" className="form-control" />
                                        <ErrorMessage name="ip_address" component="div" className="text-danger" />
                                    </BootstrapForm.Group>
                                </Col>

                                <Col md={6}>
                                    <BootstrapForm.Group controlId="formGridEmailAddress">
                                        <BootstrapForm.Label>Port</BootstrapForm.Label>
                                        <Field type="text" name="port" className="form-control" />
                                        <ErrorMessage name="port" component="div" className="text-danger" />
                                    </BootstrapForm.Group>
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col md={6}>
                                    <BootstrapForm.Group controlId="formGridUsername">
                                        <BootstrapForm.Label>Username</BootstrapForm.Label>
                                        <Field type="text" name="username" className="form-control" />
                                        <ErrorMessage name="username" component="div" className="text-danger" />
                                    </BootstrapForm.Group>
                                </Col>

                                <Col md={6}>
                                    <BootstrapForm.Label>Password</BootstrapForm.Label>
                                    <div className="position-relative">
                                        <InputGroup className="mb-0">
                                            <Field className="form-control" type={passwordShown ? "text" : "password"} name="password" />
                                            <InputGroup.Text className='input-eyes-text'>
                                                <a onClick={togglePasswordVisibility}>
                                                    {passwordShown ? (
                                                        <EyeView />
                                                    ) : (
                                                        <EyeSlash />
                                                    )}
                                                </a>
                                            </InputGroup.Text>
                                        </InputGroup>
                                        <div><small>*Password must be alphanumeric & Min. 8 characters</small></div>
                                        <ErrorMessage name="password" component="div" className="text-danger" />
                                    </div>
                                </Col>

                                <Col md={12}>
                                    <BootstrapForm.Group controlId="formGridDescription">
                                        <BootstrapForm.Label>Description</BootstrapForm.Label>
                                        <Field type="textarea" name="description" className="form-control" />
                                        <ErrorMessage name="description" component="div" className="text-danger" />
                                    </BootstrapForm.Group>
                                </Col>
                            </Row>

                            <div className="w-100 PadR0 ItemInfo-right mt-3">
                                <div className="row justify-content-end m-0">
                                    <button type="submit" className="float-end btn btn-primary">Submit</button>

                                    <button type="button" onClick={() => closePopup()} className="float-end btn btn-primary">Cancel</button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ConnectionProfileForm;
