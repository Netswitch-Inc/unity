var NetswitchThreatIntelStats = require("../models/NetswitchThreatIntelStats.model");

exports.getNetswitchThreatIntelsStats = async function (query = {}, page = 1, limit = 0, sortField = "", sortType) {
  var skips = limit * (page - 1);
  var sorts = {};
  if (sortField) {
    sorts[sortField] = sortType;
  }

  // Try Catch the awaited promise to handle the error
  try {
    var netswitchThreatIntels = await NetswitchThreatIntelStats.find(query)
      .skip(skips)
      .limit(limit)
      .sort(sorts);

    return netswitchThreatIntels;
  } catch (e) {
    throw Error(e.message);
  }
}

exports.getNetswitchThreatIntelCountStats = async function (query) {
  try {
    var count = await NetswitchThreatIntelStats.find(query).count();
    return count;
  } catch (e) {
    throw Error(e.message);
  }
}

exports.getNetswitchThreatIntelsDistinctStats = async function (field, query) {
  try {
    var netswitchThreatIntels = await NetswitchThreatIntelStats.distinct(field, query);

    return netswitchThreatIntels
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error while distinct netswitch threat intels");
  }
}

exports.getNetswitchThreatIntelStats = async function (id) {
  try {
    // Find the Data
    var _details = await NetswitchThreatIntelStats.findOne({ _id: id, deletedAt: null })
    if (_details?._id) {
      return _details;
    } else {
      throw Error("Netswitch Threat Intel not available");
    }
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e.message);
  }
}

exports.getNetswitchThreatIntelStatsOne = async function (query = {}) {
  try {
    var netswitchThreatIntel = await NetswitchThreatIntelStats.findOne(query);

    return netswitchThreatIntel;
  } catch (e) {
    // return a Error message describing the reason
    return null
  }
}

exports.createManyNetswitchThreatIntelStats = async function (netSwitchThreatIntels) {
  try {
    const savedNetSwitchThreatIntel = await NetswitchThreatIntelStats.insertMany(netSwitchThreatIntels);

    return savedNetSwitchThreatIntel;
  } catch (error) {
    throw Error(error.message);
  }
}

exports.createNetswitchThreatIntelStats = async function (netSwitchThreatIntel) {
  var newNetSwitchThreatIntel = new NetswitchThreatIntelStats({
    stats_data: Array.isArray(netSwitchThreatIntel.stats_data) ? netSwitchThreatIntel.stats_data : null,
    date_in_string: netSwitchThreatIntel.date_in_string ? netSwitchThreatIntel.date_in_string : "",
    date: netSwitchThreatIntel.date ? netSwitchThreatIntel.date : "",
    date_time: netSwitchThreatIntel.date_time ? netSwitchThreatIntel.date_time : "",
    status: netSwitchThreatIntel.status ? netSwitchThreatIntel.status : true,
    deletedAt: null
  })

  try {
    var savedNetSwitchThreatIntel = await newNetSwitchThreatIntel.save();
    return savedNetSwitchThreatIntel;
  } catch (e) {
    throw Error(e.message);
  }
}

exports.updateNetSwitchThreatIntelStats = async function (netSwitchThreatIntel) {
  var id = netSwitchThreatIntel._id;
  try {
    // Find the old NetswitchThreatIntelStats Object by the Id
    var oldNetSwitchThreatIntel = await NetswitchThreatIntelStats.findById(id);
  } catch (e) {
    throw Error("NetSwitch Threat Intel not found");
  }

  if (!oldNetSwitchThreatIntel) { return false; }

  if (Array.isArray(netSwitchThreatIntel.stats_data)) {
    oldNetSwitchThreatIntel.stats_data = netSwitchThreatIntel?.stats_data || null;
  }


  if (netSwitchThreatIntel.date_in_string) {
    oldNetSwitchThreatIntel.date_in_string = netSwitchThreatIntel.date_in_string;
  }

  if (netSwitchThreatIntel.date_time || netSwitchThreatIntel.date_time === null) {
    oldNetSwitchThreatIntel.date_time = netSwitchThreatIntel.date_time || null;
  }

  if (netSwitchThreatIntel.status || netSwitchThreatIntel.status === false) {
    oldNetSwitchThreatIntel.status = netSwitchThreatIntel.status || false;
  }

  if (netSwitchThreatIntel.deletedAt || netSwitchThreatIntel.deletedAt === null) {
    oldNetSwitchThreatIntel.deletedAt = netSwitchThreatIntel.deletedAt || null;
  }

  try {
    var savedNetSwitchThreatIntel = await oldNetSwitchThreatIntel.save();
    return savedNetSwitchThreatIntel;
  } catch (e) {
    throw Error(e.message);
  }
}

exports.softDeleteNetSwitchThreatIntelStats = async function (id) {
  try {
    var deleted = await NetswitchThreatIntelStats.updateOne({
      _id: id
    }, {
      $set: { deletedAt: new Date() },
    })

    return deleted;
  } catch (e) {
    throw Error(e.message);
  }
}

exports.deleteManyNetSwitchThreatIntelStats = async function (filter = {}) {
  try {
    const result = await NetswitchThreatIntelStats.deleteMany(filter);

    if (result.deletedCount === 0) {
      return { message: "No records found to delete", deletedCount: 0 };
    }

    return result;

  } catch (error) {
    throw new Error(error.message);
  }
}

exports.getTotalCountBasedOnCountryStats = async function (pipeline) {
  try {
    const countryData = await NetswitchThreatIntelStats.aggregate(pipeline);

    return countryData;
  } catch (error) {
    throw new Error(error.message);
  }
}
