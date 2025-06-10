// ** React Imports
import React, { useState, useEffect, useCallback } from "react";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { createsCompanyCompliancePriority } from "views/compliancePriority/store";

// ** Reactstrap Imports
import { Button, Col, Row, FormFeedback } from "reactstrap";
import { Modal, Form as BootstrapForm } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { initCompliancePriorityItem } from "utility/reduxConstant";

const CompliancePriorityModal = ({
  open,
  closeModal,
  authUserItem,
  complianceControls = []
}) => {
  const dispatch = useDispatch();
  const compliancePriorityStore = useSelector((state) => state.compliancePriority);

  const PrioritySchema = yup.object({
    name: yup.string().required("Name is required.")
  })

  // ** States
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const handleReset = useCallback(() => {
    closeModal();
  }, [closeModal])

  const handleModalOpen = () => {
  }

  useEffect(() => {
    if (compliancePriorityStore?.success) {
      setshowSnackbar(true);
      setSnackMessage(compliancePriorityStore.success);
    }

    if (compliancePriorityStore?.error) {
      setshowSnackbar(true);
      setSnackMessage(compliancePriorityStore.error);
    }

    if (compliancePriorityStore?.actionFlag === "CMP_CMLNC_PRIOTY_CRETS") {
      handleReset()
    }
  }, [compliancePriorityStore?.actionFlag, compliancePriorityStore?.success, compliancePriorityStore?.error, handleReset]);

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  const handleSubmit = (values) => {
    if (values) {
      const payload = {
        company_id: authUserItem?.company_id?._id || authUserItem?.company_id || "",
        user_id: authUserItem?._id || "",
        name: values?.name || "",
        compliance_controls: complianceControls,
        status: true
      }

      dispatch(createsCompanyCompliancePriority(payload));
    }
  }

  return (
    <Modal
      centered
      size="lg"
      show={open}
      backdrop="static"
      onShow={handleModalOpen}
      className="UpdateUserPopup modal-design"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <ReactSnackBar Icon={(
        <span><TiMessages size={25} /></span>
      )} Show={showSnackBar}>
        {snackMessage}
      </ReactSnackBar>

      <Modal.Header>
        <span
          className="modal-title col-sm-12"
          id="example-modal-sizes-title-lg"
        >
          <h3 className="mb-0 mt-0">Priority</h3>
        </span>
        <Button
          type="button"
          className="Close-button d-flex align-item-center justify-content-center"
          onClick={handleReset}
        >
          ×
        </Button>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={initCompliancePriorityItem}
          enableReinitialize={initCompliancePriorityItem}
          validationSchema={PrioritySchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="my-2">
              <Row>
                <Col xl={12} lg={12} as={BootstrapForm.Group} controlId="formGridName" className="full-width">
                  <BootstrapForm.Label className="col-label">Name</BootstrapForm.Label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    className="col-input w-100"
                  />
                  {errors.name && touched.name && (
                    <FormFeedback className="d-block">
                      {errors?.name}
                    </FormFeedback>
                  )}
                </Col>
              </Row>

              <div className="buttons text-center">
                <button type="submit" className="btnprimary">
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default CompliancePriorityModal;
