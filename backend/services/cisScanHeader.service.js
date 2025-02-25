var CISScanHeader = require("../models/CISScanHeader.model");

exports.getCISScanHeaders = async function (query = {}, page = 1, limit = 0, sortField = "", sortType = "") {
  try {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) {
      sorts[sortField] = sortType;
    }

    var cisScanHeaders = await CISScanHeader.find(query)
      .sort(sorts)
      .skip(skips)
      .limit(limit);

    // Return the CISScanHeader list that was retured by the mongoose promise
    return cisScanHeaders;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e.message);
  }
}

exports.getCISScanHeaderCount = async function (query) {
  try {
    var count = await CISScanHeader.find(query).count();

    return count;
  } catch (e) {
    throw Error("Error while Counting CIS Scan Header");
  }
}

exports.getCISScanHeader = async function (id) {
  try {
    // Find the Data 
    var _details = await CISScanHeader.findOne({ _id: id })
    if (_details._id) {
      return _details;
    } else {
      throw Error("CISScanHeader not available");
    }
  } catch (e) {
    // return a Error message describing the reason     
    throw Error("CISScanHeader not available");
  }
}

exports.createCISScanHeader = async function (cisScanHeader) {
  var newCISScanHeader = new CISScanHeader({
    company_id: cisScanHeader.company_id ? cisScanHeader.company_id : null,
    hostname: cisScanHeader.hostname ? cisScanHeader.hostname : "",
    filename: cisScanHeader.filename ? cisScanHeader.filename : "",
    originalfile: cisScanHeader.originalfile ? cisScanHeader.originalfile : "",
    scanned_date: cisScanHeader.scanned_date ? cisScanHeader.scanned_date : null,
    total: cisScanHeader.total ? cisScanHeader.total : 0,
    pass: cisScanHeader.pass ? cisScanHeader.pass : 0,
    fail: cisScanHeader.fail ? cisScanHeader.fail : 0,
    error: cisScanHeader.error ? cisScanHeader.error : 0,
    unknown: cisScanHeader.unknown ? cisScanHeader.unknown : 0,
    man: cisScanHeader.man ? cisScanHeader.man : 0,
    max: cisScanHeader.max ? cisScanHeader.max : 0,
    score: cisScanHeader.score ? cisScanHeader.score : 0,
    upload_date: cisScanHeader.upload_date ? cisScanHeader.upload_date : null,
    profile: cisScanHeader.profile ? cisScanHeader.profile : "",
    ip: cisScanHeader.ip ? cisScanHeader.ip : "",
    percentage: cisScanHeader.percentage ? cisScanHeader.percentage : 0,
    scan_id: cisScanHeader.scan_id ? cisScanHeader.scan_id : 0,
    is_deleted: 0
  })

  try {
    // Saving the CISScanHeader 
    var savedCISScanHeader = await newCISScanHeader.save();
    return savedCISScanHeader;
  } catch (e) {
    // return a Error message describing the reason     
    throw Error("Error while Creating CISScanHeader");
  }
}

exports.updateCISScanHeader = async function (cisScanHeader) {
  var id = cisScanHeader._id;
  try {
    //Find the old CISScanHeader Object by the Id
    var oldCISScanHeader = await CISScanHeader.findById(id);
  } catch (e) {
    throw Error("Error occured while Finding the CISScanHeader");
  }

  // If no old CISScanHeader Object exists return false
  if (!oldCISScanHeader) { return false; }

  // Edit the CISScanHeader Object
  if (cisScanHeader.company_id) {
    oldCISScanHeader.company_id = cisScanHeader.company_id;
  }

  if (cisScanHeader.hostname) {
    oldCISScanHeader.hostname = cisScanHeader.hostname;
  }

  if (cisScanHeader.filename) {
    oldCISScanHeader.filename = cisScanHeader.filename;
  }

  if (cisScanHeader?.originalfile) {
    oldCISScanHeader.originalfile = cisScanHeader.originalfile;
  }

  if (cisScanHeader?.scanned_date) {
    oldCISScanHeader.scanned_date = cisScanHeader.scanned_date;
  }

  if (cisScanHeader?.total || cisScanHeader.total == 0) {
    oldCISScanHeader.total = cisScanHeader.total || 0;
  }

  if (cisScanHeader?.pass || cisScanHeader.pass == 0) {
    oldCISScanHeader.pass = cisScanHeader.pass || 0;
  }

  if (cisScanHeader?.fail || cisScanHeader.fail == 0) {
    oldCISScanHeader.fail = cisScanHeader.fail || 0;
  }

  if (cisScanHeader?.error || cisScanHeader.error == 0) {
    oldCISScanHeader.error = cisScanHeader.error || 0;
  }

  if (cisScanHeader?.unknown || cisScanHeader.unknown == 0) {
    oldCISScanHeader.unknown = cisScanHeader.unknown || 0;
  }

  if (cisScanHeader?.man || cisScanHeader.man == 0) {
    oldCISScanHeader.man = cisScanHeader.man || 0;
  }

  if (cisScanHeader?.max || cisScanHeader.max == 0) {
    oldCISScanHeader.max = cisScanHeader.max || 0;
  }

  if (cisScanHeader?.score || cisScanHeader.score == 0) {
    oldCISScanHeader.score = cisScanHeader.score || 0;
  }

  if (cisScanHeader?.upload_date) {
    oldCISScanHeader.upload_date = cisScanHeader.upload_date;
  }

  if (cisScanHeader?.profile) {
    oldCISScanHeader.profile = cisScanHeader.profile;
  }

  if (cisScanHeader?.ip) {
    oldCISScanHeader.ip = cisScanHeader.ip;
  }

  if (cisScanHeader?.percentage || cisScanHeader.percentage == 0) {
    oldCISScanHeader.percentage = cisScanHeader.percentage || 0;
  }

  if (cisScanHeader?.scan_id) {
    oldCISScanHeader.scan_id = cisScanHeader.scan_id;
  }

  if (cisScanHeader?.is_deleted) {
    oldCISScanHeader.is_deleted = cisScanHeader.is_deleted;
  }

  try {
    var savedCISScanHeader = await oldCISScanHeader.save();
    return savedCISScanHeader;
  } catch (e) {
    throw Error("And Error occured while updating the CISScanHeader");
  }
}

exports.deleteCISScanHeader = async function (id) {
  // Delete the CISScanHeader
  try {
    var deleted = await CISScanHeader.remove({ _id: id });
    if (deleted.n === 0 && deleted.ok === 1) {
      throw Error("CISScanHeader Could not be deleted");
    }

    return deleted;
  } catch (e) {
    throw Error("Error Occured while Deleting the CISScanHeader");
  }
}
