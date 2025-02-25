// ** React Imports
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import {
    createCronScheduler,
    cleanCronSchedulerMessage
} from '../store';

// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    Input,
    Button,
    CardBody,
    FormGroup,
    FormFeedback
} from 'reactstrap';


import { Formik, Form, Field } from "formik";
import * as yup from "yup";

// ** Custom Components
import SimpleSpinner from 'components/spinner/simple-spinner';

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages, TiArrowLeft } from "react-icons/ti";
import { Cron } from 'react-js-cron';
import { Divider } from 'antd';

// ** Constant
import { initCronSchedulerItem } from 'utility/reduxConstant';

// ** Styles
import 'react-js-cron/dist/styles.css';

const AddCronScheduler = () => {
    // ** Hooks
    const navigate = useNavigate();

    // ** Store vars
    const dispatch = useDispatch();
    const store = useSelector((state) => state.cronScheduler);

    const CronSchedulerSchema = yup.object({
        name: yup.string().required("Name is required."),
        slug: yup.string().required("Slug is required.")
    });

    // ** States
    const [showSnackBar, setShowSnackbar] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");

    const [error, setError] = useState(undefined); // For handling errors

    useEffect(() => {
        if (store?.actionFlag || store?.success || store?.error) {
            dispatch(cleanCronSchedulerMessage());
        }

        if (store?.actionFlag === "CRN_SCH_CRET" || store?.actionFlag === "CRN_SCH_UPDT") {
            navigate('/admin/cron-schedulers')
        }

        if (store.success) {
            setShowSnackbar(true)
            setSnackMessage(store.success)
        }

        if (store.error) {
            setShowSnackbar(true)
            setSnackMessage(store.error)
        }
    }, [store.error, store.success, store.actionFlag, navigate, dispatch])

    useEffect(() => {
        setTimeout(() => {
            setShowSnackbar(false);
        }, 6000);
    }, [showSnackBar])

    const handleSubmit = (values) => {
        if (values && !error?.description) {
            const crnSchPayload = {
                name: values?.name || "",
                type: values?.slug || "",
                slug: values?.slug || "",
                cron_style: values?.cron_style || "",
                description: values?.description || "",
                status: values?.status || false
            }

            // console.log("handleSubmit >>> ", values, crnSchPayload)
            dispatch(createCronScheduler(crnSchPayload))
        }
    }

    return (
        <div className="content data-list">
            {!store?.loading ? (
                <SimpleSpinner />
            ) : null}

            <ReactSnackBar Icon={(
                <span><TiMessages size={25} /></span>
            )} Show={showSnackBar}>
                {snackMessage}
            </ReactSnackBar>

            <div className="container-fluid">
                <Row>
                    <Col className="col-md-12 col-xxl-10 ml-auto mr-auto">
                        <Card className="card-category card-subcategories m-0">
                            <div className="p-0 border-bottom pb-2 card-header row justify-content-between m-0">
                                <h3 className='card-title mb-0 mt-0'>Add Cron Scheduler</h3>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => navigate('/admin/cron-schedulers')}
                                >
                                    Back
                                    <TiArrowLeft size={25} title="Back" className='ml-2' />
                                </button>
                            </div>

                            <CardBody className='m-0 p-0'>
                                <Formik
                                    initialValues={initCronSchedulerItem}
                                    enableReinitialize={initCronSchedulerItem}
                                    validationSchema={CronSchedulerSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ values, errors, touched, setFieldValue }) => (
                                        <Form className="mt-2">
                                            <Row>
                                                <Col className="" md="12">
                                                    <FormGroup className="mb-3">
                                                        <label>Name</label>
                                                        <Field
                                                            type="text"
                                                            name="name"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter name"
                                                        />
                                                        {errors.name && touched.name && (
                                                            <FormFeedback className="d-block">{errors?.name}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                <Col className="" md="12">
                                                    <FormGroup className="mb-3">
                                                        <label>Slug</label>
                                                        <Field
                                                            type="text"
                                                            name="slug"
                                                            as={Input}
                                                            className="mb-0"
                                                            placeholder="Enter slug"
                                                        />
                                                        {errors.slug && touched.slug && (
                                                            <FormFeedback className="d-block">{errors?.slug}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                <Col className="" md="12">
                                                    <FormGroup className="mb-3">
                                                        <label>Cron Style</label>
                                                        <Field
                                                            as={Input}
                                                            type="text"
                                                            className="mb-0"
                                                            name="cron_style"
                                                            onChange={(event) => {
                                                                setFieldValue('cron_style', event.target.value);
                                                            }}
                                                            placeholder="Enter cron style"
                                                        />

                                                        <Divider>OR</Divider>

                                                        <Cron
                                                            clearButton={false}
                                                            value={values?.cron_style || ""}
                                                            setValue={(newValue) => {
                                                                setFieldValue('cron_style', newValue);
                                                            }}
                                                            onError={setError}
                                                        />
                                                        {errors.cron_style && touched.cron_style && (
                                                            <FormFeedback className="d-block">{errors?.cron_style}</FormFeedback>
                                                        )}

                                                        {error && error?.description && (
                                                            <FormFeedback className="d-block">{error?.description}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                <Col className="" md="12">
                                                    <FormGroup className="mb-3">
                                                        <label>Description</label>
                                                        <Field
                                                            as={Input}
                                                            type="textarea"
                                                            name="description"
                                                            className="form-control mb-0"
                                                            placeholder="Enter description"
                                                        />
                                                        {errors.description && touched.description && (
                                                            <FormFeedback className="d-block">{errors?.description}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>

                                                <Col className="" md="12">
                                                    <FormGroup className="mb-3">
                                                        <label>Status</label>
                                                        <div className="status-container d-flex row-cols-6">
                                                            <div className="form-check">
                                                                <input
                                                                    id="Active"
                                                                    type="radio"
                                                                    name="status"
                                                                    value={true}
                                                                    aria-label="Active Status"
                                                                    checked={values?.status === true}
                                                                    onChange={(event) => setFieldValue(event?.target?.name, true)}
                                                                />
                                                                <label
                                                                    htmlFor="Active"
                                                                    className="form-check-label"
                                                                >
                                                                    Enable
                                                                </label>
                                                            </div>

                                                            <div className="form-check">
                                                                <input
                                                                    type="radio"
                                                                    id="InActive"
                                                                    name="status"
                                                                    value={false}
                                                                    aria-label="InActive Status"
                                                                    checked={values?.status === false}
                                                                    onChange={(event) => setFieldValue(event?.target?.name, false)}
                                                                />
                                                                <label
                                                                    htmlFor="InActive"
                                                                    className="form-check-label"
                                                                >
                                                                    Disable
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {errors.status && touched.status && (
                                                            <FormFeedback className="d-block">{errors?.status}</FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <div className="my-3">
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                    className="btn-fill"
                                                >
                                                    Submit
                                                </Button>
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
    )
}

export default AddCronScheduler;
