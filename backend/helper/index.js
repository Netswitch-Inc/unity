var moment = require('moment');
var path = require("path");
const fsPromise = require('fs').promises;

var MailService = require("../services/mail.service");
var EventLogService = require("../services/eventLog.service");
var SettingService = require("../services/setting.service");

// const accountSid = process.env.ACCOUNT_SID;
// const authToken = process.env.AUTH_TOKEN;
// const messageseviceId = process.env.MESSAGE_SERVICE_ID;
// const client = require("twilio")(accountSid, authToken);

const wazuhKey = "wazuh";
const openVASKey = "openvas";
const helpdeskSupportTicketKey = "helpdesk-support-ticket";
const netswitchThreatIntelKey = "netswitch-threat-intel";
const zendeskSupportTicketKey = "zendesk-support-ticket";

const moduleSlugs = {
  roles: "roles",
  users: "users",
  companies: "companies",
  "event-logs": "event-logs",
  "risk-assessment": "risk-assessment",
  "compliance-builder": "compliance-builder",
  "resilience-index": "resilience-index",
  projects: "projects",
  "cve-lookup": "cve-lookup",
  "compliance-lookup": "compliance-lookup",
  connections: "connections",
  sections: "sections",
  questions: "questions",
  "assessment-forms": "assessment-forms",
  "cron-schedulers": "cron-schedulers",
  "openvas-scan-reports": "openvas-scan-reports",
  "helpdesk-support-ticket": "helpdesk-support-ticket",
  "vulnerability-scanner": "vulnerability-scanner",
  "siem": "siem",
  "log-collector": "log-collector"
}

const modulesData = [
  {
    _id: "66a1fd34dae0176aceda9dca",
    group_name: "master",
    name: "Roles",
    slug: "roles"
  },
  {
    _id: "66a1fd6bdae0176aceda9dcc",
    group_name: "master",
    name: "Users",
    slug: "users"
  },
  {
    _id: "66a1fd83dae0176aceda9dd0",
    group_name: "master",
    name: "Companies",
    slug: "companies"
  },
  {
    _id: "66b0d70192c0e0f7c1be731b",
    group_name: "master",
    name: "Event Logs",
    slug: "event-logs"
  },
  {
    _id: "66dac21427f5f1c90cfaeb64",
    group_name: "discovery",
    name: "Sections",
    slug: "sections"
  },
  {
    _id: "66dac22327f5f1c90cfaeb66",
    group_name: "discovery",
    name: "Questions",
    slug: "questions"
  },
  {
    _id: "66e2ba4d806ebcc07b94f055",
    group_name: "discovery",
    name: "Assessment Forms",
    slug: "assessment-forms"
  },
  {
    _id: "66a1fe0cdae0176aceda9dd2",
    group_name: "governance",
    name: "Risk Assessment",
    slug: "risk-assessment"
  },
  {
    _id: "66a1feecdae0176aceda9ddc",
    group_name: "governance",
    name: "Compliance Builder",
    slug: "compliance-builder"
  },
  {
    _id: "66a1ff0fdae0176aceda9dde",
    group_name: "governance",
    name: "Resilience Index",
    slug: "resilience-index"
  },
  {
    _id: "6797477b7aad78d3097485d2",
    group_name: "governance",
    name: "Projects",
    slug: "projects"
  },
  {
    _id: "66b06cfce376284c4cfe3485",
    group_name: "tools",
    name: "CVE Lookup",
    slug: "cve-lookup"
  },
  {
    _id: "66b06d16e376284c4cfe3487",
    group_name: "tools",
    name: "Compliance Lookup",
    slug: "compliance-lookup"
  },
  {
    _id: "66a79d934d968c8631176697",
    group_name: "setting",
    name: "Connections",
    slug: "connections"
  },
  {
    _id: "677b5a5479c9d22b0de58594",
    group_name: "setting",
    name: "Cron Schedulers",
    slug: "cron-schedulers"
  },
  {
    _id: "679b7f925996e34a275891d3",
    group_name: "setting",
    name: "OpenVAS Scan Reports",
    slug: "openvas-scan-reports"
  },
  {
    _id: "67ad9f5d92e65b322ba6fa8f",
    group_name: "governance",
    name: "Helpdesk Ticket",
    slug: "helpdesk-support-ticket"
  },
  {
    _id: "67ada4ecf70f67bf5d59a4d6",
    group_name: "tools",
    name: "Vulnerability Scanner",
    slug: "vulnerability-scanner"
  },
  {
    _id: "67ada59af70f67bf5d59a593",
    group_name: "tools",
    name: "SIEM",
    slug: "siem"
  },
  {
    _id: "67adb276f70f67bf5d59a654",
    group_name: "tools",
    name: "Log Collectors",
    slug: "log-collector"
  }
]

const aiServiceTypes = {
  gemini: "gemini",
  openai: "openai",
}

// ** Checks if an object is empty (returns boolean)
const isObjEmpty = (obj) => Object.keys(obj).length === 0

