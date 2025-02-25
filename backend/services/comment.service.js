// Gettign the Newly created Mongoose Model we just created
var CommentModel = require("../models/Comments.model");
// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the Project List

exports.getSimpleComments = async function (query) {
  // Try Catch the awaited promise to handle the error
  try {
    var Comments = await CommentModel.find(query);

    // Return the Comments list that was retured by the mongoose promise
    return Comments;
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error while Paginating Comments");
  }
};

exports.getComments = async function (
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
    var Comment = await CommentModel.find(query)
      .populate({ path: "company_id" })
      .populate({ path: "user_id" })
      .populate({ path: "project_id" })
      .sort(sorts)
      .skip(skips)
      .limit(limit);

    return Comment;
  } catch (e) {
    throw Error("Error occurred while finding Comments");
  }
};

exports.getComment = async function (id) {
  try {
    // Find the Data
    var _details = await CommentModel.findOne({ _id: id })
      .populate({ path: "company_id" })
      .populate({ path: "user_id" })
      .populate({ path: "project_id" });
    if (_details._id) {
      return _details;
    } else {
      throw Error("Comment not available");
    }
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Comment not available");
  }
};

exports.createComment = async function (Comment) {
  var newComment = new CommentModel({
    company_id: Comment.company_id ? Comment.company_id : null,
    user_id: Comment.user_id ? Comment.user_id : null,
    project_id: Comment.project_id ? Comment.project_id : null,
    description: Comment.description ? Comment?.description : null,
    date: Comment.date ? Comment.date : null,
    status: Comment.status ? Comment.status : 0,
    deletedAt: null
  });

  try {
    // Saving the Project
    var savedComment = await newComment.save();
    return savedComment;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e.message);
  }
};

exports.updateComment = async function (Comment) {
  var id = Comment._id;
  try {
    var oldComment = await CommentModel.findById(id);
  } catch (e) {
    throw Error("Comment not found");
  }

  if (!oldComment) {
    return false;
  }

  // Edit the Question Object
  if (Comment.company_id) {
    oldComment.company_id = Comment.company_id;
  }
  if (Comment.user_id) {
    oldComment.user_id = Comment.user_id;
  }
  if (Comment.project_id) {
    oldComment.project_id = Comment.project_id;
  }

  if (Comment.description) {
    oldComment.description = Comment.description;
  }

  if (Comment.date) {
    oldComment.date = Comment.date;
  }

  if (Comment.status === 1 || Comment.status === 0) {
    oldComment.status = Comment.status;
  }

  try {
    var savedComment = await oldComment.save();
    return savedComment;
  } catch (e) {
    throw Error("Error occurred while updating the Comment");
  }
};

// exports.deleteProject = async function (id) {
//   // Delete the Project
//   try {
//     var deleted = await CommentModel.remove({ _id: id });
//     if (deleted.n === 0 && deleted.ok === 1) {
//       throw Error("Project Could not be deleted");
//     }

//     return deleted;
//   } catch (e) {
//     throw Error("Error Occured while Deleting the Project");
//   }
// };

exports.softDeleteComment = async function (id) {
  try {
    var deleted = await CommentModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } }
    );
    return deleted;
  } catch (e) {
    throw Error(e.message);
  }
};

exports.getCommentsCount = async function (query) {
  try {
    var count = await CommentModel.find(query).count();

    return count;
  } catch (e) {
    throw Error("Error while Counting Comments");
  }
};
