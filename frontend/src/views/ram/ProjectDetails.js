/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { getProject } from "views/projects/store";
import { getHistoryList } from "./projectHistoryStore";
import { cleanAIPromptMessage } from "views/aiPrompts/store";

import { Col, Row } from "reactstrap";

// ** Utils
import { scrollTop } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";
import ProjectDetailsCard from "./ProjectDetailsCard";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import { defaultPerPageRow } from "utility/reduxConstant";

// ** Styles
import "../../assets/scss/views-styles.scss";

const ProjectDetails = () => {
  // ** Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // ** Const
  const displayID = location?.state?.displayID;
  const from = location?.state?.from || "";
  const controlItemData = location?.state?.control_data || null;

  const dispatch = useDispatch();
  const store = useSelector((state) => state.projects);
  const aiPromptStore = useSelector((state) => state.aiPrompt);

  const [showSnackBar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const handleGetProject = useCallback(() => {
    if (displayID) {
      const query = { id: displayID };
      dispatch(getProject(query));
      dispatch(getHistoryList({
        project_id: displayID, page: 1,
        limit: defaultPerPageRow,
      }))
    } else {
      navigate(`/admin/risk-assessment`);
    }
  }, [dispatch, navigate, displayID])

  useEffect(() => {
    handleGetProject();
  }, [handleGetProject])

  useEffect(() => {
    if (store?.actionFlag === 'PRJCT_UPDT_SCS' && displayID) {
      handleGetProject();
    }
  }, [handleGetProject, store?.actionFlag])

  useEffect(() => {
    if (aiPromptStore?.actionFlag || aiPromptStore?.error) {
      dispatch(cleanAIPromptMessage(null));
    }

    if (aiPromptStore?.error) {
      setShowSnackbar(true);
      setSnackMessage(aiPromptStore.error);
    }
  }, [dispatch, aiPromptStore.actionFlag, aiPromptStore.error])

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  const handleBack = () => {
    scrollTop();
    if (from === "resilience" && controlItemData) {
      navigate(`/admin/resilience-index`, { state: { control_data: controlItemData } })
    } else {
      navigate(-1);
    }
  }

  return (
    <div className="content">
      <Row>
        <Col md="12" lg="12">
          {!store?.loading ? (<SimpleSpinner />) : null}
          {!aiPromptStore?.loading ? (<SimpleSpinner />) : null}

          <ReactSnackBar Icon={(
            <span><TiMessages size={25} /></span>
          )} Show={showSnackBar}>
            {snackMessage}
          </ReactSnackBar>

          {store?.projectItem?._id === displayID ? (
            <ProjectDetailsCard
              className="content"
              data={store?.projectItem}
              displayID={displayID}
              onToggleDisplay={handleBack}
              handleGetProject={handleGetProject}
            />
          ) : null}
        </Col>
      </Row>
    </div>
  );
}

export default ProjectDetails;