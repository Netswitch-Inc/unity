const Attachmentservice = require("../services/attachment.service");
const projectHistoryService=require('../services/projecthistories.service.js')
const helperService = require('../helper/index.js')
exports.getAttachments = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  try {
    var page = Number(req.query?.page || 1);
    var limit = Number(req.query?.limit || 100);
    var sort = req.query?.sort == "asc" ? 1 : -1;
    var sortColumn = req.query.sortColumn ? req.query.sortColumn : "_id";
    var search = req.query?.search || "";
    var pageIndex = 0;
    var startIndex = 0;
    var endIndex = 0;

    var query = { deletedAt: null, project_id: req.query.project_id };
    if (search) {
      query["$or"] = [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
      ];
    }

    var count = await Attachmentservice.getAttachmentsCount(query);
    var Attachments = await Attachmentservice.getAttachments(
      query,
      page,
      limit,
      sortColumn,
      sort
    );
    if (!Attachments || !Attachments.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        Attachments = await Attachmentservice.getAttachments(
          query,
          page,
          limit,
          sortColumn,
          sort
        );
      }
    }

    if (Attachments && Attachments.length) {
      pageIndex = page - 1;
      startIndex = pageIndex * limit + 1;
      endIndex = Math.min(startIndex - 1 + limit, count);
    }

    var pagination = {
      pages: Math.ceil(count / limit),
      total: count,
      pageIndex,
      startIndex,
      endIndex,
    };

    // Return the Attachments list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: Attachments,
      pagination,
      message: "Attachments received successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.getAttachment = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var id = req.params.id;
  try {
    var Attachment = await Attachmentservice.getAttachment(id);

    // Return the Attachments with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: Attachment,
      message: "Attachments received successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.createAttachment = async function (req, res, next) {
  try {
    // Calling the Service function with the new object from the Request Body
    const file = req.file
    if (!file) {
      return res.status(400).json({ status: 200, flag: false, message: 'No file available' });
    }
    const fileExt = file?.filename.split('.').pop()
    const filePath = helperService.getRelativePath(file?.path)
    const attechMentData = {
      ...req.body, name: file?.originalname, file_name: file?.filename, extension: fileExt, file_size: file?.size, file_path: filePath, status: 1
    }

    var createdAttachment = await Attachmentservice.createAttachment(attechMentData);
    if (createdAttachment) {
      const description = req.body?.projectHistoryDescription
      await projectHistoryService.createProjectHistory({ ...req.body, description })
    }

    return res.status(200).json({
      status: 200,
      flag: true,
      data: createdAttachment,
      message: "Attachment created successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.updateAttachment = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body._id) {
    return res
      .status(200)
      .json({ status: 200, flag: false, message: "Id must be present!" });
  }

  try {
    // Calling the Service function with the new object from the Request Body
    var updatedAttachment = await Attachmentservice.updateAttachment(req.body);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedAttachment,
      message: "Attachment updated successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.removeAttachment = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res
      .status(200)
      .json({ status: 200, flag: true, message: "Id must be present" });
  }

  try {
    var deleted = await Attachmentservice.softDeleteAttachment(id);
    return res.status(200).send({
      status: 200,
      flag: true,
      message: "Attachment deleted successfully.",
    });
  } catch (e) {
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.uploadFile = async function (req, res, next) {
  try {
    console.log(req.file)
    console.log(req.body)
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Access the file information
    const filePath = req.file.path; // Full path of the uploaded file
    const fileName = req.file.filename; // File name

    res.status(200).send(`File uploaded successfully! Saved at`);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('An error occurred while uploading the file.');
  }
}
