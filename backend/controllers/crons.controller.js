const cron = require('node-cron')
var axios = require("axios")
var https = require("https")

var moment = require('moment')

var CronSchedulerService = require('../services/cronScheduler.service')
var ConnetionService = require('../services/connection.service')
var WazuhIndexerService = require('../services/wazuhIndexer.service')
var AgentService = require("../services/agent.service")
var ConfigurationAssessmentService = require("../services/configurationAssessment.service")
var HelpdeskSupportService = require("../services/helpdeskSupport.service")
var CronSchedulerErrorService = require('../services/cronSchedulerError.service')

var FrameworkService = require('../services/framework.service')
var ControlService = require("../services/control.service")
var CISControlService = require("../services/CISControl.service")

const { wazuhKey, isObjEmpty, formatDate, getToolsPermissions } = require('../helper')

/* Dynamic cron schedulling management */
const timezone = "UTC";
const activeCronJobs = new Map(); // Key: job ID, Value: cron job instance

const cronTaskFuntions = {
    test: () => testFun(),
    'wazuh-indexer-severity': () => wazuhIndexerSeverityData(),
    'wazuh-tool-agents': () => wazuhToolAgentsData(),
    'wazuh-tool-configuration-assessment': () => wazuhToolAgentsConfigurationAssessmentData(),
    'helpdesk-support-ticket': () => helpdeskSupportTicketData()
}

async function testFun() {
    console.log("testFun1...")
}

async function initializeJobs() {
    var cronSchedulers = await CronSchedulerService.getCronSchedulers({ status: true, deletedAt: null })
    if (cronSchedulers && cronSchedulers?.length) {
        cronSchedulers.forEach((cronScheduler) => {
            // console.log("initializeJobs >>> ", cronSchedulers, activeCronJobs, Object.keys(activeCronJobs).length)
            if (cronScheduler?._id && cronScheduler?.slug && cronScheduler?.cron_style) {
                if (cronTaskFuntions[cronScheduler.slug]) {
                    scheduleCronJob(cronScheduler._id, cronScheduler.cron_style, cronTaskFuntions[cronScheduler.slug])
                }
            }
        })
    }
}

function scheduleCronJob(id, cronStyle, taskFunction) {
    try {
        if (!cron.validate(cronStyle)) {
            console.log(`Invalid cron style: ${cronStyle}`)
            return;
        }

        if (id) { id = id.toString(); }

        if (cron.validate(cronStyle)) {
            // Schedule the job
            const job = cron.schedule(cronStyle, taskFunction, { timezone: timezone })

            // Store the job and its function in the Map
            activeCronJobs.set(id, { jobInstance: job, taskFunction })

            console.log(`Job ${id} started with cron style: ${cronStyle}`)
        }
    } catch (error) {
        console.log("scheduleCronJob catch >>> ", error)
    }
}

function stopCronJob(id) {
    try {
        if (id) { id = id.toString(); }

        if (activeCronJobs && activeCronJobs?.size > 0 && activeCronJobs.has(id)) {
            const jobDetails = activeCronJobs.get(id);
            if (jobDetails) {
                jobDetails.jobInstance.stop(); // Stop the cron job
                activeCronJobs.delete(id); // Remove from Map
                console.log(`Job ${id} stopped.`);
            } else {
                console.log(`Job ${id} not found.`);
            }
        }
    } catch (error) {
        console.log("stopCronJob catch >>> ", error)
    }
}

initializeJobs();
/* /Dynamic cron schedulling management */

/* Enable/Disable Connection and Cron Scheduler */
async function manageConnectionAndCronSchedulers() {
    try {
        var currentDateTime = new Date();

        var toolsPermission = await getToolsPermissions();
        /* Connection Enable/Disable */
        // var updateCnStatusDisableIds = [];
        // var disableConnections = await ConnetionService.getConnections({ status: true, deletedAt: null, tool_id: { $nin: toolsPermission } })
        // if (disableConnections?.length) {
        //     for (let i = 0; i < disableConnections.length; i++) {
        //         let disableConnItm = disableConnections[i]
        //         if (disableConnItm?._id) { updateCnStatusDisableIds.push(disableConnItm._id); }
        //     }
        // }

        // if (updateCnStatusDisableIds?.length) {
        //     await ConnetionService.updateManyConnection({ _id: { $in: updateCnStatusDisableIds } }, { status: false, deletedAt: currentDateTime })
        // }

        // var updateCnStatusEnableIds = [];
        // var enableConnections = await ConnetionService.getConnections({ status: false, deletedAt: { $ne: null }, tool_id: { $in: toolsPermission } })
        // if (enableConnections?.length) {
        //     for (let i = 0; i < enableConnections.length; i++) {
        //         let enableConnItm = enableConnections[i]
        //         if (enableConnItm?._id) { updateCnStatusEnableIds.push(enableConnItm._id); }
        //     }
        // }

        // if (updateCnStatusEnableIds?.length) {
        //     await ConnetionService.updateManyConnection({ _id: { $in: updateCnStatusEnableIds } }, { status: true, deletedAt: null })
        // }
        /* /Connection Enable/Disable */

        /* Cron Scheduler Enable/Disable */
        var updateCrnStatusDisableIds = [];
        var stopCronSchedulers = await CronSchedulerService.getCronSchedulers({ status: true, deletedAt: null, tool_id: { $nin: toolsPermission } })
        if (stopCronSchedulers?.length) {
            for (let i = 0; i < stopCronSchedulers.length; i++) {
                let stopCronItm = stopCronSchedulers[i]
                if (stopCronItm?._id) {
                    stopCronJob(stopCronItm._id)
                    updateCrnStatusDisableIds.push(stopCronItm?._id)
                }
            }
        }

        if (updateCrnStatusDisableIds?.length) {
            await CronSchedulerService.updateManyCronScheduler({ _id: { $in: updateCrnStatusDisableIds } }, { status: false, deletedAt: currentDateTime })
        }

        var updateCrnStatusEnableIds = [];
        var startCronSchedulers = await CronSchedulerService.getCronSchedulers({ status: false, deletedAt: { $ne: null }, tool_id: { $in: toolsPermission } })
        if (startCronSchedulers?.length) {
            for (let i = 0; i < startCronSchedulers.length; i++) {
                let startCronItm = startCronSchedulers[i]
                if (startCronItm?._id && startCronItm?.slug && startCronItm?.cron_style && cronTaskFuntions[startCronItm.slug]) {
                    scheduleCronJob(startCronItm._id, startCronItm.cron_style, cronTaskFuntions[startCronItm.slug])
                    updateCrnStatusEnableIds.push(startCronItm?._id)
                }
            }
        }

        if (updateCrnStatusEnableIds?.length) {
            await CronSchedulerService.updateManyCronScheduler({ _id: { $in: updateCrnStatusEnableIds } }, { status: true, deletedAt: null })
        }
        /* /Cron Scheduler Enable/Disable */
        console.log("manageConnectionAndCronSchedulers Called >>> ", currentDateTime);

        return { flag: true, message: "Cron scheduler and connection managed." }
    } catch (error) {
        console.log("manageConnectionAndCronSchedulers catch >>> ", error)
        return { flag: false, message: error.message }
    }
}

