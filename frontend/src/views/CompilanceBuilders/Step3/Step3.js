/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect,useCallback } from "react";

import { Col, Table, UncontrolledTooltip } from "reactstrap";

import { TiMediaRecord } from "react-icons/ti";
import { complianceTools } from "views/sampleData/ComplianceControlData";

import RenderToolsModal from "./model/toolsModal";

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

  // React.useImperativeHandle(ref, () => ({
  //   isValidated: undefined,
  // }));

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
    // scrolTop()
    setSelectedControls(
      props.wizardData["Compliance Selection"]?.selectedTiles || []
    );
    setSelectedFrameworks(
      props.wizardData["Compliance Selection"]?.selectedFrameworks || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.wizardData["Compliance Selection"]?.selectedTiles]);

  React.useImperativeHandle(ref, () => ({
    isValidated: () =>
      selectedControls?.length > 0 && selectedFrameworks?.length > 0
        ? true
        : false,
  }));

  const handleToolModel = (toolIcon) => {
    const index = complianceTools.findIndex(
      (item) => item.logoPath === toolIcon
    );
    setSelectedToolIndex(index);
    setOpenSiemModal(true);
  };

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
  },[loadMoreControls]);

  const observerOptions = {
    rootMargin: "100px",
    threshold: 1.0,
  };

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
        <div key={ind} className="cis-complinance-control mt-2 h-100 ">
          <div className="row justify-content-center">
            <Col md={6}>
              <div className="content-wrap h-100">
                <Table className="mb-0 h-100">
                  <tbody>
                    <tr>
                      <td className="tabletdstyle text-left">
                        <span id={`selected-control-${ind}`}>
                          {item?.name || ""}
                        </span>
                        <UncontrolledTooltip
                          placement="top"
                          target={`selected-control-${ind}`}
                          container={`selected-control-${ind}`}
                        >
                          <div className="inner-desc">{item.description}</div>
                        </UncontrolledTooltip>
                      </td>
                      {/* <td className="tabletdsbtntyle text-right">
                        <span> {item?.identifier}</span>
                      </td> */}
                      <td className="tabletdsbtntyle text-right">
                        {item?.identifier && <span className="mb-2"> {item?.identifier}</span>}
                        <span>{item?.framework_name || ""}</span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col md={6} className="cis-complinance-control-content">
            {/* content-wrap */}
              <div className="h-100">
                {item?.cis_control_id?.length
                  ? item.cis_control_id.map((cisControl, sbInd) => (
                    <div className={item?.cis_control_id?.length===1?`row h-100`:`row`}>
                      <div className="col-9">
                        <div className="content-wrap">
                          <div
                            key={`${ind}-${sbInd}`}
                            className="text-content d-flex justify-content-between w-100"
                          >
                            <div className="icon-number-img pr-1">
                              {/* <TiChevronRight size={20} color="#fff" />{" "} */}
                              <TiMediaRecord size={20} color="#fff" />{" "}
                              <span id={`complience-sub-control-${item?._id}-${sbInd}`}>
                                {cisControl?.name || ""}
                              </span>
                            </div>
                            <UncontrolledTooltip
                              placement="top"
                              target={`complience-sub-control-${item?._id}-${sbInd}`}
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
                      <div className="col-md-3 only-tool-content">
                        <div className="content-wrap h-100">
                          <div
                            key={`${ind}-${sbInd}`}
                            className="text-content d-flex justify-content-between w-100"
                            onClick={() => handleToolModel(cisControl.tool_icon)}
                          >
                            <div className="number-img only-tool">
                              <img
                                height={30}
                                width={30}
                                src={handleReturnIcon(cisControl?.tool_icon)}
                                className="cursor-pointer"
                                alt={cisControl?.tool_icon}
                                id={`complience-sub-control-${cisControl?._id}-image`}
                              ></img>
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
                  : null}
              </div>
            </Col>
          </div>
        </div>
      ));
    }

    return null;
  };

  // const renderCISComplianceControl = (items = []) => {
  //   if (items && items.length) {
  //     return items.map((item, ind) => (
  //       <div key={ind} className="cis-complinance-control mt-2 h-100">
  //         <div className="row justify-content-center">
  //           <Col md={5}>
  //             <div className="content-wrap h-100">
  //               <Table className="mb-0 h-100">
  //                 <tbody>
  //                   <tr>
  //                     <td className="tabletdstyle text-left">
  //                       <span id={`selected-control-${ind}`}>
  //                         {item?.name || ""}
  //                       </span>
  //                       <UncontrolledTooltip
  //                         placement="top"
  //                         target={`selected-control-${ind}`}
  //                         container={`selected-control-${ind}`}
  //                       >
  //                         <div className="inner-desc">{item.description}</div>
  //                       </UncontrolledTooltip>
  //                     </td>
  //                     <td className="tabletdsbtntyle text-right">
  //                       {item?.identifier && (
  //                         <span className="mb-2"> {item?.identifier}</span>
  //                       )}
  //                       <span>{item?.framework_name || ""}</span>
  //                     </td>
  //                   </tr>
  //                 </tbody>
  //               </Table>
  //             </div>
  //           </Col>
  //           {item?.cis_control_id?.length
  //             ? item.cis_control_id.map((cisControl, sbInd) => (
  //                 <React.Fragment key={`${ind}-${sbInd}`}>
  //                   <Col md={5} className="cis-complinance-control-content">
  //                     <div className="content-wrap h-100">
  //                       <div
  //                         className="text-content d-flex justify-content-between w-100"
  //                         onClick={() => handleToolModel(cisControl.tool_icon)}
  //                       >
  //                         <div className="icon-number-img pr-1">
  //                           <TiMediaRecord size={20} color="#fff" />{" "}
  //                           <span id={`complience-sub-control-${sbInd}`}>
  //                             {cisControl?.name || ""}
  //                           </span>
  //                         </div>
  //                         <UncontrolledTooltip
  //                           placement="auto"
  //                           target={`complience-sub-control-${sbInd}`}
  //                           container={`complience-sub-control-${sbInd}`}
  //                         >
  //                           <div className="inner-desc">
  //                             {cisControl.description}
  //                           </div>
  //                         </UncontrolledTooltip>
  //                         <div className="number-img">
  //                           {cisControl?.cis_sub_control && (
  //                             <span className="tabletdsbtntyle text-right">
  //                               {cisControl?.cis_sub_control}
  //                             </span>
  //                           )}
  //                         </div>
  //                       </div>
  //                     </div>
  //                   </Col>

  //                   <Col md={2} className="cis-complinance-control-content">
  //                     <div className="content-wrap h-100">
  //                       <div
  //                         className="text-content d-flex justify-content-between w-100"
  //                         onClick={() => handleToolModel(cisControl.tool_icon)}
  //                       >
  //                         <div className="number-img only-tool">
  //                           <img
  //                             height={30}
  //                             width={30}
  //                             src={handleReturnIcon(cisControl?.tool_icon)}
  //                             className="cursor-pointer"
  //                             alt={cisControl?.tool_icon}
  //                             id={`complience-sub-control-${cisControl?._id}-image`}
  //                           />
  //                           <UncontrolledTooltip
  //                             placement="auto"
  //                             target={`complience-sub-control-${cisControl?._id}-image`}
  //                           >
  //                             {handleReturnIconFullName(cisControl?.tool_icon)}
  //                           </UncontrolledTooltip>
  //                         </div>
  //                       </div>
  //                     </div>
  //                   </Col>
  //                 </React.Fragment>
  //               ))
  //             : null}
  //         </div>
  //       </div>
  //     ));
  //   }
  //   return null;
  // };
  // const renderCISComplianceControl = (items = []) => {
  //   if (items && items?.length) {
  //     return items.map((item, ind) => (
  //       <div key={ind} className="cis-complinance-control mt-2 h-100 ">
  //         <div className="row justify-content-center">
  //           <Col md={6}>
  //             <div className="content-wrap h-100">
  //               <Table className="mb-0 h-100">
  //                 <tbody>
  //                   <tr>
  //                     <td className="tabletdstyle text-left">
  //                       <span id={`selected-control-${ind}`}>
  //                         {item?.name || ""}
  //                       </span>
  //                       <UncontrolledTooltip
  //                         placement="top"
  //                         target={`selected-control-${ind}`}
  //                         container={`selected-control-${ind}`}
  //                       >
  //                         <div className="inner-desc">{item.description}</div>
  //                       </UncontrolledTooltip>
  //                     </td>

  //                     <td className="tabletdsbtntyle text-right">
  //                       <span>{item?.framework_name || ""}</span>
  //                     </td>
  //                   </tr>
  //                 </tbody>
  //               </Table>
  //             </div>
  //           </Col>
  //           <Col md={6} className="cis-complinance-control-content">
  //               <div className="content-wrap h-100">

  //                 {item?.cis_control_id?.length
  //                   ? item.cis_control_id.map((cisControl, sbInd) => (
  //                       <div
  //                         key={`${ind}-${sbInd}`}
  //                         className="text-content row w-100"
  //                       // onClick={() => handleToolModel(cisControl.tool_icon)}
  //                       >
  //                         <col md={9}>
  //                           <div className="icon-number-img pr-1">
  //                             {/* <TiChevronRight size={20} color="#fff" />{" "} */}
  //                             <TiMediaRecord size={20} color="#fff" />{" "}
  //                             <span id={`complience-sub-control-${sbInd}`}>
  //                               {cisControl?.name || ""}
  //                             </span>
  //                           </div>
  //                           <UncontrolledTooltip
  //                             placement="auto"
  //                             target={`complience-sub-control-${sbInd}`}
  //                             container={`complience-sub-control-${sbInd}`}
  //                           >
  //                             <div className="inner-desc">{cisControl.description}</div>
  //                           </UncontrolledTooltip>
  //                         </col>
  //                         <col md={3}>
  //                           <div
  //                             className="text-content d-flex justify-content-between w-100"
  //                             onClick={() => handleToolModel(cisControl.tool_icon)}
  //                           >
  //                             <div className="number-img only-tool">
  //                               <img
  //                                 height={30}
  //                                 width={30}
  //                                 src={handleReturnIcon(cisControl?.tool_icon)}
  //                                 className="cursor-pointer"
  //                                 alt={cisControl?.tool_icon}
  //                                 id={`complience-sub-control-${cisControl?._id}-image`}
  //                               />
  //                               <UncontrolledTooltip
  //                                 placement="auto"
  //                                 target={`complience-sub-control-${cisControl?._id}-image`}
  //                               >
  //                                 {handleReturnIconFullName(cisControl?.tool_icon)}
  //                               </UncontrolledTooltip>
  //                             </div>
  //                           </div>

  //                         </col>
  //                       </div>

  //                   )) : null}

  //               </div>
  //           </Col>
  //         </div>
  //       </div>
  //     ));
  //   }

  //   return null;
  // };
  return (
    <>
      {/* <h5 className="info-text">Build Your Compliance Profile</h5> */}
      <div className="compliance-builder ps">
        <div className="row">
          <Col md={6}>
            <div className="complaince-tab">Custom Compliance Framework</div>
          </Col>
          <Col md={6}>
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

        {/* {renderCISGroupComplianceControl(selectedControls, selectedFrameworks)} */}
        {renderCISComplianceControl(visibleControls)}
        <div ref={observerRef} style={{ height: "20px", backgroundColor: "transparent" }}></div>
      </div>
      {selectedToolIndex !== null ? (
        <RenderToolsModal
          isOpen={openSiemModal}
          toggle={handleToggleModal}
          data={complianceTools[selectedToolIndex]}
        />
      ) : null}
    </>
  );
});

