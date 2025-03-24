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
    emailExist: `users/email-exist`,
    usernamExist: `users/username-exist`
  },
  users: {
    list: `/users`,
    get: `/users`,
    create: `/users`,
    update: `/users`,
    delete: `/users`
  },
  roles: {
    list: `/roles`,
    get: `/roles`,
    create: `/roles`,
    update: `/roles`,
    delete: `/roles`
  },
  permissions: {
    create: `/permissions`,
    update: `/permissions`,
    rolePermission: `/role-permissions`,
  },
  companies: {
    list: `/company`,
    get: `/company`,
    create: `/company`,
    update: `/company`,
    delete: `/company`
  },
  connections: {
    list: `/connections`,
    get: `/connection`,
    create: `/connection`,
    update: `/connection`,
    delete: `/connection`
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
  eventLogs: {
    list: `/event-logs`,
    get: `/event-logs`,
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
  sections: {
    list: `/sections`,
    get: `/sections`,
    create: `/sections`,
    update: `/sections`,
    delete: `/sections`,
    byAssessment: `/section/byassessment`
  },
  questions: {
    list: `/questions`,
    get: `/questions`,
    create: `/questions`,
    update: `/questions`,
    delete: `/questions`,
    questionFilter: `/questionfilters`,
    bulkorderupdate: `/questions/bulk-order-update`,
  },
  assessments: {
    listing: `/assessments`,
    edit: `/assessments`,
    list: `/assessments`,
    get: `/assessments`,
    create: `/assessments`,
    update: `/assessments`,
    delete: `/assessments`
  },
  projects: {
    list: `/projects`,
    get: `/projects`,
    create: `/projects`,
    update: `/projects`,
    delete: `/projects`
  },
  attachments: {
    list: `/attachments`,
    get: `/attachments`,
    create: `/upload`,
    update: `/attachments`,
    delete: `/attachments`
  },
  comments: {
    list: `/comments`,
    get: `/comments`,
    create: `/comments`,
    update: `/comments`,
    delete: `/comments`
  },
  histories: {
    list: `/project_histories`,
    get: `/project_histories`,
    create: `/project_histories`,
    update: `/project_histories`,
    delete: `/project_histories`
  },
  assessmentReports: {
    list: `/assessment-reports`,
    get: `/assessment-reports`,
    create: `/assessment-reports`,
    update: `/assessment-reports`,
    delete: `/assessment-reports`,
    verify: `/assessment-code-verification`,
    assessmentAnswers: `/assessment-reports-questions`,
    pdfcreate: `/assessment-report-pdf`,
    sendpdfemail: `/assessment-report-email`
  },
  answers: {
    list: `/question-answers`,
    get: `/question-answers`,
    create: `/question-answers`,
    update: `/question-answers`,
    delete: `/question-answers`
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
    netSwitchThreatIntelCount: `/netswitch-threat-intels-stats-count/filter`
  },
  cronSchedulers: {
    list: `/cron-schedulers`,
    get: `/cron-schedulers`,
    create: `/cron-schedulers`,
    update: `/cron-schedulers`,
    delete: `/cron-schedulers`,
    alertWarning: `/cron-schedulers/alert-warning`
  },
  agents: {
    list: `/agents`,
    get: `/agents`,
    create: `/agents`,
    update: `/agents`,
    delete: `/agents`
  },
  configurationAssessments: {
    list: `/configuration-assessments`,
    get: `/configuration-assessments`,
    create: `/configuration-assessments`,
    update: `/configuration-assessments`,
    delete: `/configuration-assessments`
  },
  openVASScanReports: {
    list: `/openvas-scan-reports`,
    get: `/openvas-scan-reports`,
    create: `/openvas-scan-reports`,
    update: `/openvas-scan-reports`,
    delete: `/openvas-scan-reports`,
    insert: `openvas-scan-reports/insert-multipal`
  },
  netswitchThreatIntels: {
    list: `/netswitch-threat-intels`,
    get: `/netswitch-threat-intels`,
    create: `/netswitch-threat-intels`,
    update: `/netswitch-threat-intels`,
    delete: `/netswitch-threat-intels`
  }
}
