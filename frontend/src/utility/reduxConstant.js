// ** Utils
import { getLocalAppSetting } from "./Utils";

// ** Logo
import logo from "assets/img/react-logo.png";

const hostRestApiUrl = process.env?.REACT_APP_BACKEND_REST_API_URL || "";
const hostRestApiPrefix = process.env?.REACT_APP_BACKEND_REST_API_PREFIX || "";
const isEmptyBlankDataDisplay = process.env?.REACT_APP_IS_EMPTY_BLANK_DATA_DISPLAY === "true" || false;
const defaultCompanyName = getLocalAppSetting()?.name || process.env?.REACT_APP_COMPANY_NAME || "UnityRi";
const defaultCompanyUrl = getLocalAppSetting()?.url || process.env?.REACT_APP_COMPANY_URL || "";
const defaultLogo = getLocalAppSetting()?.logo || logo;

const superPriviledgeType = "super";
const adminPriviledgeType = "admin";
const executivePriviledgeType = "executive";
const governorPriviledgeType = "governor";
const technologistPriviledgeType = "technologist";

const superAdminRole = "6694b16dc2bc754ae7c64e0a";
const companyAdminRole = "6694b643c788405b9fcafbe1";

/* Module permission Ids */
const masterGroupPermissionId = "master";
const rolesPermissionId = "roles";
const usersPermissionId = "users";
const companiesPermissionId = "companies";
const eventLogPermissionId = "event-logs";

const discoveryGroupPermissionId = "discovery";
const sectionsPermissionId = "sections";
const questionsPermissionId = "questions";
const assessmentFormsPermissionId = "assessment-forms";

const governanceGroupPermissionId = "governance";
const riskAssessmentPermissionId = "risk-assessment";
const complianceBuilderPermissionId = "compliance-builder";
const resilienceIndexPermissionId = "resilience-index";
const projectsPermissionId = "projects";
const helpdeskTicketPermissionId = "helpdesk-support-ticket";

const toolsGroupPermissionId = "tools";
const cveLookupPermissionId = "cve-lookup";
const complianceLookupPermissionId = "compliance-lookup";
const vulnerabilityScannerPermissionId = "vulnerability-scanner";
const siemPermissionId = "siem";
const logCollectorPermissionId = "log-collector";

const settingGroupPermissionId = "setting";
const connectionPermissionId = "connections";
const cronSchedulerPermissionId = "cron-schedulers";
const openVasScanReportPermissionId = "openvas-scan-reports";
/* /Module permission Ids */

/* Used for datatable display entries */
const defaultPerPageRow = 10;
const perPageRowItems = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
  { label: "100", value: 100 }
]

const questionTypeOptions = [
  { label: "Note", value: "note" },
  { label: "Radio", value: "radio" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Text Box", value: "text" },
  { label: "Text Area", value: "textarea" },
  { label: "Date", value: "date" }
]

const priviledgesArr = ["executive", "governor", "technologist"]
const priviledgesObjectPermission = {
  executive: true,
  governor: true,
  technologist: true
}

/* /Used for datatable display entries */

/* Spinner color */
const spinnerColor = "default";
/* /Spinner color */

const statusEnum = {
  1: "Active",
  0: "InActive"
}

/* Role */
const roleItem = { _id: "", name: "", group: "", status: 1, deletedAt: null }
/* /Role */

const userItem = { company_id: null, role_id: null, id: null, _id: "", name: "", first_name: "", last_name: "", email: "", phone: "", user_name: "", password: "", image: "", priviledges: [], status: 1 }
const initUserItem = { company_id: null, role_id: null, id: null, _id: "", name: "", first_name: "", last_name: "", email: "", phone: "", user_name: "", password: "", image: "", priviledges: [], status: 1 }

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  user_name: '',
  password: '',
  role: '',
  status: 1,
  image: '',
  weightIndex: 1,
  priviledges: [],
};
const initSection = { _id: "", name: "", description: "", order: "", status: 1 }

const profileItem = { first_name: "", last_name: "", email: "", phone: "", user_name: "" }

const initialConnectionItem = { _id: "", tool_slug: "", name: "", type: "", description: "", ip_address: "", port: "", username: "", password: "" }

const initQuestion = { section_id: "", question: "", description: "", option_type: { label: "Note", value: "note" }, options: [{ value: "", points: "" }], value: "", is_mandatory: false, point: 0, order: null, status: 1, deletedAt: null }

const initialProject = { company_id: "", user_id: "", framework_id: [], involved_parties: [], submitted_by: "", company_compliance_control_id: "", cis_control_id: "", users_ai_description: [], name: "", description: "", cost_of_risk: 0, fix_cost_risk_ratio: 0, affected_scope: "", priority: "", fix_projected_cost: 0, likelyhood: 1, impact_assessment: 1, affected_risk: 0, status: "" }

const initAssessmentItem = { _id: "", name: "", description: "", order: "", additional_description: "", status: 1, show_score_calculation: false }

const priority = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" }
]

const projectStatus = [
  { label: "Created", value: "created" },
  { label: "Approved", value: "approved" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" }
]

const pipFormats = [
  "Not Foreseeable",
  "Foreseeable, but unexpected",
  "Expected, but not common",
  "Common",
  "Current"
]

const pipFormats2 = [
  "Negligible",
  "Acceptable",
  "Unacceptable",
  "High",
  "Catastrophic"
]

const currencySign = "$";

const businessType = [
  { label: "Individual", value: "individual" },
  { label: "Corporation", value: "corporation" },
  { label: "Partnership", value: "partnership" },
  { label: "Other", value: "other" }
]

const AssessmentReport = { name: "", first_name: "", last_name: "", company_name: "", email: "", mobile: "", business_type: "", team_size: 0, operation_description: "", address1: "", address2: "", city: "", state: "", country: "", zipcode: "" }

const OptionsForGraph = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
]