export default Step3;


// import React, { useState, useEffect, useCallback } from "react";
// import { Col, Table, UncontrolledTooltip } from "reactstrap";
// import RenderToolsModal from "./model/toolsModal";
// import { complianceTools } from "views/sampleData/ComplianceControlData";
// import { TiMediaRecord } from "react-icons/ti";
// import PenTsting from "../../../assets/img/toollogo/Pen-Testing.png";
// import Loc from "../../../assets/img/toollogo/image_592.png";
// import VA from "../../../assets/img/toollogo/image_593.png";
// import SIEM from "../../../assets/img/toollogo/SIEM.png";

// const Step3 = React.forwardRef((props, ref) => {
//   const ToolsArray = [
//     { icon: "PENTEST", path: PenTsting, fullName: "Penetration Testing" },
//     {
//       icon: "SIEM",
//       path: SIEM,
//       fullName: "Security Information and Event Management",
//     },
//     { icon: "LOC", path: Loc, fullName: "Log Collector" },
//     { icon: "VA", path: VA, fullName: "Vulnerability Assessment" },
//   ];

//   const [openSiemModal, setOpenSiemModal] = React.useState(false);
//   const [selectedToolIndex, setSelectedToolIndex] = React.useState(null);
//   const [selectedControls, setSelectedControls] = useState([]);
//   const [selectedFrameworks, setSelectedFrameworks] = useState([]);
//   const [visibleControls, setVisibleControls] = useState([]);  // Controls that are currently visible
//   const [controlsLimit, setControlsLimit] = useState(5);  // Number of controls to load initially

