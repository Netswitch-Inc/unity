/* eslint-disable react-hooks/exhaustive-deps */

import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import { RAMData } from "views/sampleData/mockData";
import {
  Col,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import OuterCard from "./OuterCard";
import GeneralCard from "./GeneralCard";
import { useNavigate } from "react-router-dom";
import { getProjectList } from "views/projects/store";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { defaultPerPageRow } from "utility/reduxConstant";
import AllprojectsTab from "./Allprojectslist";

const RiskAssessmentMethod = () => {
  const dispatch = useDispatch();
  const scrollref = useRef();
  const data = RAMData.RAMTableData;
  const [activeTab, setActiveTab] = useState("created");

  const loginStore = useSelector((state) => state.login);
  // const authUserItem = loginStore?.authUserItem;
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollref?.current) {
      window.scrollTo(0, scrollref.current.offsetTop);
    }
  }, [scrollref.current]);

  const toggle = async (tab) => {
    let params = {};
    if (activeTab !== tab) {
      if (loginStore?.authUserItem?.company_id?._id) {
        params.company_id = loginStore?.authUserItem?.company_id?._id;
      }
      if (tab === "created") {
        params.status = "created";
      }
      if (tab === "approved") {
        params.status = "approved";
      }
      if (tab === "completed") {
        params.status = "completed";
      }
      if (tab === "cancelled") {
        params.status = "cancelled";
      }
      params.page = 1;
      params.limit = defaultPerPageRow;
      dispatch(getProjectList(params));
      setActiveTab(tab);
    }
  };

  const toggleProjects = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(() => tab);
    }
  };

  useLayoutEffect(() => {
    let params = {};
    if (loginStore?.authUserItem?.company_id?._id) {
      params.company_id = loginStore?.authUserItem?.company_id?._id;
    }
    params.status = "created";
    params.page = 1;
    params.limit = defaultPerPageRow;
    dispatch(getProjectList(params));
  }, [dispatch]);

  const handleProductClick = function (id) {
    navigate(`/admin/project-details/${id}`, {
      state: {
        // data: RAMData.RAMTableData,
        displayID: id,
      },
    });
  };

  return (
    <div className="content" ref={scrollref}>
      <Row>
        <Col lg="12">
          <OuterCard data={data} />
        </Col>
        <Col md="12" lg="12">
          <div className="content project-management">
            <Nav tabs className="mb-4">
              <NavItem className="ml-3">
                <NavLink
                  className={classnames({ active: activeTab === "created" } )} 
                  onClick={() => {
                    toggle("created");
                  }}
                >
                  In Review
                </NavLink>
              </NavItem>
              <NavItem className="ml-3">
                <NavLink
                  className={classnames({ active: activeTab === "approved" })}
                  onClick={() => {
                    toggle("approved");
                  }}
                >
                  In Progress
                </NavLink>
              </NavItem>

              <NavItem className="ml-3">
                <NavLink
                  className={classnames({ active: activeTab === "completed" })}
                  onClick={() => {
                    toggle("completed");
                  }}
                >
                  Completed
                </NavLink>
              </NavItem >
              <NavItem className="ml-3">
                <NavLink
                  className={classnames({ active: activeTab === "cancelled" })}
                  onClick={() => {
                    toggle("cancelled");
                  }}
                >
                  Cancelled
                </NavLink>
              </NavItem>

              <NavItem className="ml-3">
                <NavLink
                  className={classnames({
                    active: activeTab === "allprojects",
                  })}
                  onClick={() => {
                    toggleProjects("allprojects");
                  }}
                >
                  All
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
              {activeTab !== "allprojects" && (
                <TabPane tabId={activeTab}>
                  <GeneralCard
                    setDisplayID={handleProductClick}
                    currentTab={activeTab}
                  />
                </TabPane>
              )}
              <TabPane tabId="allprojects">
                {activeTab === "allprojects" && (
                  <AllprojectsTab currentTab={activeTab} />
                )}
              </TabPane>
            </TabContent>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RiskAssessmentMethod;