async function createCronSchedulerErrorData(payload = null) {
    try {
        if (!payload) {
            return { flag: false, message: "Cron scheduler error payload is empty." }
        } else if (payload && isObjEmpty(payload)) {
            return { flag: false, message: "Cron scheduler error payload is empty." }
        }

        if (!payload?.connection_id && payload?.connection_type) {
            var connection = await ConnetionService.getConnectionOne({ type: payload.connection_type, status: true, deletedAt: null });
            if (connection?._id) { payload.connection_id = connection._id; }
        }

        if (!payload?.cron_scheduler_id && payload?.slug) {
            var cronScheduler = await CronSchedulerService.getCronSchedulerOne({ slug: payload.slug, status: true, deletedAt: null });
            if (cronScheduler?._id) {
                payload.cron_scheduler_id = cronScheduler._id;
                payload.cron_style = cronScheduler?.cron_style || "";
                payload.cron_style_disabled = cronScheduler?.cron_style_disabled || false;
            }
        }

        // console.log("createCronSchedulerErrorData >>> ", payload)
        await CronSchedulerErrorService.createCronSchedulerError(payload)
        return { flag: true, message: "Cron scheduler error log created." }
    } catch (error) {
        console.log("createCronSchedulerErrorData catch >>> ", error)
        return { flag: false, message: error.message }
    }
}

cron.schedule("30 * * * *", async (res) => {
    await manageConnectionAndCronSchedulers();
}, {
    scheduled: true,
    timezone: timezone
})
/* /Enable/Disable Connection and Cron Scheduler */

