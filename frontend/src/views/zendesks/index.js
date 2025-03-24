// ** React Imports
import React, { useEffect, useLayoutEffect } from "react";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getZendeskGraphList, cleanZendeskMessage } from "./store"; // Using the unified action

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Config
import { zendeskSupportTicketKey } from "configs/toolConfig";

import RequestClosedChart from "./requestClosedChart";
import RequestReceivedChart from "./requestOpenChart";
import UnassignedOpenChart from "./unassignedOpenChart";

const ZendeskGraphs = () => {
  // ** Store vars
  const dispatch = useDispatch()
  const loginStore = useSelector((state) => state.login)
  const store = useSelector((state) => state.zendesk)

  // ** Const
  const toolsPermissions = loginStore?.authRolePermission?.toolsPermission || [];

  useLayoutEffect(() => {
    dispatch(getZendeskGraphList())
  }, [dispatch])

  useEffect(() => {
    if (store.actionFlag || store.success || store.error) {
      dispatch(cleanZendeskMessage())
    }
  }, [dispatch, store.actionFlag, store.success, store.error])

  const enableZendeskGraph = toolsPermissions?.includes(zendeskSupportTicketKey) || false;

  return (
    <div className="content data-list zendesk">
      {!store?.loading ? (<SimpleSpinner />) : null}

      <Row>
        {enableZendeskGraph ? (
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

        {enableZendeskGraph ? (
          <Col sm="6" className="mb-3">
            <Card className="h-100 mb-0">
              <CardHeader>
                <CardTitle tag="h3">Requests Open In Last 21 Days</CardTitle>
              </CardHeader>

              <CardBody>
                <RequestReceivedChart />
              </CardBody>
            </Card>
          </Col>
        ) : null}

        {enableZendeskGraph ? (
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
      </Row>
    </div>
  )
}

export default ZendeskGraphs
