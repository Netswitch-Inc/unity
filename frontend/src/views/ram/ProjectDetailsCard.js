/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState, useMemo, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { updateProject, cleanProjectMessage } from "../projects/store/index";

import {
  Col,
  Row,
  Card,
  Badge,
  Button,
  CardBody,
  FormGroup,
  CardTitle,
  CardHeader,
} from "reactstrap";

// ** Utils
import { getModulePermissionData } from "utility/Utils";

// ** Third Party Components
import Slider from "nouislider";
// import TagsInput from "components/TagsInput/TagsInput";

import { currencySign, defaultPerPageRow, superAdminRole, companyAdminRole, projectsPermissionId, governanceGroupPermissionId } from "utility/reduxConstant";

import Gauge from "./Gauge";
import Comments from "./Comments";
import Attachments from "./Attachments";
import { getHistoryList } from "./projectHistoryStore";
import Swal from "sweetalert2";


const ProjectDetailsCard = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let id = props.displayID;
  let riskData = props.data;
  const allowed = riskData?.status === 'created';

  const historyStore = useSelector((state) => state.history);
  const loginStore = useSelector((state) => state.login)
  // const projectStore = useSelector((state) => state.projects)
  const store = useSelector((state) => state.comments);

  // ** Const
  const permission = getModulePermissionData(loginStore?.authRolePermission, projectsPermissionId, governanceGroupPermissionId)

  const frameworks = riskData.framework_id?.map((framework) => framework?.label)
  const InvolvedParties = riskData.involved_parties?.map((party) => party?.user_name)

  const [likelihood, setLikelihood] = useState(riskData?.likelyhood || 0);
  const [impactAssessment, setImpactAssessment] = useState(riskData?.impact_assessment || 0)
  const [page] = useState(1);
  const [complianceTags] = useState(frameworks);
  const [partiesTags] = useState(InvolvedParties);
  const [submitTagsinput] = useState([
    riskData.submitted_by.user_name,
  ]);
  // const handleTagsinput = (complianceTags) => setComplianceTags(complianceTags);
  // const handlePartiesTagsinput = (partiesTags) => setPartiesTags(partiesTags);

  // const handleSubmitTagsinput = (submitTagsinput) =>
  //   setSubmitTagsinput(submitTagsinput);

  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);

  const callApies = async (payload) => {
    await dispatch(updateProject(payload))
    await dispatch(getHistoryList({
      project_id: id, page,
      limit: defaultPerPageRow,
    }))
    await dispatch(cleanProjectMessage())
  }

  useLayoutEffect(() => {
    dispatch(getHistoryList({
      project_id: id, page,
      limit: defaultPerPageRow,
    }))
  }, [dispatch])

  const timelineItems = useMemo(() => {
    if (!historyStore?.historyItems?.length) return null;

    return (
      <ul className="timeline timeline-simple">
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
                <p>{history.description + " " + history?.user_id?.user_name}</p>
              </div>
              {/* Uncomment if needed */}
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
    "Current",
  ];

  let pipFormats2 = [
    "Negligible",
    "Acceptable",
    "Unacceptable",
    "High",
    "Catastrophic",
  ];

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
            projectHistoryDescription: `Likelihood changed by`,
            type: 'Affected Risk',
            company_id: loginStore?.authUserItem?.company_id?._id,
            user_id: loginStore?.authUserItem?._id,
            affected_risk: ((value * impactAssessment) / 25) * 100
          }
          callApies(payload)
          setLikelihood(() => value)
        }
      });
    }

    if (slider2Ref.current) {
      createSlider2(slider2Ref, impactAssessment, async (value) => {
        const payload = {
          _id: id,
          impact_assessment: value,
          projectHistoryDescription: `Impact changed by`,
          type: 'Affected Risk',
          company_id: loginStore?.authUserItem?.company_id?._id,
          user_id: loginStore?.authUserItem?._id,
          affected_risk: ((likelihood * value) / 25) * 100
        }
        callApies(payload)
        setImpactAssessment(() => value)
      });
    }

    return () => {
      if (slider1Ref.current) slider1Ref?.current?.noUiSlider?.destroy();
      if (slider2Ref.current) slider2Ref?.current?.noUiSlider?.destroy();
    };
  }, [dispatch, likelihood, impactAssessment, riskData, id, loginStore, setLikelihood, setImpactAssessment]);

  // Handle key up events for both sliders
  // const handleKeyUp = (event, sliderRef) => {
  //   if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
  //     sliderRef.current.noUiSlider.set(sliderRef.current.noUiSlider.get()[0] + 1);
  //   } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
  //     sliderRef.current.noUiSlider.set(sliderRef.current.noUiSlider.get()[0] - 1);
  //   }
  // };

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
    // setStatusval(() => status);
    await updateProjectStatus(payload, action);
  };

  return (
    <Row>
      <Col lg="8">
        <Card>
          <Row className="align-items-center border-bottom mb-2 pb-2">
            <Col>
              <div className="d-flex align-items-center">
                <Button
                  className="btn btn-primary mb-0 mt-0"
                  onClick={(e) => props.onToggleDisplay(false)}
                >
                  <i className="tim-icons icon-minimal-left top-0" />
                </Button>
                <div className="card-header p-0">
                  <h3 className="card-title mb-0 mt-0 ml-2">{riskData?.name}</h3>
                </div>
              </div>
            </Col>

            <Col className="text-right">
              {allowed ? (<>
                <Button
                  className="btn btn-primary mb-0 mt-0"
                  onClick={() => navigate(`/admin/project/edit/${id}`)}
                >
                  Revise
                </Button>
              </>) : null}

              {(loginStore?.authUserItem?.role_id?._id === superAdminRole ||
                loginStore?.authUserItem?.role_id?._id === companyAdminRole) || permission?.update ? (<>
                  {riskData?.status === 'created' ? (<>
                    <Button
                      className="btn btn-primary mb-0 mt-0"
                      onClick={() => updateStatus({ _id: id, status: "approved" }, "created", "Approve")}
                    >
                      Approve
                    </Button>
                  </>
                  ) : null}

                  {riskData?.status === 'approved' ? (<>
                    <Button
                      className="btn btn-primary mb-0 mt-0"
                      onClick={() => updateStatus({ _id: id, status: "completed" }, "approved", "Complete")}
                    >
                      Complete
                    </Button>
                  </>) : null}

                  {riskData?.status === 'created' || riskData?.status === 'approved' ? (<>
                    <Button
                      className="btn btn-primary mb-0 mt-0"
                      onClick={() => updateStatus({ _id: id, status: "cancelled" }, "created", "Cancel")}
                    >
                      Decline
                    </Button>
                  </>) : null}
                </>) : null}
            </Col>
          </Row>

          <CardBody>
            <Row>
              <Col lg="8">
                <Row role="description">
                  <Col lg="12">
                    <FormGroup>
                      <label className="text-info">Description</label>
                      <p> {riskData?.description}</p>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>

              <Col lg="4">
                {/* Column for gauge */}
                <Gauge val={((likelihood * impactAssessment) / 25) * 100} />
              </Col>
            </Row>

            <Row>
              <Col>
                <Card className="card-plain">
                  {/* Risk Assessment */}
                  <CardHeader>Risk Assessment</CardHeader>
                  <CardBody>
                    <Row>
                      <Col lg="12">
                        {/* Column for Details */}
                        <Row role="displayName">
                          <Col>
                            <FormGroup>
                              <label className="text-info">Compliance</label>
                              <div className="react-tagsinput">
                                {/* <TagsInput
                                  onChange={handleTagsinput}
                                  tagProps={{
                                    className: "react-tagsinput-tag warning",
                                  }}
                                  value={complianceTags}
                                /> */}
                                <p className="react-tagsinput-tag warning">{complianceTags}</p>
                              </div>
                            </FormGroup>
                          </Col>

                          <Col>
                            <FormGroup>
                              <label className="text-info">
                                Involved Parties
                              </label>
                              <div className="react-tagsinput">
                                <p className="react-tagsinput-tag info">{partiesTags}</p>
                                {/* <TagsInput
                                  onChange={handlePartiesTagsinput}
                                  tagProps={{
                                    className: "react-tagsinput-tag info",
                                  }}
                                  value={partiesTags}
                                /> */}

                              </div>
                            </FormGroup>
                          </Col>

                          <Col>
                            <FormGroup>
                              <label className="text-info">
                                Cost of The Risk
                              </label>
                              <p>{currencySign}{riskData.cost_of_risk}</p>
                            </FormGroup>
                          </Col>

                          <Col>
                            <FormGroup>
                              <label className="text-info">
                                Cost of Fix Risk Ratio
                              </label>
                              <p>{currencySign}{riskData.fix_cost_risk_ratio}</p>
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col>
                            <FormGroup>
                              <label className="text-info">Submitted By</label>
                              <div className="react-tagsinput">
                                {/* <TagsInput
                                  onChange={handleSubmitTagsinput}
                                  tagProps={{
                                    className: "react-tagsinput-tag info",
                                  }}
                                  value={submitTagsinput}
                                /> */}
                                <p className="react-tagsinput-tag info">{submitTagsinput}</p>
                              </div>
                            </FormGroup>
                          </Col>

                          <Col>
                            <FormGroup>
                              <label className="text-info">
                                Affected Scope
                              </label>
                              <p>{riskData.affected_scope}</p>
                            </FormGroup>
                          </Col>

                          <Col>
                            <FormGroup>
                              <label className="text-info">Priority</label>
                              <p>{riskData.priority}</p>
                            </FormGroup>
                          </Col>

                          <Col>
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

                    <Row>
                      <Col xs={"4"}>
                        <h6>Likelihood</h6>
                        <h2 className="text-center">
                          <u>{likelihood}</u>
                        </h2>
                      </Col>

                      <Col xs={"7"}>
                        <div className="box lg">
                          <div className="slider" ref={slider1Ref}
                          />
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
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={"4"}>
                        <h6>Impact</h6>
                        <h2 className="text-center">
                          <u>{impactAssessment}</u>
                        </h2>
                      </Col>

                      <Col xs={"7"}>
                        <div className="box lg">
                          <div className="slider" ref={slider2Ref} />
                        </div>

                        <div className="hidden-mobile">
                          <div className="dropdown">
                            <select
                              aria-label="select"
                              value={impactAssessment}
                              onChange={(e) => {
                                setImpactAssessment(e?.target?.value || 0);
                              }
                              }
                              className="form-select dropbtn w-100 dropdown-toggle btn"
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
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Row>
          <Col lg="7">
            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comments ({store.commentItems?.length ? store.commentItems?.length : 0})</CardTitle>
              </CardHeader>
              <CardBody>
                <Comments />
              </CardBody>
            </Card>
          </Col>

          <Col lg="5">
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardBody>
                <Attachments />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>

      <Col lg="4">
        <Card className="card-timeline card-plain">
          <CardHeader>
            <CardTitle>Project History</CardTitle>
          </CardHeader>

          <CardBody>
            {timelineItems}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ProjectDetailsCard;
