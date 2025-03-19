import React, { useEffect } from "react";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";

import ReactWizard from "react-bootstrap-wizard"; // Ensure this import is correct
import Col from "react-bootstrap/Col"; // Ensure Bootstrap is installed and imported
import Step1 from "./Step1/Step1"; // Adjust the import path as necessary
import Step2 from "./Step2/Step2"; // Ensure Step2 is defined and imported correctly
import Step3 from "./Step3/Step3";

import SimpleSpinner from "components/spinner/simple-spinner";
import { useNavigate } from "react-router-dom";

import { superAdminRole } from "utility/reduxConstant";
import { createMultipleCompanyComplianceControl } from "views/companyComplianceControls/store";
import { scrolTop } from "utility/Utils";

const steps = [
  {
    stepName: "Compliance Selection",
    stepIcon: "tim-icons  icon-single-02",
    component: Step1,
  },
  {
    stepName: "Compliance Benchmark",
    stepIcon: "tim-icons icon-settings-gear-63",
    component: Step2,
  },
  {
    stepName: "Recommended Tools",
    stepIcon: "tim-icons icon-settings",
    component: Step3,
  },
];

const ComplianceBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const companyComplianceControlstore = useSelector(
    (state) => state.companyComplianceControls
  );
  const loginStore = useSelector((state) => state.login);
  const authUserItem = loginStore?.authUserItem?._id
    ? loginStore?.authUserItem
    : null;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrolTop();
    }, 0); // delay in ms, 0 ensures it’s called right after the render

    return () => clearTimeout(timeoutId); // Cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps]);

  useEffect(() => {
    if (
      companyComplianceControlstore?.actionFlag === "MULTIPLE_CREATED" ||
      companyComplianceControlstore?.actionFlag === "MULTIPLE_CREATED_ERROR"
    ) {
      navigate("/admin/resilience-index");
    }
  }, [companyComplianceControlstore?.actionFlag, navigate]);

  const finishButtonClick = (e) => {
    const selectedControls = e["Compliance Selection"]?.selectedTiles;
    if (authUserItem?.role_id?._id !== superAdminRole) {
      const payload = {
        data: selectedControls,
        company_id:
          authUserItem?.company_id?._id || authUserItem?.company_id || "",
      };

      if (selectedControls.length > 0) {
        dispatch(createMultipleCompanyComplianceControl(payload));
      }
    } else {
      navigate("/admin/resilience-index");
    }
  };

  return (
    <div className="content complaince-builder-content ps">
      {!companyComplianceControlstore?.loading ? <SimpleSpinner /> : null}

      <Col className="col-md-12 col-xxl-10 mr-auto ml-auto compliance-head">
        <ReactWizard
          steps={steps}
          navSteps
          title="Build Your Compliance Profile"
          description={
            <>
              <p>This information will let us know more about your company</p>
              <break />
              {!authUserItem?.company_id && (
                <p className="compliance-store-note">
                  Note: You cannot save compliance builder state.
                </p>
              )}
            </>
          }
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
    </div>
  );
};

export default ComplianceBuilder;
