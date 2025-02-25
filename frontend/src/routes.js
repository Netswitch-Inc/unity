// ** Tool Config
import { openVASKey, helpdeskSupportTicketKey } from "configs/toolConfig";

// ** Module Imports
import Dashboard from "views/dashboard/Dashboard";
import UserManagement from "views/users";
import RoleManagement from "views/roles";
import CompanyManagement from "views/companies";
import ConnectionManagement from "views/connections";
import UserProfile from "views/users/profile";
import ModulePermission from "views/roles/ModulePermission";
import RiskAssessmentMethod from "views/ram";
import ProjectDetails from "views/ram/ProjectDetails";
import CompanyProfile from "views/companies/profile";
import ComplianceBuilder from "views/CompilanceBuilders";
import CompilanceController from "views/CompilanceControl/index";
import CVELookupTool from "views/cveLookupTool";
import ComplianceLookupTool from "views/complianceLookupTool";
import EventLogList from "views/eventLogs";
import GlobalSetting from "views/global";
import AddSection from "views/section/AddSection";
import EditSection from "views/section/EditSection";
import AddQuestion from "views/questions/AddQuestion";
import EditQuestion from "views/questions/EditQuestion";
import Assessment from "views/Assessment/AddAssessment";
import AssessmentList from "views/Assessment";
import Editassessment from "views/Assessment/EditAssessment";
import SectionsList from "views/section";
import QuestionsList from "views/questions";
import AddProject from "views/Projects/AddProject";
import EditProject from "views/Projects/EditProject";
import PreviewAssessment from "views/Assessment/previewAssessment";
import HelpdeskGraphs from "views/helpdesks";
import AsessmentReportList from "views/AssessmentReport";
import SeverityGraph from "views/dashboard/wazuhGraph/SeverityGraph";
import AssessmentReportFront from "views/AssessmentReport/TabsIndex";
import VulnerabilityScanner from "views/vulnerability-scanner";
import SIEM from "views/SIEM";
import LogCollector from "views/LogCollector";
import CronSchedulerList from "views/cronSchedulers";
import AddCronScheduler from "views/cronSchedulers/add";
import EditCronScheduler from "views/cronSchedulers/edit";
import ConfigurationAssessmentChart from "views/configurationAssessments/configurationAssessmentChart";

import AddOpenVASScanReport from "views/openVASScanReports/add";
import OpenVASScanReportList from "views/openVASScanReports";
import EditOpenVASScanReport from "views/openVASScanReports/edit";

