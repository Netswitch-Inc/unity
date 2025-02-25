/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getFrameworkList, getControllerListByFrameworkId } from "../store";
import { getCompanyComplianceControlList } from "views/companyComplianceControls/store";

import { Row, Col, FormGroup, Button, UncontrolledTooltip } from "reactstrap";
import Select from "react-select";

// ** Third Party Components
import classnames from "classnames";

import "./style.css";
import { scrolTop } from "utility/Utils";

// Define Step1 as a functional component
const Step1 = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.compilance);
  const loginStore = useSelector((state) => state.login);
  const companyComplianceControls = useSelector((state) => state.companyComplianceControls)
  // const companyComplianceControlStore = useSelector((state) => state.companyComplianceControls);
  const authUserItem = loginStore?.authUserItem?._id ? loginStore?.authUserItem : null;
  const [loadFirst, setLoadFirst] = useState(false)
  // const [frameworks, setFrameworks] = useState(store?.frameworkItems);
  const [currentStep] = useState(1)
  const [compliance, setCompliance] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  // useEffect(() => {
  //   scrolTop();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.wizardData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrolTop();
    }, 0); // delay in ms, 0 ensures it’s called right after the render

    return () => clearTimeout(timeoutId); // Cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.wizardData]);


  const GenericTile = ({ header, footer, footer2, description, keyVal }) => {
    return (
      <>
        {/* <div className="tile-header">{header}</div>
        <div className="tile-footer">{footer}</div>
        <div className="tile-footer">{footer2}</div>
        {description && <UncontrolledTooltip placement="top" target={`map-tile-${keyVal}`}>
          {description}
        </UncontrolledTooltip>} */}
        <div id={`map-tile-${keyVal}`}> {/* Ensure matching id */}
          <div className="tile-header">{header}</div>
          <div className="tile-footer">
            <span>{footer}</span>
            <span>{footer2}</span>
            </div>
          {description && (
            <UncontrolledTooltip placement="auto" target={`map-tile-${keyVal}`} container={`map-tile-${keyVal}`}>
              <div className="inner-desc">{description}</div>
            </UncontrolledTooltip>
          )}
        </div>
      </>
    );
  };



  React.useImperativeHandle(ref, () => ({
    isValidated: () =>
      selectedTiles.length > 0 && compliance.length > 0 ? true : false,
    state: { selectedTiles, selectedFrameworks: compliance, currentStep: currentStep },
  }));

  useLayoutEffect(() => {
    setCompliance([])
    setTiles([])
    setSelectedTiles([])
    setAllSelected(false)
    dispatch(getCompanyComplianceControlList({
      company_id: authUserItem?.company_id?._id || authUserItem?.company_id || ""
    }));
    dispatch(getFrameworkList());
  }, [dispatch, authUserItem]);

  const handleControllerLists = useCallback((framework_id) => {
    const frameworkId = framework_id.join(",");
    const params = {
      framework_id: frameworkId,
    };

    dispatch(getControllerListByFrameworkId(params));
  }, [dispatch])

  const handleSetTiles = useCallback((complience) => {
    const filteredData = selectedTiles.filter((tile) =>
      complience.some((item) => tile?.framework_id?._id === item?._id)
    );
    setSelectedTiles(filteredData);

    if (allSelected) {
      setAllSelected(false);
    }
  }, [allSelected, selectedTiles]);

  useEffect(() => {
    if (store?.controllerItem) {
      const data =
        store?.controllerItem?.length > 0 &&
        store?.controllerItem.map((item) => ({
          ...item,
          value: item._id,
          label: item.name,
          framework_name: item.framework_id.label,
          description: item.description,
        }));
      setTiles(() => data);
    }

    if (companyComplianceControls?.companyComplianceControlList && companyComplianceControls?.companyComplianceControlList?.length > 0 && !loadFirst) {
      const selectedData = companyComplianceControls.companyComplianceControlList.map(item => ({
        ...(item?.control_id ? { ...item.control_id } : {}),
        value: item?.control_id?._id, // Example of adding or overriding properties
        label: item?.control_id?.name,
        framework_name: item?.control_id?.framework_id?.label,
        description: item?.control_id?.description
      }));

      setSelectedTiles(selectedData);


      const complienceMap = new Map();

      if (companyComplianceControls?.companyComplianceControlList && companyComplianceControls?.companyComplianceControlList.length > 0) {
        companyComplianceControls.companyComplianceControlList.forEach(item => {
          const frameworkId = item?.control_id?.framework_id?.label;
          if (frameworkId) {
            complienceMap.set(frameworkId, item?.control_id?.framework_id);
          }
        });
      }

      const complienceArr = Array.from(complienceMap.values());
      if (complienceArr && !loadFirst) {
        setCompliance(complienceArr)
        const selectedFrameworkIds = complienceArr.map(
          (element) => element._id
        );
        if (!tiles?.length) {
          handleControllerLists(selectedFrameworkIds);

        }
      }
    }
  }, [store?.controllerItem, companyComplianceControls?.companyComplianceControlList, handleControllerLists, tiles?.length]);

  useEffect(() => {
    if (store.actionFlag === "CONTROL_VIA_FRAMEWORK_ID" && store?.error) {
      setTiles([]);
      setSelectedTiles(() => []);
      setCompliance([]);
    }
  }, [store.actionFlag, store.error]);

  useEffect(() => {
    if (companyComplianceControls?.actionFlag === 'CMPN_CONTRL_LST' && companyComplianceControls?.companyComplianceControlList?.length === 0) {
      setSelectedTiles(() => []);
      setCompliance([]);
    }
  }, [companyComplianceControls?.actionFlag, companyComplianceControls?.companyComplianceControlList])

  function handleTileClick(compliance) {
    const isSelected = selectedTiles.some(
      (item) => item.value === compliance?.value
    );

    if (!isSelected) {
      setSelectedTiles((prevSelectedTiles) => [
        ...prevSelectedTiles,
        compliance,
      ]);
    } else {
      setSelectedTiles(
        selectedTiles.filter((item) => item.value !== compliance.value)
      );
    }
  }

  function generateComplianceTile(compliance, index) {
    const isComplianceSelected = selectedTiles && selectedTiles.some(
      (selected) => selected.value === compliance.value
    );
    return (
      <div
        key={compliance.value}
        className="compliance-box">
        <div
          onClick={() => handleTileClick(compliance)}
          className={classnames({
            "tile-container w-100": true,
            "selected-tile-container w-100": isComplianceSelected,
          })}
        >
          <div className="content-wrap h-100">
            <GenericTile
              header={compliance.label}
              footer={compliance.framework_name}
              footer2={compliance.identifier}
              description={compliance.description}
              keyVal={compliance.value}
            />
          </div>
        </div>
      </div>
    );
  }

  function handleSelectAll() {
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
          description: tile.description,
        };
      });

      setSelectedTiles(updatedSelectedTiles);
      setAllSelected(true);
    }
  }

  function updateComplianceTiles(selectedCompliances) {
    setLoadFirst(() => true)
    const selectedFrameworkIds = selectedCompliances.map(
      (element) => element._id
    );
    handleControllerLists(selectedFrameworkIds);
    setCompliance(() => selectedCompliances);

  }

  return (
    <>
      <h5 className="info-text ps">Let's start with the basic information.</h5>
      <Row className="justify-content-center mt-5">
        <Col sm="10" className="mb-3">
          <FormGroup>
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
        <div className="col-sm-10 mx-auto compliance-box-content">
          <Row className="complianceTilesRow">
            {tiles?.length > 0 &&
              tiles.map((compliance, index) => generateComplianceTile(compliance, index))}
          </Row>
        </div>
      ) : null}
    </>
  );
});

export default Step1;
