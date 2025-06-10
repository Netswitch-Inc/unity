// Getting the Newly created Mongoose Model we just created
var CISControl = require("../models/CISControl.model");

// Saving the context of this module inside the _the variable
_this = this;

exports.getCISControls = async function (query = {}, page = 1, limit = 0, sortField = "", sortType = "") {
  try {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) { sorts[sortField] = sortType; }

    // Try Catch the awaited promise to handle the error
    var cisControls = await CISControl.find(query)
      .populate({ path: 'control_id' })
      .skip(skips)
      .limit(limit)
      .sort(sorts);

    return cisControls;
  } catch (e) {
    throw Error(e.message);
  }
}

exports.getCISControlCount = async function (query) {
  try {
    var count = await CISControl.find(query).count();

    return count;
  } catch (e) {
    throw Error(e.message);
  }
}

exports.getCISControlWithFrameworkId = async function (query) {
  try {
    var cisControls = await CISControl.find(query);
    return cisControls;
  } catch (e) {
    throw Error(e.message);
  }
}

exports.getCISControl = async function (id) {
  try {
    // Find the Data
    var _details = await CISControl.findOne({ _id: id });
    if (_details?._id) {
      return _details;
    } else {
      throw Error("CISControl not available");
    }
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e.message);
  }
}

exports.createCISControl = async function (cisControl) {
  var newCISControl = new CISControl({
    framework_id: cisControl.framework_id ? cisControl.framework_id : null,
    control_id: cisControl.control_id ? cisControl.control_id : null,
    reference_id: cisControl.reference_id ? cisControl.reference_id : null,
    cis_control: cisControl.cis_control ? cisControl.cis_control : "",
    cis_sub_control: cisControl.cis_sub_control ? cisControl.cis_sub_control : "",
    control_num: cisControl.control_num ? cisControl.control_num : "",
    asset_type: cisControl.asset_type ? cisControl.asset_type : "",
    security_function: cisControl.security_function ? cisControl.security_function : "",
    name: cisControl.name ? cisControl.name : "",
    relationship: cisControl.relationship ? cisControl.relationship : "",
    description: cisControl.description ? cisControl.description : "",
    tool_icon: cisControl.tool_icon ? cisControl.tool_icon : "",
    status: cisControl.status ? cisControl.status : 0,
    deletedAt: null
  });

  try {
    // Saving the CISControl
    var savedCISControl = await newCISControl.save();
    return savedCISControl;
  } catch (error) {
    // return a Error message describing the reason
    throw Error(error.message);
  }
}

exports.updateCISControl = async function (cisControl) {
  var id = cisControl._id;
  try {
    // Find the old CISControl Object by the Id
    var oldCISControl = await CISControl.findById(id);
  } catch (e) {
    throw Error("Compliance Control not found");
  }

  if (!oldCISControl) { return false; }

  if (cisControl.framework_id) {
    oldCISControl.framework_id = cisControl.framework_id;
  }

  if (cisControl.control_id) {
    oldCISControl.control_id = cisControl.control_id;
  }

  if (cisControl.reference_id) {
    oldCISControl.reference_id = cisControl.reference_id;
  }

  if (cisControl.cis_control) {
    oldCISControl.cis_control = cisControl.cis_control;
  }

  if (cisControl.cis_sub_control) {
    oldCISControl.cis_sub_control = cisControl.cis_sub_control;
  }

  if (cisControl.control_num) {
    oldCISControl.control_num = cisControl.control_num;
  }

  if (cisControl.asset_type) {
    oldCISControl.asset_type = cisControl.asset_type;
  }

  if (cisControl.security_function) {
    oldCISControl.security_function = cisControl.security_function;
  }

  if (cisControl.name) {
    oldCISControl.name = cisControl.name;
  }

  if (cisControl.relationship) {
    oldCISControl.relationship = cisControl.relationship;
  }

  if (cisControl.description) {
    oldCISControl.description = cisControl.description;
  }

  if (cisControl.tool_icon) {
    oldCISControl.tool_icon = cisControl.tool_icon;
  }

  if (cisControl?.status || cisControl.status == 0) {
    oldCISControl.status = cisControl?.status || 0;
  }

  if (cisControl?.deletedAt) {
    oldCISControl.deletedAt = cisControl?.deletedAt || null;
  }

  try {
    var savedCISControl = await oldCISControl.save();
    return savedCISControl;
  } catch (error) {
    throw Error(error.message);
  }
}

exports.softDeleteCISControl = async function (id) {
  try {
    var deleted = await CISControl.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date(), status: 0 } }
    );
    return deleted;
  } catch (e) {
    throw Error(e.message);
  }
}
