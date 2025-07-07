// ** Reducers Imports
import login from "../views/login/store/index.js";
import user from "../views/users/store/index.js";
import roles from "../views/roles/store/index.js";
import company from "../views/companies/store/index.js";
import connection from "../views/connections/store/index.js";
import compilance from "../views/CompilanceBuilders/store/index.js";
import complincecontrol from "../views/resilienceIndex/store/index.js";
import cis from "../views/resilienceIndex/cisstore/index.js";
import eventLogs from "views/eventLogs/store";
import companyComplianceControls from "views/companyComplianceControls/store";
import globalSetting from "../views/global/store/index.js";
import sections from "../views/section/store/index.js";
import questions from "../views/questions/store/index.js";
import assessment from "../views/Assessment/store/index.js";
import projects from "../views/projects/store/index.js";
import attachments from "../views/ram/attachmentStore/index.js";
import comments from "../views/ram/commentStore/index.js";
import history from "../views/ram/projectHistoryStore/index.js";
import assessmentReport from "../views/userAssest/store/index.js";
import questionAnswer from "../views/userAssest/assessment-report-answer-store/index.js";
import dashboard from "../views/dashboard/store/index.js";
import helpdesk from "../views/helpdesks/store";
import cronScheduler from "../views/cronSchedulers/store";
import agent from "../views/agents/store";
import configurationAssessment from "../views/configurationAssessments/store";
import openVASScanReport from "../views/openVASScanReports/store";
import netswitchThreatIntel from "views/netswitchThreatIntels/store";
import compliancePriority from "views/compliancePriority/store";
import contact from "views/contacts/store";
import aiPrompt from "views/aiPrompts/store";

const rootReducer = {
  login,
  user,
  roles,
  company,
  connection,
  compilance,
  complincecontrol,
  cis,
  eventLogs,
  companyComplianceControls,
  globalSetting,
  sections,
  questions,
  assessment,
  projects,
  attachments,
  comments,
  history,
  assessmentReport,
  questionAnswer,
  dashboard,
  helpdesk,
  cronScheduler,
  agent,
  configurationAssessment,
  openVASScanReport,
  netswitchThreatIntel,
  compliancePriority,
  contact,
  aiPrompt
};

export default rootReducer;
