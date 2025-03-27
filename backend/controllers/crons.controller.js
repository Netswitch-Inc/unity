const cron = require('node-cron')
const { CronExpressionParser } = require('cron-parser')

var axios = require("axios")
var https = require("https")

var moment = require('moment')

var CronSchedulerService = require('../services/cronScheduler.service')
var ConnetionService = require('../services/connection.service')
var EventLogService = require('../services/eventLog.service')

var FrameworkService = require('../services/framework.service')
var ControlService = require("../services/control.service")
var CISControlService = require("../services/CISControl.service")

var WazuhIndexerService = require('../services/wazuhIndexer.service')
var AgentService = require("../services/agent.service")
var ConfigurationAssessmentService = require("../services/configurationAssessment.service")
var HelpdeskSupportService = require("../services/helpdeskSupport.service")
var CronSchedulerErrorService = require('../services/cronSchedulerError.service')
var NetSwitchThreatIntelService = require('../services/netSwitchThreatIntel.service')
var NetswitchThreatIntelStatsService = require("../services/netswitchThreatIntelStats.service");


const {
    wazuhKey,
    netswitchThreatIntelKey,
    isObjEmpty,
    formatDate,
    getToolsPermissions,
    removeWhiteSpaceString
} = require('../helper')

const { createUpdateCronEventLog } = require("../helper");

/* Dynamic cron schedulling management */
const timezone = "UTC";
const cronParserOptions = {
    // strict: true, // Default: false
    tz: timezone
}
const activeCronJobs = new Map(); // Key: job ID, Value: cron job instance

const cronTaskFuntions = {
    test: () => testFunction(),
    'wazuh-indexer-severity': () => wazuhIndexerSeverityData(),
    'wazuh-tool-agents': () => wazuhToolAgentsData(),
    'wazuh-tool-configuration-assessment': () => wazuhToolAgentsConfigurationAssessmentData(),
    'helpdesk-support-ticket': () => helpdeskSupportTicketData(),
    'netswitch-threat-intel-txt-file': () => netswitchThreatIntelTxtData()
}

const getCronNextPrevTime = (expression = "") => {
    var current = null;
    var previous = null;
    var next = null;
    try {
        var expressionLen = removeWhiteSpaceString(expression).length || 0;
        if (expression && expressionLen >= 5) {
            var interval = CronExpressionParser.parse(expression, cronParserOptions);
            previous = interval?.prev()?.toString() || null;
            next = interval?.next()?.toString() || null;
            current = new Date().toUTCString();
            if (previous) { previous = new Date(previous).toUTCString(); }
            if (next) { next = new Date(next).toUTCString(); }
        }
    } catch (error) {
        current = null;
        previous = null;
        next = null;
        console.log("getCronNextPrevTime catch >>> ", error)
    }

    return { current, previous, next }
}

const testFunction = async () => {
    try {
        console.log("testFunction >>> ")
    } catch (error) {
        console.log("testFunction catch >>> ", error)
    }
}

const initializeJobs = async () => {
    try {
        var cronSchedulers = await CronSchedulerService.getCronSchedulers({ status: true, deletedAt: null })
        if (cronSchedulers && cronSchedulers?.length) {
            cronSchedulers.forEach((cronScheduler) => {
                // console.log("initializeJobs >>> ", cronSchedulers, activeCronJobs, Object.keys(activeCronJobs).length)
                if (cronScheduler?._id && cronScheduler?.slug && cronScheduler?.cron_style) {
                    if (cronTaskFuntions[cronScheduler.slug]) {
                        scheduleCronJob(cronScheduler._id, cronScheduler.slug, cronScheduler.cron_style, cronTaskFuntions[cronScheduler.slug], cronScheduler)
                    }
                }
            })
        }
    } catch (error) {
        console.log("initializeJobs catch >>> ", error)
    }
}

const scheduleCronJob = (id, slug, cronStyle, taskFunction, payload = null) => {
    try {
        if (!cron.validate(cronStyle)) {
            console.log(`Invalid cron style: ${cronStyle}`)
            return;
        }

        if (id) { id = id.toString(); }

        if (cron.validate(cronStyle)) {
            // Schedule the job
            const job = cron.schedule(cronStyle, taskFunction, { timezone: timezone })

            var currentTime = null;
            var previousTime = null;
            var nextTime = null;
            const cronTime = getCronNextPrevTime(cronStyle)
            if (cronTime?.current && cronTime?.previous && cronTime?.next) {
                currentTime = cronTime.current;
                previousTime = cronTime.previous;
                nextTime = cronTime.next;
            }

            // Store the job and its function in the Map
            activeCronJobs.set(slug, { id, slug, cronStyle, jobInstance: job, taskFunction, currentTime, previousTime, nextTime })

            console.log(`Job ${id} ${slug} started with cron style: ${cronStyle}`)
        }
    } catch (error) {
        console.log("scheduleCronJob catch >>> ", error)
    }
}

