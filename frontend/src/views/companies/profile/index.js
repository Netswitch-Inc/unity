/* eslint-disable jsx-a11y/anchor-is-valid */

// ** React Imports
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { updateCompany, editActionRequest } from 'views/companies/store/index';

// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    CardBody,
    CardText
} from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Form as BootstrapForm } from 'react-bootstrap';

// ** Utils
import { onImageSrcError } from "utility/Utils";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages, TiContacts } from "react-icons/ti";

// ** Constant
import { hostRestApiUrl, companyAdminRole } from 'utility/reduxConstant';

// ** Default Avatar
import defaultAvatar from "assets/img/avatar-default.jpg";

// Validation schema using Yup
const validationSchema = Yup.object({
    name: Yup.string().required('Company Name is required'),
    contact_no: Yup.string()
        .required('Contact Number is required')
        .min(8, 'Invalid Contact Number (Minimum 8 Digits Are Required)')
        .max(10, 'Invalid Contact Number (Must Not Exceed 10 digits)'),
    email: Yup.string().email('Invalid email address').required('Email Address is required'),
    address: Yup.string().required('Physical Address is required')
});

const initialState = {
    user_id: {
        user_name: "",
        first_name: "",
        last_name: ""
    },
    name: "",
    logo: "",
    contact_no: "",
    email: "",
    address: "",
    header_color: "#ffffff",
    footer_color: "#ffffff"
}

