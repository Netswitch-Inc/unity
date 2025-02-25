// Getting the Newly created Mongoose Model we just created
var Framework = require("../models/Framework.model");

// Saving the context of this module inside the _the variable
_this = this;

exports.getFrameworks = async function (query = {}, page = 1, limit = 0, sortField = "", sortType = "") {
  var skips = limit * (page - 1);
  var sorts = {};
  if (sortField) { sorts[sortField] = sortType; }

  // Try Catch the awaited promise to handle the error
  try {
    var frameworkes = await Framework.find(query)
      .skip(skips)
      .limit(limit)
      .sort(sorts);

    return frameworkes;
  } catch (e) {
    throw Error(e.message);
  }
}

exports.getFrameworksWithIds = async function (query) {
  const projection = { _id: 1 };

  try {
    // Use projection to only return the _id field
    const frameworks = await Framework.find(query).select(projection);

    return frameworks;
  } catch (e) {
    throw new Error(e.message);
  }
};

exports.getFrameworkCount = async function (query) {
  try {
    var count = await Framework.find(query).count();

    return count;
  } catch (e) {
    throw Error(e.message);
  }
};

exports.getFramework = async function (id) {
  try {
    // Find the Data
    var _details = await Framework.findOne({ _id: id });
    if (_details?._id) {
      return _details;
    } else {
      throw Error("Framework not available");
    }
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e.message);
  }
};

exports.createFramework = async function (framework) {
  var newFramework = new Framework({
    reference_id: framework.reference_id ? framework.reference_id : null,
    value: framework.value ? framework.value : null,
    label: framework.label ? framework.label : "",
    slug: framework.slug ? framework.slug : "",
    child_framework: framework.child_framework ? framework.child_framework : "",
    status: framework.status ? framework.status : 0,
    deletedAt: null,
  });

  try {
    // Saving the Framework
    var savedFramework = await newFramework.save();
    return savedFramework;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e.message);
  }
};

exports.updateFramework = async function (framework) {
  var id = framework._id;
  try {
    // Find the old Framework Object by the Id
    var oldFramework = await Framework.findById(id);
  } catch (e) {
    throw Error("Framework not found");
  }

  if (!oldFramework) {
    return false;
  }

  if (framework.reference_id) {
    oldFramework.reference_id = framework.reference_id;
  }

  if (framework.value) {
    oldFramework.value = framework.value;
  }

  if (framework.label) {
    oldFramework.label = framework.label;
  }

  if (framework.slug) {
    oldFramework.slug = framework.slug;
  }

  if (framework.child_framework) {
    oldFramework.child_framework = framework.child_framework;
  }

  if (framework?.status || framework.status == 0) {
    oldFramework.status = framework?.status || 0;
  }

  if (framework?.deletedAt) {
    oldFramework.deletedAt = framework?.deletedAt || null;
  }

  try {
    var savedFramework = await oldFramework.save();
    return savedFramework;
  } catch (e) {
    console.log(e);
    throw Error(e.message);
  }
};

exports.softDeleteFramework = async function (id) {
  try {
    var deleted = await Framework.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date(), status: 0 } }
    );
    return deleted;
  } catch (e) {
    throw Error(e.message);
  }
};

exports.getframeworkByName = async function (name) {
  try {
    var framework = await Framework.findOne({ label: name });
    return framework;
  } catch (e) {
    throw Error(e.message);
  }
}