const OptionsForConfigrationAssessmentGraph = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

const OptionsForCriticalGraph = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" }
]

const OptionsForNetSwitchThreatIntelGraph = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" }
]

const OptionsForSIEMGraph = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" }
]

const OptionsForVulnerGraph = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" }
]

const defaultCronStyle = '0 0 * * *';
const initCronSchedulerItem = { _id: "", tool_slug: "", name: "", type: "", slug: "", cron_style: defaultCronStyle, cron_style_disabled: false, description: "", is_default: false, status: true }

const initAgentItem = { _id: "", ref_id: "", os: null, group: null, name: "", ip: "", registerIP: "", version: "", node_name: "", manager: "", mergedSum: "", configSum: "", dateAdd: "", lastKeepAlive: "", disconnection_time: "", group_config_status: "", status: "", status_code: 0 }

const initCompanyItem = { _id: "", user_name: "", password: "", name: "", logo: "", contact_no: "", email: "", address: "" }

const initOpenVASScanReportItem = { _id: "", affected_software_os: "", bids: "", certs: "", cves: "", cvss: 0, hostname: "", impact: "", ip: "", nvt_name: "", nvt_oid: "", other_references: "", port: "", port_protocol: "", product_detection_result: "", qod: 0, result_id: "", severity: "", solution: "", solution_type: "", specific_result: "", summary: "", task_id: "", task_name: "", timestamp: "", vulnerability_detection_method: "", vulnerability_insight: "" }

const initConfigurationAssessmentItem = { _id: "", agent_ref_id: "", policy_id: "", name: "", references: "", invalid: 0, description: "", hash_file: "", total_checks: 0, pass: 0, fail: 0, score: 0, date_in_string: "", start_scan: "", end_scan: "" }

const initEventLogItem = { _id: "", company_id: null, module_id: null, action_user_id: null, user_id: null, reference_id: null, module_slug: "", type: "", action: "", description: "", previous_data: null, current_data: null }

const initNetswitchThreatIntelItem = { _id: "", ip_address: "", as_number: "", company: "", country: "", time: "", date_in_string: "", date: null, date_time: null, status: true }

const initCompanyComplianceControlItem = { _id: "", company_id: null, user_id: null, compliance_priority_id: null, framework_id: null, control_id: null, project_id: null, cis_tool_icons: null, status: true }

const initCompliancePriorityItem = { _id: "", company_id: null, user_id: null, name: "", description: "", status: true }

const draftEditorToolbarConfig = {
  options: ["blockType", "inline", "list", "textAlign", "link", "image", "history", "remove"],
  blockType: {
    inDropdown: true,
    options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"]
  },
  inline: {
    inDropdown: false,
    options: ["bold", "italic", "underline", "strikethrough"]
  },
  textAlign: {
    options: ["left", "center", "right"],
  },
  link: {
    options: ["link"],
    defaultTargetOption: "_blank",
    showOpenOptionOnHover: true,
    showRemoveOption: true,
  },
  image: {
    uploadEnabled: false, // change to true if you want uploads
    urlEnabled: true,
    previewImage: true,
    alt: { present: true, mandatory: false },
  },
  history: {
    options: ["undo", "redo"],
  },
  remove: { icon: undefined, className: undefined, component: undefined, popupClassName: undefined }
}

export {
  hostRestApiUrl,
  hostRestApiPrefix,
  isEmptyBlankDataDisplay,
  defaultCompanyName,
  defaultCompanyUrl,
  defaultLogo,

  superPriviledgeType,
  adminPriviledgeType,

  superAdminRole,
  companyAdminRole,
  executivePriviledgeType,
  governorPriviledgeType,
  technologistPriviledgeType,

  masterGroupPermissionId,
  rolesPermissionId,
  usersPermissionId,
  companiesPermissionId,
  eventLogPermissionId,

  discoveryGroupPermissionId,
  sectionsPermissionId,
  questionsPermissionId,
  assessmentFormsPermissionId,

  governanceGroupPermissionId,
  complianceBuilderPermissionId,
  riskAssessmentPermissionId,
  resilienceIndexPermissionId,
  projectsPermissionId,
  helpdeskTicketPermissionId,

  toolsGroupPermissionId,
  cveLookupPermissionId,
  complianceLookupPermissionId,
  vulnerabilityScannerPermissionId,
  siemPermissionId,
  logCollectorPermissionId,

  settingGroupPermissionId,
  connectionPermissionId,
  openVasScanReportPermissionId,
  cronSchedulerPermissionId,

  defaultPerPageRow,
  perPageRowItems,
  spinnerColor,
  statusEnum,
  roleItem,
  userItem,
  initUserItem,
  initialValues,
  profileItem,
  initialConnectionItem,
  initSection,
  questionTypeOptions,
  initQuestion,
  initAssessmentItem,
  initialProject,
  projectStatus,
  priority,
  pipFormats,
  pipFormats2,
  currencySign,
  businessType,
  AssessmentReport,
  priviledgesArr,
  priviledgesObjectPermission,
  OptionsForGraph,
  OptionsForConfigrationAssessmentGraph,
  OptionsForCriticalGraph,
  OptionsForNetSwitchThreatIntelGraph,
  OptionsForSIEMGraph,
  OptionsForVulnerGraph,
  initCronSchedulerItem,
  initCompanyItem,
  initAgentItem,
  initConfigurationAssessmentItem,
  initOpenVASScanReportItem,
  initEventLogItem,
  initNetswitchThreatIntelItem,
  initCompanyComplianceControlItem,
  initCompliancePriorityItem,
  draftEditorToolbarConfig
}
