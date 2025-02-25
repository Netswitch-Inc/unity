var CISScanHeaderService = require("../services/cisScanHeader.service");

var AWS = require("aws-sdk");

// Saving the context of this module inside the _the variable
_this = this;

var awsID = process.env?.AWS_ID || "";
var awsSecret = process.env?.AWS_SECRET || "";

AWS.config.update({
  accessKeyId: awsID,
  secretAccessKey: awsSecret
});

exports.getCISScanHeaders = async function (req, res, next) {
  try {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = Number(req.query?.page || 1);
    var limit = Number(req.query?.limit || 100);
    var sort = req.query?.sort == "asc" ? 1 : -1;
    var sortColumn = req.query.sortColumn ? req.query.sortColumn : "_id";
    var search = req.query?.search || "";
    var pageIndex = 0;
    var startIndex = 0;
    var endIndex = 0;

    var query = {};

    var count = await CISScanHeaderService.getCISScanHeaderCount(query);
    var cisScanHeaders = await CISScanHeaderService.getCISScanHeaders(query, page, limit, sortColumn, sort);
    if (!cisScanHeaders || !cisScanHeaders.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        cisScanHeaders = await CISScanHeaderService.getCISScanHeaders(query, page, limit, sortColumn, sort);
      }
    }

    if (cisScanHeaders && cisScanHeaders.length) {
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

    return res.status(200).json({
      status: 200,
      flag: true,
      data: cisScanHeaders,
      pagination,
      message: "CisData received successfully.",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
};

exports.downloadFromStorage = async (req, res) => {
  const { fileName } = req.query;
  try {
    let filenametostring = fileName.toString();
    console.log("Trying to download file", fileName);

    var s3 = new AWS.S3();
    var options = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filenametostring,
    };

    res.attachment(filenametostring);
    var fileStream = s3.getObject(options).createReadStream().on("error", (error) => {
      console.log("Function Name - downloadFileFromStorage", Date(), error);
    });

    fileStream.pipe(res);
  } catch (error) {
    console.log("Function Name - downloadFileFromStorage", Date(), error);
    return res.status(500).send(`Error occurred while downloading file from S3 storage.${error}`);
  }
}
