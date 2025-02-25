/* eslint-disable array-callback-return */

import React, { useState, useEffect, useRef, useCallback } from "react";

import { Col, Table, UncontrolledTooltip } from "reactstrap";

import { TiMediaRecord } from "react-icons/ti";
import { scrolTop } from "utility/Utils";

import SimpleSpinner from "components/spinner/simple-spinner";

const Step2 = React.forwardRef((props, ref) => {
  const [selectedControls, setSelectedControls] = useState([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for initial data load
  const [visibleControls, setVisibleControls] = useState([]); // Visible controls for lazy loading
  const observer = useRef(null); // Intersection observer reference

  // useEffect to initialize the selected controls and frameworks
  useEffect(() => {
    if (props.wizardData["Compliance Selection"]) {
      setSelectedControls(props.wizardData["Compliance Selection"].selectedTiles || []);
      setSelectedFrameworks(props.wizardData["Compliance Selection"].selectedFrameworks || []);
    }
    setLoading(false); // Set loading to false once data is loaded
  }, [props.wizardData]);

  // Expose validation to parent component
  React.useImperativeHandle(ref, () => ({
    isValidated: () => {
      return selectedControls.length > 0 && selectedFrameworks.length > 0;
    },
  }));

  // Load visible controls based on scroll position
  useEffect(() => {
    if (selectedControls.length > 0) {
      setVisibleControls(selectedControls.slice(0, 10)); // Initially load 10 items
    }
  }, [selectedControls]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrolTop();
    }, 0); // delay in ms, 0 ensures it’s called right after the render

    return () => clearTimeout(timeoutId); // Cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.wizardData]);

  // Handle infinite scroll (loading more data as user scrolls)
  const handleLoadMore = useCallback((entries) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
      const currentLength = visibleControls.length;
      const moreControls = selectedControls.slice(currentLength, currentLength + 10); // Load next 10 items
      setVisibleControls((prev) => [...prev, ...moreControls]);
    }
  }, [selectedControls, visibleControls])

  // Set up the intersection observer when the component mounts
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(handleLoadMore, options);

    const loadMoreRef = document.getElementById("load-more");
    if (loadMoreRef) {
      observer.current.observe(loadMoreRef); // Observe the "load more" element
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect(); // Clean up observer
      }
    };
  }, [handleLoadMore, visibleControls]);

  // Render the CIS Compliance Controls
  const renderCISComplianceControl = (items = []) => {
    if (!Array.isArray(items) || items.length === 0) {
      return <SimpleSpinner />;
    }

    return items.map((item, ind) => (
      <div key={ind} className="cis-complinance-control mt-2 h-100">
        <div className="row justify-content-center">
          <Col md={6}>
            <div className="content-wrap h-100">
              <Table className="mb-0 h-100">
                <tbody>
                  <tr>
                    <td className="tabletdstyle text-left">
                      <span id={`selected-control-${item?._id}`}>
                        {item?.name || "No Name"}
                        <UncontrolledTooltip
                          placement="top"
                          target={`selected-control-${item?._id}`}
                          container={`selected-control-${item?._id}`}
                        >
                          <div className="inner-desc">{item.description || "No Description"}</div>
                        </UncontrolledTooltip>
                      </span>
                    </td>
                    {/* <td className="tabletdsbtntyle text-right">
                      <span> {item?.identifier}</span>
                    </td> */}
                    <td className="tabletdsbtntyle text-right">
                      {item?.identifier && <span className="mb-2"> {item?.identifier}</span>}
                      <span>{item?.framework_name || "No Framework"}</span>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>

          <Col md={6} className="cis-complinance-control-content">
            <div className="content-wrap h-100">
              {item?.cis_control_id?.length ? (
                item.cis_control_id.map((cisControl, sbInd) => (
                  <div key={`${ind}-${sbInd}`} className="text-content w-100 d-flex justify-content-between">
                    <div className="pr-1" id={`complience-sub-control-${cisControl?._id}`}>
                      <TiMediaRecord size={20} color="#fff" />
                      <span>{cisControl?.name || "Sub-control Name"}</span>

                      <UncontrolledTooltip
                        placement="auto"
                        target={`complience-sub-control-${cisControl?._id}`}
                        container={`complience-sub-control-${cisControl?._id}`}
                      >
                        <div className="inner-desc">{cisControl.description || "No Description"}</div>
                      </UncontrolledTooltip>
                    </div>
                    {cisControl?.cis_sub_control && <div className="number-img">
                      <span className="tabletdsbtntyle text-right">
                        {cisControl?.cis_sub_control}
                      </span>
                    </div>}
                    {/* <img
                      height={30}
                      width={30}
                      id={`complience-sub-control-${cisControl?._id}-image`}
                      src={handleReturnIcon(cisControl.tool_icon)}
                      alt={cisControl.tool_icon || "Tool Icon"}
                    />
                    <UncontrolledTooltip
                      placement="auto"
                      target={`complience-sub-control-${cisControl?._id}-image`}
                    >
                      {handleReturnIconFullName(cisControl?.tool_icon)}
                    </UncontrolledTooltip> */}

                  </div>
                ))
              ) : (
                <div>No Sub-controls available.</div>
              )}
            </div>
          </Col>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="compliance-builder">
        <div className="row">
          <Col md={6}>
            <div className="complaince-tab">Custom Compliance Framework</div>
          </Col>

          <Col md={6}>
            <div className="complaince-tab">CIS Benchmark</div>
          </Col>
        </div>

        {/* Show a loading spinner if the data is still loading */}
        {loading ? (
          <SimpleSpinner />
        ) : (
          renderCISComplianceControl(visibleControls)
        )}

        {/* "Load More" Element for Infinite Scroll */}
        <div id="load-more" style={{ height: "30px", textAlign: "center", marginTop: "20px" }}>
          {/* No spinner here, infinite scroll only triggers when the user scrolls */}
        </div>
      </div>
    </>
  );
});

export default Step2;