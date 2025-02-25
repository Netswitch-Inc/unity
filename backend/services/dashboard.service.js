var Dashboard = require("../models/Dashboard.model");

exports.getDashboards = async function (query = {}, page = 1, limit = 0, sortField = "", sortType) {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) sorts[sortField] = sortType;

    try {
        var dashboards = await Dashboard.find(query)
            .skip(skips)
            .limit(limit)
            .sort(sorts);

        return dashboards;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getDashboardCount = async function (query) {
    try {
        var count = await Dashboard.find(query)
            .countDocuments();
            
        return count;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getDashboard = async function (id) {
    try {
        var dashboard = await Dashboard.findOne({ _id: id });
        if (dashboard?._id) {
            return dashboard;
        } else {
            throw Error("Dashboard not found");
        }
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getDashboardOne = async function (query) {
    try {
        var dashboard = await Dashboard.findOne(query);

        return dashboard || null;
    } catch (e) {
        return null;
    }
}

exports.createDashboard = async function (dashboard) {
    var newDashboardData = new Dashboard({
        user_id: dashboard.user_id ? dashboard.user_id : null,
        name: dashboard.name ? dashboard.name : "",
        order: dashboard.order ? dashboard.order : 0,
        show: dashboard.show ? dashboard.show : true,
        status: dashboard.status ? dashboard.status : 1,
        deletedAt: null
    });

    try {
        // Saving the Control
        var savedDashboard = await newDashboardData.save();
        return savedDashboard;
    } catch (e) {
        // return a Error message describing the reason
        throw Error(e.message);
    }
}

exports.updateDashboard = async function (dashboardData) {
    var id = dashboardData._id;
    try {
        // Find the old Control Object by the Id
        var oldDashboard = await Dashboard.findById(id);
    } catch (e) {
        throw Error("Control not found");
    }

    if (!oldDashboard) { return false; }
    
    if (dashboardData.user_id) {
        oldDashboard.user_id = dashboardData.user_id;
    }

    if (dashboardData.name) {
        oldDashboard.name = dashboardData.name;
    }

    if (dashboardData?.status || dashboardData.status == 0) {
        oldDashboard.status = dashboardData?.status || 0;
    }

    if (dashboardData.show === true || dashboardData.show === false) {
        oldDashboard.show = dashboardData.show;
    }

    try {
        var savedDashboard = await oldDashboard.save();
        return savedDashboard;
    } catch (e) {
        console.log(e);
        throw Error(e.message);
    }
}

exports.bulkWriteOperation = async function (operations) {
    try {
        const result = await Dashboard.bulkWrite(operations);
        return result;
    } catch (error) {
        throw Error(error?.message);
    }
}

exports.FindUserIdAndNameAndUpdate = async function (userId, name, showValue) {
    try {
        // Find and update the document
        const updatedDashboardData = await Dashboard.findOneAndUpdate(
            { user_id: userId, name: name },   // Filter to find the document
            { $set: { show: showValue } },      // Update the 'show' field
            { new: true }                       // Return the updated document
        );

        return updatedDashboardData;  // Return the updated document

    } catch (error) {
        console.error("Error updating dashboard:", error);
        throw error.message;  // Optionally rethrow the error for higher-level handling
    }
}