const updateScheduleCronLogTime = (slug) => {
    try {
        if (activeCronJobs && activeCronJobs?.size > 0 && activeCronJobs.has(slug)) {
            const jobDetails = activeCronJobs.get(slug);
            if (jobDetails && jobDetails?.cronStyle) {
                var currentTime = jobDetails?.current || null;
                var previousTime = jobDetails?.previous || null;
                var nextTime = jobDetails?.next || null;
                const cronTime = getCronNextPrevTime(jobDetails?.cronStyle)
                if (cronTime?.current && cronTime?.previous && cronTime?.next) {
                    currentTime = cronTime.current;
                    previousTime = cronTime.previous;
                    nextTime = cronTime.next;
                }

                jobDetails.currentTime = currentTime;
                jobDetails.previousTime = previousTime;
                jobDetails.nextTime = nextTime;
                activeCronJobs.set(slug, jobDetails)
            }
        }
    } catch (error) {
        console.log("updateScheduleCronLogTime catch >>> ", error)
    }
}

const stopCronJob = (id, slug) => {
    try {
        if (id) { id = id.toString(); }

        if (activeCronJobs && activeCronJobs?.size > 0 && activeCronJobs.has(slug)) {
            const jobDetails = activeCronJobs.get(slug);
            if (jobDetails) {
                jobDetails.jobInstance.stop(); // Stop the cron job
                activeCronJobs.delete(id); // Remove from Map
                console.log(`Job ${id} ${slug} stopped.`);
            } else {
                console.log(`Job ${id} ${slug} not found.`);
            }
        }
    } catch (error) {
        console.log("stopCronJob catch >>> ", error)
    }
}

initializeJobs();
/* /Dynamic cron schedulling management */