const createUpdateCronEventLog = async (payload = null) => {
  try {
    if (!payload || (payload && isObjEmpty(payload))) {
      return { data: null, error: "Payload must be present." };
    }

    if (!payload?.action) {
      return { data: null, error: "Action must be present." };
    }

    if (!payload?.type) {
      return { data: null, error: "Type must be present." };
    }

    if (payload?.module_slug && moduleSlugs[payload.module_slug]) {
      const module = modulesData.find((x) => x.slug == moduleSlugs[payload.module_slug]);
      if (module && module?._id) {
        payload.module_id = module._id;
        payload.module_slug = module.slug;
      }
    }

    var todayDate = formatDate(null, "YYYY-MM-DD")
    payload.date_in_string = todayDate;

    var eventLog = null;
    if (payload?._id) {
      eventLog = await EventLogService.updateEventLog(payload);
    } else {
      eventLog = await EventLogService.createEventLog(payload);
    }

    var result = { data: eventLog };
    if (eventLog?._id) {
      result.message = "Cron event log created successfully.";
    } else {
      result.error = "Something went wrong.";
    }

    return result;
  } catch (error) {
    console.log("createUpdateCronEventLog catch >>>", error);
    return { data: null, error };
  }
}

const createUpdateEventLog = async (payload = null, action = "", type = "") => {
  try {
    if (!action) {
      return { data: null, error: "Action must be present." };
    }

    if (!type) {
      return { data: null, error: "Type must be present." };
    }

    if (!payload?.user_id && !payload?.company_id && type != "roles") {
      return { data: null, error: "User Id or company Id must present." };
    }

    if (payload?.module_slug && moduleSlugs[payload.module_slug]) {
      const module = modulesData.find((x) => x.slug == moduleSlugs[payload.module_slug]);
      if (module && module?._id) {
        payload.module_id = module._id;
        payload.module_slug = module.slug;
      }
    }

    var todayDate = formatDate(null, "YYYY-MM-DD")

    var query = { action, type, user_id: null, company_id: null };
    if (payload?.reference_id) { query.reference_id = payload.reference_id; }
    if (payload?.user_id) { query.user_id = payload.user_id; }
    if (payload?.company_id) { query.company_id = payload.company_id; }

    payload.date_in_string = todayDate;

    var eventLog = await EventLogService.getEventLogOne(query);
    if (eventLog && eventLog?._id) {
      payload._id = eventLog._id;
      eventLog = await EventLogService.updateEventLog(payload);
    } else {
      eventLog = await EventLogService.createEventLog(payload);
    }

    var result = { data: eventLog };
    if (eventLog?._id) {
      result.message = "Event log created successfully.";
    } else {
      result.error = "Something went wrong.";
    }

    return result;
  } catch (error) {
    console.log("createUpdateEventLog catch >>>", error);
    return { data: null, error };
  }
}

function getRelativePath(fullPath) {
  // Define the base directory you want to strip out
  const baseDir = path.resolve("public"); // Adjust this if 'public' directory is different

  // Get the relative path from the base directory
  const relativePath = path.relative(baseDir, fullPath);

  return relativePath;
}

const generateCode = () => {
  var code = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return code;
}

