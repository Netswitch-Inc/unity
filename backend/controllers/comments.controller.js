const Commentservice = require("../services/comment.service");
const projectHistoryService = require('../services/projecthistories.service')
exports.getComments = async function (req, res, next) {
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

    var query = { deletedAt: null };
    // if (search) {
    //   query["$or"] = [
    //     { name: { $regex: ".*" + search + ".*", $options: "i" } },
    //   ];
    // }
    if (req.query?.project_id) {
      query.project_id = req.query.project_id;
    }

    var count = await Commentservice.getCommentsCount(query);
    var Comments = await Commentservice.getComments(
      query,
      page,
      limit,
      sortColumn,
      sort
    );
    if (!Comments || !Comments.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        Comments = await Commentservice.getComments(
          query,
          page,
          limit,
          sortColumn,
          sort
        );
      }
    }

    if (Comments && Comments.length) {
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

    // Return the Comments list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: Comments,
      pagination,
      message: "Comments received successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.getComment = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var id = req.params.id;
  try {
    var Comment = await Commentservice.getComment(id);

    // Return the Comments with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: Comment,
      message: "Comments received successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.createComment = async function (req, res, next) {
  try {
    // Calling the Service function with the new object from the Request Body
    var createdComment = await Commentservice.createComment(req.body);
    if (createdComment) {
      const description = req.body.projectHistoryDescription
      await projectHistoryService.createProjectHistory({ ...req.body, description })
    }
    return res.status(200).json({
      status: 200,
      flag: true,
      data: createdComment,
      message: "Comment created successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.updateComment = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body._id) {
    return res
      .status(200)
      .json({ status: 200, flag: false, message: "Id must be present!" });
  }

  try {
    // Calling the Service function with the new object from the Request Body
    var updatedComment = await Commentservice.updateComment(req.body);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedComment,
      message: "Comment updated successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.removeComment = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res
      .status(200)
      .json({ status: 200, flag: true, message: "Id must be present" });
  }

  try {
    var deleted = await Commentservice.softDeleteComment(id);
    return res.status(200).send({
      status: 200,
      flag: true,
      message: "Comment deleted successfully.",
    });
  } catch (e) {
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};
