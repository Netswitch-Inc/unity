var axios = require('axios');
var https = require("https");

// Saving the context of this module inside the _the variable
_this = this;

exports.testLowWazuhIndexerAPI = async function (req, res, next) {
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        var userName = "admin";
        var password = "q3dzcwCz3FwTAik+ZoiVSYZb?blD3+1I";
        var credentials = new Buffer.from(`${userName}:${password}`, "utf8").toString("base64");

        var url = `https://192.235.98.180:9200/wazuh-alerts*/_search?pretty=true`;
        var headers = {
            Authorization: `Basic ${credentials}`
        }

        var data = {
            query: {
                bool: {
                    must: [],
                    filter: [
                        {
                            range: {
                                timestamp: {
                                    gte: "now-24h",
                                    lte: "now",
                                    format: "epoch_millis"
                                }
                            }
                        },
                        {
                            range: {
                                "rule.level": {
                                    gte: 0,
                                    lte: 6
                                }
                            }
                        }
                        // {
                        //     "range": {
                        //         "timestamp": {
                        //             "gte": "2024-11-04T04:20:09.115Z",
                        //             "lte": "2024-11-05T04:20:09.115Z",
                        //             "format": "strict_date_optional_time"
                        //         }
                        //     }
                        // }
                    ],
                    should: [],
                    must_not: []
                }
            },
            script_fields: {},
            size: 100,
            sort: [],
            stored_fields: ["*"]
        }

        var apiResponse = await axios.get(url, { data, headers, httpsAgent: agent })
            .then((res) => res.data).catch((error) => error);
        console.log("apiResponse >>> ", apiResponse);

        return res.status(200).send({ status: 200, flag: true, data: apiResponse, message: "Wazuh Test function called successfully!" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.testMediumWazuhIndexerAPI = async function (req, res, next) {
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        var userName = "admin";
        var password = "q3dzcwCz3FwTAik+ZoiVSYZb?blD3+1I";
        var credentials = new Buffer.from(`${userName}:${password}`, "utf8").toString("base64");

        var url = `https://192.235.98.180:9200/wazuh-alerts*/_search?pretty=true`;
        var headers = {
            Authorization: `Basic ${credentials}`
        }

        var data = {
            query: {
                bool: {
                    must: [],
                    filter: [
                        {
                            range: {
                                timestamp: {
                                    gte: "now-24h",
                                    lte: "now",
                                    format: "epoch_millis"
                                }
                            }
                        },
                        {
                            range: {
                                "rule.level": {
                                    gte: 7,
                                    lte: 11
                                }
                            }
                        }
                        // {
                        //     "range": {
                        //         "timestamp": {
                        //             "gte": "2024-11-04T04:20:09.115Z",
                        //             "lte": "2024-11-05T04:20:09.115Z",
                        //             "format": "strict_date_optional_time"
                        //         }
                        //     }
                        // }
                    ],
                    should: [],
                    must_not: []
                }
            },
            script_fields: {},
            size: 100,
            sort: [],
            stored_fields: ["*"]
        }

        var apiResponse = await axios.get(url, { data, headers, httpsAgent: agent })
            .then((res) => res.data).catch((error) => error);
        console.log("apiResponse >>> ", apiResponse);

        return res.status(200).send({ status: 200, flag: true, data: apiResponse, message: "Wazuh Test function called successfully!" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.testHighWazuhIndexerAPI = async function (req, res, next) {
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        var userName = "admin";
        var password = "q3dzcwCz3FwTAik+ZoiVSYZb?blD3+1I";
        var credentials = new Buffer.from(`${userName}:${password}`, "utf8").toString("base64");

        var url = `https://192.235.98.180:9200/wazuh-alerts*/_search?pretty=true`;
        var headers = {
            Authorization: `Basic ${credentials}`
        }

        var data = {
            query: {
                bool: {
                    must: [],
                    filter: [
                        {
                            range: {
                                timestamp: {
                                    gte: "now-24h",
                                    lte: "now",
                                    format: "epoch_millis"
                                }
                            }
                        },
                        {
                            range: {
                                "rule.level": {
                                    gte: 12,
                                    lte: 14
                                }
                            }
                        }
                        // {
                        //     "range": {
                        //         "timestamp": {
                        //             "gte": "2024-11-04T04:20:09.115Z",
                        //             "lte": "2024-11-05T04:20:09.115Z",
                        //             "format": "strict_date_optional_time"
                        //         }
                        //     }
                        // }
                    ],
                    should: [],
                    must_not: []
                }
            },
            script_fields: {},
            size: 100,
            sort: [],
            stored_fields: ["*"]
        }

        var apiResponse = await axios.get(url, { data, headers, httpsAgent: agent })
            .then((res) => res.data).catch((error) => error);
        console.log("apiResponse >>> ", apiResponse);

        return res.status(200).send({ status: 200, flag: true, data: apiResponse, message: "Wazuh Test function called successfully!" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}
exports.testCriticalWazuhIndexerAPI = async function (req, res, next) {
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        var userName = "admin";
        var password = "q3dzcwCz3FwTAik+ZoiVSYZb?blD3+1I";
        var credentials = new Buffer.from(`${userName}:${password}`, "utf8").toString("base64");

        var url = `https://192.235.98.180:9200/wazuh-alerts*/_search?pretty=true`;
        var headers = {
            Authorization: `Basic ${credentials}`
        }

        var data = {
            query: {
                bool: {
                    must: [],
                    filter: [
                        {
                            range: {
                                timestamp: {
                                    gte: "now-24h",
                                    lte: "now",
                                    format: "epoch_millis"
                                }
                            }
                        },
                        {
                            range: {
                                "rule.level": {
                                    gte: 15,
                                }
                            }
                        }
                        // {
                        //     "range": {
                        //         "timestamp": {
                        //             "gte": "2024-11-04T04:20:09.115Z",
                        //             "lte": "2024-11-05T04:20:09.115Z",
                        //             "format": "strict_date_optional_time"
                        //         }
                        //     }
                        // }
                    ],
                    should: [],
                    must_not: []
                }
            },
            script_fields: {},
            size: 100,
            sort: [],
            stored_fields: ["*"]
        }

        var apiResponse = await axios.get(url, { data, headers, httpsAgent: agent })
            .then((res) => res.data).catch((error) => error);
        console.log("apiResponse >>> ", apiResponse);

        return res.status(200).send({ status: 200, flag: true, data: apiResponse, message: "Wazuh Test function called successfully!" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.testHelpdeskTickets = async function (req, res, next) {
    try {
        var headers = {
            Authtoken: "7F63A0F6-3B95-473F-821B-77DAE8C8C6A0"
        }

        var params = {
            list_info: {
                row_count: 5,
                get_total_count: true
            }
        }

        var encodeParams = encodeURIComponent(JSON.stringify(params));
        var url = `https://helpdesk.netswitch.net/api/v3/requests?input_data=${encodeParams}`;
        var apiResponse = await axios.get(url, { headers })
            .then((res) => res.data).catch((error) => error);
        console.log("apiResponse >>> ", apiResponse);

        return res.status(200).send({ status: 200, flag: true, data: apiResponse, message: "Helpdesk ticket function called successfully!" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}