// ** Constant
import {
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
  riskAssessmentPermissionId,
  complianceBuilderPermissionId,
  resilienceIndexPermissionId,
  helpdeskTicketPermissionId,

  toolsGroupPermissionId,
  cveLookupPermissionId,
  complianceLookupPermissionId,
  vulnerabilityScannerPermissionId,
  siemPermissionId,
  logCollectorPermissionId,

  settingGroupPermissionId,
  connectionPermissionId,
  cronSchedulerPermissionId,
  openVasScanReportPermissionId
} from "utility/reduxConstant";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    mini: "D",
    icon: "tim-icons icon-chart-pie-36",
    layout: "/admin",
    component: (<Dashboard />)
  },
  {
    collapse: true,
    name: "DISCOVERY",
    mini: "DS",
    icon: "tim-icons icon-zoom-split",
    state: "DiscoveryCollapse",
    // customClass: "d-none",
    permissionId: discoveryGroupPermissionId,
    views: [
      {
        path: "/sections",
        name: "Sections",
        mini: "SEC",
        layout: "/admin",
        customClass: "d-none",
        component: (<SectionsList />),
        permissionId: sectionsPermissionId
      },
      {
        path: "/sections/add",
        name: "Add Section",
        mini: "SEC",
        layout: "/admin",
        component: (<AddSection />),
        permissionId: sectionsPermissionId,
        redirect: true
      },
      {
        path: "/sections/:id",
        name: "Add Section",
        mini: "SEC",
        layout: "/admin",
        component: (<EditSection />),
        permissionId: sectionsPermissionId,
        redirect: true
      },
      {
        path: "/questions",
        name: "Questions",
        mini: "QUE",
        layout: "/admin",
        customClass: "d-none",
        component: (<QuestionsList />),
        permissionId: questionsPermissionId
      },
      {
        path: "/questions/add",
        name: "Add Questions",
        mini: "QUE",
        layout: "/admin",
        component: (<AddQuestion />),
        permissionId: questionsPermissionId,
        redirect: true
      },
      {
        path: "/questions/:id",
        name: "Edit Questions",
        mini: "QUE",
        layout: "/admin",
        component: (<EditQuestion />),
        permissionId: questionsPermissionId,
        redirect: true
      },
      {
        path: "/assessment-form-preview/:id",
        name: "Assessment Form Preview",
        mini: "AFP",
        layout: "/admin",
        component: (<PreviewAssessment />),
        permissionId: assessmentFormsPermissionId,
        redirect: true
      },
      {
        path: "/assessment-forms",
        name: "Assessment Forms",
        mini: "A",
        layout: "/admin",
        component: (<AssessmentList />),
        permissionId: assessmentFormsPermissionId
      },

      {
        path: "/assessment-forms/add",
        name: "Add Assessment",
        mini: "AS",
        layout: "/admin",
        component: (<Assessment />),
        permissionId: assessmentFormsPermissionId,
        redirect: true
      },
      {
        path: "/assessment-forms/:id",
        name: "Edit Assessment Form",
        mini: "A",
        layout: "/admin",
        component: (<Editassessment />),
        permissionId: assessmentFormsPermissionId,
        redirect: true
      },
      {
        path: "/assessment-repots/:id",
        name: "Assessment Reports",
        mini: "A",
        layout: "/admin",
        component: (<AsessmentReportList />),
        permissionId: assessmentFormsPermissionId,
        redirect: true,
      },
      {
        path: "/report/:id",
        name: "Assessment Reports",
        mini: "A",
        layout: "/admin",
        component: (<AssessmentReportFront />),
        permissionId: assessmentFormsPermissionId,
        redirect: true
      }
    ]
  },
  {
    collapse: true,
    name: "Governance",
    mini: "Governance",
    icon: "tim-icons icon-bank",
    state: "GovernanceCollapse",
    permissionId: governanceGroupPermissionId,
    views: [
      {
        path: "/compliance-builder",
        name: "Compliance Builder",
        mini: "CB",
        layout: "/admin",
        customClass: "",
        component: (<ComplianceBuilder />),
        permissionId: complianceBuilderPermissionId,
      },
      {
        path: "/resilience-index",
        name: "Resilience Index",
        mini: "CC",
        layout: "/admin",
        customClass: "",
        component: (<CompilanceController />),
        permissionId: resilienceIndexPermissionId,
      },
      {
        path: "/risk-assessment",
        name: "Risk Assessment",
        mini: "RAM",
        layout: "/admin",
        customClass: "",
        component: (<RiskAssessmentMethod />),
        permissionId: riskAssessmentPermissionId,
      },
      {
        path: "/project/add",
        name: "Add Project",
        mini: "PRO",
        layout: "/admin",
        customClass: "",
        component: (<AddProject />),
        permissionId: riskAssessmentPermissionId,
        redirect: true,
      },
      {
        path: "/project/edit/:id",
        name: "Edit Project",
        mini: "PRO",
        layout: "/admin",
        customClass: "",
        component: (<EditProject />),
        permissionId: riskAssessmentPermissionId,
        redirect: true,
      },
      {
        path: "/project-details/:id",
        name: "Project Details",
        mini: "PD",
        layout: "/admin",
        component: (<ProjectDetails />),
        permissionId: riskAssessmentPermissionId,
        redirect: true,
      },
      {
        path: "/helpdesk-graph-data",
        name: "Helpdesk Ticket",
        mini: "HT",
        layout: "/admin",
        customClass: "",
        component: (<HelpdeskGraphs />),
        toolId: helpdeskSupportTicketKey,
        permissionId: helpdeskTicketPermissionId
      }
    ]
  },
  {
    collapse: true,
    name: "TOOLS",
    mini: "T",
    icon: "tim-icons icon-settings",
    state: "ToolsCollapse",
    permissionId: toolsGroupPermissionId,
    views: [
      {
        path: "/cve-lookup",
        name: "CVE Lookup",
        mini: "CVE",
        layout: "/admin",
        customClass: "",
        component: (<CVELookupTool />),
        permissionId: cveLookupPermissionId
      },
      {
        path: "/compliance-lookup",
        name: "Compliance Lookup",
        mini: "CLT",
        layout: "/admin",
        customClass: "",
        component: (<ComplianceLookupTool />),
        permissionId: complianceLookupPermissionId
      },
      {
        path: "/vulnerability-scanner",
        name: "Vulnerability Scanner",
        mini: "Vs",
        layout: "/admin",
        customClass: "",
        component: (<VulnerabilityScanner />),
        permissionId: vulnerabilityScannerPermissionId
      },
      {
        path: "/siem",
        name: "SIEM",
        mini: "SIEM",
        layout: "/admin",
        customClass: "",
        component: (<SIEM />),
        permissionId: siemPermissionId
      },
      {
        path: "/log-collector",
        name: "Log Collector",
        mini: "LC",
        layout: "/admin",
        customClass: "",
        component: (<LogCollector />),
        permissionId: logCollectorPermissionId
      }
    ]
  },
  {
    collapse: true,
    name: "Master",
    mini: "Master",
    icon: "tim-icons icon-settings-gear-63",
    state: "MasterCollapse",
    permissionId: masterGroupPermissionId,
    views: [
      {
        path: "/roles",
        name: "Roles",
        mini: "RM",
        layout: "/admin",
        customClass: "",
        component: (<RoleManagement />),
        permissionId: rolesPermissionId
      },
      {
        path: "/roles/permission/:id",
        name: "Roles",
        mini: "RM",
        layout: "/admin",
        customClass: "d-none",
        component: (<ModulePermission />),
        permissionId: rolesPermissionId
      },
      {
        path: "/users",
        name: "Users",
        mini: "UM",
        layout: "/admin",
        customClass: "",
        component: (<UserManagement />),
        permissionId: usersPermissionId
      },
      {
        path: "/companies",
        name: "Locations",
        mini: "CM",
        layout: "/admin",
        component: (<CompanyManagement />),
        permissionId: companiesPermissionId
      },
      {
        path: "/event-logs",
        name: "Event Logs",
        mini: "EL",
        layout: "/admin",
        component: (<EventLogList />),
        permissionId: eventLogPermissionId
      }
    ]
  },
  {
    collapse: true,
    name: "SETTING",
    mini: "SETTING",
    icon: "tim-icons icon-settings-gear-63",
    state: "SETTINGSCollapse",
    permissionId: settingGroupPermissionId,
    views: [
      {
        path: "/connections",
        name: "Connections",
        mini: "CON",
        layout: "/admin",
        component: (<ConnectionManagement />),
        permissionId: connectionPermissionId
      },
      {
        path: "/cron-schedulers",
        name: "Cron Schedulers",
        mini: "CS",
        layout: "/admin",
        component: (<CronSchedulerList />),
        permissionId: cronSchedulerPermissionId
      },
      {
        path: "/cron-schedulers/add",
        name: "Add Cron Scheduler",
        mini: "CS",
        layout: "/admin",
        customClass: "",
        component: (<AddCronScheduler />),
        permissionId: cronSchedulerPermissionId,
        redirect: true
      },
      {
        path: "/cron-schedulers/edit/:id",
        name: "Edit Cron Scheduler",
        mini: "CS",
        layout: "/admin",
        customClass: "",
        component: (<EditCronScheduler />),
        permissionId: cronSchedulerPermissionId,
        redirect: true
      },
      {
        path: "/openvas-scan-reports",
        name: "OpenVAS Scan Reports",
        mini: "A",
        layout: "/admin",
        component: (<OpenVASScanReportList />),
        toolId: openVASKey,
        permissionId: openVasScanReportPermissionId
      },
      {
        path: "/openvas-scan-reports/add",
        name: "Add OpenVAS Scan Report",
        mini: "CS",
        layout: "/admin",
        customClass: "",
        component: (<AddOpenVASScanReport />),
        toolId: openVASKey,
        permissionId: openVasScanReportPermissionId,
        redirect: true
      },
      {
        path: "/openvas-scan-reports/edit/:id",
        name: "Edit OpenVAS Scan Report",
        mini: "CS",
        layout: "/admin",
        customClass: "",
        component: (<EditOpenVASScanReport />),
        toolId: openVASKey,
        permissionId: openVasScanReportPermissionId,
        redirect: true
      }
    ]
  },
  {
    path: "/profile",
    name: "Profile",
    mini: "P",
    icon: "tim-icons icon-single-02",
    layout: "/admin",
    customClass: "",
    component: (<UserProfile />),
    redirect: true
  },
  {
    path: "/company-profile",
    name: "Company Profile",
    mini: "CP",
    icon: "tim-icons icon-single-02",
    layout: "/admin",
    customClass: "",
    component: (<CompanyProfile />),
    redirect: true
  },
  {
    path: "/global-setting",
    name: "Global Setting",
    mini: "GS",
    icon: "tim-icons icon-chart-pie-36",
    layout: "/admin",
    component: (<GlobalSetting />),
    redirect: true
  },
  {
    path: "/level-severity-graph",
    name: "Level Severity Graph",
    mini: "MSG",
    icon: "tim-icons icon-chart-pie-36",
    layout: "/admin",
    component: (<SeverityGraph />),
    redirect: true
  },
  {
    path: "/configuration-assessment-chart",
    name: "Configuration Assessment Chart",
    mini: "CAC",
    icon: "tim-icons icon-chart-pie-36",
    layout: "/admin",
    component: (<ConfigurationAssessmentChart />),
    redirect: true
  }
]

export default routes;
