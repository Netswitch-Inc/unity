/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
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

// ** Third Party Components
// import ReactSnackBar from "react-js-snackbar";
// import { TiMessages } from "react-icons/ti";

import { GenerateRows } from "components/ComplinceControlComps/DataRows";
import SubControlCard from "components/ComplinceControlComps/SubcontrolCard";
// import HistoryAndReportCard from "components/ComplinceControlComps/HistoryGraphData";

// ** Models
import SelectSolutionTool from "views/CompilanceBuilders/Step3/model/SelectSolutionTool";

const CompilanceController = () => {
  // ** Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const rightSectionRef = useRef(null);

  const dispatch = useDispatch();
  const store = useSelector((state) => state.complincecontrol);
  const loginStore = useSelector((state) => state.login);
  const companyComplianceControlStore = useSelector((state) => state.companyComplianceControls);

  // ** Const
  const authUserItem = loginStore?.authUserItem?._id ? loginStore?.authUserItem : null;
  const routeStateData = location?.state || null;

  // ** States
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [openSolutionModal, setSolutionModal] = useState(false);
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

  useLayoutEffect(() => {
    const query = {
      company_id: authUserItem?.company_id?._id || authUserItem?.company_id || "",
      user_id: authUserItem?._id || "",
      compliance_priority_id: ""
    }

    if (controlItemData?.compliance_priority_id) {
      query.compliance_priority_id = controlItemData?.compliance_priority_id?._id || controlItemData?.compliance_priority_id;
    }

    dispatch(getCompanyComplianceControlList(query))
  }, [authUserItem, routeStateData]);

  const handleSelectedControlData = (item) => {
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
          return {
            ...item?.control_id,
            ...item?.control_id,
            project_id: item?.project_id || null,
            company_compliance_control_id: item?._id || "",
            tool_icons: item?.tool_icons || "",
            compliance_priority_id: compliancePriority?._id || ""
          }
        }) || []

        defaultControl = list2?.length ? list2[0] : null;
        if(controlItemData?._id) {
          const control = list2.find((x) => x._id === controlItemData._id) || null;
          defaultControl = control?._id ? control : defaultControl;
          setControlItemData(null);
        }
      }

      setSelectedControl(defaultControl)
      setSelectedPriority(compliancePriority)
      setPrioritiesOptions(list1)
      setComplianceControlData(list2)
    }
  }, [dispatch, companyComplianceControlStore.companyComplianceControlData, companyComplianceControlStore.actionFlag, companyComplianceControlStore.success, companyComplianceControlStore.error, controlItemData]);

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar]);

  const handleBackControl = () => {
    setSelectedControl(() => null)
  }

  const handleUpdateToolIcons = (item = null, icons = "") => {
    if (icons && item?._id && item?.company_compliance_control_id) {
      setSelectedControl({ ...item, tool_icons: icons })

      dispatch(updateCompanyComplianceControl({ _id: item.company_compliance_control_id, tool_icons: icons }));
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
                selectedPriority={selectedPriority}
                handleBackControl={handleBackControl}
                complianceControlData={complianceControlData}
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

      <SelectSolutionTool
        open={openSolutionModal}
        controlItemData={selectedControl}
        closeModal={closeSolutionModal}
        handleUpdateToolIcons={handleUpdateToolIcons}
      />
    </div>
  )
}

export default CompilanceController;
