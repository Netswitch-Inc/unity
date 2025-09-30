var AssessmentReportService = require("../services/assessmentReport.service");
var sectionService = require("../services/section.service");
var AssessmentService = require("../services/assessment.service");
var QuestionService = require("../services/question.service");

var {
  sendSMS,
  generateCode,
  sendVerification,
  sendPlatformTypeEmail,
} = require("../helper");

// Saving the context of this AssessmentReport inside the _the variable
_this = this;

let ejs = require("ejs");
// let pdf = require("html-pdf")
var pdfCompress = require("compress-pdf");

let reportpath = require("path").resolve("./");
const puppeteer = require("puppeteer");
var fs = require("fs");
let pdfpath = require("path");
var pdfpathexistance = require("path").resolve("public");

async function generatePdf(html, outputPath, options = { format: "A4" }, userDetailsHtml) {
  try {
    const browser = await puppeteer.launch({
      timeout: 3000,
      headless: true, // true|false
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ["--disable-extensions"],
      waitUntil: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
      defaultViewport: null, // Set to null for full screen,
      // executablePath: "",
      // cacheDirectory: cacheDir,
      cacheDirectory: puppeteer.executablePath(),
      // cacheDirectory: pdfpath.join(pdfpath.resolve("./"), ".cache", "puppeteer"),
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        // "--single-process",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    const combinedHtml = `<html>
    <head>
        <style>
            @media print {
                .page-break {
                    page-break-after: always;
                }
            }
        </style>
    </head>
    <body>
        <div>${userDetailsHtml}</div>
        <div class="page-break"></div>
        <div>${html}</div>
    </body>
    </html>`;

    // Set the user details HTML for the first page
    await page.setContent(combinedHtml, { waitUntil: "networkidle0" });

    // await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({ path: outputPath, ...options });
    await browser.close();
    return "PDF generated Successfully";
  } catch (e) {
    console.log("tError ", e);
    //Return an Error Response Message with Code and the Error Message.
    return e;
  }
}

async function compressPdfFile(inputPath, outputPath) {
  const buffer = await pdfCompress.compress(inputPath);
  await fs.promises.writeFile(outputPath, buffer);
}

const generateReport = async (assessmentReport, file_name, assessmentUserReport) => {
  try {
    // Render the EJS template
    const html = await ejs.renderFile(`${reportpath}/views/assessment-form.ejs`, { data: assessmentReport });

    const userDetailsHtml = await ejs.renderFile(`${reportpath}/views/assessment-user-details.ejs`, { data: assessmentUserReport });

    // Define output path for the PDF
    const outputPath = `public/files/assessment-report/${file_name}.pdf`;
    // Ensure the output directory exists
    await fs.promises.mkdir("public/files/assessment-report/", {
      recursive: true,
    });

    // Define options for PDF generation
    const options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
      localUrlAccess: true,
      margin: {
        top: "7mm",
        bottom: "10.3mm",
        right: "2mm",
        left: "2mm",
      },
      header: {
        height: "7mm",
      },
      footer: {
        height: "10.3mm",
      },
    };

    // Generate the PDF
    const pdfGenerated = await generatePdf(html, outputPath, options, userDetailsHtml);
    if (pdfGenerated) {
      // Compress the PDF if generated successfully
      const inputPdfPath = outputPath; // Same as outputPath
      await compressPdfFile(inputPdfPath, inputPdfPath);
      return pdfGenerated;
    }
  } catch (error) {
    console.error("Error generating report:", error?.message);
    return error?.message;
  }
}

// Async Controller function to get the To do List
exports.getAssessmentReports = async function (req, res, next) {
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
    if (search) {
      query["$or"] = [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { first_name: { $regex: ".*" + search + ".*", $options: "i" } },
        { last_name: { $regex: ".*" + search + ".*", $options: "i" } },
        { company_name: { $regex: ".*" + search + ".*", $options: "i" } },
        {
          operation_description: {
            $regex: ".*" + search + ".*",
            $options: "i",
          },
        },
      ];
    }
    
    if (req.query?.asessmentId) {
      query.assessment_id = req.query?.asessmentId;
    }

    var count = await AssessmentReportService.getAssessmentReportsCount(query);
    var assessmentReports = await AssessmentReportService.getAssessmentReports(query, page, limit, sortColumn, sort);
    if (!assessmentReports || !assessmentReports.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        assessmentReports = await AssessmentReportService.getAssessmentReports(query, page, limit, sortColumn, sort);
      }
    }

    if (assessmentReports && assessmentReports.length) {
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

    // Return the Assessment Reports list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: assessmentReports,
      pagination,
      message: "Assessment Reports received successfully."
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.getAssessmentReport = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var id = req.params.id;
  try {
    var assessmentReport = await AssessmentReportService.getAssessmentReport(id);

    // Return the Assessment Report with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: assessmentReport,
      message: "Assessment Report received successfully."
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.createAssessmentReport = async function (req, res, next) {
  try {
    // Calling the Service function with the new object from the Request Body
    const assessment_id = req.body.assessment_id;
    if (!assessment_id) {
      return res.status(200).json({
        status: 200,
        flag: false,
        message: "Assessment Id is required!",
      });
    }
    
    const query = { assessment_id: assessment_id, status: 1 };
    // let mobileCode = generateCode();
    let emailCode = generateCode();
    let section_data = await sectionService.getSectionsByAssessmentId(query);
    let assessmentData = await AssessmentService.getAssessmentOne(assessment_id);
    var createdAssessmentReport = await AssessmentReportService.createAssessmentReport({
        ...req.body,
        email_code: emailCode,
        // mobile_code: mobileCode,
        group_data: section_data,
        assessment_data: assessmentData,
    });
    
    if (createdAssessmentReport) {
      let mailItem = {
        to: createdAssessmentReport?.email,
        name: createdAssessmentReport?.name,
        subject: "Verification Code",
        // content: `Your email verification code is: <strong>${emailCode}</strong><br>Your mobile verification code is: <strong>${mobileCode}</strong>`
        content: `Your email verification code is: <strong>${emailCode}</strong>`
      }

      await sendPlatformTypeEmail(mailItem)
    }
    
    return res.status(200).json({
      status: 200,
      flag: true,
      data: createdAssessmentReport,
      message: "Assessment Report created successfully!"
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.updateAssessmentReport = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body._id) {
    return res.status(200).json({ status: 200, flag: false, message: "Id must be present!" });
  }

  try {
    const getAssessmentReport = await AssessmentReportService.getAssessmentReport(req.body._id);
    if (req.body?.email !== getAssessmentReport?.email) {
      req.body.email_code = generateCode();
      // req.body.mobile_code = generateCode();
      req.body.email_verified = false;
      req.body.mobile_verified = false;

      let mailItem = {
        to: getAssessmentReport?.email,
        name: getAssessmentReport?.name,
        subject: "Verification Code",
        // content: `Your email verification code is: <strong>${req.body.email_code}</strong><br>Your mobile verification code is: <strong>${req.body.mobile_code}</strong>`
        content: `Your email verification code is: <strong>${req.body.email_code}</strong>`
      }

      await sendPlatformTypeEmail(mailItem)
    }

    // if (req.body?.mobile !== getAssessmentReport?.mobile) {
    //   req.body.mobile_verified = false;
    //   req.body.mobile_code = generateCode();
    //   await sendSMS({
    //     message: `Your verification code is: ${mobileCode}`,
    //     mobile: getAssessmentReport?.mobile,
    //   });
    // }

    // Calling the Service function with the new object from the Request Body
    var updatedAssessmentReport = await AssessmentReportService.updateAssessmentReport(req.body);
    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedAssessmentReport,
      message: "Assessment Report updated successfully!",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.removeAssessmentReport = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res.status(200).json({ status: 200, flag: true, message: "Id must be present!" });
  }

  try {
    var deleted = await AssessmentReportService.deleteAssessmentReport(id);

    return res.status(200).json({ status: 200, flag: true, message: "Successfully Deleted... " });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.verifyAssessmentReport = async function (req, res, next) {
  try {
    const { _id, email_code, mobile_code } = req.body;
    let email_verified = false;
    let mobile_verified = false;
    // Validate input
    if (!_id) {
      return res.status(200).json({ status: 200, flag: false, message: "Id is required." });
    }

    const email_verification = await AssessmentReportService.getDataOfReport({ _id, email_code });
    // const mobile_verification = await AssessmentReportService.getDataOfReport({ _id, mobile_code });
    // if (mobile_verification) {
    //   mobile_verified = true;
    // }

    if (email_verification) {
      email_verified = true;
    }
    // if (!mobile_verified && !email_verified) {
    //   return res.status(200).json({
    //     status: 200,
    //     flag: false,
    //     message: "Email verification and Mobile verification code not matched.",
    //   });
    // }
    // if (!mobile_verified) {
    //   return res.status(200).json({
    //     status: 200,
    //     flag: false,
    //     message: "Mobile verification code not matched.",
    //   });
    // }

    if (!email_verified) {
      return res.status(200).json({
        status: 200,
        flag: false,
        message: "Email verification code not matched.",
      });
    }

    // if (mobile_verification && email_verification) {
    if (email_verification) {
      // const payload = { _id: _id, email_verified: true, mobile_verified: true };
      const payload = { _id: _id, email_verified: true };
      await AssessmentReportService.updateAssessmentReport(payload);
      return res.status(200).json({ status: 200, flag: true, message: "Verification successful." });
    } else {
      return res.status(200).json({
        status: 200,
        flag: false,
        message: "Verification codes do not match.",
      });
    }
  } catch (error) {
    console.error("Verification error:", error); // Log the error for debugging
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.generateAssessmentReport = async function (req, res, next) {
  try {
    const { assessment_id, asessment_report_id } = req.body;
    const assessmentReport = await AssessmentReportService.getAssessmentReport(asessment_report_id);
    if (!assessmentReport?.pdf_path || assessmentReport?.pdf_path === "" || !fs.existsSync(pdfpathexistance + `/files/assessment-report/${asessment_report_id}.pdf`)) {
      let data = await QuestionService.getSectionsWithQuestionsAndAnswers(assessment_id, asessment_report_id);
      const generatdPdf = await generateReport(
        data,
        asessment_report_id,
        assessmentReport
      );
      const payload = {
        _id: asessment_report_id,
        pdf_path: `files/assessment-report/${asessment_report_id}.pdf`,
      };
      await AssessmentReportService.updateAssessmentReport(payload);
    }
    
    return res.status(200).json({
      status: 200,
      flag: true,
      // data: generatdPdf,
      message: "Test report",
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.sentAttachmentReportViaEmail = async function (req, res, next) {
  try {
    const { assessment_id, assessment_report_id } = req.body;

    // Step 1: Retrieve the data for the assessment report
    const assessmentReport = await AssessmentReportService.getAssessmentReport(assessment_report_id);
    if (!assessmentReport?.pdf_path || assessmentReport?.pdf_path === "" || !fs.existsSync(`${pdfpathexistance}/files/assessment-report/${assessment_report_id}.pdf`)
    ) {
      const data = await QuestionService.getSectionsWithQuestionsAndAnswers(assessment_id, assessment_report_id);
      await generateReport(data, assessment_report_id, assessmentReport);
      const payload = {
        _id: assessment_report_id,
        pdf_path: `files/assessment-report/${assessment_report_id}.pdf`,
      };

      await AssessmentReportService.updateAssessmentReport(payload);
    }

    let mailItem = {
      to: assessmentReport?.email,
      name: assessmentReport?.name,
      subject: "Assessment Report",
      content: `Assessment Report Details`,
      filePath: `files/assessment-report/${assessment_report_id}.pdf`
    }

    await sendPlatformTypeEmail(mailItem)

    // Step 6: Respond to the client
    return res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error?.message);
    // Step 7: Handle errors
    return res.status(200).json({ message: error.message });
  }
}

exports.sendSMSPostment = async function (req, res, next) {
  try {
    const response = await sendVerification("+xxxxxxxxxxxx");
    if (response) {
      return res.status(200).json({ status: 200, flag: true, message: "SMS sent successfully." });
    }
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}
