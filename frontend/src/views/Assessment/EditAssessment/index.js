import React, { useLayoutEffect, useState, useRef } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
// import AssessmentForm from "./assessmentform";
import EditAssessmentQuestion from "./editquestionassessmentform";
import EditAssessmentForm from "./editassessmentform";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Editassessment = () => {
  const location = useLocation();
  const childFunc = useRef(null);

  // Create a URLSearchParams object from the query string
  const questionStore = useSelector((state) => state.questions);

  const queryParams = new URLSearchParams(location.search);

  // Extract parameters from the query string
  const activateTab = queryParams.get("active_tab");
  const [activeTab, setActiveTab] = useState("1");
  const [triggered, setTrigger] = useState(false);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useLayoutEffect(() => {
    if (activateTab) {
      setActiveTab(activateTab);
    }
  }, [activateTab]);

  return (
    <div className="content asssessment-forms">
      <div className="tab-buttons row align-items-center m-0 mb-4 justify-content-between">
        <Nav tabs className="">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => {
                toggle("1");
              }}
            >
              Assesment Form
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => {
                toggle("2");
              }}
            >
              Sections & Questions
            </NavLink>
          </NavItem>
        </Nav>

        {(questionStore?.questionItemsFilterd?.length > 0 && activeTab === '2') && (
          <div className="buttons">
            <button
              type="button"
              className="btn btn-primary mt-0"
              onClick={() => setTrigger(true)}
            >
              Add Section
            </button>
          </div>
        )}
      </div>
      {/* <div className="p-0 border-bottom pb-2 row justify-content-end m-0">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/admin/assessment-forms")}
        >
          Back
          <TiArrowLeft size={25} title="Back" className="ml-2" />
        </button>
      </div> */}

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <EditAssessmentForm />
        </TabPane>

        <TabPane tabId="2">
          {" "}
          <EditAssessmentQuestion
            childFunc={childFunc}
            triggered={triggered}
            cancelTrigger={() => setTrigger(false)}
            goPrevious={() => setActiveTab("1")}
          />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default Editassessment;