async function wazuhIndexerSeverityData() {
    var connectionType = "wazuh-indexer";
    var cronSchdlSlug = "wazuh-indexer-severity";
    var createCronErrorLog = false;
    var errorLogType = "";
    var errorLogMessage = "";
    var errorLogDescription = "";
    var apiErrorLog = null;
    try {
        var cronScheduler = await CronSchedulerService.getCronSchedulerOne({ slug: cronSchdlSlug, status: true, deletedAt: null })

        var connection = await ConnetionService.getConnectionOne({ type: connectionType, status: true, deletedAt: null })
        if (connection?._id && connection?.username && connection?.ip_address) {
            var userName = connection.username;
            var password = connection?.password || "";
            var rowCredentials = userName;
            if (password) {
                rowCredentials = `${rowCredentials}:${password}`;
            }

            var todayDate = formatDate(null, "YYYY-MM-DD");
            var currentTimeHour = formatDate(null, "HH:mm");

            // Get the current time
            var currentTime = moment();
            var dateTime = moment();
            var allowToCreate = false;

            var lastWazuhIndexer = await WazuhIndexerService.getWazuhIndexerOne({ deletedAt: null }, 'createdAt', -1) || null;
            if (!lastWazuhIndexer || !lastWazuhIndexer?._id) { allowToCreate = true; }

            if (lastWazuhIndexer?._id && lastWazuhIndexer?.date_time) {
                // Get the difference in minutes
                var lastRecordTime = moment(lastWazuhIndexer.date_time);
                var differenceInHours = currentTime.diff(lastRecordTime, 'minutes');
                if ((differenceInHours >= 55 && differenceInHours <= 65) || differenceInHours >= 60) { allowToCreate = true; }
            }

            if (allowToCreate) {
                const agent = new https.Agent({ rejectUnauthorized: false })
                var credentials = new Buffer.from(rowCredentials, "utf8").toString("base64")

                var url = `https://${connection.ip_address}`;
                if (connection?.port) {
                    url = `${url}:${connection.port}`;
                }

                var lowSeverityHitsCount = 0;
                var lowSeverityHitsContent = null;

                var mediumSeverityHitsCount = 0;
                var mediumSeverityHitsContent = null;

                var highSeverityHitsCount = 0;
                var highSeverityHitsContent = null;

                var criticalSeverityHitsCount = 0;
                var criticalSeverityHitsContent = null;

                var lowRangeLevel = { "rule.level": { gte: 0, lte: 6 } }
                var mediumRangeLevel = { "rule.level": { gte: 7, lte: 11 } }
                var highRangeLevel = { "rule.level": { gte: 12, lte: 14 } }
                var criticalRangeLevel = { "rule.level": { gte: 15 } }

                url = `${url}/wazuh-alerts*/_search?pretty=true`;
                var headers = {
                    Authorization: `Basic ${credentials}`
                }

                var apiQuery = {
                    query: {
                        bool: {
                            must: [],
                            filter: [
                                {
                                    range: {
                                        timestamp: {
                                            gte: "now-1h",
                                            lte: "now",
                                            format: "epoch_millis"
                                        }
                                    }
                                },
                                { range: lowRangeLevel }
                            ],
                            should: [],
                            must_not: []
                        }
                    },
                    aggs: {
                        date_histogram_aggregation: {
                            date_histogram: {
                                field: "timestamp",
                                min_doc_count: 1, // Ensure empty buckets are excluded
                                fixed_interval: "1h"
                            }
                        }
                    },
                    script_fields: {},
                    // size: 10000,
                    sort: [],
                    stored_fields: ["*"]
                }

                var lowApiResponse = await axios.get(url, { data: apiQuery, headers, httpsAgent: agent }).then((res) => res.data).catch((error) => error)
                if (!lowApiResponse?.hits?.total && lowApiResponse?.response) {
                    createCronErrorLog = true;
                    errorLogType = "connection_cron_error";
                    errorLogMessage = "Please check your connection and cron details.";
                    errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection and cron details.`;
                    apiErrorLog = {
                        status: lowApiResponse.response?.status,
                        statusText: lowApiResponse.response?.statusText,
                        data: lowApiResponse.response?.data || null
                    }
                } else if (lowApiResponse?.hits?.total) {
                    lowSeverityHitsCount = lowApiResponse?.hits?.total?.value || 0;
                    lowSeverityHitsContent = lowApiResponse;
                }

                apiQuery.query.bool.filter[1].range = mediumRangeLevel;
                var mediumApiResponse = await axios.get(url, { data: apiQuery, headers, httpsAgent: agent }).then((res) => res.data).catch((error) => error)
                if (!mediumApiResponse?.hits?.total && mediumApiResponse?.response) {
                    createCronErrorLog = true;
                    errorLogType = "connection_cron_error";
                    errorLogMessage = "Please check your connection and cron details.";
                    errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection and cron details.`;
                    apiErrorLog = {
                        status: mediumApiResponse.response?.status,
                        statusText: mediumApiResponse.response?.statusText,
                        data: mediumApiResponse.response?.data || null
                    }
                } else if (mediumApiResponse?.hits?.total) {
                    mediumSeverityHitsCount = mediumApiResponse?.hits?.total?.value || 0;
                    mediumSeverityHitsContent = mediumApiResponse;
                }

                apiQuery.query.bool.filter[1].range = highRangeLevel;
                var highApiResponse = await axios.get(url, { data: apiQuery, headers, httpsAgent: agent }).then((res) => res.data).catch((error) => error)
                if (!highApiResponse?.hits?.total && highApiResponse?.response) {
                    createCronErrorLog = true;
                    errorLogType = "connection_cron_error";
                    errorLogMessage = "Please check your connection and cron details.";
                    errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection and cron details.`;
                    apiErrorLog = {
                        status: highApiResponse.response?.status,
                        statusText: highApiResponse.response?.statusText,
                        data: highApiResponse.response?.data || null
                    }
                } else if (highApiResponse?.hits?.total) {
                    highSeverityHitsCount = highApiResponse?.hits?.total?.value || 0;
                    highSeverityHitsContent = highApiResponse;
                }

                apiQuery.query.bool.filter[1].range = criticalRangeLevel;
                var criticalApiResponse = await axios.get(url, { data: apiQuery, headers, httpsAgent: agent }).then((res) => res.data).catch((error) => error)
                if (!criticalApiResponse?.hits?.total && criticalApiResponse?.response) {
                    createCronErrorLog = true;
                    errorLogType = "connection_cron_error";
                    errorLogMessage = "Please check your connection and cron details.";
                    errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection and cron details.`;
                    apiErrorLog = {
                        status: criticalApiResponse.response?.status,
                        statusText: criticalApiResponse.response?.statusText,
                        data: criticalApiResponse.response?.data || null
                    }
                } else if (criticalApiResponse?.hits?.total) {
                    criticalSeverityHitsCount = criticalApiResponse?.hits?.total?.value || 0;
                    criticalSeverityHitsContent = criticalApiResponse;
                }

                var wzhIndxPayload = {
                    type: "wazuh-indexer-statistics",
                    date: todayDate,
                    date_in_string: todayDate,
                    date_time: dateTime,
                    time: currentTimeHour,
                    low_severity_hits_count: lowSeverityHitsCount || 0,
                    low_severity_hits_content: lowSeverityHitsContent || null,
                    medium_severity_hits_count: mediumSeverityHitsCount || 0,
                    medium_severity_hits_content: mediumSeverityHitsContent || null,
                    high_severity_hits_count: highSeverityHitsCount || 0,
                    high_severity_hits_content: highSeverityHitsContent || null,
                    critical_severity_hits_count: criticalSeverityHitsCount || 0,
                    critical_severity_hits_content: criticalSeverityHitsContent || null
                }

                await WazuhIndexerService.createWazuhIndexer(wzhIndxPayload);
            }
            console.log("wazuhIndexerSeverityData >>> ", currentTimeHour, todayDate)
        } else {
            createCronErrorLog = true;
            errorLogType = "connection_setup";
            errorLogMessage = "Please setup connection data.";
            errorLogDescription = `Connection (${connectionType}): Please setup connection data.`;
        }

        if (createCronErrorLog) {
            const payload = {
                connection_id: connection?._id || null,
                cron_scheduler_id: cronScheduler?._id || null,
                tool_id: wazuhKey,
                date: new Date(),
                slug: cronSchdlSlug,
                cron_style: cronScheduler?.cron_style || "",
                cron_style_disabled: cronScheduler?.cron_style_disabled || false,
                description: errorLogDescription,
                error_logs: {
                    type: errorLogType,
                    cron_slug: cronSchdlSlug,
                    connection_slug: connectionType,
                    message: errorLogMessage,
                    api_errors: apiErrorLog
                },
                status: true
            }

            await createCronSchedulerErrorData(payload)
        }

        return { flag: true, message: "Wazuh indexer severity data fetched." }
    } catch (error) {
        console.log("wazuhIndexerSeverityData catch >>> ", error)
        createCronErrorLog = true;
        errorLogType = "cron_error";
        errorLogMessage = "Internal cron function error.";
        errorLogDescription = `Cron (${cronSchdlSlug}): Internal cron function error.`;
        apiErrorLog = {
            status: 400,
            statusText: error.message,
            data: null
        }

        if (createCronErrorLog) {
            const payload = {
                tool_id: wazuhKey,
                date: new Date(),
                slug: cronSchdlSlug,
                connection_type: connectionType,
                description: errorLogDescription,
                error_logs: {
                    type: errorLogType,
                    cron_slug: cronSchdlSlug,
                    connection_slug: connectionType,
                    message: errorLogMessage,
                    api_errors: apiErrorLog
                },
                status: true
            }

            await createCronSchedulerErrorData(payload)
        }

        return { flag: false, message: error.message }
    }
}

