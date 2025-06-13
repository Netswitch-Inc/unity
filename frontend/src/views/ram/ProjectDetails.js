/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { getProject } from "views/projects/store";

import { Col, Row } from "reactstrap";

// ** Utils
import { scrollTop } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";
import ProjectDetailsCard from "./ProjectDetailsCard";

// ** Styles
import "../../assets/scss/views-styles.scss";

const ProjectDetails = () => {
  // ** Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // ** Const
  const displayID = location?.state?.displayID;
  // const data = RAMData.RAMTableData;
  const from = location?.state?.from || "";
  const controlItemData = location?.state?.control_data || null;

  const dispatch = useDispatch();
  const store = useSelector((state) => state.projects)

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

  const handleBack = () => {
    scrollTop();
    if(from === "resilience" && controlItemData) {
      navigate(`/admin/resilience-index`, { state: { control_data: controlItemData } })
    } else {
      navigate(-1);
    }
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

export default ProjectDetails;