var NetswitchThreatIntel = require("../models/NetswitchThreatIntel.model");

exports.getNetswitchThreatIntels = async function (query = {}, page = 1, limit = 0, sortField = "", sortType) {
  var skips = limit * (page - 1);
  var sorts = {};
  if (sortField) {
    sorts[sortField] = sortType;
  }

  // Try Catch the awaited promise to handle the error
  try {
    var netswitchThreatIntels = await NetswitchThreatIntel.find(query)
      .skip(skips)
      .limit(limit)
      .sort(sorts);

    return netswitchThreatIntels;
  } catch (e) {
    throw Error(e.message);
  }
}

exports.getNetswitchThreatIntelCount = async function (query) {
  try {
    var count = await NetswitchThreatIntel.find(query).count();
    return count;
  } catch (e) {
    throw Error(e.message);
  }
}

exports.getNetswitchThreatIntelsDistinct = async function (field, query) {
  try {
    var netswitchThreatIntels = await NetswitchThreatIntel.distinct(field, query);

    return netswitchThreatIntels
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error while distinct netswitch threat intels");
  }
}

exports.getNetswitchThreatIntel = async function (id) {
  try {
    // Find the Data
    var _details = await NetswitchThreatIntel.findOne({ _id: id, deletedAt: null })
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

exports.getNetswitchThreatIntelOne = async function (query = {}) {
  try {
    var netswitchThreatIntel = await NetswitchThreatIntel.findOne(query);

    return netswitchThreatIntel;
  } catch (e) {
    // return a Error message describing the reason
    return null
  }
}

exports.createManyNetswitchThreatIntel = async function (netSwitchThreatIntels) {
  try {
    const savedNetSwitchThreatIntel = await NetswitchThreatIntel.insertMany(netSwitchThreatIntels);

    return savedNetSwitchThreatIntel;
  } catch (error) {
    throw Error(error.message);
  }
}

exports.createNetswitchThreatIntel = async function (netSwitchThreatIntel) {
  var newNetSwitchThreatIntel = new NetswitchThreatIntel({
    ip_address: netSwitchThreatIntel.ip_address ? netSwitchThreatIntel.ip_address : "",
    as_number: netSwitchThreatIntel.as_number ? netSwitchThreatIntel.as_number : "",
    company: netSwitchThreatIntel.company ? netSwitchThreatIntel.company : "",
    country: netSwitchThreatIntel.country ? netSwitchThreatIntel.country : "",
    time: netSwitchThreatIntel.time ? netSwitchThreatIntel.time : "",
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

exports.updateNetSwitchThreatIntel = async function (netSwitchThreatIntel) {
  var id = netSwitchThreatIntel._id;
  try {
    // Find the old NetswitchThreatIntel Object by the Id
    var oldNetSwitchThreatIntel = await NetswitchThreatIntel.findById(id);
  } catch (e) {
    throw Error("NetSwitch Threat Intel not found");
  }

  if (!oldNetSwitchThreatIntel) { return false; }

  if (netSwitchThreatIntel.ip_address) {
    oldNetSwitchThreatIntel.ip_address = netSwitchThreatIntel.ip_address;
  }

  if (netSwitchThreatIntel.as_number) {
    oldNetSwitchThreatIntel.as_number = netSwitchThreatIntel.as_number;
  }
  if (netSwitchThreatIntel.company) {
    oldNetSwitchThreatIntel.company = netSwitchThreatIntel.company;
  }

  if (netSwitchThreatIntel.country) {
    oldNetSwitchThreatIntel.country = netSwitchThreatIntel.country;
  }

  if (netSwitchThreatIntel.date || netSwitchThreatIntel.date === null) {
    oldNetSwitchThreatIntel.date = netSwitchThreatIntel.date || null;
  }

  if (netSwitchThreatIntel.time) {
    oldNetSwitchThreatIntel.time = netSwitchThreatIntel.time;
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

exports.softDeleteNetSwitchThreatIntel = async function (id) {
  try {
    var deleted = await NetswitchThreatIntel.updateOne({
      _id: id
    }, {
      $set: { deletedAt: new Date() },
    })

    return deleted;
  } catch (e) {
    throw Error(e.message);
  }
}

exports.deleteManyNetSwitchThreatIntel = async function (filter = {}) {
  try {
    const result = await NetswitchThreatIntel.deleteMany(filter);

    if (result.deletedCount === 0) {
      return { message: "No records found to delete", deletedCount: 0 };
    }

    return result;

  } catch (error) {
    throw new Error(error.message);
  }
}

exports.getTotalCountBasedOnCountry = async function (pipeline) {
  try {
    const countryData = await NetswitchThreatIntel.aggregate(pipeline);
    return countryData;
  } catch (error) {
    throw new Error(error.message);
  }
}