/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { createProject } from "./store";
import { getCompanyList } from "views/companies/store";
import { getUserList } from "views/users/store";
import { getFrameworkList } from "views/CompilanceBuilders/store";

// ** Reactstrap Imports
import { Card, CardBody, FormFeedback } from "reactstrap";
import { Row, Col, Form as BootstrapForm } from "react-bootstrap";
import Select from "react-select";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// ** Utils
import { getModulePermissionData } from "utility/Utils";

// ** Custom Components
import SimpleSpinner from "components/spinner/simple-spinner";

// ** Third Party Components
import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

// ** Constant
import {
  priority,
  initialProject,
  superAdminRole,
  projectsPermissionId,
  governanceGroupPermissionId,
} from "utility/reduxConstant";

const AddProject = () => {
  // ** Hooks
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const complienceStore = useSelector((state) => state.compilance);
  const companyStore = useSelector((state) => state.company);
  const loginStore = useSelector((state) => state.login);
  const store = useSelector((state) => state.projects);
  const userStore = useSelector((state) => state.user);

  const from = location?.state?.from || "";
  const controlItemData = location?.state?.control_data || null;
  // const queryParams = new URLSearchParams(location?.search);
  // const controlId = queryParams.get("control_id");

  // ** Const
  const permission = getModulePermissionData(loginStore?.authRolePermission, projectsPermissionId, governanceGroupPermissionId)
  const authUser = loginStore?.authUserItem;

  // ** States
  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");
  const [frameworkList, setFrameworkList] = useState([]);
  const [involvedParties, setInvolvedParties] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [companyVal, setCompanyVal] = useState({ label: "", value: "" });
  const [initialProjectValue, setInitialProjectValue] = useState(initialProject);

  useEffect(() => {
    if (!permission?.create) {
      navigate(`/admin/dashboard`);
    }
  }, [permission]);

  useEffect(() => {
    if (controlItemData) {
      setInitialProjectValue((prev) => ({
        ...prev,
        name: controlItemData.name || "", // Ensure name has a default value
        description: controlItemData.description || "", // Ensure description has a default value
        framework_id: controlItemData.framework_id ? [{ label: controlItemData.framework_id.label, value: controlItemData.framework_id._id }] : [],
      }))
    }
  }, [controlItemData]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    framework_id: Yup.array().of(Yup.object().required("Compliance is required."))
      .min(1, "At least one compliance must be selected."),
    company_id: Yup.object().when([], {
      is: () => companiesList.length > 0, // Only validate if Location has options
      then: () => Yup.object().required("Company is required to get involved party options.")
    }),
    involved_parties: Yup.array().of(Yup.object().required("Involved parties are required.")).when([], {
      is: () => involvedParties.length > 0, // Only validate if involvedParties has options
      then: () => Yup.array().min(1, "At least one involved party must be selected")
    }),
    description: Yup.string().required("Description is required."),
    cost_of_risk: Yup.number().min(0, "Cost of risk must be a positive number.")
      .required("Cost of risk is required."),
    fix_cost_risk_ratio: Yup.number().min(0, "Fix cost risk ratio must be a positive number.")
      .required("Fix cost risk ratio is required."),
    affected_scope: Yup.string().required("Affected scope is required."),
    priority: Yup.object().required("Priority is required."),
    fix_projected_cost: Yup.number().min(0, "Fix projected cost must be a positive number.")
      .required("Fix projected cost is required.")
  });

  const handleBack = useCallback(() => {
    if(from === "resilience" && controlItemData) {
      navigate(`/admin/resilience-index`, { state: { control_data: controlItemData } })
    } else {
      navigate("/admin/risk-assessment")
    }
  }, [navigate, controlItemData, from])

  useLayoutEffect(() => {
    dispatch(getFrameworkList());
    if (authUser?.role_id?._id === superAdminRole) {
      dispatch(getCompanyList());
    }

    if (authUser?.company_id?._id) {
      dispatch(getUserList({ company_id: loginStore?.authUserItem?.company_id?._id }))
    }
  }, [dispatch]);

  useEffect(() => {
    if (!loginStore?.authUserItem?.company_id?._id &&
      companyVal?.value !== "") {
      dispatch(getUserList({ company_id: companyVal?.value }));
    }
  }, [companyVal]);

  useEffect(() => {
    if (complienceStore.frameworkItems?.length > 0) {
      const list = complienceStore.frameworkItems?.map((item) => ({
        label: item.label,
        value: item._id
      }))

      setFrameworkList(() => list);
    }

    if (userStore?.userItems?.length > 0) {
      const list = userStore?.userItems?.map((item) => ({
        // label: item?.user_name,
        label: `${`${item?.first_name} ${item?.last_name}`?.trim()} ${item?.role_id?.name ? `(${item?.role_id?.name})` : ""}`,
        value: item?._id
      }))

      setInvolvedParties(() => list);
    }

    if (companyStore?.companyItems?.length > 0) {
      const list = companyStore?.companyItems?.map((item) => ({
        label: item?.name,
        value: item?._id,
      }))

      setCompaniesList(() => list);
    }
  }, [complienceStore.frameworkItems, userStore?.userItems, companyStore?.companyItems]);

  useEffect(() => {
    if (store?.actionFlag === "PRJCT_CRTD_SCS") {
      setTimeout(() => { handleBack() }, 2000);
    }

    if (store.success) {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
    }

    if (store.error) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [handleBack, store?.actionFlag, store.success, store.error]);

  useEffect(() => {
    setTimeout(() => {
      setshowSnackbar(false);
    }, 6000);
  }, [showSnackBar])

  const onSubmit = (values) => {
    const payload = { ...values };
    payload.submitted_by = authUser?._id;
    payload.user_id = authUser?._id;
    payload.company_id = authUser?.company_id ? authUser?.company_id?._id : companyVal?.value;
    // payload.affected_risk = (Number(payload?.likelyhood) * Number(payload?.impact_assessment) / 25) * 100
    // payload.impact_assessment = Number(payload?.impact_assessment)
    // payload.likelyhood = Number(payload?.likelyhood)
    payload.involved_parties = payload?.involved_parties?.length > 0 ? payload?.involved_parties?.map((parties) => parties?.value) : [authUser?._id];
    payload.framework_id = payload?.framework_id?.map((framework) => framework?.value)
    payload.priority = payload?.priority?.value;
    payload.status = "created";

    if (controlItemData?.cis_control_id) {
      payload.cis_control_id = controlItemData?.cis_control_id;
    }

    if (controlItemData?.company_compliance_control_id) {
      payload.company_compliance_control_id = controlItemData?.company_compliance_control_id;
    }

    dispatch(createProject(payload));
  }

  return (<>
    <div className="content project-add-edit-content">
      {showSnackBar && (
        <ReactSnackBar Icon={
          <span><TiMessages size={25} /></span>
        } Show={showSnackBar}>
          {snakebarMessage}
        </ReactSnackBar>
      )}

      {!store?.loading ? (<SimpleSpinner />) : null}

      <Row>
        <Col>
          <Card>
            <CardBody className="pl-0 pr-0 mt-2">
              <Formik
                initialValues={initialProjectValue}
                enableReinitialize={initialProjectValue}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
                  <Form>
                    <Row>
                      <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                        <BootstrapForm.Label className="col-label">Name</BootstrapForm.Label>
                        <Field
                          type="text"
                          name="name"
                          className="col-input w-100"
                        />
                        {errors.name && touched.name && (
                          <FormFeedback className="d-block">{errors?.name}</FormFeedback>
                        )}
                      </Col>

                      {companiesList?.length > 0 && (
                        <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridLocationName" className="full-width">
                          <BootstrapForm.Label className="col-label">Location</BootstrapForm.Label>
                          {companiesList && (
                            <Select
                              name="company_id"
                              className="react-select col-select w-100"
                              classNamePrefix="react-select"
                              placeholder="Select Location..."
                              options={companiesList}
                              onBlur={() => setFieldTouched("company_id", true)}
                              onChange={(selectedOption) => {
                                setFieldValue("company_id", selectedOption);
                                setCompanyVal(selectedOption); // Update the company value
                                setFieldValue("involved_parties", []);
                              }}
                            />
                          )}
                          {errors.company_id && touched.company_id && (
                            <FormFeedback className="d-block">{errors?.company_id}</FormFeedback>
                          )}
                        </Col>
                      )}

                      <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                        <BootstrapForm.Label className="col-label">Compliance</BootstrapForm.Label>
                        {frameworkList && (
                          <Select
                            isMulti
                            name="framework_id"
                            options={frameworkList}
                            value={values?.framework_id}
                            classNamePrefix="react-select"
                            placeholder="Select Compliance..."
                            className="react-select col-select w-100"
                            onBlur={() => setFieldTouched("framework_id", true)}
                            onChange={(secVal) => setFieldValue("framework_id", secVal)}
                          />
                        )}
                        {errors.framework_id && touched.framework_id && (
                          <FormFeedback className="d-block">{errors?.framework_id}</FormFeedback>
                        )}
                      </Col>

                      <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridLastName" className="full-width">
                        <BootstrapForm.Label className="col-label">Involved Parties</BootstrapForm.Label>
                        {involvedParties && (
                          <Select
                            isMulti
                            name="involved_parties"
                            options={involvedParties}
                            classNamePrefix="react-select"
                            value={values?.involved_parties}
                            placeholder="Select Involved Parties..."
                            className="react-select col-select w-100"
                            onBlur={() => setFieldTouched("involved_parties", true)}
                            onChange={(secVal) => setFieldValue("involved_parties", secVal)}
                          />
                        )}
                        {errors.involved_parties && touched.involved_parties && (
                          <FormFeedback className="d-block">{errors?.involved_parties}</FormFeedback>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col xl={12} lg={6} as={BootstrapForm.Group} controlId="formGridLastName" className="full-width">
                        <BootstrapForm.Label className="col-label">Description</BootstrapForm.Label>
                        <Field
                          rows="3"
                          as="textarea"
                          name="description"
                          className="col-input w-100"
                        />
                        {errors.description && touched.description && (
                          <FormFeedback className="d-block">{errors?.description}</FormFeedback>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridContactNumber" className="full-width">
                        <BootstrapForm.Label className="col-label">Cost Of Risk</BootstrapForm.Label>
                        <Field
                          type="number"
                          name="cost_of_risk"
                          className="col-input w-100"
                        />
                        {errors.cost_of_risk && touched.cost_of_risk && (
                          <FormFeedback className="d-block">{errors?.cost_of_risk}</FormFeedback>
                        )}
                      </Col>

                      <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                        <BootstrapForm.Label className="col-label">Fix Cost Risk Ratio</BootstrapForm.Label>
                        <Field
                          type="number"
                          name="fix_cost_risk_ratio"
                          className="col-input w-100"
                        />
                        {errors.fix_cost_risk_ratio && touched.fix_cost_risk_ratio && (
                          <FormFeedback className="d-block">{errors?.fix_cost_risk_ratio}</FormFeedback>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                        <BootstrapForm.Label className="col-label">Affected Scope</BootstrapForm.Label>
                        <Field
                          type="text"
                          name="affected_scope"
                          className="col-input w-100"
                        />
                        {errors.affected_scope && touched.affected_scope && (
                          <FormFeedback className="d-block">{errors?.affected_scope}</FormFeedback>
                        )}
                      </Col>

                      <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                        <BootstrapForm.Label className="col-label">Priority</BootstrapForm.Label>
                        {priority && (
                          <Select
                            name="priority"
                            classNamePrefix="react-select"
                            placeholder="Select Priority..."
                            //   value={values?.framework_id}
                            options={priority}
                            className="react-select info col-select w-100"
                            onChange={(secVal) => setFieldValue("priority", secVal)}
                          />
                        )}
                        {errors.priority && touched.priority && (
                          <FormFeedback className="d-block">{errors?.priority}</FormFeedback>
                        )}
                      </Col>

                      <Col xl={6} lg={6} as={BootstrapForm.Group} controlId="formGridFirstName" className="full-width">
                        <BootstrapForm.Label className="col-label">Fix Projected Cost</BootstrapForm.Label>
                        <Field
                          type="number"
                          name="fix_projected_cost"
                          className="col-input w-100"
                        />
                        {errors.fix_projected_cost && touched.fix_projected_cost && (
                          <FormFeedback className="d-block">{errors?.fix_projected_cost}</FormFeedback>
                        )}
                      </Col>
                    </Row>

                    {/* <Row>
                      <Col md={4}>
                        <FormGroup>
                          <label>Likelyhood</label>
                          <Field name="likelyhood">
                            {({ field }) => (
                              <>
                                <input
                                  type="range"
                                  {...field}
                                  min="1"
                                  max="5"
                                  step="1"
                                  className="form-range w-100"
                                  onChange={(e) =>
                                    setFieldValue("likelyhood", e.target.value)
                                  }
                                // value={pipFormats[field?.value]}
                                />
                                <div className="d-flex justify-content-between">
                                  <span>1</span>
                                  {pipFormats[field?.value - 1]}
                                  <span>5</span>
                                </div>
                                <ErrorMessage
                                  name="likelyhood"
                                  component="div"
                                  style={{ color: "red" }}
                                />
                              </>
                            )}
                          </Field>
                        </FormGroup>
                      </Col>

                      <Col md={4}>
                        <FormGroup>
                          <label>
                            Impact Assessment
                          </label>
                          <Field name="impact_assessment">
                            {({ field }) => (
                              <>
                                <input
                                  type="range"
                                  {...field}
                                  min="1"
                                  max="5"
                                  step="1"
                                  className="form-range w-100"
                                  onChange={(e) =>
                                    setFieldValue(
                                      "impact_assessment",
                                      e.target.value
                                    )
                                  }

                                />
                                <div className="d-flex justify-content-between">
                                  <span>1</span>
                                  {pipFormats2[field?.value - 1]}
                                  <span>5</span>
                                </div>
                                <ErrorMessage
                                  name="impact_assessment"
                                  component="div"
                                  style={{ color: "red" }}
                                />
                              </>
                            )}
                          </Field>
                        </FormGroup>
                      </Col>
                    </Row> */}

                    <div className="buttons">
                      <button
                        type="submit"
                        className="btnprimary"
                        disabled={isSubmitting}
                      >
                        Submit
                      </button>

                      <button
                        type="button"
                        className="btnsecondary ml-3"
                        onClick={() => handleBack()}
                      >
                        Back
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  </>)
}

export default AddProject;
