/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getFrameworkList, getControllerListByFrameworkId } from "../store";
import { getCompanyComplianceControlList, cleanCompanyComplianceControlMessage } from "views/companyComplianceControls/store";

import { Row, Col, FormGroup, Button, UncontrolledTooltip } from "reactstrap";
import Select from "react-select";

import { scrollTop } from "utility/Utils";
import infoIcon from "assets/img/info.png";

// ** Third Party Components
import classnames from "classnames";

// ** Modals
import SelectFramewroksModal from "../modals/SelectFramewroksModal";

// ** Styles
import "./style.css";

// Define Step1 as a functional component
const Step1 = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.compilance);
  const loginStore = useSelector((state) => state.login);
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

  const GenericTile = ({ header, footer, footer2, description, keyVal }) => {
    return (
      <div id={`map-tile-${keyVal}`}> {/* Ensure matching id */}
        <div className="tile-header">
          <img
            alt="icon"
            src={infoIcon}
            className="i-icon-img"
            id={`tooltip-icon-${keyVal}`}
          />
          <p> {header}</p>
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

  useLayoutEffect(() => {
    setCompliance([])
    setTiles([])
    setSelectedTiles([])
    setAllSelected(false)
    dispatch(getCompanyComplianceControlList({
      company_id: authUserItem?.company_id?._id || authUserItem?.company_id || "",
      user_id: authUserItem?._id || ""
    }));
    dispatch(getFrameworkList());
  }, [dispatch, authUserItem]);

  const handleControllerLists = useCallback((framework_id) => {
    const frameworkId = framework_id.join(",");
    const params = { framework_id: frameworkId }

    dispatch(getControllerListByFrameworkId(params));
  }, [dispatch])

  const handleSetTiles = useCallback((complience) => {
    const filteredData = selectedTiles.filter((tile) => complience.some((item) => tile?.framework_id?._id === item?._id))
    setSelectedTiles(filteredData)

    if (allSelected) {
      setAllSelected(false)
    }
  }, [allSelected, selectedTiles])

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
  }, [store?.controllerItem, store.actionFlag, companyComplianceControls.actionFlag, companyComplianceControls?.companyComplianceControlData, handleControllerLists, tiles?.length, authUserItem])

  const handleTileClick = (compliance) => {
    const isSelected = selectedTiles.some((item) => item.value === compliance?.value)
    if (!isSelected) {
      setSelectedTiles((prevSelectedTiles) => [...prevSelectedTiles, compliance])
    } else {
      setSelectedTiles(selectedTiles.filter((item) => item.value !== compliance.value))
    }
  }

  const generateComplianceTile = (item, index) => {
    const isComplianceSelected = selectedTiles && selectedTiles.some((selected) => selected.value === item.value)

    return (
      <div
        key={item.value}
        className="compliance-box">
        <div
          onClick={() => handleTileClick(item)}
          className={classnames({
            "tile-container w-100": true,
            "selected-tile-container w-100": isComplianceSelected
          })}
        >
          <div className="content-wrap h-100">
            <GenericTile
              header={item.label}
              keyVal={item.value}
              footer2={item.identifier}
              footer={item.framework_name}
              description={item.description}
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
  }

  const updateComplianceTiles = (selectedCompliances) => {
    const selectedFrameworkIds = selectedCompliances.map((element) => element._id)
    handleControllerLists(selectedFrameworkIds);
    setCompliance(() => selectedCompliances);
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