const sendSMS = async function (data) {
  try {
    const tosentSms = "+" + data.mobile.toString();
    const accountSid =
      (await SettingService.getSettingBySlug("twilio_account_sid")) || null;
    const authToken =
      (await SettingService.getSettingBySlug("twilio_auth_token")) || null;
    const messageseviceId =
      (await SettingService.getSettingBySlug("twilio_message_service_id")) ||
      null;
    console.log(accountSid, "accountSid");
    const client = require("twilio")(accountSid?.value, authToken?.value);
    const response = await client.messages
      .create({
        body: data.message,
        messagingServiceSid: messageseviceId?.value,
        to: tosentSms,
      })
      .then((message) => console.log(message));
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

const sendVerification = async (phoneNumber) => {
  try {
    const accountSid =
      (await SettingService.getSettingBySlug("twilio_account_sid")) || null;
    const authToken =
      (await SettingService.getSettingBySlug("twilio_auth_token")) || null;
    const messageseviceIds = "VA7765f565a5fe8bdcab1ab6db740845de";
    const client = require("twilio")(accountSid?.value, authToken?.value);
    const verification = await client.verify.v2
      .services(messageseviceIds)
      .verifications.create({ to: phoneNumber, channel: "sms" });
    console.log("Verification sent:", verification.status);
  } catch (error) {
    console.error("Error sending verification:", error.message);
  }
}

const formatDate = (date = "", format = "MM-DD-YYYY") => {
  if (!date) { date = new Date(); }

  return moment(new Date(date)).format(format);
}

const splitWithPipe = function (value = "") {
  if (value) {
    return value.split("|").filter(function (e) { return e !== "" })
  }

  return []
}

const getToolsPermissions = async function () {
  try {
    var toolsPermission = await SettingService.getSettingOne({ deletedAt: null, slug: "tools" }) || null;
    if (toolsPermission?.value) {
      toolsPermission = splitWithPipe(toolsPermission.value);
    }

    return toolsPermission || []
  } catch (error) {
    console.log("getToolsPermissions catch >>> ", error.message)
    return []
  }
}

const removeWhiteSpaceString = (string = "") => {
  if (string) {
    string = string.replace(/\s+/g, "") || string;
  }

  return string
}

const sendPlatformTypeEmail = async (item = null) => {
  try {
    var emailConfigType = await SettingService.getSettingBySlug("email_config_type") || null;
    if (emailConfigType?.value) {
      let configType = emailConfigType?.value;
      if (configType === "azure-msal") {
        let msalClientId = await SettingService.getSettingBySlug("email_azure_msal_client_id") || null;
        let msalSecretValue = await SettingService.getSettingBySlug("email_azure_msal_secret_value") || null;
        let msalTenantId = await SettingService.getSettingBySlug("email_azure_msal_tenant_id") || null;
        let msalFromEmail = await SettingService.getSettingBySlug("email_azure_msal_from_email") || null;
        let msalFromName = await SettingService.getSettingBySlug("email_azure_msal_from_name") || null;

        msalClientId = msalClientId?.value || "";
        msalSecretValue = msalSecretValue?.value || "";
        msalTenantId = msalTenantId?.value || "";
        msalFromEmail = msalFromEmail?.value || "";
        msalFromName = msalFromName?.value || "";

        let config = {
          client_id: msalClientId,
          secret_value: msalSecretValue,
          tenant_id: msalTenantId,
          from_email: msalFromEmail,
          from_name: msalFromName
        }

        var response = await MailService.sendAzureM365Email(config, item);
        return
      } else if (configType === "smtp") {
        let mailServerHost = await SettingService.getSettingBySlug("mail_server_host") || null;
        let mailServerPort = await SettingService.getSettingBySlug("mail_server_port") || null;
        let mailAuthEmail = await SettingService.getSettingBySlug("mail_auth_email") || null;
        let mailAuthPassword = await SettingService.getSettingBySlug("mail_auth_password") || null;
        let mailFromEmail = await SettingService.getSettingBySlug("mail_from_email") || null;
        let mailFromName = await SettingService.getSettingBySlug("mail_from_name") || null;

        mailServerHost = mailServerHost?.value || process.env?.MAIL_SERVER_HOST || "";
        mailServerPort = mailServerPort?.value || process.env?.MAIL_SERVER_PORT || ""; mailAuthEmail = mailAuthEmail?.value || process.env?.MAIL_AUTH_EMAIL || "";
        mailAuthPassword = mailAuthPassword?.value || process.env?.MAIL_AUTH_PASSWORD || "";
        mailFromEmail = mailFromEmail?.value || process.env?.MAIL_FROM_EMAIL || "";
        mailFromName = mailFromName?.value || process.env?.MAIL_FROM_NAME || "";

        let config = {
          mail_host: mailServerHost,
          mail_port: mailServerPort,
          mail_auth_email: mailAuthEmail,
          mail_auth_password: mailAuthPassword,
          mail_from_email: mailFromEmail,
          mail_from_name: mailFromName
        }

        var response = await MailService.sendSimpleHtmlEmail(config, item);
        return
      } else {
        throw Error("sendPlatformTypeEmail -> No any email configuration found.")
      }
    }

    throw Error("No email config found.")
  } catch (error) {
    console.log("sendPlatformTypeEmail catch >>> ", error);
    throw Error(error)
  }
}

const getReplaceValue = (key = "", value = "", content = "") => {
  var regex = new RegExp(key, 'g');
  if (content && content?.replace(regex, value)) {
    return content.replace(regex, value)
  }

  return content;
}

const getReadFileContent = async (filePath = "") => {
  try {
    if (filePath) {
      const content = await fsPromise.readFile(filePath, 'utf8');
      return content;
    }

    return null;
  } catch (err) {
    console.log('getReadFileContent >>> ', err);
    return null;
  }
}

const getAIIntegrationCredentials = async () => {
  try {
    var aIService = await SettingService.getSettingBySlug("ai_integration_service") || null;
    var aiServiceAPISlug = `${aIService?.type}_${aIService?.value}_api_key`;
    if (aIService?.value && aiServiceAPISlug) {
      var aiApiKey = await SettingService.getSettingBySlug(aiServiceAPISlug) || null;
      if (aiApiKey?.value) {
        let configType = aIService.value;
        aiApiKey = aiApiKey?.value || "";

        let config = {
          type: configType,
          api_key: aiApiKey,
        }

        return config;
      }
    }

    throw Error("No AI Integration credentials found.")
  } catch (error) {
    console.log("getAIIntegrationCredentials catch >>> ", error);
    throw Error(error)
  }
}

module.exports = {
  wazuhKey,
  openVASKey,
  helpdeskSupportTicketKey,
  netswitchThreatIntelKey,
  zendeskSupportTicketKey,

  moduleSlugs,
  modulesData,
  aiServiceTypes,

  isObjEmpty,
  createUpdateEventLog,
  getRelativePath,
  generateCode,
  sendSMS,
  sendVerification,
  formatDate,
  splitWithPipe,
  getToolsPermissions,
  removeWhiteSpaceString,
  createUpdateCronEventLog,
  sendPlatformTypeEmail,
  getReplaceValue,
  getReadFileContent,
  getAIIntegrationCredentials
}
