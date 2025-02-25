import React, { useState, useRef } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import AssessmentForm from "./assessmentform";
import AssessmentQuestion from "./addquestionassessment";
import { useSelector } from "react-redux";

const Assessment = () => {
  const childFunc = useRef(null);
  const questionStore = useSelector((state) => state.questions);

  const [activeTab, setActiveTab] = useState("1");
  const [questionActivated, setQuestionActivated] = useState(false);
  const [triggered, setTrigger] = useState(false);

  const toggle = (tab) => {
    if (activeTab !== tab) {
      if (tab === "2" && questionActivated) {
        setActiveTab(tab);
      }
      if (tab === "1") {
        setActiveTab(tab);
      }
    }
  };

  const toggleQuestion = () => {
    setQuestionActivated(() => true);
    setActiveTab("2");
  };

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
        {questionActivated &&
          questionStore?.questionItemsFilterd?.length > 0 && (
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
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <AssessmentForm
            toggleQuestion={() => toggleQuestion()}
            // toggle={(tab) => toggle(tab)}
          />
        </TabPane>

        <TabPane tabId="2">
          <AssessmentQuestion
            childFunc={childFunc}
            triggered={triggered}
            cancelTrigger={() => setTrigger(false)}
          />
        </TabPane>
      </TabContent>
    </div>
  );
};

export default Assessment;