async function wazuhToolAgentsData() {
    var connectionType = "wazuh-tool";
    var cronSchdlSlug = "wazuh-tool-agents";
    var createCronErrorLog = false;
    var errorLogType = "";
    var errorLogMessage = "";
    var errorLogDescription = "";
    var apiErrorLog = null;
    try {
        var cronScheduler = await CronSchedulerService.getCronSchedulerOne({ slug: cronSchdlSlug, status: true, deletedAt: null });

        var connection = await ConnetionService.getConnectionOne({ type: connectionType, status: true, deletedAt: null });
        if (connection?._id && connection?.username && connection?.ip_address) {
            var userName = connection.username;
            var password = connection?.password || "";
            var rowCredentials = userName;
            if (password) {
                rowCredentials = `${rowCredentials}:${password}`;
            }

            const httpsAgent = new https.Agent({ rejectUnauthorized: false })
            var credentials = new Buffer.from(rowCredentials, "utf8").toString("base64")

            var url = `https://${connection.ip_address}`;
            if (connection?.port) {
                url = `${url}:${connection.port}`;
            }

            var tokenUrl = `${url}/security/user/authenticate`;
            var headers = {
                Authorization: `Basic ${credentials}`
            }

            var tokenApiResponse = await axios.get(tokenUrl, { headers, httpsAgent })
                .then((res) => res.data).catch((error) => error)
            if (!tokenApiResponse?.data?.token && tokenApiResponse?.response) {
                createCronErrorLog = true;
                errorLogType = "connection_error";
                errorLogMessage = "Please check your connection credentials.";
                errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection credentials.`;
                apiErrorLog = {
                    status: tokenApiResponse.response?.status,
                    statusText: tokenApiResponse.response?.statusText,
                    data: tokenApiResponse.response?.data || null
                }
            } else if (tokenApiResponse?.data?.token) {
                var accessToken = tokenApiResponse.data.token;

                var agentsUrl = `${url}/agents`;
                var headers = {
                    Authorization: `Bearer ${accessToken}`
                }

                var apiResponse = await axios.get(agentsUrl, { headers, httpsAgent })
                    .then((res) => res.data).catch((error) => error)
                if (!apiResponse?.data?.affected_items && apiResponse?.response) {
                    createCronErrorLog = true;
                    errorLogType = "connection_cron_error";
                    errorLogMessage = "Please check your connection and cron details.";
                    errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection and cron details.`;
                    apiErrorLog = {
                        status: apiResponse.response?.status,
                        statusText: apiResponse.response?.statusText,
                        data: apiResponse.response?.data || null
                    }
                } else if (apiResponse?.data?.affected_items) {
                    var affectedItems = apiResponse.data.affected_items;
                    for (let i = 0; i < affectedItems.length; i++) {
                        var affectedItem = affectedItems[i];
                        var refId = affectedItem?.id || "";
                        if (refId) {
                            var agent = await AgentService.getAgentOne({ ref_id: refId });
                            if (agent?._id) {
                                await AgentService.updateAgent({ ...affectedItem, ref_id: refId, _id: agent._id });
                            } else {
                                await AgentService.createAgent({ ...affectedItem, ref_id: refId });
                            }
                        }
                    }

                    console.log("wazuhToolAgentsData >>> ", affectedItems?.length);
                }
            }
        } else {
            createCronErrorLog = true;
            errorLogType = "connection_setup";
            errorLogMessage = "Please setup connection data.";
            errorLogDescription = `Connection (${connectionType}): Please setup connection data.`;
        }

        if (createCronErrorLog) {
            const payload = {
                connection_id: connection?._id || null,
                cron_scheduler_id: cronScheduler?._id || null,
                tool_id: wazuhKey,
                date: new Date(),
                slug: cronSchdlSlug,
                cron_style: cronScheduler?.cron_style || "",
                cron_style_disabled: cronScheduler?.cron_style_disabled || false,
                description: errorLogDescription,
                error_logs: {
                    type: errorLogType,
                    cron_slug: cronSchdlSlug,
                    connection_slug: connectionType,
                    message: errorLogMessage,
                    api_errors: apiErrorLog
                },
                status: true
            }

            await createCronSchedulerErrorData(payload)
        }

        return { flag: true, message: "Wazuh tool agents data fetched." }
    } catch (error) {
        console.log("wazuhToolAgentsData catch >>> ", error)
        createCronErrorLog = true;
        errorLogType = "cron_error";
        errorLogMessage = "Internal cron function error.";
        errorLogDescription = `Cron (${cronSchdlSlug}): Internal cron function error.`;
        apiErrorLog = {
            status: 400,
            statusText: error.message,
            data: null
        }

        if (createCronErrorLog) {
            const payload = {
                tool_id: wazuhKey,
                date: new Date(),
                slug: cronSchdlSlug,
                connection_type: connectionType,
                description: errorLogDescription,
                error_logs: {
                    type: errorLogType,
                    cron_slug: cronSchdlSlug,
                    connection_slug: connectionType,
                    message: errorLogMessage,
                    api_errors: apiErrorLog
                },
                status: true
            }

            await createCronSchedulerErrorData(payload)
        }

        return { flag: false, message: error.message }
    }
}

