// ** React Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

// ** Third Party Components
import classnames from "classnames";

import AssessmentReportPreview from "./Preview";
import AssessmentReportCompanyDetails from "./companydetails";

const AssessmentReportFront = () => {
  // ** Hooks
  const navigate = useNavigate();

  // ** States
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  return (
    <div className="content">
      <div className="d-flex justify-content-between align-items-baseline tab-design">
        <Nav tabs className="mb-4">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => toggle("1")}
            >
              Company Details
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => toggle("2")}
            >
              Question Answers
            </NavLink>
          </NavItem>
        </Nav>

        <div className="buttons black-btn">
          <button
            type="button"
            className="btnprimary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <AssessmentReportCompanyDetails />
        </TabPane>

        <TabPane tabId="2">
          <AssessmentReportPreview />
        </TabPane>
      </TabContent>
    </div>
  )
}

export default AssessmentReportFront;
