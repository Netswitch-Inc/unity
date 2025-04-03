import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { insertOpenVASScanReport } from "../store";

import { Modal, Form as BootstrapForm, Row, Col, Alert } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';

import Papa from 'papaparse';

const ModalImportCSV = ({ show, closePopup }) => {
    const dispatch = useDispatch();

    // Local states
    const [parsedData, setParsedData] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatKey = (key) => {
        return key.toLowerCase().replace(/\s+/g, '_').replace(/\//g, '_');
    }

    const handleOpen = () => {
        setError(null)
        setParsedData(null)
        setIsSubmitting(false)
    }

    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        setError(null);

        if (selectedFile) {
            Papa.parse(selectedFile, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const { data } = result;

                    if (data.length === 0) {
                        setError('CSV file contains no valid data');
                        return;
                    }

                    // Format headers and preserve original data structure
                    const formattedData = data.map(row => {
                        return Object.entries(row).reduce((acc, [key, value]) => {
                            const formattedKey = formatKey(key);
                            return {
                                ...acc,
                                [formattedKey]: value?.trim()
                            };
                        }, {});
                    });

                    setParsedData(formattedData);
                },
                error: (err) => {
                    setError('Error parsing CSV file');
                }
            });
        }
    }

    const handleSubmit = () => {
        if (!parsedData) {
            setError('Please upload a valid CSV file first');
            return;
        }

        setIsSubmitting(true);
        dispatch(insertOpenVASScanReport(parsedData));
    }

    const handleClose = () => {
        setParsedData(null);
        setError(null);
        closePopup();
    }

    return (
        <Modal
            size="lg"
            centered
            show={show}
            onShow={handleOpen}
            className="UpdateUserPopup modal-design"
        >
            <Modal.Header>
                <span className='modal-title col-sm-12'>
                    <h3 className='mb-0 mt-0'>Upload OpenVAS Scan Report</h3>
                </span>
                <button type="button" className='Close-button' onClick={handleClose}>×</button>
            </Modal.Header>

            <Modal.Body>
                <Formik initialValues={{}} onSubmit={handleSubmit}>
                    {() => (
                        <Form>
                            <Row className="mb-2 mt-3 ">
                                <Col md={12}>
                                    <BootstrapForm.Group>
                                        <BootstrapForm.Label>
                                            CSV File (Matching your OpenVAS scan format)
                                        </BootstrapForm.Label>
                                        <span className='col-photo'>
                                            <Field
                                                name="csvFile"
                                                type="file"
                                                accept=".csv"
                                                className=""
                                                onChange={handleFileUpload}
                                            />
                                        </span>
                                    </BootstrapForm.Group>
                                </Col>
                            </Row>

                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                            <div className="mt-4 d-flex justify-content-end buttons">
                                <button
                                    type="submit"
                                    className="btnprimary"
                                    disabled={isSubmitting || !parsedData}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Processing...
                                        </>
                                    ) : 'Upload Results'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default ModalImportCSV