//   const handleToggleModal = (i) => {
//     setOpenSiemModal(!openSiemModal);
//   };

//   const handleReturnIcon = (givenIcon) => {
//     return ToolsArray.find((icon) => icon.icon === givenIcon).path;
//   };

//   const handleReturnIconFullName = (givenIcon) => {
//     return ToolsArray.find((icon) => icon.icon === givenIcon).fullName;
//   };

//   useEffect(() => {
//     // scrolTop()
//     setSelectedControls(
//       props.wizardData["Compliance Selection"]?.selectedTiles || []
//     );
//     setSelectedFrameworks(
//       props.wizardData["Compliance Selection"]?.selectedFrameworks || []
//     );
//   }, [props.wizardData["Compliance Selection"]?.selectedTiles]);

//   const handleToolModel = (toolIcon) => {
//     const index = complianceTools.findIndex(
//       (item) => item.logoPath === toolIcon
//     );
//     setSelectedToolIndex(index);
//     setOpenSiemModal(true);
//   };

//   // Lazy load more controls when user scrolls near bottom
//   const loadMoreControls = useCallback(() => {
//     if (visibleControls.length < selectedControls.length) {
//       const newControls = selectedControls.slice(visibleControls.length, visibleControls.length + controlsLimit);
//       setVisibleControls((prev) => [...prev, ...newControls]);
//     }
//   }, [selectedControls, visibleControls, controlsLimit]);

