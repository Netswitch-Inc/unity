/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import {
  updateCompanyComplianceControl,
  getCompanyComplianceControlList,
  cleanCompanyComplianceControlMessage
} from "views/companyComplianceControls/store";

// ** Reactstrap Imports
import { Col, Row, Card, CardBody } from "reactstrap";

import Select from "react-select";

// ** Utils
import { getFormatDate } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

import { GenerateRows } from "components/ComplinceControlComps/DataRows";
import SubControlCard from "components/ComplinceControlComps/SubcontrolCard";
// import HistoryAndReportCard from "components/ComplinceControlComps/HistoryGraphData";

// ** Models
import AIPromptWriteModal from "./models/AIPromptWriteModal";
import SelectSolutionTool from "views/CompilanceBuilders/Step3/model/SelectSolutionTool";

const ResilienceIndex = () => {
  // ** Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const rightSectionRef = useRef(null);

  const dispatch = useDispatch();
  const store = useSelector((state) => state.complincecontrol);
  const loginStore = useSelector((state) => state.login);
  const settingStore = useSelector((state) => state.globalSetting);
  const companyComplianceControlStore = useSelector((state) => state.companyComplianceControls);

  // ** Const
  const appSettingItem = settingStore?.appSettingItem || null;
  const authUserItem = loginStore?.authUserItem?._id ? loginStore?.authUserItem : null;
  const routeStateData = location?.state || null;
  const aiServiceEnabled = appSettingItem?.ai_service_enabled || false;

  // ** States
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [openSolutionModal, setSolutionModal] = useState(false);
  const [openAIWriteModal, setAIWriteModal] = useState("");
  const [selectedControl, setSelectedControl] = useState(null);
  const [prioritiesOptions, setPrioritiesOptions] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [complianceControlData, setComplianceControlData] = useState([]);
  const [rightSectionHeight, setRightSectionHeight] = useState(0);
  const [controlItemData, setControlItemData] = useState(routeStateData?.control_data || null);

  const handleOpenSolutionModal = () => {
    setSolutionModal(true);
  }

  const closeSolutionModal = () => {
    setSolutionModal(false);
  }

  const handleOpenAIWriteModal = (value) => {
    setAIWriteModal(value);
  }

  const closeAiWriteModal = () => {
    setAIWriteModal("");
  }

  const handleResetStatesData = useCallback(() => {
  }, [])

  useLayoutEffect(() => {
    handleResetStatesData();
    const query = {
      company_id: authUserItem?.company_id?._id || authUserItem?.company_id || "",
      user_id: authUserItem?._id || "",
      compliance_priority_id: ""
    }

    if (controlItemData?.compliance_priority_id) {
      query.compliance_priority_id = controlItemData?.compliance_priority_id?._id || controlItemData?.compliance_priority_id;
    }

    dispatch(getCompanyComplianceControlList(query))
  }, [dispatch, handleResetStatesData, authUserItem, routeStateData]);

  const handleSelectedControlData = (item) => {
    handleResetStatesData();
    setSelectedControl(() => item);
  }

  const handleSelectPriority = (item = null) => {
    setSelectedPriority(item)
    dispatch(getCompanyComplianceControlList({
      company_id: authUserItem?.company_id?._id || authUserItem?.company_id || "",
      user_id: authUserItem?._id || "",
      compliance_priority_id: item?._id || ""
    }))
  }

  useEffect(() => {
    let height = 0;
    if (rightSectionRef?.current) {
      height = rightSectionRef?.current?.offsetHeight || 0;
    }
    setRightSectionHeight(height)
  }, [complianceControlData]);

  useEffect(() => {
    if (companyComplianceControlStore.actionFlag || companyComplianceControlStore.success || companyComplianceControlStore.error) {
      dispatch(cleanCompanyComplianceControlMessage(null));
    }

    if (companyComplianceControlStore.actionFlag === "CMPN_CONTRL_LST") {
      const companyComplianceControlData = companyComplianceControlStore?.companyComplianceControlData || null;

      let list1 = []
      let list2 = []
      let defaultControl = null;
      let compliancePriority = companyComplianceControlData?.compliancePriority || null
      if (companyComplianceControlData.compliancePriorities) {
        list1 = companyComplianceControlData.compliancePriorities.map((item) => {
          let name = item?.name || "";
          if (item?.createdAt) { name = `${name} - ${getFormatDate(item.createdAt, "DD-MM-YYYY HH:mm")}`; }

          return { ...item, label: name, value: item?._id }
        }) || []
      }

      if (compliancePriority?._id) {
        let name = compliancePriority?.name || "";
        if (compliancePriority?.createdAt) { name = `${name} - ${getFormatDate(compliancePriority.createdAt, "DD-MM-YYYY HH:mm")}`; }
        compliancePriority = { ...compliancePriority, label: name, value: compliancePriority?._id }
      }

      if (companyComplianceControlData.data) {
        list2 = companyComplianceControlData.data.map((item) => {
          const comItem = { ...item?.control_id }
          if (item?.control_description) {
            comItem.description = item.control_description;
          }

          if (item?.cis_control_descriptions?.length && comItem?.cis_control_id?.length) {
            const cisControls = comItem.cis_control_id.map((cisItem) => {
              const cisItm = { ...cisItem };
              const decItm = item.cis_control_descriptions.find((x) => x.cis_control_id === cisItm._id);
              if (decItm?.description) { cisItm.description = decItm.description; }

              return cisItm;
            })

            comItem.cis_control_id = cisControls;
          }

          return {
            ...comItem,
            project_id: item?.project_id || null,
            company_compliance_control_id: item?._id || "",
            tool_icons: item?.tool_icons || "",
            control_description: item?.control_description || "",
            cis_control_descriptions: item?.cis_control_descriptions || null,
            compliance_priority_id: compliancePriority?._id || ""
          }
        }) || []

        defaultControl = list2?.length ? list2[0] : null;
        if (controlItemData?._id) {
          const control = list2.find((x) => x._id === controlItemData._id) || null;
          defaultControl = control?._id ? control : defaultControl;
          setControlItemData(null);
        }
      }

      handleResetStatesData();
      setSelectedControl(defaultControl)
      setSelectedPriority(compliancePriority)
      setPrioritiesOptions(list1)
      setComplianceControlData(list2)
    }
  }, [dispatch, handleResetStatesData, companyComplianceControlStore.companyComplianceControlData, companyComplianceControlStore.actionFlag, companyComplianceControlStore.success, companyComplianceControlStore.error, controlItemData]);

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar]);

  const handleBackControl = () => {
    handleResetStatesData();
    setSelectedControl(() => null)
  }

  const handleUpdateToolIcons = (item = null, icons = "") => {
    if (icons && item?._id && item?.company_compliance_control_id) {
      setSelectedControl({ ...item, tool_icons: icons })

      dispatch(updateCompanyComplianceControl({ _id: item.company_compliance_control_id, tool_icons: icons }));
    }
  }

  const handleUpdateDescription = (type = "", value = "") => {
    if (selectedControl && type && value) {
      const comControlData = [...complianceControlData]
      const types = type?.split("@");
      const descTypes = ["cis", "sub-edit-dec"];
      if (types?.length > 1 && descTypes.includes(types[0])) {
        const id = selectedControl?._id || "";
        const cisId = types[1] || "";
        const ind = comControlData.findIndex((x) => x._id === id);
        if (ind >= 0) {
          const cisControls = [...comControlData?.[ind]?.cis_control_id];
          const subInd = cisControls.findIndex((x) => x._id === cisId);
          if (subInd >= 0) {
            cisControls[subInd] = { ...cisControls[subInd], description: value };
            comControlData[ind] = { ...comControlData[ind], cis_control_id: cisControls };
            setSelectedControl(comControlData[ind]);
          }
        }
      } else {
        const id = selectedControl?._id || "";
        const ind = comControlData.findIndex((x) => x._id === id);
        if (ind >= 0) {
          comControlData[ind] = { ...comControlData[ind], description: value, control_description: value };
          setSelectedControl(comControlData[ind]);
        }
      }

      setComplianceControlData(comControlData);
    }
  }

  return (
    <div className="content">
      {!store?.loading ? (<SimpleSpinner />) : null}
      {!companyComplianceControlStore?.loading ? (<SimpleSpinner />) : null}

      <Row>
        <Col md={4} className="complaince-right-container compliance-pie-charts pr-md-1 mb-md-0" style={{
          overflow: "auto",
          maxHeight: rightSectionHeight > 0 ? `${rightSectionHeight}px` : "0px"
        }}>
          <Card className="card-chart mb-0 h-100 p-0" id="scrollTopID">
            <CardBody className="p-0">
              <div>
                <div className="sub-frame-heading">
                  {/* <h4 className="mb-0">
                        Priority List
                    </h4> */}
                  <div className="d-block w-100">
                    <Select
                      options={prioritiesOptions}
                      name="compliance_priority_id"
                      classNamePrefix="react-select"
                      placeholder="Select Priority..."
                      value={selectedPriority || null}
                      className="react-select col-select"
                      onChange={(val) => handleSelectPriority(val)}
                    />
                  </div>
                </div>

                <div className="ScrollingEffectGraph" style={{ maxHeight: rightSectionHeight > 0 ? `${rightSectionHeight}px` : "0px", paddingBottom: "60px" }}>
                  <div className="sub-frame-name p-3">
                    {GenerateRows(complianceControlData, 2, handleSelectedControlData, selectedControl)}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md={8} className="complaince-right-container pl-md-1 pr-md-1">
          <div className="h-100" ref={rightSectionRef}>
            {selectedControl ? (
              <SubControlCard
                authUserItem={authUserItem}
                selectedControl={selectedControl}
                aiServiceEnabled={aiServiceEnabled}
                selectedPriority={selectedPriority}
                handleBackControl={handleBackControl}
                complianceControlData={complianceControlData}
                handleOpenAIWriteModal={handleOpenAIWriteModal}
                handleOpenSolutionModal={handleOpenSolutionModal}
              />
            ) : (<>
              {/* <HistoryAndReportCard /> */}
              <Card className="h-100">
                <CardBody>
                  <div className="d-block text-center">
                    <span className="text-white">Create your custom compliance control (CCF)</span>
                    <div className="buttons mt-2">
                      <button type="button" className="btnprimary" onClick={() => navigate(`/admin/compliance-builder`)}>
                        Go to CCF
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </>)}
          </div>
        </Col>
      </Row>

      <AIPromptWriteModal
        isOpen={openAIWriteModal}
        selectedControl={selectedControl}
        closeModal={closeAiWriteModal}
        handleUpdateDescription={handleUpdateDescription}
      />

      <SelectSolutionTool
        open={openSolutionModal}
        controlItemData={selectedControl}
        closeModal={closeSolutionModal}
        handleUpdateToolIcons={handleUpdateToolIcons}
      />
    </div>
  )
}

export default ResilienceIndex;