const CompanyProfile = () => {
    // ** Hooks
    const navigate = useNavigate();

    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.company);
    const loginStore = useSelector((state) => state.login);

    // ** Const
    const userRoleId = loginStore?.authUserItem?.role_id?._id || loginStore?.authUserItem?.role_id || "";

    const [loadFirst, setLoadFirst] = useState(true);
    const [showSnackBar, setshowSnackbar] = useState(false);
    const [snakebarMessage, setSnakbarMessage] = useState("");
    const [initialValues, setInitialValues] = useState(initialState);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");

    useEffect(() => {
        if (companyAdminRole !== userRoleId) {
            navigate('/admin');
        }
    }, [userRoleId, navigate])

    useEffect(() => {
        if (loadFirst) {
            const query = { id: loginStore?.authUserItem?.company_id?._id }
            dispatch(editActionRequest(query));
            setLoadFirst(false)
        }
    }, [dispatch, loadFirst, loginStore?.authUserItem?.company_id?._id])

    useEffect(() => {
        if (store.editItem) {
            setInitialValues(store.editItem)
            setImagePreviewUrl(`${hostRestApiUrl}/${store.editItem.logo}`)
        }

        if (store.success && store.actionFlag === 'COMPANY_UPDATED') {
            setshowSnackbar(true)
            setSnakbarMessage(store.success)
        }

        if (store.error && store.actionFlag === 'COMPANY_UPDATED') {
            setshowSnackbar(true)
            setSnakbarMessage(store.error)
        }
    }, [store.editItem, store.actionFlag, store.success, store.error])

    useEffect(() => {
        setTimeout(() => {
            setshowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    const handleFileUpload = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFieldValue('logo', reader.result); // Store base64 encoded image
                setImagePreviewUrl(reader.result); // Set image preview URL
            };
            reader.readAsDataURL(file);
        }
    }

    const onSubmit = (values) => {
        const payload = { ...values }
        if (values?.user_id) {
            payload.user_id = values.user_id?._id || values.user_id;
        }

        if (payload?._id) {
            dispatch(updateCompany(payload));
        }
    }

    return (<>
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
                <Col md="8">
                    <Card>
                        <div className="p-0 card-header">
                            <h3 className="card-title border-bottom pb-2 mt-0">Company Profile</h3>
                        </div>

                        <CardBody className="pl-0 pr-0">
                            <Formik
                                initialValues={initialValues}
                                enableReinitialize={true}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                {({ setFieldValue }) => (
                                    <Form>
                                        <Row className="mb-2">
                                            <Col md={6}>
                                                <BootstrapForm.Group controlId="formGridCompanyName">
                                                    <BootstrapForm.Label>Company Name</BootstrapForm.Label>
                                                    <Field type="text" name="name" className="form-control" placeholder="Enter Company Name" />
                                                    <ErrorMessage name="name" component="div" className="text-danger" />
                                                </BootstrapForm.Group>
                                            </Col>

                                            <Col md={6}>
                                                <BootstrapForm.Group controlId="formGridClientLogo" >
                                                    <BootstrapForm.Label>Logo</BootstrapForm.Label>
                                                    <div className='d-flex'>
                                                        <input
                                                            type="file"
                                                            name="logo"
                                                            accept="image/*"
                                                            className="form-control-file "
                                                            onChange={(event) => handleFileUpload(event, setFieldValue)}
                                                        />
                                                        {imagePreviewUrl && (
                                                            <img
                                                                height={50}
                                                                width={50}
                                                                src={imagePreviewUrl}
                                                                alt="Client Logo Preview"
                                                                style={{ marginTop: '10px', maxWidth: '100%' }}
                                                                onError={(currentTarget) => onImageSrcError(currentTarget, defaultAvatar)}
                                                            />
                                                        )}
                                                    </div>
                                                </BootstrapForm.Group>
                                            </Col>
                                        </Row>

                                        <Row className="mb-2">
                                            <Col md={6}>
                                                <BootstrapForm.Group controlId="formGridContactNumber">
                                                    <BootstrapForm.Label>Contact Number</BootstrapForm.Label>
                                                    <Field type="text" name="contact_no" className="form-control" placeholder="Enter contact number" />
                                                    <ErrorMessage name="contact_no" component="div" className="text-danger" />
                                                </BootstrapForm.Group>
                                            </Col>

                                            <Col md={6}>
                                                <BootstrapForm.Group controlId="formGridEmailAddress">
                                                    <BootstrapForm.Label>Email Address</BootstrapForm.Label>
                                                    <Field type="email" name="email" className="form-control" placeholder="Enter Your Email Address" readOnly />
                                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                                </BootstrapForm.Group>
                                            </Col>
                                        </Row>

                                        <Row className="mb-2">
                                            <BootstrapForm.Group as={Col} controlId="formGridPhysicalAddress">
                                                <BootstrapForm.Label>Physical Address</BootstrapForm.Label>
                                                <Field type="text" name="address" className="form-control" placeholder="Enter Your Physical Address" />
                                                <ErrorMessage name="address" component="div" className="text-danger" />
                                            </BootstrapForm.Group>
                                        </Row>

                                        <Row className="mb-2">
                                            <BootstrapForm.Group as={Col} controlId="formGridHeaderColor" className='col-12 col-md-6 col-lg-3'>
                                                <BootstrapForm.Label>Header Color</BootstrapForm.Label>
                                                <Field type="color" name="header_color" className="form-control col-12 col-md-6 col-lg-4" />
                                            </BootstrapForm.Group>

                                            <BootstrapForm.Group as={Col} controlId="formGridFooterColor" className='col-12 col-md-6 col-lg-3'>
                                                <BootstrapForm.Label>Footer Color</BootstrapForm.Label>
                                                <Field type="color" name="footer_color" className="form-control col-12 col-md-6 col-lg-4" />
                                            </BootstrapForm.Group>
                                        </Row>

                                        <div className="w-100 PadR0 ItemInfo-right mt-3">
                                            <div className="row justify-content-end m-0">
                                                <button type="submit" className="float-end btn btn-primary">Submit</button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </CardBody>
                    </Card>
                </Col>

                <Col md="4">
                    <Card className="card-user">
                        <CardBody>
                            <CardText />

                            <div className="author">
                                <div className="block block-one" />
                                <div className="block block-two" />
                                <div className="block block-three" />
                                <div className="block block-four" />
                                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                    {imagePreviewUrl && (
                                        <img
                                            alt="Company Profile"
                                            className="avatar"
                                            src={imagePreviewUrl}
                                            onError={(currentTarget) => onImageSrcError(currentTarget, defaultAvatar)}
                                        />
                                    )}
                                    <h5 className="title">{initialValues?.company_name}</h5>
                                </a>

                                <p className="description">{initialValues?.email}</p>
                                {initialValues?.contact_no && (
                                    <p className="description"><TiContacts size={20} /> {initialValues?.contact_no || ""}</p>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    </>);
};

export default CompanyProfile;