/* Enable/Disable Connection and Cron Scheduler */
const manageConnectionAndCronSchedulers = async () => {
    try {
        var currentDateTime = new Date();

        var toolsPermission = await getToolsPermissions();
        /* Connection Enable/Disable */
        // var updateCnStatusDisableIds = [];
        // var disableConnections = await ConnetionService.getConnections({ status: true, deletedAt: null, tool_slug: { $nin: toolsPermission } })
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
        // var enableConnections = await ConnetionService.getConnections({ status: false, deletedAt: { $ne: null }, tool_slug: { $in: toolsPermission } })
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
        var stopCronSchedulers = await CronSchedulerService.getCronSchedulers({ status: true, deletedAt: null, tool_slug: { $nin: toolsPermission } })
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
        var startCronSchedulers = await CronSchedulerService.getCronSchedulers({ status: false, deletedAt: { $ne: null }, tool_slug: { $in: toolsPermission } })
        if (startCronSchedulers?.length) {
            for (let i = 0; i < startCronSchedulers.length; i++) {
                let startCronItm = startCronSchedulers[i]
                if (startCronItm?._id && startCronItm?.slug && startCronItm?.cron_style && cronTaskFuntions[startCronItm.slug]) {
                    scheduleCronJob(startCronItm._id, startCronItm.slug, startCronItm.cron_style, cronTaskFuntions[startCronItm.slug])
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

const createCronSchedulerErrorData = async (payload = null) => {
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

/* Manage cron autorun error logs */
const manageCronNextAutorunErrorLogs = async () => {
    try {
        var cronSchedulers = await CronSchedulerService.getCronSchedulers({ status: true, deletedAt: null })
        if (cronSchedulers && cronSchedulers?.length) {
            for (let i = 0; i < cronSchedulers.length; i++) {
                let cronScheduler = cronSchedulers[i];
                if (cronScheduler?._id && cronScheduler?.slug && cronScheduler?.cron_style) {
                    var slug = cronScheduler.slug;
                    const hasCron = activeCronJobs.has(slug)
                    if (hasCron) {
                        const cronTime = getCronNextPrevTime(cronScheduler.cron_style)
                        const jobDetails = activeCronJobs.get(slug);
                        if (jobDetails?.nextTime && jobDetails?.previousTime && cronTime?.current) {
                            if (moment(cronTime.current).isAfter(jobDetails.nextTime)) {
                                const payload = {
                                    cron_scheduler_id: cronScheduler?._id || null,
                                    tool_slug: cronScheduler.tool_slug || "",
                                    date: new Date(),
                                    slug: slug,
                                    cron_style: cronScheduler?.cron_style || "",
                                    cron_style_disabled: cronScheduler?.cron_style_disabled || false,
                                    description: `Cron autorun (${slug}): Internal cron not running on time or something went wrong.`,
                                    error_logs: {
                                        type: "cron_autorun_error",
                                        cron_slug: slug,
                                        connection_slug: "",
                                        message: "Internal cron not running on time or something went wrong.",
                                        api_errors: null,
                                        cron_errors: {
                                            check_time: cronTime.current,
                                            previous_time: jobDetails?.previousTime || null,
                                            next_time: jobDetails?.nextTime || null,
                                            previous_updated_time: jobDetails?.currentTime || null,
                                        }
                                    },
                                    status: true
                                }

                                await createCronSchedulerErrorData(payload)
                            }
                        }
                    }
                }
            }
        }

        return { flag: true, message: "Cron next autorun error log managed." }
    } catch (error) {
        console.log("manageCronNextAutorunErrorLogs catch >>> ", error)
        return { flag: false, message: error.message }
    }
}

cron.schedule("*/15 * * * *", async (res) => {
    await manageCronNextAutorunErrorLogs();
}, {
    scheduled: true,
    timezone: timezone
})
/* /Manage cron autorun error logs */

/* Manage cron running log */
const manageCronRunningLog = async (payload = null) => {
    try {
        var moduleSlug = "cron-schedulers";
        var action = "cron";
        var connectionType = payload?.connection_type || "";
        var cronSchdlSlug = payload?.cron_slug || "";
        var cronSchdlId = payload?.cron_id || "";
        if (!connectionType) {
            return { flag: false, message: "Connection type must be present." }
        }

        if (!cronSchdlSlug) {
            return { flag: false, message: "Cron slug must be present." }
        }

        var todayDate = formatDate(null, "YYYY-MM-DD")
        var query = { deletedAt: null, module_slug: moduleSlug, action: action, type: cronSchdlSlug, date_in_string: todayDate };

        var eventLog = await EventLogService.getEventLogOne(query);
        var currentLog = eventLog?.current_data || { connection_type: connectionType, cron_id: cronSchdlId, cron_slug: cronSchdlSlug };

        var keyCount = ((Object.keys(currentLog)?.length || 0) + 1) - 3;
        currentLog[`log_${keyCount}`] = {
            date_time: payload?.date_time || null,
            utc_date_time: payload?.utc_date_time || null,
            status: payload?.status || ""
        }

        var logPayload = {
            _id: eventLog?._id || "",
            reference_id: cronSchdlId || null,
            module_id: null,
            module_slug: moduleSlug,
            type: cronSchdlSlug,
            action: action,
            description: "Cron log created.",
            previous: true,
            current_data: currentLog
        }

        createUpdateCronEventLog(logPayload);
        // console.log("manageCronRunningLog >>> ", payload, eventLog);
        return { flag: true, message: "Cron running log managed." }
    } catch (error) {
        console.log("manageCronRunningLog catch >>> ", error)
        return { flag: false, message: error.message }
    }
}
/* /Manage cron running logs */

const wazuhIndexerSeverityData = async () => {
    var connectionType = "wazuh-indexer";
    var cronSchdlSlug = "wazuh-indexer-severity";
    var createCronErrorLog = false;
    var errorLogType = "";
    var errorLogMessage = "";
    var errorLogDescription = "";
    var apiErrorLog = null;
    var currentDate = new Date();
    try {
        updateScheduleCronLogTime(cronSchdlSlug);

        var cronScheduler = await CronSchedulerService.getCronSchedulerOne({ slug: cronSchdlSlug, status: true, deletedAt: null })
        if (cronScheduler?._id) {
            manageCronRunningLog({
                connection_type: connectionType,
                cron_slug: cronSchdlSlug,
                cron_id: cronScheduler?._id || "",
                date_time: currentDate.toString(),
                utc_date_time: currentDate.toUTCString(),
                status: "running"
            });

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
                    tool_slug: wazuhKey,
                    date: currentDate,
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
        }

        return { flag: true, message: "Wazuh indexer severity data fetched." }
    } catch (error) {
        console.log("wazuhIndexerSeverityData catch >>> ", error)
        updateScheduleCronLogTime(cronSchdlSlug);

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
                tool_slug: wazuhKey,
                date: currentDate,
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

const wazuhToolAgentsData = async () => {
    var connectionType = "wazuh-tool";
    var cronSchdlSlug = "wazuh-tool-agents";
    var createCronErrorLog = false;
    var errorLogType = "";
    var errorLogMessage = "";
    var errorLogDescription = "";
    var apiErrorLog = null;
    var currentDate = new Date();
    try {
        updateScheduleCronLogTime(cronSchdlSlug);

        var cronScheduler = await CronSchedulerService.getCronSchedulerOne({ slug: cronSchdlSlug, status: true, deletedAt: null });
        if (cronScheduler?._id) {
            manageCronRunningLog({
                connection_type: connectionType,
                cron_slug: cronSchdlSlug,
                cron_id: cronScheduler?._id || "",
                date_time: currentDate.toString(),
                utc_date_time: currentDate.toUTCString(),
                status: "running"
            });

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
                    tool_slug: wazuhKey,
                    date: currentDate,
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
        }

        return { flag: true, message: "Wazuh tool agents data fetched." }
    } catch (error) {
        console.log("wazuhToolAgentsData catch >>> ", error)
        updateScheduleCronLogTime(cronSchdlSlug);

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
                tool_slug: wazuhKey,
                date: currentDate,
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

const wazuhToolAgentsConfigurationAssessmentData = async () => {
    var connectionType = "wazuh-tool";
    var cronSchdlSlug = "wazuh-tool-configuration-assessment";
    var createCronErrorLog = false;
    var errorLogType = "";
    var errorLogMessage = "";
    var errorLogDescription = "";
    var apiErrorLog = null;
    var currentDate = new Date();
    try {
        updateScheduleCronLogTime(cronSchdlSlug);

        var cronScheduler = await CronSchedulerService.getCronSchedulerOne({ slug: cronSchdlSlug, status: true, deletedAt: null });
        if (cronScheduler?._id) {
            manageCronRunningLog({
                connection_type: connectionType,
                cron_slug: cronSchdlSlug,
                cron_id: cronScheduler?._id || "",
                date_time: currentDate.toString(),
                utc_date_time: currentDate.toUTCString(),
                status: "running"
            });

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
                    tool_slug: wazuhKey,
                    date: currentDate,
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
        }

        return { flag: true, message: "Wazuh tool agents configuration assessment data fetched." }
    } catch (error) {
        console.log("wazuhToolAgentsConfigurationAssessmentData catch >>> ", error)
        updateScheduleCronLogTime(cronSchdlSlug);

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
                tool_slug: wazuhKey,
                date: currentDate,
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

const helpdeskSupportTicketData = async () => {
    var connectionType = "helpdesk-support-ticket";
    var cronSchdlSlug = "helpdesk-support-ticket";
    var createCronErrorLog = false;
    var errorLogType = "";
    var errorLogMessage = "";
    var errorLogDescription = "";
    var apiErrorLog = null;
    var currentDate = new Date();
    try {
        updateScheduleCronLogTime(cronSchdlSlug);

        var cronScheduler = await CronSchedulerService.getCronSchedulerOne({ slug: cronSchdlSlug, status: true, deletedAt: null });
        if (cronScheduler?._id) {
            manageCronRunningLog({
                connection_type: connectionType,
                cron_slug: cronSchdlSlug,
                cron_id: cronScheduler?._id || "",
                date_time: currentDate.toString(),
                utc_date_time: currentDate.toUTCString(),
                status: "running"
            });

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
                    tool_slug: cronScheduler?.tool_slug || wazuhKey,
                    date: currentDate,
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
        }

        return { flag: true, message: "Helpdesk Support Ticket data fetched." }
    } catch (error) {
        console.log("helpdeskSupportTicketData catch >>> ", error)
        updateScheduleCronLogTime(cronSchdlSlug);

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
                tool_slug: wazuhKey,
                date: currentDate,
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

const netswitchThreatIntelTxtData = async () => {
    var connectionType = "netswitch-threat-intel-txt-file";
    var cronSchdlSlug = "netswitch-threat-intel-txt-file";
    var createCronErrorLog = false;
    var errorLogType = "";
    var errorLogMessage = "";
    var errorLogDescription = "";
    var apiErrorLog = null;
    var currentDate = new Date();
    try {
        updateScheduleCronLogTime(cronSchdlSlug);

        var cronScheduler = await CronSchedulerService.getCronSchedulerOne({ slug: cronSchdlSlug, status: true, deletedAt: null });
        if (cronScheduler?._id) {
            manageCronRunningLog({
                connection_type: connectionType,
                cron_slug: cronSchdlSlug,
                cron_id: cronScheduler?._id || "",
                date_time: currentDate.toString(),
                utc_date_time: currentDate.toUTCString(),
                status: "running"
            });

            var connection = await ConnetionService.getConnectionOne({ type: connectionType, status: true, deletedAt: null });
            if (connection?._id && connection?.ip_address) {
                const httpsAgent = new https.Agent({ rejectUnauthorized: false });
                var url = `${connection.ip_address}`;

                var currentTimeHour = formatDate(null, "HH:mm");
                var dateTime = moment();
                var todayDate = formatDate(null, "YYYY-MM-DD");

                var apiResponse = await axios.get(`${url}`, { httpsAgent })
                    .then((res) => res.data).catch((error) => error);
                if (apiResponse?.response?.statusText) {
                    createCronErrorLog = true;
                    errorLogType = "connection_cron_error";
                    errorLogMessage = "Please check your connection and cron details.";
                    errorLogDescription = `Connection (${connectionType}) and Cron (${cronSchdlSlug}): Please check your connection and cron details.`;
                    apiErrorLog = {
                        status: apiReceivedResponse.response?.status,
                        statusText: apiReceivedResponse.response?.statusText,
                        data: apiResponse?.response?.statusText ? { status: apiResponse?.response?.status, statusText: apiResponse?.response?.statusText } : null
                    }
                } else if (apiResponse && typeof apiResponse == "string") {
                    if (apiResponse?.split('\n')) {
                        var lines = apiResponse.split('\n');
                        if (lines?.length > 1) {
                            const jsonData = lines.slice(1).filter(line => line.trim()).map(line => {
                                const values = line.split(',');
                                return {
                                    "ip_address": values[0] || "",
                                    "as_number": values[1] || "",
                                    "company": values[2] || "",
                                    "country": values[3] || "",
                                    "date_in_string": todayDate || "",
                                    "date": todayDate || null,
                                    "date_time": dateTime || null,
                                    "time": currentTimeHour || "",
                                }
                            })

                            if (jsonData?.length) {
                                var deletingAllrecord = await NetSwitchThreatIntelService.deleteManyNetSwitchThreatIntel({});

                                const createDataInTheDb = await NetSwitchThreatIntelService.createManyNetswitchThreatIntel(jsonData);

                                if (createDataInTheDb?.length) {
                                    const threatCountryCountQuery = [{
                                        $group: { _id: "$country", count: { $sum: 1 } }
                                    }, { $project: { _id: 0, country_name: "$_id", count: 1 } },
                                    { $sort: { count: -1 } }];
                                    var netswitchThreatCountryCountsStats = await NetSwitchThreatIntelService.getTotalCountBasedOnCountry(threatCountryCountQuery);
                                    if (netswitchThreatCountryCountsStats?.length) {
                                        var netswitchThreatIntelStats = await NetswitchThreatIntelStatsService.getNetswitchThreatIntelStatsOne({ date_in_string: todayDate })
                                        if (netswitchThreatIntelStats?._id) {
                                            var netswitchThreatIntelStats = await NetswitchThreatIntelStatsService.updateNetSwitchThreatIntelStats({ _id: netswitchThreatIntelStats._id, stats_data: netswitchThreatCountryCountsStats, date_time: dateTime })
                                        } else {
                                            var netswitchThreatIntelStats = await NetswitchThreatIntelStatsService.createNetswitchThreatIntelStats({ stats_data: netswitchThreatCountryCountsStats, date_in_string: todayDate, date: todayDate, date_time: dateTime })
                                        }
                                    }
                                }

                                console.log("netswitchThreatIntelTxtData >>> ", jsonData?.length, createDataInTheDb?.length, deletingAllrecord);
                            }
                        }
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
                    tool_slug: cronScheduler?.tool_slug || netswitchThreatIntelKey,
                    date: currentDate,
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
        }

        return { flag: true, message: "NetSwitch Threat Intel data fetched successfully." }
    } catch (error) {
        console.log("netswitchThreatIntelTxtData catch >>> ", error)
        updateScheduleCronLogTime(cronSchdlSlug);

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
                tool_slug: netswitchThreatIntelKey,
                date: currentDate,
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

const testScriptData = async () => {
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
    testFunction,
    wazuhToolAgentsData,
    wazuhToolAgentsConfigurationAssessmentData,
    manageCronNextAutorunErrorLogs,
    helpdeskSupportTicketData,
    netswitchThreatIntelTxtData,
    testScriptData
}