//   useEffect(() => {
//     loadMoreControls(); // Initial loading of controls
//   }, [selectedControls]);

//   // Intersection Observer to trigger loadMoreControls when scrolled to bottom
//   const handleIntersection = (entries) => {
//     const entry = entries[0];
//     if (entry.isIntersecting) {
//       loadMoreControls();
//     }
//   };

//   const observerOptions = {
//     rootMargin: "100px",
//     threshold: 1.0,
//   };

//   const observerRef = React.useRef();
  
//   useEffect(() => {
//     const observer = new IntersectionObserver(handleIntersection, observerOptions);
//     if (observerRef.current) {
//       observer.observe(observerRef.current);
//     }

//     return () => {
//       if (observerRef.current) {
//         observer.unobserve(observerRef.current);
//       }
//     };
//   }, [visibleControls]);

//   const renderCISComplianceControl = (items = []) => {
//     if (items && items.length) {
//       return items.map((item, ind) => (
//         <div key={ind} className="cis-complinance-control mt-2 h-100">
//           <div className="row justify-content-center">
//             <Col md={6}>
//               <div className="content-wrap h-100">
//                 <Table className="mb-0 h-100">
//                   <tbody>
//                     <tr>
//                       <td className="tabletdstyle text-left">
//                         <span id={`selected-control-${ind}`}>
//                           {item?.name || ""}
//                         </span>
//                         <UncontrolledTooltip
//                           placement="top"
//                           target={`selected-control-${ind}`}
//                           container={`selected-control-${ind}`}
//                         >
//                           <div className="inner-desc">{item.description}</div>
//                         </UncontrolledTooltip>
//                       </td>
//                       <td className="tabletdsbtntyle text-right">
//                         {item?.identifier && <span className="mb-2"> {item?.identifier}</span>}
//                         <span>{item?.framework_name || ""}</span>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </div>
//             </Col>
//             <Col md={6} className="cis-complinance-control-content">
//               <div className="h-100">
//                 {item?.cis_control_id?.length
//                   ? item.cis_control_id.map((cisControl, sbInd) => (
//                     <div key={`${ind}-${sbInd}`} className="row h-100">
//                       <div className="col-9">
//                         <div className="content-wrap">
//                           <div className="text-content d-flex justify-content-between w-100">
//                             <div className="icon-number-img pr-1">
//                               <TiMediaRecord size={20} color="#fff" />{" "}
//                               <span id={`complience-sub-control-${sbInd}`}>
//                                 {cisControl?.name || ""}
//                               </span>
//                             </div>
//                             <UncontrolledTooltip
//                               placement="auto"
//                               target={`complience-sub-control-${sbInd}`}
//                               container={`complience-sub-control-${sbInd}`}
//                             >
//                               <div className="inner-desc">{cisControl.description}</div>
//                             </UncontrolledTooltip>
//                             <div className="number-img">
//                               {cisControl?.cis_sub_control && <span className="tabletdsbtntyle text-right">
//                                 {cisControl?.cis_sub_control}
//                               </span>}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="col-md-3">
//                         <div className="content-wrap h-100">
//                           <div
//                             key={`${ind}-${sbInd}`}
//                             className="text-content d-flex justify-content-between w-100"
//                             onClick={() => handleToolModel(cisControl.tool_icon)}
//                           >
//                             <div className="number-img only-tool">
//                               <img
//                                 height={30}
//                                 width={30}
//                                 src={handleReturnIcon(cisControl?.tool_icon)}
//                                 className="cursor-pointer"
//                                 alt={cisControl?.tool_icon}
//                                 id={`complience-sub-control-${cisControl?._id}-image`}
//                               ></img>
//                               <UncontrolledTooltip
//                                 placement="auto"
//                                 target={`complience-sub-control-${cisControl?._id}-image`}
//                               >
//                                 {handleReturnIconFullName(cisControl?.tool_icon)}
//                               </UncontrolledTooltip>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                   : null}
//               </div>
//             </Col>
//           </div>
//         </div>
//       ));
//     }
//     return null;
//   };

//   return (
//     <>
//       <div className="compliance-builder ps">
//         <div className="row">
//           <Col md={6}>
//             <div className="complaince-tab">Custom Compliance Framework</div>
//           </Col>
//           <Col md={6}>
//             <div className="row">
//               <Col md={9}>
//                 <div className="complaince-tab">CIS Benchmark</div>
//               </Col>
//               <Col md={3}>
//                 <div className="complaince-tab">Tools</div>
//               </Col>
//             </div>
//           </Col>
//         </div>

//         {renderCISComplianceControl(visibleControls)}

//         <div ref={observerRef} style={{ height: "20px", backgroundColor: "transparent" }}></div>
//       </div>

//       {selectedToolIndex !== null ? (
//         <RenderToolsModal
//           isOpen={openSiemModal}
//           toggle={handleToggleModal}
//           data={complianceTools[selectedToolIndex]}
//         />
//       ) : null}
//     </>
//   );
// });

// export default Step3;
