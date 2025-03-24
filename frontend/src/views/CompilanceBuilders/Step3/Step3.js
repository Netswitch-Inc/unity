/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useCallback } from "react";

import { Col, UncontrolledTooltip } from "reactstrap";

import { complianceTools } from "views/sampleData/ComplianceControlData";

import RenderToolsModal from "./model/toolsModal";
import iIcon from "assets/img/cis-icon.png";
import PenTsting from "../../../assets/img/toollogo/Pen-Testing.png";
import Loc from "../../../assets/img/toollogo/image_592.png";
import VA from "../../../assets/img/toollogo/image_593.png";
import SIEM from "../../../assets/img/toollogo/SIEM.png";

const Step3 = React.forwardRef((props, ref) => {
  const ToolsArray = [
    { icon: "PENTEST", path: PenTsting, fullName: "Penetration Testing" },
    { icon: "SIEM", path: SIEM, fullName: "Security Information and Event Management" },
    { icon: "LOC", path: Loc, fullName: "Log Collector" },
    { icon: "VA", path: VA, fullName: "Vulnerability Assessment" }
  ];

  const [openSiemModal, setOpenSiemModal] = React.useState(false);
  const [selectedToolIndex, setSelectedToolIndex] = React.useState(null);
  const [controlsLimit] = useState(5);

  const handleToggleModal = (i) => {
    setOpenSiemModal(!openSiemModal);
  };

  const handleReturnIcon = (givenIcon) => {
    return ToolsArray.find((icon) => icon.icon === givenIcon)?.path || "";
  };

  const handleReturnIconFullName = (givenIcon) => {
    return ToolsArray.find((icon) => icon.icon === givenIcon)?.fullName || "";
  };

  const [selectedControls, setSelectedControls] = useState([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [visibleControls, setVisibleControls] = useState([]);  // Controls that are currently visible

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

  React.useImperativeHandle(ref, () => ({
    isValidated: () => selectedControls?.length > 0 && selectedFrameworks?.length > 0 ? true : false
  }));

  const handleToolModel = (toolIcon) => {
    const index = complianceTools.findIndex((item) => item.logoPath === toolIcon)
    setSelectedToolIndex(index);
    setOpenSiemModal(true);
  }

  const loadMoreControls = useCallback(() => {
    if (visibleControls.length < selectedControls.length) {
      const newControls = selectedControls.slice(visibleControls.length, visibleControls.length + controlsLimit);
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
  }, [loadMoreControls]);

  const observerOptions = {
    rootMargin: "100px",
    threshold: 1.0
  }

  const observerRef = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleIntersection, visibleControls]);

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
                        src={iIcon}
                        height={17}
                        id={`tooltip-icon-${item?._id}`}
                        className="i-icon-img"
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
                    {item?.identifier && <span className="second-frame"> {item?.identifier}</span>}
                  </div>
                </div>
              </div>
            </Col>

            <Col md={6} className="cis-complinance-control-content new-cis-compliance">
              <div className="h-100">
                {item?.cis_control_id?.length ? (
                  item.cis_control_id.map((cisControl, sbInd) => (
                    <div key={`${ind}-${sbInd}`} className={item?.cis_control_id?.length === 1 ? `row h-100` : `row`}>
                      <div className="col-md-9 col-12 cis-text">
                        <div className="content-wrap">
                          <div
                            key={`${ind}-${sbInd}`}
                            className="text-content d-flex justify-content-between w-100"
                          >
                            <div className="icon-number-img pr-1" id={`complience-sub-control-${item?._id}-${sbInd}`}>
                              <div className="cis-icon" >
                                <img
                                  alt="icon"
                                  src={iIcon} height={17}
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
                              <div className="inner-desc">{cisControl.description}</div>
                            </UncontrolledTooltip>
                            <div className="number-img">
                              {cisControl?.cis_sub_control && <span className="tabletdsbtntyle text-right">
                                {cisControl?.cis_sub_control}
                              </span>}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 col-12 only-tool-content cis-text">
                        <div className="content-wrap h-100">
                          <div
                            key={`${ind}-${sbInd}`}
                            className="text-content d-flex justify-content-between w-100"
                            onClick={() => handleToolModel(cisControl.tool_icon)}
                          >
                            <div className="number-img only-tool">
                              <img
                                width={30}
                                height={30}
                                className="cursor-pointer"
                                alt={cisControl?.tool_icon}
                                src={handleReturnIcon(cisControl?.tool_icon)}
                                id={`complience-sub-control-${cisControl?._id}-image`}
                              />
                              <UncontrolledTooltip
                                placement="top"
                                target={`complience-sub-control-${cisControl?._id}-image`}
                              // container={`complience-sub-control-${cisControl?.tool_icon}`}
                              >
                                {handleReturnIconFullName(cisControl?.tool_icon)}
                              </UncontrolledTooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>
            </Col>
          </div>
        </div>
      ))
    }

    return null;
  }

  return (<>
    <div className="compliance-builder ps">
      <div className="row compliance-builder-row">
        <Col md={6} className="compliance-builder-col">
          <div className="complaince-tab">Custom Compliance Framework</div>
        </Col>
        <Col md={6} className="compliance-builder-col">
          <div className="row">
            <Col md={9}>
              <div className="complaince-tab">CIS Benchmark</div>
            </Col>
            <Col md={3}>
              <div className="complaince-tab">Tools</div>
            </Col>
          </div>
        </Col>
      </div>

      <div className="compliance-builder-content">
        {renderCISComplianceControl(visibleControls)}
        <div ref={observerRef} style={{ height: "20px", backgroundColor: "transparent" }} />
      </div>
    </div>

    {selectedToolIndex !== null ? (
      <RenderToolsModal
        isOpen={openSiemModal}
        toggle={handleToggleModal}
        data={complianceTools[selectedToolIndex]}
      />
    ) : null}
  </>)
})

export default Step3;
