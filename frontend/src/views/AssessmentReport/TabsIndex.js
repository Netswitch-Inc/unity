import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import AssessmentReportPreview from "./Preview";
import AssessmentReportCompanyDetails from "./companydetails";
import { TiArrowLeft } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
// import UserProfile from './tabs/Profile';
// import ChangePassword from './tabs/ChangePassword';

const AssessmentReportFront = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div className="content profile-management">
      <div className="d-flex justify-content-between">
        <Nav tabs className="mb-4">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => {
                toggle("1");
              }}
            >
              Company Details
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => {
                toggle("2");
              }}
            >
              Question Answers
            </NavLink>
          </NavItem>
        </Nav>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate(-1)}
        >
          Back
          <TiArrowLeft size={15} title="Back" className="ml-2" />
        </button>
      </div>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          {/* <UserProfile /> */}
          <AssessmentReportCompanyDetails />
        </TabPane>

        <TabPane tabId="2">
          <AssessmentReportPreview />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default AssessmentReportFront;
