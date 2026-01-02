/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getCompanyList } from "views/companies/store";
import { getFrameworkList } from "views/CompilanceBuilders/store";
import {
  getProject,
  updateProject,
  cleanProjectMessage,
  createProject,
} from "./store";
import { getUserList } from "views/users/store";

import { Card, CardBody } from "reactstrap";
import { Row, Col, Form as BootstrapForm } from "react-bootstrap";
import Select from "react-select";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// ** Utils
import { getModulePermissionData } from "utility/Utils";

import SimpleSpinner from "components/spinner/simple-spinner";

import ReactSnackBar from "react-js-snackbar";
import { TiMessages } from "react-icons/ti";

import {
  initialProject,
  priority,
  //   pipFormats,
  //   pipFormats2,
  superAdminRole,
  projectsPermissionId,
  governanceGroupPermissionId,
} from "utility/reduxConstant";

const EditProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { reCreate } = location?.state || "";

  const complienceStore = useSelector((state) => state.compilance);
  const companyStore = useSelector((state) => state.company);
  const loginStore = useSelector((state) => state.login);
  const store = useSelector((state) => state.projects);

  // ** Const
  const permission = getModulePermissionData(
    loginStore?.authRolePermission,
    projectsPermissionId,
    governanceGroupPermissionId
  );

  const [showSnackBar, setshowSnackbar] = useState(false);
  const [snakebarMessage, setSnakbarMessage] = useState("");
  const [frameworkList, setFrameworkList] = useState([]);
  const [involvedParties, setInvolvedParties] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [companyVal, setCompanyVal] = useState({ label: "", value: "" });

  const allowed =
    store.projectItem?.status === "created" ||
    (store.projectItem?.status === "cancelled" && reCreate);
  const userStore = useSelector((state) => state.user);
  const [initialProjectValue, setInitialProjectValue] =
    useState(initialProject);
  const { id } = useParams();

  const authUser = loginStore?.authUserItem;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),

    framework_id: Yup.array()
      .of(Yup.object().required("Compliance is required"))
      .min(1, "At least one compliance must be selected"),

    company_id: Yup.object().when([], {
      is: () => companiesList.length > 0, // Only validate if involvedParties has options
      then: () =>
        Yup.object().required(
          "Company is required to get involved party options"
        ),
    }),

    // involved_parties: Yup.array()
    //     .of(Yup.object().required('Involved parties are required'))
    //     .min(1, 'At least one involved party must be selected'),

    involved_parties: Yup.array()
      .of(Yup.object().required("Involved parties are required"))
      .when([], {
        is: () => involvedParties.length > 0, // Only validate if involvedParties has options
        then: () =>
          Yup.array().min(1, "At least one involved party must be selected"),
        // otherwise: Yup.array().notRequired()
      }),

    description: Yup.string().required("Description is required"),

    cost_of_risk: Yup.number()
      .min(0, "Cost of risk must be a positive number")
      .required("Cost of risk is required"),

    fix_cost_risk_ratio: Yup.number()
      .min(0, "Fix cost risk ratio must be a positive number")
      .required("Fix cost risk ratio is required"),

    affected_scope: Yup.string().required("Affected scope is required"),

    priority: Yup.object().required("Priority is required"),

    fix_projected_cost: Yup.number()
      .min(0, "Fix projected cost must be a positive number")
      .required("Fix projected cost is required"),
  });

  useEffect(() => {
    if (!permission?.update) {
      navigate(`/admin/dashboard`);
    }
  }, [permission]);

  useEffect(() => {
    const query = { id: id };
    dispatch(getProject(query));
    dispatch(cleanProjectMessage());
  }, [dispatch, id]);

  useEffect(() => {
    if (store.projectItem?._id && store.projectItem?._id === id) {
      if (!allowed) {
        navigate(`/admin/risk-assessment`);
      }
      const FrameworkArr =
        store.projectItem?.framework_id?.length > 0 &&
        store.projectItem?.framework_id.map((framework) => {
          return { label: framework?.label, value: framework?._id };
        });
      const involvedPartiesArr =
        store.projectItem?.involved_parties?.length > 0 &&
        store.projectItem?.involved_parties?.map((involved) => {
          return {
            // label: involved?.user_name,
            label: `${`${involved?.first_name} ${involved?.last_name}`?.trim()} ${involved?.role_id?.name ? `(${involved?.role_id?.name})` : ""}`,
            value: involved?._id
          };
        });
      if (authUser?.role_id?._id === superAdminRole) {
        setCompanyVal({
          label: store.projectItem.company_id?.name,
          value: store.projectItem.company_id?._id,
        });
      }
      const priorityData = priority.find(
        (item) => item?.value === store.projectItem?.priority
      );
      // const StatusData = projectStatus.find((item) => item?.value === store.projectItem?.status)
      setInitialProjectValue({
        ...store.projectItem,
        company_id: {
          label: store.projectItem.company_id?.name,
          value: store.projectItem.company_id?._id,
        },
        framework_id: FrameworkArr,
        involved_parties: involvedPartiesArr,
        priority: priorityData,
      });
    }
  }, [store.projectItem, navigate]);

  useLayoutEffect(() => {
    dispatch(getFrameworkList());
    if (authUser?.role_id?._id === superAdminRole) {
      dispatch(getCompanyList());
    }
    if (authUser?.company_id?._id)
      dispatch(
        getUserList({
          company_id: loginStore?.authUserItem?.company_id?._id,
        })
      );
  }, [dispatch]);

  useEffect(() => {
    if (
      !loginStore?.authUserItem?.company_id?._id &&
      companyVal?.value !== ""
    ) {
      dispatch(getUserList({ company_id: companyVal?.value }));
    }
  }, [companyVal]);

  useEffect(() => {
    if (complienceStore.frameworkItems?.length > 0) {
      const list = complienceStore.frameworkItems?.map((item) => ({
        label: item.label,
        value: item._id,
      }));
      setFrameworkList(() => list);
    }
    if (userStore?.userItems?.length > 0) {
      const list = userStore?.userItems?.map((item) => ({
        // label: item?.user_name,
        label: `${`${item?.first_name} ${item?.last_name}`?.trim()} ${item?.role_id?.name ? `(${item?.role_id?.name})` : ""}`,
        value: item?._id,
      }));
      setInvolvedParties(() => list);
    }
    if (companyStore?.companyItems?.length > 0) {
      const list = companyStore?.companyItems?.map((item) => ({
        label: item?.name,
        value: item?._id,
      }));
      setCompaniesList(() => list);
    }
  }, [
    complienceStore.frameworkItems,
    userStore?.userItems,
    companyStore?.companyItems,
  ]);

  useEffect(() => {
    if (
      store?.actionFlag === "PRJCT_UPDT_SCS" ||
      store?.actionFlag === "PRJCT_CRTD_SCS"
    ) {
      setshowSnackbar(true);
      setSnakbarMessage(store.success);
    }
    if (
      store?.actionFlag === "PRJCT_UPDT_ERR" ||
      store?.actionFlag === "PRJCT_CRTD_ERR"
    ) {
      setshowSnackbar(true);
      setSnakbarMessage(store.error);
    }
  }, [store?.actionFlag]);

  useEffect(() => {
    if (
      (store?.actionFlag === "PRJCT_UPDT_SCS" ||
        store?.actionFlag === "PRJCT_CRTD_SCS") &&
      showSnackBar
    ) {
      setTimeout(() => {
        setshowSnackbar(false);
        setSnakbarMessage("");
        navigate("/admin/risk-assessment");
      }, 2000);
    }

    if (
      (store?.actionFlag === "PRJCT_UPDT_ERR" ||
        store?.actionFlag === "PRJCT_CRTD_ERR") &&
      showSnackBar
    ) {
      setTimeout(() => {
        setshowSnackbar(false);
        setSnakbarMessage("");
      }, 2000);
    }
  }, [showSnackBar, store?.actionFlag]);

  const onSubmit = (values) => {
    const payload = { ...values };
    payload.submitted_by = authUser?._id;
    payload.user_id = authUser?._id;
    payload.company_id = authUser?.company_id
      ? authUser?.company_id?._id
      : companyVal?.value;
    // payload.affected_risk = (Number(payload?.likelyhood) * Number(payload?.impact_assessment) / 25) * 100
    // payload.impact_assessment = Number(payload?.impact_assessment)
    // payload.likelyhood = Number(payload?.likelyhood)
    payload.involved_parties =
      payload?.involved_parties?.length > 0
        ? payload?.involved_parties?.map((parties) => parties?.value)
        : [authUser?._id];
    payload.framework_id = payload?.framework_id?.map(
      (framework) => framework?.value
    );
    payload.priority = payload?.priority?.value;
    // payload.status = payload?.status?.value ? payload?.status?.value : payload?.status
    if (reCreate) {
      const reCreatedPayload = { ...values };
      reCreatedPayload.submitted_by = authUser?._id;
      reCreatedPayload.user_id = authUser?._id;
      reCreatedPayload.company_id = authUser?.company_id
        ? authUser?.company_id?._id
        : companyVal?.value;
      // payload.affected_risk = (Number(payload?.likelyhood) * Number(payload?.impact_assessment) / 25) * 100
      // payload.impact_assessment = Number(payload?.impact_assessment)
      // payload.likelyhood = Number(payload?.likelyhood)
      reCreatedPayload.involved_parties =
        reCreatedPayload?.involved_parties?.length > 0
          ? reCreatedPayload?.involved_parties?.map((parties) => parties?.value)
          : [authUser?._id];
      reCreatedPayload.framework_id = reCreatedPayload?.framework_id?.map(
        (framework) => framework?.value
      );
      reCreatedPayload.priority = reCreatedPayload?.priority?.value;
      reCreatedPayload.status = "created";
      dispatch(createProject(reCreatedPayload));
    } else {
      dispatch(updateProject(payload));
    }
  };
  return (
    <>
      <div className="content project-add-edit-content">
        {showSnackBar && (
          <ReactSnackBar
            Icon={
              <span>
                <TiMessages size={25} />
              </span>
            }
            Show={showSnackBar}
          >
            {snakebarMessage}
          </ReactSnackBar>
        )}
        {!store?.loading ? <SimpleSpinner /> : null}
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
                  {({ setFieldValue, values, errors, isSubmitting }) => (
                    <Form>
                      <Row>
                        <Col
                          xl={6}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">
                            Name
                          </BootstrapForm.Label>
                          <Field
                            type="text"
                            name="name"
                            className="col-input w-100"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </Col>
                        {companiesList?.length > 0 && (
                          <Col
                            xl={6}
                            lg={6}
                            as={BootstrapForm.Group}
                            controlId="formGridLocationName"
                            className="full-width"
                          >
                            <BootstrapForm.Label className="col-label">
                              Location
                            </BootstrapForm.Label>

                            {companiesList?.length > 0 && (
                              <Select
                                name="company_id"
                                className="react-select col-select w-100"
                                classNamePrefix="react-select"
                                placeholder="Select Location..."
                                options={companiesList}
                                value={values?.company_id}
                                onChange={(selectedOption) => {
                                  setFieldValue("company_id", selectedOption);
                                  setCompanyVal(selectedOption);
                                  setFieldValue("involved_parties", []);
                                }}
                              />
                            )}
                            <ErrorMessage
                              name="company_id"
                              component="div"
                              i
                              style={{ color: "red" }}
                            />
                          </Col>
                        )}
                        <Col
                          xl={6}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">
                            Compliance
                          </BootstrapForm.Label>
                          {frameworkList && (
                            <Select
                              name="framework_id"
                              className="react-select info col-select w-100"
                              classNamePrefix="react-select"
                              placeholder="Select Compliance..."
                              isMulti
                              value={values?.framework_id}
                              options={frameworkList}
                              onChange={(secVal) => {
                                setFieldValue("framework_id", secVal);
                              }}
                            />
                          )}
                          <ErrorMessage
                            name="framework_id"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </Col>

                        <Col
                          xl={6}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridLastName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">
                            Involved Parties
                          </BootstrapForm.Label>
                          {involvedParties && (
                            <Select
                              name="involved_parties"
                              className="react-select info col-select w-100"
                              classNamePrefix="react-select"
                              placeholder="Select Involved Parties..."
                              isMulti
                              options={involvedParties}
                              value={values?.involved_parties}
                              onChange={(secVal) => {
                                setFieldValue("involved_parties", secVal);
                              }}
                            />
                          )}
                          <ErrorMessage
                            name="involved_parties"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-2">
                        <Col
                          xl={12}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridLastName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">
                            Description
                          </BootstrapForm.Label>
                          <Field
                            as="textarea"
                            name="description"
                            className="col-input w-100"
                            rows="3"
                          />
                          <ErrorMessage
                            name="description"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          xl={6}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridContactNumber"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">
                            Cost Of Risk
                          </BootstrapForm.Label>
                          <Field
                            type="number"
                            name="cost_of_risk"
                            className="col-input w-100"
                          />
                          <ErrorMessage
                            name="cost_of_risk"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </Col>
                        <Col
                          xl={6}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">
                            {" "}
                            Fix Cost Risk Ratio
                          </BootstrapForm.Label>
                          <Field
                            type="number"
                            name="fix_cost_risk_ratio"
                            className="col-input w-100"
                          />
                          <ErrorMessage
                            name="fix_cost_risk_ratio"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          xl={6}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">
                            {" "}
                            Affected Scope
                          </BootstrapForm.Label>
                          <Field
                            type="text"
                            name="affected_scope"
                            className="col-input w-100"
                          />
                          <ErrorMessage
                            name="affected_scope"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </Col>
                        <Col
                          xl={6}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">
                            Priority
                          </BootstrapForm.Label>
                          {priority && (
                            <Select
                              name="priority"
                              className="react-select info col-select w-100"
                              classNamePrefix="react-select"
                              placeholder="Select Priority..."
                              value={values?.priority}
                              options={priority}
                              onChange={(secVal) => {
                                setFieldValue("priority", secVal);
                              }}
                            />
                          )}
                          <ErrorMessage
                            name="priority"
                            component="div"
                            style={{ color: "red" }}
                          />
                        </Col>
                        <Col
                          xl={6}
                          lg={6}
                          as={BootstrapForm.Group}
                          controlId="formGridFirstName"
                          className="full-width"
                        >
                          <BootstrapForm.Label className="col-label">
                            Fix Projected Cost
                          </BootstrapForm.Label>
                          <Field
                            type="number"
                            name="fix_projected_cost"
                            className="col-input w-100"
                          />
                          <ErrorMessage
                            name="fix_projected_cost"
                            component="div"
                            style={{ color: "red" }}
                          />
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
                                                </Col> */}
                      {/* <Col md={4}>
                                                    <label>Status</label>
                                                    {projectStatus && (
                                                        <Select
                                                            name="status"
                                                            className="react-select info"
                                                            classNamePrefix="react-select"
                                                            placeholder="Select Section..."
                                                            value={values?.status}
                                                            options={projectStatus}
                                                            onChange={(secVal) => {
                                                                setFieldValue("status", secVal);
                                                            }}
                                                        />
                                                    )}
                                                    <ErrorMessage
                                                        name="framework_id"
                                                        component="div"
                                                        style={{ color: "red" }}
                                                    />
                                                </Col> */}
                      {/* </Row> */}
                     
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
                          onClick={() => navigate("/admin/risk-assessment")}
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
    </>
  );
};

export default EditProject;
