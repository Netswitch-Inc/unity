/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { updateProject } from "../projects/store/index";

import {
  Col,
  Row,
  Card,
  Badge,
  CardBody,
  FormGroup
} from "reactstrap";

// ** Utils
import { getModulePermissionData } from "utility/Utils";

// ** Third Party Components
import Slider from "nouislider";
import Swal from "sweetalert2";
import { TiArrowLeft } from "react-icons/ti";

// ** Constant
import {
  currencySign,
  superPriviledgeType,
  adminPriviledgeType,
  projectsPermissionId,
  governanceGroupPermissionId
} from "utility/reduxConstant";

import Gauge from "./Gauge";
import Comments from "./Comments";
import Attachments from "./Attachments";

// ** Models
import AIPromptWriteModal from "views/projects/models/AIPromptWriteModal";

// ** PNG Icons
// import crgGoldenYellowLogo from "assets/img/crg-golden-yellow-logo.png";
import saraAiIcon from "assets/img/sara-ai-icon.jpeg";

const ProjectDetailsCard = (props) => {
  const navigate = useNavigate();
  let id = props.displayID;
  let riskData = props.data;

  const allowed = riskData?.status === 'created';

  const dispatch = useDispatch();
  const historyStore = useSelector((state) => state.history);
  const loginStore = useSelector((state) => state.login);
  const store = useSelector((state) => state.comments);
  const settingStore = useSelector((state) => state.globalSetting);

  // ** Const
  const permission = getModulePermissionData(loginStore?.authRolePermission, projectsPermissionId, governanceGroupPermissionId)
  const authUserItem = loginStore?.authUserItem?._id ? loginStore?.authUserItem : null;
  const appSettingItem = settingStore?.appSettingItem || null;
  const aiServiceEnabled = appSettingItem?.ai_service_enabled || false;
  const currentUserIsSuper = (authUserItem?.role_id?.priviledge === superPriviledgeType) || false;
  const currentUserIsAdmin = (authUserItem?.role_id?.priviledge === adminPriviledgeType) || false;

  const frameworks = riskData.framework_id?.map((framework) => framework?.label)
  const InvolvedParties = riskData.involved_parties?.map((party) => {
    return `${`${party?.first_name} ${party?.last_name}`?.trim()} ${party?.role_id?.name ? `(${party?.role_id?.name})` : ""}`
  })

  const [likelihood, setLikelihood] = useState(riskData?.likelyhood || 0);
  const [impactAssessment, setImpactAssessment] = useState(riskData?.impact_assessment || 0)
  const [complianceTags] = useState(frameworks);
  const [partiesTags] = useState(InvolvedParties);
  const [submitTagsinput] = useState([riskData.submitted_by.user_name]);
  const [openAIDecWriteModal, setAIDecWriteModal] = useState("");

  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);
  const leftSectionRef = useRef(null);

  const handleOpenAIDecWriteModal = (value) => {
    setAIDecWriteModal(value);
  }

  const closeAIDecWriteModal = () => {
    setAIDecWriteModal("");
  }

  const handleUpdateProject = (payload) => {
    dispatch(updateProject(payload));
  }

  const timelineItems = useMemo(() => {
    if (!historyStore?.historyItems?.length) return null;

    return (
      <ul className="timeline timeline-simple main-time-line">
        {historyStore.historyItems.map((history) => (
          <li key={history?._id} className="timeline-inverted">
            <div className="timeline-badge info">
              <i className="tim-icons icon-bag-16" />
            </div>

            <div className="timeline-panel">
              <div className="timeline-heading">
                <Badge color="info">{history.type}</Badge>
              </div>

              <div className="timeline-body">
                <p>{history.description}</p>
              </div>

              <h6>
                <i className="ti-time" />
                {history.date} by {history?.user_id?.user_name}
              </h6>
            </div>
          </li>
        ))}
      </ul>
    )
  }, [historyStore]);

  let pipFormats = [
    "Not Foreseeable",
    "Foreseeable,but unexpected",
    "Expected,but not common",
    "Common",
    "Current"
  ]

  let pipFormats2 = [
    "Negligible",
    "Acceptable",
    "Unacceptable",
    "High",
    "Catastrophic"
  ]

  // const handleUpdateDescription = useCallback(() => {
  //   if (aiPromptStore?.aiDescriptionItems?.length) {
  //     const description = aiPromptStore?.aiDescriptionItems?.[0]?.description || "";
  //     dispatch(updateProject({ _id: id, ai_description: description }));
  //   }
  // }, [dispatch, aiPromptStore.aiDescriptionItems])

  useEffect(() => {
  }, [])

  useEffect(() => {
    const createSlider = (sliderRef, startValue, onChange) => {
      allowed && Slider.create(sliderRef.current, {
        start: startValue,
        step: 1,
        range: { min: 1, max: 5 },
        tooltips: {
          to(value) {
            return pipFormats[value - 1];
          }
        }
      });

      allowed && sliderRef.current.noUiSlider.on('set', async (values) => {
        const value = parseInt(values[0], 10);
        onChange(value);
      });

    };

    const createSlider2 = (sliderRef, startValue, onChange) => {
      allowed && Slider.create(sliderRef.current, {
        start: startValue,
        step: 1,
        range: { min: 1, max: 5 },
        tooltips: {
          to(value) {
            return pipFormats2[value - 1];
          }
        }
      });

      allowed && sliderRef.current.noUiSlider.on('set', async (values) => {
        const value = parseInt(values[0], 10);
        onChange(value);
      });

    };

    if (slider1Ref.current) {
      createSlider(slider1Ref, likelihood, async (value) => {
        if (value !== riskData?.likelyhood && allowed) {
          const payload = {
            _id: id,
            likelyhood: value,
            // projectHistoryDescription: `Likelihood changed by`,
            projectHistoryDescription: `Likelihood changed`,
            type: 'Affected Risk',
            company_id: loginStore?.authUserItem?.company_id?._id,
            user_id: loginStore?.authUserItem?._id,
            affected_risk: ((value * impactAssessment) / 25) * 100
          }
          handleUpdateProject(payload)
          setLikelihood(() => value)
        }
      });
    }

    if (slider2Ref.current) {
      createSlider2(slider2Ref, impactAssessment, async (value) => {
        const payload = {
          _id: id,
          impact_assessment: value,
          // projectHistoryDescription: `Impact changed by`,
          projectHistoryDescription: `Impact changed`,
          type: 'Affected Risk',
          company_id: loginStore?.authUserItem?.company_id?._id,
          user_id: loginStore?.authUserItem?._id,
          affected_risk: ((likelihood * value) / 25) * 100
        }
        handleUpdateProject(payload)
        setImpactAssessment(() => value)
      });
    }

    return () => {
      if (slider1Ref.current) slider1Ref?.current?.noUiSlider?.destroy();
      if (slider2Ref.current) slider2Ref?.current?.noUiSlider?.destroy();
    };
  }, [dispatch, likelihood, impactAssessment, riskData, id, loginStore, setLikelihood, setImpactAssessment]);

  const updateProjectStatus = async (payload, action) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(updateProject(payload));
        Swal.fire(
          `${payload?.status.toUpperCase()}`,
          `Project is ${payload?.status}.`,
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an error while updating status.",
          "error"
        );
      }
    }
  };

  const updateStatus = async (payload, status, action) => {
    await updateProjectStatus(payload, action);
  }

  const isUserGeneratedAIDescription = () => {
    let item = null;
    const userId = authUserItem?._id || null;
    if (riskData?.users_ai_description?.length) {
      const ind = riskData.users_ai_description.findIndex((x) => x.user_id._id === userId);
      if (ind >= 0) { item = riskData.users_ai_description[ind]; }
    }

    return item;
  }

  return (
    <div className="main-risk-edit">
      <Row className="align-items-center mb-2">
        <Col lg={7} className="mb-2">
          <div className="d-flex align-items-center heading">
            <TiArrowLeft
              size={30}
              className="arrow-left"
              onClick={(e) => props.onToggleDisplay(false)}
            />
            <div className="p-0">
              <h3 className="card-title mb-0 mt-0 ml-1">{riskData?.name}</h3>
            </div>
          </div>
        </Col>

        <Col lg={5} className="text-sm-right text-center mb-2 buttons black-btn">
          {allowed ? (<>
            <button
              className="btnprimary mb-0 mt-0 ml-2"
              onClick={() => navigate(`/admin/project/edit/${id}`)}
            >
              Revise
            </button>
          </>) : null}

          {(currentUserIsSuper || currentUserIsAdmin) || permission?.update ? (<>
            {riskData?.status === 'created' ? (<>
              <button
                className="btnprimary mb-0 mt-0 ml-2"
                onClick={() => updateStatus({ _id: id, status: "approved" }, "created", "Approve")}
              >
                Approve
              </button>
            </>) : null}

            {riskData?.status === 'approved' ? (<>
              <button
                className="btnprimary mb-0 mt-0 ml-2"
                onClick={() => updateStatus({ _id: id, status: "completed" }, "approved", "Complete")}
              >
                Complete
              </button>
            </>) : null}

            {riskData?.status === 'created' || riskData?.status === 'approved' ? (<>
              <button
                className="btnprimary mb-0 mt-0 ml-2"
                onClick={() => updateStatus({ _id: id, status: "cancelled" }, "created", "Cancel")}
              >
                Decline
              </button>
            </>) : null}
          </>) : null}
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <div ref={leftSectionRef}>
            <Row className="mb-3">
              <Col md={6}>
                <Card role="description" className="h-100 pb-0">
                  <FormGroup>
                    <label className="description">Description</label>
                    <p className="description-text"> {riskData?.description || ""}</p>
                  </FormGroup>

                  <div className="buttons d-flex justify-content-between">
                    {aiServiceEnabled && !isUserGeneratedAIDescription()?.user_id ? (
                      <button type="button" className="btnprimary mt-0" onClick={() => handleOpenAIDecWriteModal("ai-dec")}>Review with Sara</button>
                    ) : null}

                    {(riskData.users_ai_description?.length && (currentUserIsSuper || currentUserIsAdmin)) || isUserGeneratedAIDescription()?.user_id ? (
                      <img
                        alt="CRG"
                        width={20}
                        height={20}
                        title="Details"
                        className="cursor-pointer"
                        src={saraAiIcon}
                        onClick={() => handleOpenAIDecWriteModal("edit-dec")}
                      />
                    ) : null}
                  </div>

                </Card>
              </Col>

              <Col md={6} className="pl-md-0">
                {/* Column for gauge */}
                <Card className=" main-graph-dot h-100 mt-md-0 mt-2 p-0">
                  <Gauge val={((likelihood * impactAssessment) / 25) * 100} />
                </Card>
              </Col>
            </Row>

            <Row>
              <Col>
                <div>
                  <Card className="mb-3 asses-card">
                    <Row>
                      <Col lg={12}>
                        <div className="description mb-2">Risk Assessment</div>
                        {/* Column for Details */}
                        <Row role="displayName">
                          <Col className="col-6 col-md-4 col-lg-3">
                            <FormGroup className="text-lg-left">
                              <label className="text-info">Compliance</label>
                              <div className="react-tagsinput">
                                <p className="react-tagsinput-tag warning">{complianceTags}</p>
                              </div>
                            </FormGroup>
                          </Col>

                          <Col className="col-6 col-md-4 col-lg-3">
                            <FormGroup>
                              <label className="text-info">
                                Involved Parties
                              </label>
                              <div className="react-tagsinput">
                                <p className="react-tagsinput-tag info">{partiesTags}</p>
                              </div>
                            </FormGroup>
                          </Col>

                          <Col className="col-6 col-md-4 col-lg-3">
                            <FormGroup>
                              <label className="text-info">
                                Cost of The Risk
                              </label>
                              <p>{currencySign}{riskData.cost_of_risk}</p>
                            </FormGroup>
                          </Col>

                          <Col className="col-6 col-md-4 col-lg-3">
                            <FormGroup>
                              <label className="text-info">
                                Cost of Fix Risk Ratio
                              </label>
                              <p>{currencySign}{riskData.fix_cost_risk_ratio}</p>
                            </FormGroup>
                          </Col>

                          <Col className="col-6 col-md-4 col-lg-3">
                            <FormGroup className="text-lg-left">
                              <label className="text-info">Submitted By</label>
                              <div className="react-tagsinput">
                                <p className="react-tagsinput-tag info">{submitTagsinput}</p>
                              </div>
                            </FormGroup>
                          </Col>

                          <Col className="col-6 col-md-4 col-lg-3">
                            <FormGroup>
                              <label className="text-info">
                                Affected Scope
                              </label>
                              <p>{riskData.affected_scope}</p>
                            </FormGroup>
                          </Col>

                          <Col className="col-6 col-md-4 col-lg-3">
                            <FormGroup>
                              <label className="text-info">Priority</label>
                              <p>{riskData.priority}</p>
                            </FormGroup>
                          </Col>

                          <Col className="col-6 col-md-4 col-lg-3">
                            <FormGroup>
                              <label className="text-info">
                                Projected Cost to Fix
                              </label>
                              <p>{currencySign}{riskData.fix_projected_cost}</p>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>

                  <Card className="mb-3 like-impact-main">
                    <Row>
                      <Col xs={12}>
                        <h6 className="description">Likelihood</h6>
                        <div className="box lg">
                          <div className="slider" ref={slider1Ref} />
                        </div>

                        <div className="hidden-mobile">
                          <div className="dropdown">
                            <select
                              aria-label="select"
                              value={likelihood}
                              onChange={(e) => setLikelihood(e?.target?.value || 0)}
                              className="form-select dropbtn w-100 dropdown-toggle btn"
                            >
                              <option value={1}>Not Foreseeable</option>
                              <option value={2}>
                                Foreseeable,but unexpected
                              </option>
                              <option value={3}>
                                Expected,but not common!
                              </option>
                              <option value={4}>Common</option>
                              <option value={5}>Current</option>
                            </select>
                          </div>
                        </div>
                        <h2 className="text-center impact-number">
                          <u className="impact-text">{likelihood}</u>
                        </h2>
                      </Col>
                    </Row>
                  </Card>

                  <Card className="mb-3 like-impact-main">
                    <Row>
                      <Col xs={"12"}>
                        <h6 className="description">Impact</h6>
                        <div className="box lg">
                          <div className="slider" ref={slider2Ref} />
                        </div>

                        <div className="hidden-mobile">
                          <div className="dropdown">
                            <select
                              aria-label="select"
                              value={impactAssessment}
                              className="form-select dropbtn w-100 dropdown-toggle btn"
                              onChange={(e) => setImpactAssessment(e?.target?.value || 0)}
                            >
                              <option value={1}>Negligible</option>
                              <option value={2}>Acceptable</option>
                              <option value={3}>Unacceptable</option>
                              <option value={4}>High</option>
                              <option value={5}>Catastrophic</option>
                            </select>
                            <button className="dropbtn w-100 dropdown-toggle btn">
                              Impact
                            </button>
                            <div className="dropdown-content">
                              <span>Negligible</span>
                              <span>Acceptable</span>
                              <span>Unacceptable</span>
                              <span>High</span>
                              <span>Catastrophic</span>
                            </div>
                          </div>
                        </div>
                        <h2 className="text-center impact-number">
                          <u className="impact-text">{impactAssessment}</u>
                        </h2>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                {/* Comments */}
                <Card className="main-comment-card common-comment-attach mb-0 h-100">
                  <div className="description mb-2">Comments ({store.commentItems?.length ? store.commentItems?.length : 0})</div>
                  <CardBody>
                    <Comments />
                  </CardBody>
                </Card>
              </Col>

              <Col md={6} className="pl-md-0">
                <Card className="common-comment-attach mb-0">
                  <div className="description mb-2">Attachments</div>
                  <CardBody>
                    <Attachments />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>

        <Col lg={4} className="pl-lg-0">
          <Card className="card-timeline pt-0" style={{
            maxHeight: leftSectionRef?.current?.offsetHeight > 0 ? `${leftSectionRef.current.offsetHeight}px` : "0px",
            overflow: "auto",
          }}>
            <div className="description time-history">
              Project History
            </div>

            <CardBody>{timelineItems}</CardBody>
          </Card>
        </Col>
      </Row>

      <AIPromptWriteModal
        projectId={id}
        isOpen={openAIDecWriteModal}
        closeModal={closeAIDecWriteModal}
        authUserItem={authUserItem}
        selectedProjectItem={riskData}
        currentUserIsSuper={currentUserIsSuper}
        currentUserIsAdmin={currentUserIsAdmin}
        handleGetProject={props?.handleGetProject}
        handleUpdateProject={handleUpdateProject}
        isUserGeneratedAIDescription={isUserGeneratedAIDescription}
      />
    </div>
  )
}

export default ProjectDetailsCard;
