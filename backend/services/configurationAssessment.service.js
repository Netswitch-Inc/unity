var ConfigurationAssessment = require("../models/ConfigurationAssessment.model");

exports.getConfigurationAssessments = async function (query = {}, page = 1, limit = 0, sortField = "", sortType) {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) { sorts[sortField] = sortType };

    try {
        var configurationAssessments = await ConfigurationAssessment.find(query)
            .skip(skips)
            .limit(limit)
            .sort(sorts);

        return configurationAssessments;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getAggregateConfigurationAssessments = async function (query = {}) {
    try {
        var configurationAssessments = await ConfigurationAssessment.aggregate([{ $match: query }, {
            $addFields: {
                start_scan: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$start_scan_date'
                    }
                },
                end_scan: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$end_scan_date'
                    }
                },
                createdAt: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$createdAt'
                    }
                }
            }
        }])

        return configurationAssessments || [];
    } catch (error) {
        // console.log("getAggregateConfigurationAssessments catch >>> ", error)
        throw Error(error.message);
    }
}

exports.getConfigurationAssessmentsGraph = async function (query = {}) { 
    try {
        var configurationAssessments = await ConfigurationAssessment.aggregate([
            { $match: query },
            {
                $addFields: {
                    fullDate: {
                        $dateToString: { format: dateFormat, date: "$end_scan" }
                    }
                }
            },
            {
                $group: {
                    _id: "$fullDate",
                    total_checks: { $sum: "$total_checks" }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
            {
                $project: {
                    name: "$_id",
                    value: "$total_checks",
                    _id: 0
                }
            }
        ]);

        return configurationAssessments || [];
    } catch (error) {
        // console.log("getConfigurationAssessmentsGraph catch >>> ", error);
        throw Error(error.message);
    }
};


exports.getConfigurationAssessmentCount = async function (query) {
    try {
        var count = await ConfigurationAssessment.find(query).countDocuments();
        return count;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getConfigurationAssessment = async function (id) {
    try {
        var configurationAssessment = await ConfigurationAssessment.findOne({ _id: id, deletedAt: null });
        if (configurationAssessment?._id) {
            return configurationAssessment;
        } else {
            throw Error("Configuration Assessment not found");
        }
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getConfigurationAssessmentOne = async function (query) {
    try {
        var configurationAssessment = await ConfigurationAssessment.findOne(query);

        return configurationAssessment || null;
    } catch (e) {
        return null;
    }
}

exports.createConfigurationAssessment = async function (data) {
    var newConfigurationAssessment = new ConfigurationAssessment({
        agent_ref_id: data.agent_ref_id ? data.agent_ref_id : "",
        policy_id: data.policy_id ? data.policy_id : "",
        name: data.name ? data.name : "",
        references: data.references ? data.references : "",
        invalid: data.invalid || 0,
        description: data.description ? data.description : "",
        hash_file: data.hash_file ? data.hash_file : "",
        total_checks: data.total_checks || 0,
        pass: data.pass || 0,
        fail: data.fail || 0,
        score: data.score || 0,
        date_in_string: data.date_in_string ? data.date_in_string : "",
        start_scan: data.start_scan ? data.start_scan : "",
        end_scan: data.end_scan ? data.end_scan : "",
        deletedAt: data.deletedAt || null
    })

    try {
        var savedConfigurationAssessment = await newConfigurationAssessment.save();
        return savedConfigurationAssessment;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.updateConfigurationAssessment = async function (data) {
    var id = data._id;

    try {
        // Find the old ConfigurationAssessment object by its ID
        var oldConfigurationAssessment = await ConfigurationAssessment.findById(id);
        if (!oldConfigurationAssessment) {
            throw Error("Configuration Assessment not found");
        }

        // Update fields explicitly if they are provided in data
        if (data.agent_ref_id) {
            oldConfigurationAssessment.agent_ref_id = data.agent_ref_id;
        }

        if (data.policy_id) {
            oldConfigurationAssessment.policy_id = data.policy_id;
        }

        if (data.name) {
            oldConfigurationAssessment.name = data.name;
        }

        if (data.references) {
            oldConfigurationAssessment.references = data.references;
        }

        if (data.invalid || data.invalid === 0) {
            oldConfigurationAssessment.invalid = data.invalid || 0;
        }

        if (data.description || data.description === "") {
            oldConfigurationAssessment.description = data.description || "";
        }

        if (data.hash_file) {
            oldConfigurationAssessment.hash_file = data.hash_file;
        }

        if (data.total_checks || data.total_checks === 0) {
            oldConfigurationAssessment.total_checks = data.total_checks || 0;
        }

        if (data.pass || data.pass === 0) {
            oldConfigurationAssessment.pass = data.pass || 0;
        }

        if (data.fail || data.fail === 0) {
            oldConfigurationAssessment.fail = data.fail || 0;
        }

        if (data.score || data.score === 0) {
            oldConfigurationAssessment.score = data.score || 0;
        }

        if (data.date_in_string) {
            oldConfigurationAssessment.date_in_string = data.date_in_string;
        }

        if (data.start_scan) {
            oldConfigurationAssessment.start_scan = data.start_scan;
        }

        if (data.end_scan) {
            oldConfigurationAssessment.end_scan = data.end_scan;
        }

        if (data.deletedAt || data.deletedAt === null) {
            oldConfigurationAssessment.deletedAt = data.deletedAt || null;
        }

        // Save the updated ConfigurationAssessment object
        var updatedConfigurationAssessment = await oldConfigurationAssessment.save();
        return updatedConfigurationAssessment;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.softDeleteConfigurationAssessment = async function (id) {
    try {
        var deleted = await ConfigurationAssessment.updateOne({
            _id: id
        }, {
            $set: { deletedAt: new Date() }
        });

        return deleted;
    } catch (e) {
        throw Error(e.message)
    }
}
