// ** React Imports
import React, { useLayoutEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

// ** Third Party Components
import classnames from "classnames";

import EditAssessmentQuestion from "./editquestionassessmentform";
import EditAssessmentForm from "./editassessmentform";

const Editassessment = () => {
  // ** Hooks
  const childFunc = useRef(null);
  const location = useLocation();

  // Create a URLSearchParams object from the query string
  const queryParams = new URLSearchParams(location.search);
  const activateTab = queryParams.get("active_tab");

  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const [triggered, setTrigger] = useState(false);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  }

  useLayoutEffect(() => {
    if (activateTab) {
      setActiveTab(activateTab);
    }
  }, [activateTab]);

  return (
    <div className="content asssessment-forms">
      <div className="tab-buttons row align-items-center m-0 mb-3 justify-content-between tab-design">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => toggle("1")}
            >
              Assesment Form
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => toggle("2")}
            >
              Sections & Questions
            </NavLink>
          </NavItem>
        </Nav>

        {activeTab === '2' ? (
          <div className="buttons black-btn">
            <button
              type="button"
              className="btnprimary mt-0"
              onClick={() => setTrigger(true)}
            >
              Add Section
            </button>
          </div>
        ) : null}
      </div>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <EditAssessmentForm />
        </TabPane>

        <TabPane tabId="2">
          <EditAssessmentQuestion
            childFunc={childFunc}
            triggered={triggered}
            cancelTrigger={() => setTrigger(false)}
            goPrevious={() => setActiveTab("1")}
          />
        </TabPane>
      </TabContent>
    </div>
  )
}

export default Editassessment;
