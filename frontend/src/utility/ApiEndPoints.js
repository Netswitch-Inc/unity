export const API_ENDPOINTS = {
  auth: {
    login: `/users/login`,
    profile: `/user/profile`,
    changepassword: `/users/changePassword`,
    get: `/users/profile`,
    role: `/auth/role`,
    rolePermission: `/auth/role-permission`,
    verifyemail: `/users/forgotpassword`,
    verifyotp: `/users/verifyotp`,
    resetpassword: `/users/resetpassword`,
  },
  customer: {
    listing: `/users`,
    create: `/users`,
    edit: `/users`,
    update: `/users`,
    delete: `/users`,
  },
  role: {
    get: `/roles`,
    listing: `/roles`,
    create: `/roles`,
    update: `/roles`,
    delete: `/roles`,
  },
  permission: {
    create: `/permissions`,
    update: `/permissions`,
    rolePermission: `/role-permissions`,
  },
  company: {
    listing: `/company`,
    edit: `/company`,
    create: `/company`,
    update: `/company`,
    delete: `/company`,
    emailunique: "/users/isemailunique",
    userunique: "/users/isusernameunique",
  },
  Connection: {
    listing: `/connections`,
    create: `/connection`,
    update: `/connection`,
    delete: `/connection`,
    edit: `/connection`,
  },
  Framework: {
    listing: `/compilance/frameworks`,
    dropdown: `/frameworks-dropdown`,
    frameworkIds: "/compilance/frameworkswithids",
  },
  controls: {
    listing: `/controls-frameworks`,
    listingAll: `/controls`,
    get: `/controls`,
  },
  Controller: {
    listing: `/compliance-controls-frameworks`,
    listingAll: `/compliance-controls`,
  },
  Cis: {
    listingAll: "/cis",
    download: "/downloadfromstorage",
    listingSubcontrols: "/cis-controls-with-frameworkIds",
  },
  eventLog: {
    get: `/event-logs`,
    listing: `/event-logs`,
    create: `/event-logs`,
    update: `/event-logs`,
    delete: `/event-logs`,
  },
  companyComplianceControls: {
    lists: `/company-compliance-controls-list`,
    creates: `/company-multiple-compliance-controls`,
  },
  globalSettings: {
    lists: `/settings`,
    update: `/settings`,
  },
  Section: {
    edit: `/sections`,
    listing: `/sections`,
    create: `/sections`,
    update: `/sections`,
    delete: `/sections`,
    byAssessment: `/section/byassessment`,
  },
  question: {
    create: `/questions`,
    listing: `/questions`,
    update: `/questions`,
    delete: `/questions`,
    edit: `/questions`,
    questionFilter: `/questionfilters`,
    bulkorderupdate: `/questions/bulk-order-update`,
  },
  Assessment: {
    listing: `/assessments`,
    create: `/assessments`,
    edit: `/assessments`,
    delete: `/assessments`,
    update: `/assessments`,
  },
  Project: {
    listing: `/projects`,
    create: `/projects`,
    edit: `/projects`,
    delete: `/projects`,
    update: `/projects`,
  },
  Attachment: {
    listing: `/attachments`,
    create: `/upload`,
    delete: `/attachments`,
    edit: `/attachments`,
  },
  Comment: {
    listing: `/comments`,
    create: `/comments`,
    edit: `/comments`,
    delete: `/comments`,
  },
  History: {
    listing: `/project_histories`,
    create: `/project_histories`,
    edit: `/project_histories`,
    delete: `/project_histories`,
  },
  AssessmentReport: {
    listing: `/assessment-reports`,
    create: `/assessment-reports`,
    edit: `/assessment-reports`,
    delete: `/assessment-reports`,
    update: `/assessment-reports`,
    verify: `/assessment-code-verification`,
    assessmentAnswers: `/assessment-reports-questions`,
    pdfcreate: `/assessment-report-pdf`,
    sendpdfemail: `/assessment-report-email`,
  },
  Answer: {
    listing: `/question-answers`,
    create: `/question-answers`,
    edit: `/question-answers`,
    delete: `/question-answers`,
    update: `/question-answers`,
  },
  dashboard: {
    widgetsOrder: `/dashboard-widgets-order`,
    updateWidgetsOrder: `/dashboard-widgets-order-update`,
    updateWidgetsToggle: `/dashboard-widgets-update-toggle`,
    helpdeskTicket: `/helpdesk-graph-data`,
    wazuhSeverityCount: `/wazuh-indexer-severity-counts`,
    wazuhIndexerGraph: `wazuh-indexer-graph/filter`,
    incidentTrendStats: `incident-trend-wazuh-stats-graph/filter`,
    configureAssesmntStats: `configuration-assessment-stats-graph/filter`,
    openVASScnReportStats: `/openvas-scan-report-stats-graph/filter`,
  },
  cronSchedulers: {
    list: `/cron-schedulers`,
    get: `/cron-schedulers`,
    create: `/cron-schedulers`,
    update: `/cron-schedulers`,
    delete: `/cron-schedulers`,
  },
  agents: {
    list: `/agents`,
    get: `/agents`,
    create: `/agents`,
    update: `/agents`,
    delete: `/agents`,
  },
  configurationAssessments: {
    list: `/configuration-assessments`,
    get: `/configuration-assessments`,
    create: `/configuration-assessments`,
    update: `/configuration-assessments`,
    delete: `/configuration-assessments`,
  },
  openVASScanReports: {
    list: `/openvas-scan-reports`,
    get: `/openvas-scan-reports`,
    create: `/openvas-scan-reports`,
    update: `/openvas-scan-reports`,
    delete: `/openvas-scan-reports`,
    insert: `openvas-scan-reports/insert-multipal`,
  },
};
