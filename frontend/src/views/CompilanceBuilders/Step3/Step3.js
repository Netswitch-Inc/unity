/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";

import { useSelector } from "react-redux";

import { Col, UncontrolledTooltip } from "reactstrap";

import SimpleSpinner from "components/spinner/simple-spinner";

// ** Tool Icon JSON
import { solutionToolIcons } from "utility/toolIcons";

// ** Utils
import { splitWithPipe } from "utility/Utils";

// ** Icons
import infoIcon from "assets/img/info.png";
import gearIcon from "assets/img/gear.svg";

import SelectSolutionTool from "./model/SelectSolutionTool";

const Step3 = React.forwardRef((props, ref) => {
  const observerRef = React.useRef();

  const cisStore = useSelector((state) => state.cis);

  // ** States
  const [openSolutionModal, setSolutionModal] = useState(false);
  const [controlItemData, setControlItemData] = useState(null);
  const [controlsLimit] = useState(5);

  const [selectedControls, setSelectedControls] = useState([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [visibleControls, setVisibleControls] = useState([]); // Controls that are currently visible

  // ** Const
  const observerOptions = {
    rootMargin: "100px",
    threshold: 1.0,
  }

  React.useImperativeHandle(ref, () => ({
    isValidated: () => selectedControls?.length > 0 && selectedFrameworks?.length > 0 ? true : false,
    state: { visibleControls },
  }))

  const handleOpenSolutionModal = (item = null) => {
    setControlItemData(item);
    setSolutionModal(true);
  }

  const closeSolutionModal = () => {
    setSolutionModal(false);
    setControlItemData(null);
  }

  useEffect(() => {
    // scrollTop()
    setSelectedControls(
      props.wizardData["Compliance Selection"]?.selectedTiles || []
    );
    setSelectedFrameworks(
      props.wizardData["Compliance Selection"]?.selectedFrameworks || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.wizardData["Compliance Selection"]?.selectedTiles]);

  const loadMoreControls = useCallback(() => {
    if (visibleControls.length < selectedControls.length) {
      const newControls = selectedControls.slice(
        visibleControls.length,
        visibleControls.length + controlsLimit
      );
      setVisibleControls((prev) => [...prev, ...newControls]);
    }
  }, [selectedControls, visibleControls, controlsLimit]);

  useEffect(() => {
    loadMoreControls(); // Initial loading of controls
  }, [loadMoreControls, selectedControls]);

  // Intersection Observer to trigger loadMoreControls when scrolled to bottom
  const handleIntersection = useCallback((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      loadMoreControls();
    }
  }, [loadMoreControls])

  useEffect(() => {
    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleIntersection, visibleControls])

  const handleUpdateToolIcons = (item = null, icons = "") => {
    const controlItems = [...visibleControls];
    if (item?._id && icons && controlItems?.length) {
      const ind = controlItems.findIndex((x) => x._id === item?._id)
      if (ind >= 0 && controlItems[ind]) {
        controlItems[ind] = { ...visibleControls[ind], tool_icons: icons }
      }
    }

    setVisibleControls(controlItems);
  }

  const handleGetIcons = (toolIcons = "") => {
    let icons = toolIcons;
    if (toolIcons) {
      icons = splitWithPipe(toolIcons);

      if (icons?.length) {
        icons = solutionToolIcons.filter((x) => icons.includes(x.key));
      }
    }

    return icons;
  }

  const renderCISComplianceControl = (items = []) => {
    if (items && items?.length) {
      return items.map((item, ind) => (
        <div key={ind} className="cis-complinance-control mt-2">
          <div className="row justify-content-center">
            <Col md={6}>
              <div className="content-wrap h-100 control-box">
                <div className="main-table-row text-content w-100 d-flex justify-content-between">
                  <div className="tabletdstyle text-left rows-td">
                    <div className="cis-icon">
                      <img
                        alt="icon"
                        height={17}
                        src={infoIcon}
                        className="i-icon-img"
                        id={`tooltip-icon-${item?._id}`}
                      />
                      <span id={`selected-control-${ind}`}>
                        {item?.name || ""}
                      </span>
                    </div>
                    <UncontrolledTooltip
                      placement="right"
                      target={`tooltip-icon-${item?._id}`}
                      container={`selected-control-${ind}`}
                    >
                      <div className="inner-desc">{item.description}</div>
                    </UncontrolledTooltip>
                  </div>

                  <div className="tabletdsbtntyle text-right rows-td">
                    <span>{item?.framework_name || ""}</span>
                    {item?.identifier && (
                      <span className="second-frame"> {item?.identifier}</span>
                    )}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} className="cis-complinance-control-content new-cis-compliance">
              <div className="row h-100">
                <div className="col-md-9 col-12 cis-text">
                  <div className="content-wrap">
                    {item?.cis_control_id?.length ? (
                      item.cis_control_id.map((cisControl, sbInd) => (
                        <div
                          key={`${ind}-${sbInd}`}
                          className="text-content d-flex justify-content-between w-100"
                        >
                          <div
                            className="icon-number-img pr-1"
                            id={`complience-sub-control-${item?._id}-${sbInd}`}
                          >
                            <div className="cis-icon">
                              <img
                                alt="icon"
                                height={17}
                                src={infoIcon}
                                className="cursor-pointer"
                                id={`tooltip-icons-${item?._id}-${sbInd}`}
                              />
                              <p>{cisControl?.name || ""}</p>
                            </div>
                          </div>
                          <UncontrolledTooltip
                            placement="auto"
                            target={`tooltip-icons-${item?._id}-${sbInd}`}
                            container={`complience-sub-control-${item?._id}-${sbInd}`}
                          >
                            <div className="inner-desc">
                              {cisControl.description}
                            </div>
                          </UncontrolledTooltip>
                          <div className="number-img">
                            {cisControl?.cis_sub_control && (
                              <span className="tabletdsbtntyle text-right">
                                {cisControl?.cis_sub_control}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : null}
                  </div>
                </div>

                <div className="col-md-3 col-12 only-tool-content cis-text">
                  <div className="content-wrap h-100 d-block">
                    <div className="text-center" onClick={() => handleOpenSolutionModal(item)}>
                      <div className="main-only-tool">
                        {handleGetIcons(item?.tool_icons)?.length ? (
                          handleGetIcons(item.tool_icons).map((toolItem, tInd) => (
                            <div key={`tool-icons-${item?._id}-${ind}-${tInd}`} className="only-tool">
                              <img
                                width={30}
                                height={30}
                                alt={toolItem?.value}
                                src={toolItem?.source}
                                className="cursor-pointer mb-md-2"
                                id={`tool-icon-${item?._id}-${ind}-${tInd}`}
                              />
                              <UncontrolledTooltip
                                placement="top"
                                target={`tool-icon-${item?._id}-${ind}-${tInd}`}
                              // container={`complience-sub-control-${item?.tool_icons}`}
                              >
                                {toolItem?.value}
                              </UncontrolledTooltip>
                            </div>
                          ))
                        ) : (
                          <div className="only-tool">
                            <img
                              width={30}
                              height={30}
                              alt={"Tool"}
                              src={gearIcon}
                              className="cursor-pointer mb-md-2"
                              id={`gear-icon-${item?._id}-${ind}`}
                            />
                            <UncontrolledTooltip
                              placement="top"
                              target={`gear-icon-${item?._id}-${ind}`}
                            // container={`complience-sub-control-${item?.tool_icons}`}
                            >
                              Select Solution
                            </UncontrolledTooltip>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </div>
        </div>
      ))
    }

    return null;
  }

  return (<>
    {!cisStore?.loading ? (<SimpleSpinner />) : null}

    <div className="compliance-builder ps">
      <div className="row compliance-builder-row">
        <Col md={6} className="compliance-builder-col">
          <div className="complaince-tab">Custom Compliance Framework (CCF)</div>
        </Col>

        <Col md={6} className="compliance-builder-col">
          <div className="row">
            <Col md={9}>
              <div className="complaince-tab">CIS Benchmark: Sub-Controls</div>
            </Col>

            <Col md={3}>
              <div className="complaince-tab">Solution</div>
            </Col>
          </div>
        </Col>
      </div>

      <div className="compliance-builder-content">
        {renderCISComplianceControl(visibleControls)}
        <div
          ref={observerRef}
          style={{ height: "20px", backgroundColor: "transparent" }}
        />
      </div>
    </div>

    <SelectSolutionTool
      open={openSolutionModal}
      controlItemData={controlItemData}
      closeModal={closeSolutionModal}
      handleUpdateToolIcons={handleUpdateToolIcons}
    />
  </>)
})

export default Step3;
