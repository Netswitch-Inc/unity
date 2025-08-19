/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import React, { useEffect, useState, useCallback, useLayoutEffect, useRef } from "react";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { getFrameworkList, getControllerListByFrameworkId } from "../store";
import { writeDescriptionWithAI } from "views/aiPrompts/store";
import { updateControl } from "views/resilienceIndex/store";
import { getCompanyComplianceControlList, updateMultipleCompanyComplianceControl, cleanCompanyComplianceControlMessage } from "views/companyComplianceControls/store";

// ** Reactstrap Imports
import { Row, Col, FormGroup, Button, UncontrolledTooltip } from "reactstrap";
import Select from "react-select";

// ** Utils
import { scrollTop } from "utility/Utils";

// ** Third Party Components
import classnames from "classnames";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

// ** Modals
import SelectFramewroksModal from "../modals/SelectFramewroksModal";

// ** PNG Icons
import infoIcon from "assets/img/info.png";
// import crgGoldenYellowLogo from "assets/img/crg-golden-yellow-logo.png";
import saraAiIcon from "assets/img/sara-ai-icon.jpeg";

// ** Styles
import "./style.scss";

// Define Step1 as a functional component
const Step1 = React.forwardRef((props, ref) => {
  // ** Hooks
  const saraTipContainer = useRef();
  const mySwal = withReactContent(Swal);

  const dispatch = useDispatch();
  const store = useSelector((state) => state.compilance);
  const loginStore = useSelector((state) => state.login);
  const aiPromptStore = useSelector((state) => state.aiPrompt);
  const controlStore = useSelector((state) => state.complincecontrol);
  const companyComplianceControls = useSelector((state) => state.companyComplianceControls)

  // ** Const
  const authUserItem = loginStore?.authUserItem?._id ? loginStore?.authUserItem : null;

  // ** States
  const [modalOpen, setModalOpen] = useState(false)
  const [currentStep] = useState(1)
  const [compliance, setCompliance] = useState([])
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [controlAiDescItem, setControlAiDescItem] = useState(null);
  const [openSaraToolTip, setOpenSaraToolTip] = useState("");

  const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollTop();
    }, 0); // delay in ms, 0 ensures it’s called right after the render

    return () => clearTimeout(timeoutId); // Cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.wizardData]);

  const loadInitialDefaultSession = useCallback(() => {
    setCompliance([]);
    setTiles([]);
    setSelectedTiles([]);
    setAllSelected(false);
    setControlAiDescItem(null);
    setOpenSaraToolTip("");
    dispatch(getCompanyComplianceControlList({
      company_id: authUserItem?.company_id?._id || authUserItem?.company_id || "",
      user_id: authUserItem?._id || "",
      builder_session: "active"
    }));
    dispatch(getFrameworkList());
  }, [dispatch, authUserItem])

  useLayoutEffect(() => {
    loadInitialDefaultSession();
  }, [loadInitialDefaultSession]);

  const handleControllerLists = useCallback((framework_id) => {
    const frameworkId = framework_id.join(",");
    const params = { framework_id: frameworkId }

    dispatch(getControllerListByFrameworkId(params));
  }, [dispatch])

  const handleUpdateDescription = useCallback(() => {
    if (aiPromptStore?.aiDescriptionItems?.length && controlAiDescItem?._id) {
      const description = aiPromptStore?.aiDescriptionItems?.[0]?.description || "";
      setControlAiDescItem({ ...controlAiDescItem, ai_description: description });
      dispatch((updateControl({ _id: controlAiDescItem._id, ai_description: description })));
    }
  }, [dispatch, controlAiDescItem, aiPromptStore.aiDescriptionItems])

  const handleUpdateDescriptionLocally = useCallback(() => {
    const controls = [...tiles];
    if (controls?.length && controlAiDescItem?._id && controlAiDescItem?.ai_description) {
      const ind = controls.findIndex((x) => x._id === controlAiDescItem._id);
      if (ind >= 0) {
        controls[ind] = { ...controls[ind], ai_description: controlAiDescItem?.ai_description }
        setTiles(controls);
      }
    }
  }, [controlAiDescItem])

  useEffect(() => {
    if (aiPromptStore?.actionFlag === "WRT_AI_DEC_SCS") {
      handleUpdateDescription();
    }
  }, [handleUpdateDescription, aiPromptStore.actionFlag])

  useEffect(() => {
    if (controlStore?.actionFlag === "CNTRL_UPDT_SCS") {
      handleUpdateDescriptionLocally();
    }

    if (controlStore?.actionFlag === "CNTRL_UPDT_ERR") {
      setControlAiDescItem(null);
    }
  }, [handleUpdateDescriptionLocally, controlStore.actionFlag])

  const handleGetAIDescription = (item = null) => {
    if (item?._id) {
      setOpenSaraToolTip(`sara-${item._id}`)
    }

    if (item && !item?.ai_description) {
      const payload = {
        name: item?.name,
        description: item?.ai_description || item?.description || ""
      }

      if (item?.framework_id?.label) {
        payload.framework_name = item.framework_id.label;
      }

      setControlAiDescItem(item);
      dispatch(writeDescriptionWithAI(payload));
    }
  }

  const GenericTile = ({ item, header, footer, footer2, description, keyVal, isComplianceSelected }) => {
    return (
      <div id={`map-tile-${keyVal}`}>
        <div className="tile-header">
          <img
            alt="icon"
            src={infoIcon}
            className="i-icon-img"
            id={`tooltip-icon-${keyVal}`}
          />
          <p> {header}</p>

          <span className="star-icon">
            <img
              alt="CRG"
              className="i-icon-img"
              src={saraAiIcon}
              id={`ai-desc-tip-${keyVal}`}
              onClick={(event) => { event.stopPropagation(); handleGetAIDescription(item) }}
            />

            {item?.ai_description && openSaraToolTip === `sara-${item._id}` ? (
              <div
                ref={saraTipContainer}
                className="tool-tip"
                onClick={(event) => event.stopPropagation()}
              >
                <span className="w-100 d-block">{item?.ai_description}</span>

                <button
                  type="button"
                  class="text-white border rounded-pill btn-simple btn-sm btnSelect btn btn-secondary"
                  onClick={() => handleTileClick(item)}
                >
                  {isComplianceSelected ? "Unselect" : "Select"}
                </button>
              </div>
            ) : null}
          </span>
        </div>

        <div className="tile-footer">
          <span>{footer}</span>
          <span>{footer2}</span>
        </div>

        {description && (
          <UncontrolledTooltip placement="auto" target={`tooltip-icon-${keyVal}`} container={`map-tile-${keyVal}`}>
            <div className="inner-desc">{description}</div>
          </UncontrolledTooltip>
        )}
      </div>
    )
  }

  React.useImperativeHandle(ref, () => ({
    isValidated: () => selectedTiles.length > 0 && compliance.length > 0 ? true : false,
    state: { selectedTiles, selectedFrameworks: compliance, currentStep: currentStep },
  }));

  const handleSetTiles = useCallback((complience) => {
    const filteredData = selectedTiles.filter((tile) => complience.some((item) => tile?.framework_id?._id === item?._id))
    setSelectedTiles(filteredData)

    if (allSelected) {
      setAllSelected(false)
    }

    if (openSaraToolTip) {
      setOpenSaraToolTip("");
    }
  }, [allSelected, selectedTiles, openSaraToolTip])

  useEffect(() => {
    if (companyComplianceControls?.actionFlag) {
      dispatch(cleanCompanyComplianceControlMessage());
    }
  }, [companyComplianceControls.actionFlag])

  useEffect(() => {
    if (store.actionFlag === "CONTROL_VIA_FRAMEWORK_ID") {
      let list = []
      if (store?.controllerItem?.length) {
        list = store.controllerItem.map((item) => ({
          ...item,
          value: item._id,
          label: item.name,
          framework_name: item.framework_id.label,
          description: item.description
        }))
      }

      setTiles(() => list)
    }

    if (store.actionFlag === "CONTROL_VIA_FRAMEWORK_ID_ERROR") {
      setTiles([])
      setCompliance([])
      setSelectedTiles(() => [])
    }

    if (companyComplianceControls?.actionFlag === 'CCC_MNY_UPDT') {
      loadInitialDefaultSession();
    }

    if (companyComplianceControls?.actionFlag === 'CMPN_CONTRL_LST_ERR') {
      setCompliance([])
      setSelectedTiles(() => [])
    }

    if (companyComplianceControls?.actionFlag === "CMPN_CONTRL_LST") {
      if (companyComplianceControls?.companyComplianceControlData?.data?.length) {
        const selectedData = companyComplianceControls.companyComplianceControlData.data.map(item => ({
          ...(item?.control_id ? { ...item.control_id } : {}),
          value: item?.control_id?._id, // Example of adding or overriding properties
          label: item?.control_id?.name,
          framework_name: item?.control_id?.framework_id?.label,
          description: item?.control_id?.description
        }));

        setSelectedTiles(selectedData);

        const complienceMap = new Map();
        if (companyComplianceControls?.companyComplianceControlData?.data?.length > 0) {
          companyComplianceControls.companyComplianceControlData.data.forEach(item => {
            const frameworkId = item?.control_id?.framework_id?.label;
            if (frameworkId) {
              complienceMap.set(frameworkId, item?.control_id?.framework_id);
            }
          })
        }

        const complienceArr = Array.from(complienceMap.values());
        if (complienceArr) {
          setCompliance(complienceArr)
          const selectedFrameworkIds = complienceArr.map((element) => element._id)
          if (!tiles?.length) {
            handleControllerLists(selectedFrameworkIds);
          }
        }
      }
    }
  }, [loadInitialDefaultSession, store?.controllerItem, store.actionFlag, companyComplianceControls.actionFlag, companyComplianceControls?.companyComplianceControlData, handleControllerLists, tiles?.length, authUserItem])

  const handleOutsideClick = (event) => {
    if (saraTipContainer?.current && !saraTipContainer?.current?.contains(event.target)) {
      setOpenSaraToolTip("");
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [])

  const handleTileClick = (compliance) => {
    const isSelected = selectedTiles.some((item) => item.value === compliance?.value)
    if (!isSelected) {
      setSelectedTiles((prevSelectedTiles) => [...prevSelectedTiles, compliance])
    } else {
      setSelectedTiles(selectedTiles.filter((item) => item.value !== compliance.value))
    }

    if (openSaraToolTip) {
      setOpenSaraToolTip("");
    }
  }

  const generateComplianceTile = (item, index) => {
    const isComplianceSelected = selectedTiles && selectedTiles.some((selected) => selected.value === item.value)

    return (
      <div key={item.value} className="compliance-box">
        <div
          onClick={() => handleTileClick(item)}
          className={classnames({
            "tile-container w-100": true,
            "selected-tile-container w-100": isComplianceSelected
          })}
        >
          <div className="content-wrap h-100">
            <GenericTile
              item={item}
              header={item.label}
              keyVal={item.value}
              footer2={item.identifier}
              footer={item.framework_name}
              description={item.description}
              isComplianceSelected={isComplianceSelected}
            />
          </div>
        </div>
      </div>
    )
  }

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedTiles([]);
      setAllSelected(false);
    } else {
      const updatedSelectedTiles = tiles.map((tile) => {
        return {
          ...tile,
          value: tile.value,
          label: tile.label,
          framework_name: tile.framework_name,
          description: tile.description
        }
      })

      setSelectedTiles(updatedSelectedTiles);
      setAllSelected(true);
    }

    if (openSaraToolTip) {
      setOpenSaraToolTip("");
    }
  }

  const updateComplianceTiles = (selectedCompliances) => {
    const selectedFrameworkIds = selectedCompliances.map((element) => element._id)
    handleControllerLists(selectedFrameworkIds);
    setCompliance(() => selectedCompliances);
  }

  const resetCompanyComplianceControl = () => {
    mySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reset it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updateMultipleCompanyComplianceControl({
          company_id: authUserItem?.company_id?._id || authUserItem?.company_id || "",
          user_id: authUserItem?._id || "",
          builder_status: "reset"
        }));
      }
    })
  }

  return (<>
    <div className="text-center buttons mt-3">
      <button type="button" className="btnprimary" onClick={() => openModal()}>
        Select Framework
      </button>
    </div>

    <Row className="justify-content-center mt-3">
      <Col sm="12" className="mb-3">
        <FormGroup className="d-none">
          <label>Compliance</label>
          <Select
            isMulti
            value={compliance}
            name="frameworks-select"
            closeMenuOnSelect={false}
            className="react-select info"
            classNamePrefix="react-select"
            options={store?.frameworkItems || []}
            placeholder="Choose Compliance (Multiple Options)"
            onChange={(selectedCompliances) => {
              updateComplianceTiles(selectedCompliances);
              handleSetTiles(selectedCompliances)
            }}
          />
        </FormGroup>

        <FormGroup>
          {compliance?.length && tiles?.length > 0 ? (
            <Button
              id="selectAll"
              className="text-white border rounded-pill btn-simple btn-sm btnSelect float-left"
              onClick={handleSelectAll}
            >
              {allSelected ? "Unselect All" : "Select All"}
            </Button>
          ) : null}

          {companyComplianceControls?.companyComplianceControlData?.data?.length ? (
            <Button
              id="reset"
              className="text-white border rounded-pill btn-simple btn-sm btnSelect float-left"
              onClick={() => resetCompanyComplianceControl()}
            >
              Reset
            </Button>
          ) : null}

          <label className="float-right">
            {selectedTiles.length} Controls selected
          </label>
        </FormGroup>
      </Col>
    </Row>

    {compliance?.length ? (
      <div className="col-sm-12 mx-auto compliance-box-content">
        <Row className="complianceTilesRow">
          {tiles?.length ? (
            tiles.map((item, index) => generateComplianceTile(item, index))
          ) : null}
        </Row>
      </div>
    ) : null}

    <SelectFramewroksModal
      open={modalOpen}
      closeModal={closeModal}
      compliance={compliance}
      handleSetTiles={handleSetTiles}
      frameworkItems={store?.frameworkItems}
      updateComplianceTiles={updateComplianceTiles}
    />
  </>)
})

export default Step1;
