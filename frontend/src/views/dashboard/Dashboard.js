/* eslint-disable react-hooks/exhaustive-deps */

// ** React Imports
import React, { useMemo, useState, useEffect, useCallback, useLayoutEffect, Fragment } from "react";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import {
  updateWidgetsOrder,
  updateWidgetsToggle,
  cleanDashboardMessage,
  getDashboardWidgetData,
  wazuhIndexerSeverityCountData,
  netSwitchThreatIntelCountryCount
} from "./store/index.js";

// ** Reactstrap Imports
import {
  Col,
  Row,
  Card,
  CardBody,
  Dropdown,
  CardTitle,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from "reactstrap";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner.js";

// ** Third Party Components
import moment from "moment";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// ** Constant
import { isEmptyBlankDataDisplay, priviledgesObjectPermission } from "utility/reduxConstant.js";

// ** Config
import { wazuhKey, openVASKey, netswitchThreatIntelKey } from "configs/toolConfig.js";

import Sixlayers from "./SixLayers.js";
import ToggleComp from "./HOChiding.js";
import AgentChart from "./AgentChart.js";
import VulnerTrending from "./VulnerTrending.js";
import IncidentByType from "./IncidentByType.js";
import IncidentTrending from "./IncidentTrending.js";
import ManagementTable from "components/DashboardComp/ManagementTable.js";
import ProjectBudgetByTask from "components/DashboardComp/projectBudgetTask.js";
import ScoreHistoryLineChart from "components/DashboardComp/ScoreHistoryLine.js";
import CritcalIncident from "./CriticalIncident.js";
import NetSwitchThreatIntelChart from "./NetSwitchThreatIntelChart.js";

import { CisSubControlHistoryData } from "../sampleData/ComplianceControlData.js";

const Dashboard = () => {
  const generalData = CisSubControlHistoryData;
  const { authUserItem, authRolePermission } = useSelector((state) => state.login);
  const toolsPermissions = authRolePermission?.toolsPermission || [];

  const dispatch = useDispatch();
  const store = useSelector((state) => state.dashboard);

  const [previledgePermission, setPreviledgePermission] = useState(priviledgesObjectPermission);
  const [toggleManagementTable, setToggleManagementTable] = useState(true);
  const [toggleProjectBudgetByTask, setToggleProjectBudgetByTask] = useState(true);
  const [toggleScoreHistoryLineChart, setToggleScoreHistoryLineChart] = useState(true);
  const [toggleIncidentTrending, setToggleIncidentTrending] = useState(true);
  const [toggleVulnerTrending, setToggleVulnerTrending] = useState(true);
  const [toggleIncidentByType, setToggleIncidentByType] = useState(true);
  const [toggleAgentChart, setToggleAgentChart] = useState(true);
  const [toggleSixLayers, setToggleSixLayers] = useState(true);
  const [toggleCritcalIncident, setToggleCritcalIncident] = useState(true);
  const [toggleNetSwitchIntelChart, setToggleNetSwitchIntelChart] = useState(true);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = useCallback(() => setDropdownOpen((prevState) => !prevState), [])

  const EnhancedManegementComp = ToggleComp(ManagementTable);
  const EnhancedProjectBudgetByTask = ToggleComp(ProjectBudgetByTask);
  const EnhancedScoreHistoryLineChart = ToggleComp(ScoreHistoryLineChart);
  const EnhancedIncidentTrending = ToggleComp(IncidentTrending);
  const EnhancedVulnerTrending = ToggleComp(VulnerTrending);
  const EnhancedIncidentType = ToggleComp(IncidentByType);
  const EnhancedAgentChart = ToggleComp(AgentChart);
  const EnhancedSixLayers = ToggleComp(Sixlayers);
  const EnhancedCritcalIncident = ToggleComp(CritcalIncident);
  const EnhancedNetSwitchThreatIntel = ToggleComp(NetSwitchThreatIntelChart);

  // ** Const
  const enableWazuhGraph = toolsPermissions?.includes(wazuhKey) || false;
  const enableOpenVASGraph = toolsPermissions?.includes(openVASKey) || false;
  const enableNetswitchThreatIntel = toolsPermissions?.includes(netswitchThreatIntelKey) || false;

  const widgetsCompoItems = [
    {
      name: "toggleSixLayers",
      show: toggleSixLayers,
      component: EnhancedSixLayers,
      className: "p-3 layers-shape mb-0 h-100",
      toggleFunc: setToggleSixLayers,
      display: true,
      permission: true
    },
    {
      name: "toggleVulnerTrending",
      show: toggleVulnerTrending,
      component: EnhancedVulnerTrending,
      className: "card-chart mb-0 h-100",
      toggleFunc: setToggleVulnerTrending,
      display: enableOpenVASGraph || false,
      permission: true
    },
    {
      name: "toggleManagementTable",
      show: toggleManagementTable,
      component: EnhancedManegementComp,
      className: "db-mid-section mb-0 h-100",
      toggleFunc: setToggleManagementTable,
      display: true,
      permission: previledgePermission?.governor || previledgePermission?.executive
    },
    {
      name: "toggleProjectBudgetByTask",
      show: toggleProjectBudgetByTask,
      component: EnhancedProjectBudgetByTask,
      className: "card-chart db-mid-section mb-0 h-100",
      toggleFunc: setToggleProjectBudgetByTask,
      display: true,
      permission: previledgePermission?.governor || previledgePermission?.executive
    },
    {
      name: "toggleScoreHistoryLineChart",
      show: toggleScoreHistoryLineChart,
      component: EnhancedScoreHistoryLineChart,
      className: "card-chart mb-0 h-100",
      toggleFunc: setToggleScoreHistoryLineChart,
      data: generalData.history.data.progress_by_month,
      height: "350px",
      display: enableWazuhGraph || false,
      permission: previledgePermission?.technologist
    },
    {
      name: "toggleIncidentTrending",
      show: toggleIncidentTrending,
      component: EnhancedIncidentTrending,
      className: "card-chart mb-0 h-100",
      toggleFunc: setToggleIncidentTrending,
      display: enableWazuhGraph || false,
      permission: previledgePermission?.technologist
    },
    {
      name: "toggleCritcalIncident",
      show: toggleCritcalIncident,
      component: EnhancedCritcalIncident,
      className: "card-chart mb-0 h-100",
      toggleFunc: setToggleCritcalIncident,
      display: enableWazuhGraph || false,
      permission: previledgePermission?.technologist
    },
    {
      name: "toggleAgentChart",
      show: toggleAgentChart,
      component: EnhancedAgentChart,
      className: "card-chart mb-0 h-100",
      toggleFunc: setToggleAgentChart,
      display: enableWazuhGraph || false,
      permission: previledgePermission?.technologist
    },
    {
      name: "toggleNetSwitchIntelChart",
      show: toggleNetSwitchIntelChart,
      component: EnhancedNetSwitchThreatIntel,
      className: "card-chart mb-0 h-100",
      toggleFunc: setToggleNetSwitchIntelChart,
      display: enableNetswitchThreatIntel || false,
      permission: previledgePermission?.technologist
    },
    {
      name: "toggleIncidentByType",
      show: toggleIncidentByType,
      component: EnhancedIncidentType,
      className: "card-chart mb-0 h-100",
      toggleFunc: setToggleIncidentByType,
      display: true,
      permission: previledgePermission?.technologist
    }
  ]

  const widgetCompoNames = widgetsCompoItems?.map((item) => item?.name || "") || [];
  const [toggleComponents, setToggleComponents] = useState(widgetsCompoItems);

  let now = new moment().subtract(2, 'minutes').format("lll");
  const lastIntelDate = now.toString()

  const handleGetWazuhIndexerCountData = useCallback(() => {
    dispatch(wazuhIndexerSeverityCountData());
  }, [dispatch])

  const handleGetNetSwitchThreatIntelCountData = useCallback(() => {
    dispatch(netSwitchThreatIntelCountryCount());
  }, [dispatch])

  const handleGetDashboardWidgets = useCallback(() => {
    dispatch(getDashboardWidgetData());
  }, [dispatch])

  useLayoutEffect(() => {
    handleGetWazuhIndexerCountData();
    handleGetDashboardWidgets();
    handleGetNetSwitchThreatIntelCountData();
  }, [handleGetWazuhIndexerCountData, handleGetDashboardWidgets, handleGetNetSwitchThreatIntelCountData]);

  const handleToggleFunc = async (setDatafunc, name, show) => {
    setDatafunc(() => show);
    const payload = {
      user_id: authUserItem?._id,
      name: name,
      show: show,
      widgetCompoNames
    }

    dispatch(updateWidgetsToggle(payload))
  }

  useEffect(() => {
    if (authUserItem?.priviledges?.length > 0) {
      // eslint-disable-next-line
      Object.keys(previledgePermission).map((previledge) => {
        if (!authUserItem?.priviledges?.includes(previledge)) {
          setPreviledgePermission((prev) => ({ ...prev, [previledge]: false }));
        }
      });
    }
  }, [authUserItem?.priviledges]);

  useEffect(() => {
    if (store?.actionFlag === "WGT_ITMS" || store?.actionFlag === "WGT_ITMS_ERR") {
      const updatedComponents = widgetsCompoItems.map((component) => {
        const widget = store.widgetItems?.find((widget) => widget.name === component.name) || null;

        if (widget) {
          return {
            ...component,
            // id: widget._id,
            user_id: widget?.user_id,
            order: widget.order,
            show: widget.show
          }
        }

        return component;
      })

      const sortedComponents = updatedComponents.sort((a, b) => a.order - b.order)
      setToggleComponents(() => sortedComponents)
    }
  }, [store.actionFlag, store.widgetItems])

  useEffect(() => {
    if (store.widgetItems?.length > 0) {
      store.widgetItems.forEach((widget) => {
        const widgetStateMap = {
          toggleManagementTable: setToggleManagementTable,
          toggleSixLayers: setToggleSixLayers,
          toggleVulnerTrending: setToggleVulnerTrending,
          toggleProjectBudgetByTask: setToggleProjectBudgetByTask,
          toggleScoreHistoryLineChart: setToggleScoreHistoryLineChart,
          toggleIncidentTrending: setToggleIncidentTrending,
          toggleIncidentByType: setToggleIncidentByType,
          toggleAgentChart: setToggleAgentChart,
          toggleCritcalIncident: setToggleCritcalIncident,
          toggleNetSwitchIntelChart: setToggleNetSwitchIntelChart
        }

        if (widgetStateMap[widget.name]) {
          widgetStateMap[widget.name](widget?.show);
        }
      })
    }
  }, [store.widgetItems, store.actionFlag])

  useEffect(() => {
    if (store?.actionFlag === "WGT_ITM_ODR" || store?.actionFlag === "WGT_ITM_ODR_ERR") {
      handleGetDashboardWidgets()
    }

    if (store?.actionFlag === "WGT_ITM_TGL" || store?.actionFlag === "WGT_ITM_TGL_ERR") {
      handleGetDashboardWidgets()
    }
  }, [handleGetDashboardWidgets, store.actionFlag])

  useEffect(() => {
    if (store?.actionFlag || store?.success || store?.error) {
      dispatch(cleanDashboardMessage())
    }
  }, [dispatch, store.error, store.success, store.actionFlag])

  const dropDownItems = useMemo(() => {
    return (
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
        <DropdownToggle caret>Show Widgets</DropdownToggle>
        <DropdownMenu>
          {!toggleManagementTable && (
            <DropdownItem
              className="text-wrap"
              onClick={() => handleToggleFunc(setToggleManagementTable, "toggleManagementTable", true)}
            >
              Management Table
            </DropdownItem>
          )}

          {!toggleSixLayers && (
            <DropdownItem
              className="text-wrap"
              onClick={() => handleToggleFunc(setToggleSixLayers, "toggleSixLayers", true)}
            >
              Defense in depth overview
            </DropdownItem>
          )}

          {!toggleVulnerTrending && (
            <DropdownItem
              className="text-wrap"
              onClick={() => handleToggleFunc(setToggleVulnerTrending, "toggleVulnerTrending", true)}
            >
              Vulnerabilities Trending
            </DropdownItem>
          )}

          {!toggleProjectBudgetByTask && (
            <DropdownItem
              className="text-wrap"
              onClick={() => handleToggleFunc(setToggleProjectBudgetByTask, "toggleProjectBudgetByTask", true)}
            >
              Project Budget By Task
            </DropdownItem>
          )}

          {!toggleScoreHistoryLineChart && (
            <DropdownItem
              className="text-wrap"
              onClick={() => handleToggleFunc(setToggleScoreHistoryLineChart, "toggleScoreHistoryLineChart", true)}
            >
              Configuration Assessment
            </DropdownItem>
          )}

          {!toggleIncidentTrending && (
            <DropdownItem
              className="text-wrap"
              onClick={() => handleToggleFunc(setToggleIncidentTrending, "toggleIncidentTrending", true)}
            >
              SIEM Incident Trending
            </DropdownItem>
          )}

          {!toggleIncidentByType && (
            <DropdownItem
              className="text-wrap"
              onClick={() => handleToggleFunc(setToggleIncidentByType, "toggleIncidentByType", true)}
            >
              Major Incident By Type
            </DropdownItem>
          )}

          {!toggleAgentChart && (
            <DropdownItem
              className="text-wrap"
              onClick={() => handleToggleFunc(setToggleAgentChart, "toggleAgentChart", true)}
            >
              Agents Summary
            </DropdownItem>
          )}

          {!toggleCritcalIncident && (
            <DropdownItem
              className="text-wrap"
              onClick={() => handleToggleFunc(setToggleCritcalIncident, "toggleCritcalIncident", true)}
            >
              Critcal Incident By Type
            </DropdownItem>
          )}

          {!toggleNetSwitchIntelChart && (
            <DropdownItem
              className="text-wrap"
              onClick={() => handleToggleFunc(setToggleNetSwitchIntelChart, "toggleNetSwitchIntelChart", true)}
            >
              Netswitch Threat Intel
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    )
  }, [
    toggleManagementTable,
    toggleSixLayers,
    toggleVulnerTrending,
    toggleProjectBudgetByTask,
    toggleScoreHistoryLineChart,
    toggleIncidentTrending,
    toggleIncidentByType,
    toggleAgentChart,
    toggleCritcalIncident,
    toggleNetSwitchIntelChart,
    setToggleManagementTable,
    setToggleSixLayers,
    setToggleVulnerTrending,
    setToggleProjectBudgetByTask,
    setToggleScoreHistoryLineChart,
    setToggleIncidentTrending,
    setToggleIncidentByType,
    setToggleAgentChart,
    setToggleCritcalIncident,
    setToggleNetSwitchIntelChart,
    dropdownOpen,
    toggleDropdown,
    authUserItem
  ])

  const handleDragWidgets = (result) => {
    const { destination, source } = result;

    // If dropped outside of a droppable container, return early
    if (!destination) { return; }

    // If item is dropped at the same position, no need to update
    if (destination.index === source.index) { return; }

    // Reorder the components
    const reorderedComponents = Array.from(toggleComponents);
    const [removed] = reorderedComponents.splice(source.index, 1);
    reorderedComponents.splice(destination.index, 0, removed);
    const updatedPayload = reorderedComponents.map((item, index) => ({
      // _id: item.id,
      order: index,
      name: item.name,
      user_id: item.user_id,
    }));
    setToggleComponents(reorderedComponents);

    const payload = {
      widgetCompoNames,
      bulkItems: updatedPayload,
      user_id: authUserItem._id,
    }

    dispatch(updateWidgetsOrder(payload));
  }

  return (
    <div className="content dashboard">
      {!store?.loading ? (<SimpleSpinner />) : null}

      <div className="accordian-toggle-button position-relative">
        {(!toggleManagementTable || !toggleSixLayers || !toggleVulnerTrending || !toggleProjectBudgetByTask || !toggleScoreHistoryLineChart || !toggleIncidentTrending || !toggleIncidentByType || !toggleAgentChart || !toggleCritcalIncident || !toggleNetSwitchIntelChart) && dropDownItems}
      </div>

      <Col lg="13" className="dashboard-content">
        <Row>
          <Col lg="2" md="6" style={{ display: "flex", maxHeight: "270px" }}>
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="12">
                    <div>
                      <p className="card-category">Log Processed</p>
                      <CardTitle tag="h3" style={{ fontSize: "1.75rem" }}>
                        {isEmptyBlankDataDisplay ? ("0") : ("178GB")}
                      </CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>

              <CardFooter>
                <hr />
                <div
                  className="stats"
                  style={{
                    fontSize: "0.9em",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <i className="tim-icons icon-refresh-01" /> Update Now
                </div>
              </CardFooter>
            </Card>
          </Col>

          <Col lg="2" md="6" style={{ display: "flex", maxHeight: "270px" }}>
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="12">
                    <div>
                      <p className="card-category">Traffic Monitored</p>
                      <CardTitle tag="h3" style={{ fontSize: "1.75rem" }}>
                        {isEmptyBlankDataDisplay ? ("0") : ("1.82TB")}
                      </CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>

              <CardFooter>
                <hr />
                <div
                  className="stats"
                  style={{
                    fontSize: "0.9em",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <i className="tim-icons icon-sound-wave" /> Last 24 Hours
                </div>
              </CardFooter>
            </Card>
          </Col>

          <Col lg="2" md="6" style={{ display: "flex", maxHeight: "270px" }}>
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="12">
                    <div>
                      <p className="card-category">Protected Devices</p>
                      <CardTitle tag="h3" style={{ fontSize: "1.75rem" }}>
                        {isEmptyBlankDataDisplay ? ("0") : ("265")}
                      </CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>

              <CardFooter>
                <hr />
                <div
                  className="stats"
                  style={{
                    fontSize: "0.9em",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <i className="tim-icons icon-sound-wave" /> Last 24 Hours
                </div>
              </CardFooter>
            </Card>
          </Col>

          <Col lg="2" md="6" style={{ display: "flex", maxHeight: "270px" }}>
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="12">
                    <div>
                      <p className="card-category">Last Threat Intel</p>
                      <CardTitle tag="h3" style={{ fontSize: "1.75rem" }}>
                        {isEmptyBlankDataDisplay ? ("N/A") : (lastIntelDate)}
                      </CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>

              <CardFooter>
                <hr />
                <div
                  className="stats"
                  style={{
                    fontSize: "0.9em",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <i className="tim-icons icon-refresh-01" /> Update now
                </div>
              </CardFooter>
            </Card>
          </Col>

          <Col lg="2" md="6" style={{ display: "flex", maxHeight: "270px" }}>
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="12">
                    <div>
                      <p className="card-category">Blocked Traffic</p>
                      <CardTitle tag="h3" style={{ fontSize: "1.75rem" }}>
                        {isEmptyBlankDataDisplay ? ("0") : ("98k")}
                      </CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>

              <CardFooter>
                <hr />
                <div
                  className="stats"
                  style={{
                    fontSize: "0.9em",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <i className="tim-icons icon-sound-wave" /> Last 24 Hours
                </div>
              </CardFooter>
            </Card>
          </Col>

          <Col lg="2" md="6" style={{ display: "flex", maxHeight: "270px" }}>
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col xs="12">
                    <div>
                      <p className="card-category">Incidents</p>
                      <CardTitle tag="h3" style={{ fontSize: "1.75rem" }}>
                        {isEmptyBlankDataDisplay ? ("0") : ("2")}
                      </CardTitle>
                    </div>
                  </Col>
                </Row>
              </CardBody>

              <CardFooter>
                <hr />
                <div
                  className="stats"
                  style={{
                    fontSize: "0.9em",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <i className="tim-icons icon-sound-wave" /> Last 24 Hours
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Col>

      <DragDropContext onDragEnd={handleDragWidgets}>
        <Droppable droppableId="droppable-sections">
          {(provided) => (
            <div
              className="row"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {toggleComponents?.length > 0 ? (<>
                {toggleComponents.map((item, index) => (
                  <Fragment key={`${index}-${item.name}`}>
                    {item?.display && item?.show ? (
                      <Draggable
                        index={index}
                        key={item.name}
                        draggableId={item.name}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="col-md-6 mb-3"
                          >
                            {item?.permission ? (
                              <item.component
                                show={item.show}
                                data={item.data}
                                height={item.height}
                                className={item.className}
                                isEmptyBlankDataDisplay={isEmptyBlankDataDisplay}
                                handleToggle={() => handleToggleFunc(item.toggleFunc, item.name, !item.show)}
                              />
                            ) : null}
                          </div>
                        )}
                      </Draggable>
                    ) : null}
                  </Fragment>
                ))}
                {provided.placeholder} {/* Ensures layout stability */}
              </>) : null}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default Dashboard
