/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";
import ProjectDetailsCard from "./ProjectDetailsCard";
import "../../assets/scss/views-styles.scss";
import { scrollTop } from "utility/Utils";
import { getProject } from "views/projects/store";
import { useSelector, useDispatch } from "react-redux";
import SimpleSpinner from "components/spinner/simple-spinner";
export default function ProjectDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.projects)
  const displayID = location.state?.displayID;
  // const data = RAMData.RAMTableData;

  useEffect(() => {
    if (displayID) {
      const query = { id: displayID };
      dispatch(getProject(query))
    }
    if (!displayID) {
      navigate(`/admin/risk-assessment`)
    }
  }, [])

  useEffect(() => {
    if (store?.actionFlag === 'PRJCT_UPDT_SCS' && displayID) {
      const query = { id: displayID };
      dispatch(getProject(query))
    }
  }, [store?.actionFlag])

  function handleBack() {
    scrollTop()
    navigate(-1);
  }
  return (
    <div className="content">
      <Row>
        <Col md="12" lg="12">
          {!store?.loading ? (
            <SimpleSpinner />
          ) : null}
          {store?.projectItem?._id === displayID && <ProjectDetailsCard
            className="content"
            data={store?.projectItem}
            displayID={displayID}
            onToggleDisplay={handleBack}
          />}
        </Col>
      </Row>
    </div>
  );
}