async function wazuhToolAgentsConfigurationAssessmentData() {
    var connectionType = "wazuh-tool";
    var cronSchdlSlug = "wazuh-tool-configuration-assessment";
    var createCronErrorLog = false;
    var errorLogType = "";
    var errorLogMessage = "";
    var errorLogDescription = "";
    var apiErrorLog = null;
    try {
        var cronScheduler = await CronSchedulerService.getCronSchedulerOne({ slug: cronSchdlSlug, status: true, deletedAt: null });

        var agents = await AgentService.getAgents({ status: 'active' });
        if (agents?.length) {
            var connection = await ConnetionService.getConnectionOne({ type: connectionType, status: true, deletedAt: null });
            if (connection?._id && connection?.username && connection?.ip_address) {
                var userName = connection.username;
                var password = connection?.password || "";
                var rowCredentials = userName;
                if (password) {
                    rowCredentials = `${rowCredentials}:${password}`;
                }

                var todayDate = formatDate(null, "YYYY-MM-DD");

                const httpsAgent = new https.Agent({ rejectUnauthorized: false })
                var credentials = new Buffer.from(rowCredentials, "utf8").toString("base64")

                var url = `https://${connection.ip_address}`;
                if (connection?.port) {
                    url = `${url}:${connection.port}`;
                }

                var tokenUrl = `${url}/security/user/authenticate`;
                var headers = {
                    Authorization: `Basic ${credentials}`
                }

                var tokenApiResponse = await axios.get(tokenUrl, { headers, httpsAgent })
                    .then((res) => res.data).catch((error) => error)
                if (!tokenApiResponse?.data?.token && tokenApiResponse?.response) {
                    createCronErrorLog = true;
                    errorLogType = "connection_error";
                    errorLogMessage = "Please check your connection credentials.";
                    errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection credentials.`;
                    apiErrorLog = {
                        status: tokenApiResponse.response?.status,
                        statusText: tokenApiResponse.response?.statusText,
                        data: tokenApiResponse.response?.data || null
                    }
                } else if (tokenApiResponse?.data?.token) {
                    var accessToken = tokenApiResponse.data.token;

                    var scaUrl = `${url}/sca`;
                    var headers = {
                        Authorization: `Bearer ${accessToken}`
                    }

                    for (let i = 0; i < agents.length; i++) {
                        var agent = agents[i];
                        var agnRefId = agent?.ref_id || "";
                        if (agnRefId) {
                            var apiResponse = await axios.get(`${scaUrl}/${agnRefId}`, { headers, httpsAgent }).then((res) => res.data).catch((error) => error)
                            if (!apiResponse?.data?.affected_items && apiResponse?.response) {
                                createCronErrorLog = true;
                                errorLogType = "connection_cron_error";
                                errorLogMessage = "Please check your connection and cron details.";
                                errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection and cron details.`;
                                apiErrorLog = {
                                    status: apiResponse.response?.status,
                                    statusText: apiResponse.response?.statusText,
                                    agent_ref_id: agnRefId,
                                    data: apiResponse.response?.data || null
                                }
                            } else if (apiResponse?.data?.affected_items?.length) {
                                var configurationAssessment = await ConfigurationAssessmentService.getConfigurationAssessmentOne({ agent_ref_id: agnRefId, date_in_string: todayDate });
                                if (configurationAssessment?._id) {
                                    await ConfigurationAssessmentService.updateConfigurationAssessment({
                                        ...apiResponse.data.affected_items[0],
                                        _id: configurationAssessment._id
                                    })
                                } else {
                                    await ConfigurationAssessmentService.createConfigurationAssessment({
                                        ...apiResponse.data.affected_items[0],
                                        date_in_string: todayDate,
                                        agent_ref_id: agnRefId
                                    })
                                }
                            }
                        }
                    }
                }

                console.log("wazuhToolAgentsConfigurationAssessmentData >>> ", todayDate);
            }
        } else {
            createCronErrorLog = true;
            errorLogType = "connection_setup";
            errorLogMessage = "Please setup connection data.";
            errorLogDescription = `Connection (${connectionType}): Please setup connection data.`;
        }

        if (createCronErrorLog) {
            const payload = {
                connection_id: connection?._id || null,
                cron_scheduler_id: cronScheduler?._id || null,
                tool_id: wazuhKey,
                date: new Date(),
                slug: cronSchdlSlug,
                cron_style: cronScheduler?.cron_style || "",
                cron_style_disabled: cronScheduler?.cron_style_disabled || false,
                description: errorLogDescription,
                error_logs: {
                    type: errorLogType,
                    cron_slug: cronSchdlSlug,
                    connection_slug: connectionType,
                    message: errorLogMessage,
                    api_errors: apiErrorLog
                },
                status: true
            }

            await createCronSchedulerErrorData(payload)
        }

        return { flag: true, message: "Wazuh tool agents configuration assessment data fetched." }
    } catch (error) {
        console.log("wazuhToolAgentsConfigurationAssessmentData catch >>> ", error)
        createCronErrorLog = true;
        errorLogType = "cron_error";
        errorLogMessage = "Internal cron function error.";
        errorLogDescription = `Cron (${cronSchdlSlug}): Internal cron function error.`;
        apiErrorLog = {
            status: 400,
            statusText: error.message,
            data: null
        }

        if (createCronErrorLog) {
            const payload = {
                tool_id: wazuhKey,
                date: new Date(),
                slug: cronSchdlSlug,
                connection_type: connectionType,
                description: errorLogDescription,
                error_logs: {
                    type: errorLogType,
                    cron_slug: cronSchdlSlug,
                    connection_slug: connectionType,
                    message: errorLogMessage,
                    api_errors: apiErrorLog
                },
                status: true
            }

            await createCronSchedulerErrorData(payload)
        }

        return { flag: false, message: error.message }
    }
}

