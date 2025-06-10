// ** React Imports
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { cleanCompliancePriorityMessage } from "views/compliancePriority/store";

import { Col } from "react-bootstrap";

// ** Utils
import { scrollTop } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactWizard from "react-bootstrap-wizard";

// ** Constant
// import { superAdminRole } from "utility/reduxConstant";

import Step1 from "./Step1/Step1";
import Step2 from "./Step2/Step2";
import Step3 from "./Step3/Step3";

import CompliancePriorityModal from "../CompilanceBuilders/modals/CompliancePriorityModal.js";

const ComplianceBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginStore = useSelector((state) => state.login);
  const compliancePriorityStore = useSelector((state) => state.compliancePriority);
  const authUserItem = loginStore?.authUserItem?._id ? loginStore?.authUserItem : null;

  const step1Name = "Compliance Selection";
  const step2Name = "Compliance Benchmark";
  const step3Name = "Recommended Tools";
  const complianceSteps = useMemo(() => [
    {
      stepName: step1Name,
      stepIcon: "tim-icons icon-single-02",
      component: Step1
    },
    {
      stepName: step2Name,
      stepIcon: "tim-icons icon-settings-gear-63",
      component: Step2
    },
    {
      stepName: step3Name,
      stepIcon: "tim-icons icon-settings",
      component: Step3
    }
  ], [])

  // ** States
  const [modalOpen, setModalOpen] = useState(false);
  const [complianceControls, setComplianceControls] = useState([]);

  const handleOpen = () => {
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollTop();
    }, 0); // delay in ms, 0 ensures it’s called right after the render

    return () => clearTimeout(timeoutId); // Cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complianceSteps]);

  useEffect(() => {
    if (compliancePriorityStore?.actionFlag || compliancePriorityStore?.success || compliancePriorityStore?.error) {
      dispatch(cleanCompliancePriorityMessage());
    }

    if (compliancePriorityStore?.actionFlag === "CMP_CMLNC_PRIOTY_CRETS") {
      setTimeout(() => { navigate("/admin/resilience-index"); }, 2000);
    }
  }, [compliancePriorityStore?.actionFlag, compliancePriorityStore?.success, compliancePriorityStore?.error, dispatch, navigate]);

  const finishButtonClick = (event) => {
    let controls = [...complianceControls]
    if (event && event[step3Name]) {
      const visibleControls = event[step3Name]?.visibleControls || [];
      controls = visibleControls;
      handleOpen()
      // if (authUserItem?.role_id?._id !== superAdminRole) {
      //   handleOpen()
      // } else {
      //   navigate("/admin/resilience-index")
      // }
    }

    setComplianceControls(controls);
  }

  return (
    <div className="content complaince-builder-content ps">
      {!compliancePriorityStore?.loading ? (<SimpleSpinner />) : null}

      <Col className="col-md-12 col-xxl-10 mr-auto ml-auto compliance-head">
        <ReactWizard
          navSteps
          steps={complianceSteps}
          title="Build Your Compliance Profile"
          description={(<>
            <p>This information will let us know more about your company</p>
            <p style={{ display: "none" }}>
              {" "}
              Let's start with the basic information.{" "}
            </p>
            {/* <break />
            {!authUserItem?.company_id && (
              <p className="compliance-store-note">
                Note: You cannot save compliance builder state.
              </p>
            )} */}
          </>)}
          // headerTextCenter
          // finishButtonClasses="btn btn-primary"
          // nextButtonClasses="btn btn-primary"
          // previousButtonClasses="btn btn-primary"
          headerTextCenter
          finishButtonClasses="btn btn-btn-simple active btn btn-info btn-sm btnprimary"
          nextButtonClasses="btn btn-btn-simple active btn btn-info btn-sm btnprimary"
          previousButtonClasses="btn btn-btn-simple active btn btn-info btn-sm btnprimary"
          progressbar
          color="blue"
          validate
          finishButtonClick={(e) => finishButtonClick(e)}
        // onDataChange={handleWizardDataChange}
        />
      </Col>

      <CompliancePriorityModal
        open={modalOpen}
        closeModal={handleClose}
        authUserItem={authUserItem}
        complianceControls={complianceControls}
      />
    </div>
  )
}

export default ComplianceBuilder;
