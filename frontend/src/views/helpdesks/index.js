// ** React Imports
import React, { useEffect, useLayoutEffect } from "react";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getHelpdeskGraphList, cleanHelpdeskMessage } from "./store"; // Using the unified action

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Config
import { helpdeskSupportTicketKey } from "configs/toolConfig";

import RequestClosedChart from "./requestClosedChart";
import RequestReceivedChart from "./requestReceivedChart";
import UnassignedOpenChart from "./unassignedOpenChart";
import SlaViolatedRequestChart from "./slaViolatedRequestChart";
import RequestSummaryChart from "./requestSummaryChart";

const HelpdeskGraphs = () => {
  // ** Store vars
  const dispatch = useDispatch()
  const loginStore = useSelector((state) => state.login)
  const store = useSelector((state) => state.helpdesk)

  // ** Const
  const toolsPermissions = loginStore?.authRolePermission?.toolsPermission || [];

  useLayoutEffect(() => {
    dispatch(getHelpdeskGraphList())
  }, [dispatch])

  useEffect(() => {
    if (store.actionFlag || store.success || store.error) {
      dispatch(cleanHelpdeskMessage())
    }
  }, [dispatch, store.actionFlag, store.success, store.error])

  const enableHelpdeskGraph = toolsPermissions?.includes(helpdeskSupportTicketKey) || false;

  return (
    <div className="content data-list helpdesk">
      {!store?.loading ? (<SimpleSpinner />) : null}

      <Row>
        {enableHelpdeskGraph ? (
          <Col sm="6" className="mb-3">
            <Card className="h-100 mb-0">
              <CardHeader>
                <CardTitle tag="h3">Request Closed In Last 21 Days</CardTitle>
              </CardHeader>

              <CardBody>
                <RequestClosedChart />
              </CardBody>
            </Card>
          </Col>
        ) : null}

        {enableHelpdeskGraph ? (
          <Col sm="6" className="mb-3">
            <Card className="h-100 mb-0">
              <CardHeader>
                <CardTitle tag="h3">Requests Received In Last 21 Days</CardTitle>
              </CardHeader>

              <CardBody>
                <RequestReceivedChart />
              </CardBody>
            </Card>
          </Col>
        ) : null}

        {enableHelpdeskGraph ? (
          <Col sm="6" className="mb-3">
            <Card className="h-100 mb-0">
              <CardHeader>
                <CardTitle tag="h3">Unassigned and Open Requests</CardTitle>
              </CardHeader>

              <CardBody>
                <UnassignedOpenChart />
              </CardBody>
            </Card>
          </Col>
        ) : null}

        {enableHelpdeskGraph ? (
          <Col sm="6" className="mb-3">
            <Card className="h-100 mb-0">
              <CardHeader>
                <CardTitle tag="h3">SLA Violated Requests</CardTitle>
              </CardHeader>

              <CardBody>
                <SlaViolatedRequestChart />
              </CardBody>
            </Card>
          </Col>
        ) : null}

        {enableHelpdeskGraph ? (
          <Col sm="6" className="mb-3">
            <Card className="h-100 mb-0">
              <CardHeader>
                <CardTitle tag="h3">Request Summary</CardTitle>
              </CardHeader>

              <CardBody>
                <RequestSummaryChart />
              </CardBody>
            </Card>
          </Col>
        ) : null}
      </Row>
    </div>
  )
}

export default HelpdeskGraphs