async function helpdeskSupportTicketData() {
    var connectionType = "helpdesk-support-ticket";
    var cronSchdlSlug = "helpdesk-support-ticket";
    var createCronErrorLog = false;
    var errorLogType = "";
    var errorLogMessage = "";
    var errorLogDescription = "";
    var apiErrorLog = null;
    try {
        var cronScheduler = await CronSchedulerService.getCronSchedulerOne({ slug: cronSchdlSlug, status: true, deletedAt: null });

        var connection = await ConnetionService.getConnectionOne({ type: connectionType, status: true, deletedAt: null });
        if (connection?._id && connection?.password && connection?.ip_address) {
            var userName = connection.username;
            var password = connection?.password || "";

            const httpsAgent = new https.Agent({ rejectUnauthorized: false })

            var url = `${connection.ip_address}`;
            if (connection?.port) {
                url = `${url}:${connection.port}`;
            }

            var currentTimeHour = formatDate(null, "HH:mm");
            var dateTime = moment();
            var todayDate = formatDate(null, "YYYY-MM-DD");

            if (currentTimeHour == "00:00") {
                var previousDate = new Date(todayDate);
                previousDate.setUTCDate(previousDate.getUTCDate() - 1)
                previousDate.setUTCHours(0, 0, 0, 0);

                todayDate = formatDate(previousDate, "YYYY-MM-DD");
                dateTime = moment(todayDate)
            }

            var startDate = new Date(todayDate);
            startDate.setUTCHours(0, 0, 0, 0);

            var endDate = new Date(startDate);
            endDate.setUTCDate(endDate.getUTCDate()); // Move to the next day
            endDate.setUTCHours(23, 59, 59, 999);

            var helpdeskSupport = await HelpdeskSupportService.getHelpdeskSupportOne({ date_in_string: todayDate })

            var queries = {
                closed_request: {
                    list_info: {
                        fields_required: ["sla", "status", "created_time"],
                        search_criteria: [
                            { condition: "is", field: "status.name", value: "close" },
                            { condition: "gte", field: "created_time", logical_operator: "and", value: startDate.getTime().toString() },
                            { condition: "lte", field: "created_time", logical_operator: "and", value: endDate.getTime().toString() }
                        ]
                    }
                },
                open_request: {
                    list_info: {
                        fields_required: ["technician", "status", "created_time"],
                        search_criteria: [
                            { condition: "is", field: "status.name", value: "open" },
                            { condition: "gte", field: "created_time", logical_operator: "and", value: startDate.getTime().toString() },
                            { condition: "lte", field: "created_time", logical_operator: "and", value: endDate.getTime().toString() }
                        ]
                    }
                },
                received_request: {
                    list_info: {
                        fields_required: ["sla", "created_time", "sla_violated_technician", "sla_violated_group"],
                        search_criteria: [
                            { condition: "gte", field: "created_time", value: startDate.getTime().toString() },
                            { condition: "lte", field: "created_time", logical_operator: "and", value: endDate.getTime().toString() }
                        ]
                    }
                },
                request_summary: {
                    list_info: {
                        fields_required: ["is_overdue", "completed_time"],
                        search_criteria: [
                            { condition: "gte", field: "created_time", value: startDate.getTime().toString() },
                            { condition: "lte", field: "created_time", logical_operator: "and", value: endDate.getTime().toString() }
                        ]
                    }
                },
                sla_violated: {
                    list_info: {
                        fields_required: ["sla", "status", "created_time"],
                        search_criteria: [
                            { condition: "gte", field: "created_time", value: startDate.getTime().toString() },
                            { condition: "lte", field: "created_time", logical_operator: "and", value: endDate.getTime().toString() }
                        ]
                    }
                }
            }

            var apiResponseData = {
                closed_request_content: helpdeskSupport?.closed_request_content || null,
                open_request_content: helpdeskSupport?.open_request_content || null,
                received_request_content: helpdeskSupport?.received_request_content || null,
                request_summary_content: helpdeskSupport?.request_summary_content || null,
                sla_violated_request_content: helpdeskSupport?.sla_violated_request_content || null
            }

            var closedQueryParams = encodeURIComponent(JSON.stringify(queries.closed_request));
            var openQueryParams = encodeURIComponent(JSON.stringify(queries.open_request));
            var receivedQueryParams = encodeURIComponent(JSON.stringify(queries.received_request));
            var summaryQueryParams = encodeURIComponent(JSON.stringify(queries.request_summary));
            var slaViolatedQueryParams = encodeURIComponent(JSON.stringify(queries.sla_violated));

            url = `${url}/v3/requests?input_data=`;
            var headers = { Authtoken: password }
            var apiClosedResponse = await axios.get(`${url}${closedQueryParams}`, { headers, httpsAgent }).then((res) => res.data).catch((error) => error)
            if (!apiClosedResponse?.response_status && apiClosedResponse?.response) {
                createCronErrorLog = true;
                errorLogType = "connection_cron_error";
                errorLogMessage = "Please check your connection and cron details.";
                errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection and cron details.`;
                apiErrorLog = {
                    status: apiClosedResponse.response?.status,
                    statusText: apiClosedResponse.response?.statusText,
                    data: apiClosedResponse.response?.data || null
                }
            } else if (apiClosedResponse?.response_status && apiClosedResponse?.list_info) {
                apiResponseData.closed_request_content = apiClosedResponse;
            }

            var apiSummaryResponse = await axios.get(`${url}${summaryQueryParams}`, { headers, httpsAgent }).then((res) => res.data).catch((error) => error)
            if (!apiSummaryResponse?.response_status && apiSummaryResponse?.response) {
                createCronErrorLog = true;
                errorLogType = "connection_cron_error";
                errorLogMessage = "Please check your connection and cron details.";
                errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection and cron details.`;
                apiErrorLog = {
                    status: apiSummaryResponse.response?.status,
                    statusText: apiSummaryResponse.response?.statusText,
                    data: apiSummaryResponse.response?.data || null
                }
            } else if (apiSummaryResponse?.response_status && apiSummaryResponse?.list_info) {
                apiResponseData.request_summary_content = apiSummaryResponse;
            }

            var apiOpenResponse = await axios.get(`${url}${openQueryParams}`, { headers, httpsAgent }).then((res) => res.data).catch((error) => error)
            if (!apiOpenResponse?.response_status && apiOpenResponse?.response) {
                createCronErrorLog = true;
                errorLogType = "connection_cron_error";
                errorLogMessage = "Please check your connection and cron details.";
                errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection and cron details.`;
                apiErrorLog = {
                    status: apiOpenResponse.response?.status,
                    statusText: apiOpenResponse.response?.statusText,
                    data: apiOpenResponse.response?.data || null
                }
            } else if (apiOpenResponse?.response_status && apiOpenResponse?.list_info) {
                apiResponseData.open_request_content = apiOpenResponse;
            }

            var apiReceivedResponse = await axios.get(`${url}${receivedQueryParams}`, { headers, httpsAgent }).then((res) => res.data).catch((error) => error)
            if (!apiReceivedResponse?.response_status && apiReceivedResponse?.response) {
                createCronErrorLog = true;
                errorLogType = "connection_cron_error";
                errorLogMessage = "Please check your connection and cron details.";
                errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection and cron details.`;
                apiErrorLog = {
                    status: apiReceivedResponse.response?.status,
                    statusText: apiReceivedResponse.response?.statusText,
                    data: apiReceivedResponse.response?.data || null
                }
            } else if (apiReceivedResponse?.response_status && apiReceivedResponse?.list_info) {
                apiResponseData.request_summary_content = apiReceivedResponse;
            }

            var apiSlaViolatedResponse = await axios.get(`${url}${slaViolatedQueryParams}`, { headers, httpsAgent }).then((res) => res.data).catch((error) => error)
            if (!apiSlaViolatedResponse?.response_status && apiSlaViolatedResponse?.response) {
                createCronErrorLog = true;
                errorLogType = "connection_cron_error";
                errorLogMessage = "Please check your connection and cron details.";
                errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection and cron details.`;
                apiErrorLog = {
                    status: apiSlaViolatedResponse.response?.status,
                    statusText: apiSlaViolatedResponse.response?.statusText,
                    data: apiSlaViolatedResponse.response?.data || null
                }
            } else if (apiSlaViolatedResponse?.response_status && apiSlaViolatedResponse?.list_info) {
                apiResponseData.sla_violated_request_content = apiSlaViolatedResponse;
            }

            if (helpdeskSupport?._id) {
                await HelpdeskSupportService.updateHelpdeskSupport({
                    ...apiResponseData,
                    date: todayDate,
                    date_time: dateTime,
                    time: currentTimeHour,
                    date_in_string: todayDate,
                    _id: helpdeskSupport._id
                })
            } else {
                await HelpdeskSupportService.createHelpdeskSupport({
                    ...apiResponseData,
                    date: todayDate,
                    date_time: dateTime,
                    time: currentTimeHour,
                    date_in_string: todayDate
                })
            }

            console.log("helpdeskSupportTicketData >>> ", currentTimeHour, todayDate)
        } else {
            createCronErrorLog = true;
            errorLogType = "connection_setup";
            errorLogMessage = "Please setup connection data.";
            errorLogDescription = `Connection (${connectionType}): Please setup connection data.`;
        }

        if (createCronErrorLog) {
            const payload = {
                connection_id: connection?._id || null,
                cron_scheduler_id: cronScheduler?._id || null,
                tool_id: wazuhKey,
                date: new Date(),
                slug: cronSchdlSlug,
                cron_style: cronScheduler?.cron_style || "",
                cron_style_disabled: cronScheduler?.cron_style_disabled || false,
                description: errorLogDescription,
                error_logs: {
                    type: errorLogType,
                    cron_slug: cronSchdlSlug,
                    connection_slug: connectionType,
                    message: errorLogMessage,
                    api_errors: apiErrorLog
                },
                status: true
            }

            await createCronSchedulerErrorData(payload)
        }

        return { flag: true, message: "Helpdesk Support Ticket data fetched." }
    } catch (error) {
        console.log("helpdeskSupportTicketData catch >>> ", error)
        createCronErrorLog = true;
        errorLogType = "cron_error";
        errorLogMessage = "Internal cron function error.";
        errorLogDescription = `Cron (${cronSchdlSlug}): Internal cron function error.`;
        apiErrorLog = {
            status: 400,
            statusText: error.message,
            data: null
        }

        if (createCronErrorLog) {
            const payload = {
                tool_id: wazuhKey,
                date: new Date(),
                slug: cronSchdlSlug,
                connection_type: connectionType,
                description: errorLogDescription,
                error_logs: {
                    type: errorLogType,
                    cron_slug: cronSchdlSlug,
                    connection_slug: connectionType,
                    message: errorLogMessage,
                    api_errors: apiErrorLog
                },
                status: true
            }

            await createCronSchedulerErrorData(payload)
        }

        return { flag: false, message: error.message }
    }
}

async function testScriptData() {
    try {
        const value = 3077;

        // Fetch data from the API
        const apiResponse = await axios
            .get("http://localhost:3001/v1/getAllData")
            .then((res) => res.data)
            .catch((error) => {
                console.error("Error fetching API data:", error);
                throw new Error("Failed to fetch data from the API");
            });

        console.log(apiResponse, "apiResponse");

        if (apiResponse?.message?.length > 0) {
            for (let i = 0; i < apiResponse?.message.length; i++) {
                const framework = apiResponse?.message[i];

                // Check if the framework already exists
                let existingFramework = await FrameworkService.getframeworkByName(framework?.frameworkName);

                if (!existingFramework) {
                    // Generate slug
                    const slug = framework?.frameworkName
                        ?.toString()                // Ensure it's a string
                        .trim()                     // Remove leading and trailing spaces
                        .toLowerCase()              // Convert to lowercase
                        .replace(/[^a-z0-9 -]/g, "") // Remove special characters
                        .replace(/\s+/g, "-")       // Replace spaces with hyphens
                        .replace(/-+/g, "-");

                    // Create the framework
                    existingFramework = await FrameworkService.createFramework({
                        value: value + i,
                        label: framework?.frameworkName,
                        slug: slug,
                        status: 1,
                    });
                }

                // Check and create control
                let existingControl = await ControlService.findControlByName(framework?.controllername);
                if (!existingControl) {
                    existingControl = await ControlService.createControl({
                        framework_id: existingFramework?._id,
                        identifier: framework?.identifier,
                        name: framework?.controllername,
                        description: framework?.description,
                        icon: "SIEM",
                        status: 1,
                    });

                    console.log(`Control created:`, existingControl);
                }

                // Check and create sub-control
                if (existingControl?._id) {
                    const subControl = await CISControlService.createCISControl({
                        framework_id: existingFramework?._id,
                        control_id: existingControl?._id,
                        cis_control: framework?.content[0]?.CIS_Control,
                        cis_sub_control: framework?.content[0]?.CIS_Safeguard,
                        control_num: framework?.content[0]?.Control_Num,
                        asset_type: framework?.content[0]?.Asset_Type,
                        security_function: framework?.content[0]?.Security_Function,
                        name: framework?.safeguardtitle,
                        description: framework?.safeguarddescription,
                        tool_icon: "SIEM",
                        icon: "SIEM",
                        status: 1,
                    });

                    // Update the control with the new sub-control ID
                    await ControlService.updateArrayField(existingControl?._id, [subControl?._id]);

                    console.log(`Sub-control created and updated:`, subControl);
                }
            }
        } else {
            console.log("No data found in the API response.");
        }

        return "Data processed successfully.";
    } catch (error) {
        console.error("Error processing test script data:", error);
        return "An error occurred while processing data.";
    }
}

module.exports = {
    stopCronJob,
    scheduleCronJob,
    cronTaskFuntions,
    wazuhToolAgentsData,
    wazuhToolAgentsConfigurationAssessmentData,
    testScriptData
}
