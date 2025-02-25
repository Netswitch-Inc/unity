// Gettign the Newly created Mongoose Model we just created
var AttachmentModel = require("../models/Attachments.model");
var Fileservice = require('../services/fileupload.service')
var fs = require("fs");
var publicPath = require("path").resolve("public");
// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the Project List

exports.getSimpleAttachments = async function (query) {
  // Try Catch the awaited promise to handle the error
  try {
    var Attachments = await AttachmentModel.find(query);

    // Return the Attachments list that was retured by the mongoose promise
    return Attachments;
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error while Paginating Attachments");
  }
};

exports.getAttachments = async function (
  query = {},
  page = 1,
  limit = 0,
  sortField = "",
  sortType = ""
) {
  try {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) {
      sorts[sortField] = sortType;
    }

    // Try Catch the awaited promise to handle the error
    var Attachment = await AttachmentModel.find(query)
      .populate({ path: "company_id" })
      .populate({ path: "user_id" })
      .populate({ path: "project_id" })
      .sort(sorts)
      .skip(skips)
      .limit(limit);

    return Attachment;
  } catch (e) {
    throw Error("Error occurred while finding Attachments");
  }
};

exports.getAttachment = async function (id) {
  try {
    // Find the Data
    var _details = await AttachmentModel.findOne({ _id: id })
      .populate({ path: "company_id" })
      .populate({ path: "user_id" })
      .populate({ path: "project_id" });
    if (_details._id) {
      return _details;
    } else {
      throw Error("Attachment not available");
    }
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Attachment not available");
  }
};

exports.createAttachment = async function (attachment) {
  var newAttachment = new AttachmentModel({
    company_id: attachment.company_id ? attachment.company_id : null,
    user_id: attachment.user_id ? attachment.user_id : null,
    project_id: attachment.project_id ? attachment.project_id : null,
    name: attachment.name ? attachment.name : "",
    file_name: attachment.file_name ? attachment.file_name : "",
    extension: attachment.extension ? attachment.extension : "",
    file_size: attachment.file_size ? attachment.file_size : 0,
    file_path: attachment.file_path ? attachment.file_path : "",
    status: attachment.status ? attachment.status : 0,
    deletedAt: null
  });

  try {
    // Saving the Project
    var savedAttachment = await newAttachment.save();
    return savedAttachment;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e.message);
  }
};

exports.updateAttachment = async function (attachment) {
  var id = attachment._id;
  try {
    var oldAttachment = await AttachmentModel.findById(id);
  } catch (e) {
    throw Error("Attachment not found");
  }

  if (!oldAttachment) {
    return false;
  }

  // Edit the Question Object
  if (attachment.company_id) {
    oldAttachment.company_id = attachment.company_id;
  }
  if (attachment.user_id) {
    oldAttachment.user_id = attachment.user_id;
  }
  if (attachment.project_id) {
    oldAttachment.project_id = attachment.project_id;
  }

  if (attachment.name) {
    oldAttachment.name = attachment.name;
  }
  if (attachment.file_name) {
    oldAttachment.file_name = attachment.file_name;
  }
  if (attachment.extension) {
    oldAttachment.extension = attachment.extension;
  }
  if (attachment.file_size) {
    oldAttachment.file_size = attachment.file_size;
  }
  if (attachment.file_path) {
    oldAttachment.file_path = attachment.file_path;
  }
  if (attachment.status === 1 || attachment.status === 0) {
    oldAttachment.status = attachment.status;
  }

  try {
    var savedAttachment = await oldAttachment.save();
    return savedAttachment;
  } catch (e) {
    throw Error("Error occurred while updating the Attachment");
  }
};

// exports.deleteProject = async function (id) {
//   // Delete the Project
//   try {
//     var deleted = await AttachmentModel.remove({ _id: id });
//     if (deleted.n === 0 && deleted.ok === 1) {
//       throw Error("Project Could not be deleted");
//     }

//     return deleted;
//   } catch (e) {
//     throw Error("Error Occured while Deleting the Project");
//   }
// };

exports.softDeleteAttachment = async function (id) {
  try {
    var deleted = await AttachmentModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } }
    );
    return deleted;
  } catch (e) {
    throw Error(e.message);
  }
};

exports.getAttachmentsCount = async function (query) {
  try {
    var count = await AttachmentModel.find(query).count();

    return count;
  } catch (e) {
    throw Error("Error while Counting Attachments");
  }
};
