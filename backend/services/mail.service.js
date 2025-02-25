// Main Mail file with all configurabled data
var fs = require("fs");
var publicPath = require("path").resolve("public");

var Hogan = require("hogan.js");
const nodemailer = require("nodemailer");

var SettingService = require("../services/setting.service");

// Async function to get the Test List
exports.sendEmail = async function (
  to,
  name,
  subject,
  temFile,
  text,
  filePath = ""
) {
  try {
    // for given dynamic template files and compile it.
    var rtemplate = fs.readFileSync("./templates/" + temFile, "utf-8");
    var compiledTemplate = Hogan.compile(rtemplate);

    var mailServerHost =
      (await SettingService.getSettingBySlug("mail_server_host")) || null;
    var mailServerPort =
      (await SettingService.getSettingBySlug("mail_server_port")) || null;
    var mailAuthEmail =
      (await SettingService.getSettingBySlug("mail_auth_email")) || null;
    var mailAuthPassword =
      (await SettingService.getSettingBySlug("mail_auth_password")) || null;
    var mailFromEmail =
      (await SettingService.getSettingBySlug("mail_from_email")) || null;
    var mailFromName =
      (await SettingService.getSettingBySlug("mail_from_name")) || null;

    mailServerHost =
      mailServerHost?.value || process.env?.MAIL_SERVER_HOST || "";
    mailServerPort =
      mailServerPort?.value || process.env?.MAIL_SERVER_PORT || "";
    mailAuthEmail = mailAuthEmail?.value || process.env?.MAIL_AUTH_EMAIL || "";
    mailAuthPassword =
      mailAuthPassword?.value || process.env?.MAIL_AUTH_PASSWORD || "";
    mailFromEmail = mailFromEmail?.value || process.env?.MAIL_FROM_EMAIL || "";
    mailFromName = mailFromName?.value || process.env?.MAIL_FROM_NAME || "";

    let transport = nodemailer.createTransport({
      host: mailServerHost,
      port: mailServerPort,
      auth: {
        user: mailAuthEmail,
        pass: mailAuthPassword,
      },
    });

    // console.log("transport ",transport)
    const mailOptions = {
      from: `(${mailFromName} ${mailFromEmail})`,
      to: `(${name} ${to})`,
      subject: subject,
      html: compiledTemplate.render({ text }),
    };

    if (filePath && fs.existsSync(`${publicPath}/${filePath}`)) {
      var fileName = filePath.split("/").pop();
      mailOptions.attachments = [
        {
          filename: fileName,
          path: `${publicPath}/${filePath}`,
        },
      ];
    }

    // console.log("mailOptions ", mailOptions)
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (e) {
    console.log("e ", e);
    console.log("\n\nMail update Issaues >>>>>>>>>>>>>>\n\n");
  }
};

exports.sendSimpleHtmlEmail = async function (
  to,
  name,
  subject,
  html,
  filePath = ""
) {
  try {
    var mailServerHost =
      (await SettingService.getSettingBySlug("mail_server_host")) || null;
    var mailServerPort =
      (await SettingService.getSettingBySlug("mail_server_port")) || null;
    var mailAuthEmail =
      (await SettingService.getSettingBySlug("mail_auth_email")) || null;
    var mailAuthPassword =
      (await SettingService.getSettingBySlug("mail_auth_password")) || null;
    var mailFromEmail =
      (await SettingService.getSettingBySlug("mail_from_email")) || null;
    var mailFromName =
      (await SettingService.getSettingBySlug("mail_from_name")) || null;

    mailServerHost =
      mailServerHost?.value || process.env?.MAIL_SERVER_HOST || "";
    mailServerPort =
      mailServerPort?.value || process.env?.MAIL_SERVER_PORT || "";
    mailAuthEmail = mailAuthEmail?.value || process.env?.MAIL_AUTH_EMAIL || "";
    mailAuthPassword =
      mailAuthPassword?.value || process.env?.MAIL_AUTH_PASSWORD || "";
    mailFromEmail = mailFromEmail?.value || process.env?.MAIL_FROM_EMAIL || "";
    mailFromName = mailFromName?.value || process.env?.MAIL_FROM_NAME || "";

    let transport = nodemailer.createTransport({
      host: mailServerHost,
      port: mailServerPort,
      auth: {
        user: mailAuthEmail,
        pass: mailAuthPassword,
      },
    });

    // console.log("transport ",transport)
    const mailOptions = {
      from: `(${mailFromName} ${mailFromEmail})`,
      to: `(${name} ${to})`,
      subject: subject,
      html: html,
    };

    if (filePath && fs.existsSync(`${publicPath}/${filePath}`)) {
      var fileName = filePath.split("/").pop();
      mailOptions.attachments = [
        {
          filename: fileName,
          path: `${publicPath}/${filePath}`,
        },
      ];
    }

    // console.log("mailOptions ", mailOptions)
    await transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error.message, "err");
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (e) {
    console.log("e ", e.message);
    console.log("\n\nMail update Issaues >>>>>>>>>>>>>>\n\n");
  }
};

exports.sendEmailWithAttachment = async function (emailOptions) {
  var mailServerHost =
    (await SettingService.getSettingBySlug("mail_server_host")) || null;
  var mailServerPort =
    (await SettingService.getSettingBySlug("mail_server_port")) || null;
  var mailAuthEmail =
    (await SettingService.getSettingBySlug("mail_auth_email")) || null;
  var mailAuthPassword =
    (await SettingService.getSettingBySlug("mail_auth_password")) || null;
  var mailFromEmail =
    (await SettingService.getSettingBySlug("mail_from_email")) || null;
  var mailFromName =
    (await SettingService.getSettingBySlug("mail_from_name")) || null;

  mailServerHost = mailServerHost?.value || process.env?.MAIL_SERVER_HOST || "";
  mailServerPort = mailServerPort?.value || process.env?.MAIL_SERVER_PORT || "";
  mailAuthEmail = mailAuthEmail?.value || process.env?.MAIL_AUTH_EMAIL || "";
  mailAuthPassword =
    mailAuthPassword?.value || process.env?.MAIL_AUTH_PASSWORD || "";
  mailFromEmail = mailFromEmail?.value || process.env?.MAIL_FROM_EMAIL || "";
  mailFromName = mailFromName?.value || process.env?.MAIL_FROM_NAME || "";

  let transport = nodemailer.createTransport({
    host: mailServerHost,
    port: mailServerPort,
    auth: {
      user: mailAuthEmail,
      pass: mailAuthPassword,
    },
  });
  // Define email data
  const mailOptions = {
    from: `(${mailFromName} ${mailFromEmail})`, // Sender address
    to: emailOptions?.to, // List of recipients
    subject: emailOptions?.subject, // Subject line
    text: emailOptions?.text, // Plain text body
    // html: emailOptions?.html, // HTML body (optional)
    attachments: emailOptions?.attachments, // Attachments array
  };

  // Send the email
  try {
    const info = await transport.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Optionally throw an error for further handling
  }
};
