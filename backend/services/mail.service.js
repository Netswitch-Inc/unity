// Main Mail file with all configurabled data
var fs = require("fs");
var axios = require("axios");
var path = require("path");
var publicPath = require("path").resolve("public");

var Hogan = require("hogan.js");
const nodemailer = require("nodemailer");
const { ConfidentialClientApplication } = require("@azure/msal-node");

var SettingService = require("../services/setting.service");

// Async function to get the Test List
exports.sendEmail = async function (to, name, subject, temFile, text, filePath = "") {
  try {
    // for given dynamic template files and compile it.
    var rtemplate = fs.readFileSync("./templates/" + temFile, "utf-8");
    var compiledTemplate = Hogan.compile(rtemplate);

    var mailServerHost = await SettingService.getSettingBySlug("mail_server_host") || null;
    var mailServerPort = await SettingService.getSettingBySlug("mail_server_port") || null;
    var mailAuthEmail = await SettingService.getSettingBySlug("mail_auth_email") || null;
    var mailAuthPassword = await SettingService.getSettingBySlug("mail_auth_password") || null;
    var mailFromEmail = await SettingService.getSettingBySlug("mail_from_email") || null;
    var mailFromName = await SettingService.getSettingBySlug("mail_from_name") || null;

    mailServerHost = mailServerHost?.value || process.env?.MAIL_SERVER_HOST || "";
    mailServerPort = mailServerPort?.value || process.env?.MAIL_SERVER_PORT || ""; mailAuthEmail = mailAuthEmail?.value || process.env?.MAIL_AUTH_EMAIL || "";
    mailAuthPassword = mailAuthPassword?.value || process.env?.MAIL_AUTH_PASSWORD || "";
    mailFromEmail = mailFromEmail?.value || process.env?.MAIL_FROM_EMAIL || "";
    mailFromName = mailFromName?.value || process.env?.MAIL_FROM_NAME || "";

    let transport = nodemailer.createTransport({
      host: mailServerHost,
      port: mailServerPort,
      auth: {
        user: mailAuthEmail,
        pass: mailAuthPassword
      }
    })

    // console.log("transport ",transport)
    const mailOptions = {
      from: `(${mailFromName} ${mailFromEmail})`,
      to: `(${name} ${to})`,
      subject: subject,
      html: compiledTemplate.render({ text })
    }

    if (filePath && fs.existsSync(`${publicPath}/${filePath}`)) {
      var fileName = filePath.split("/").pop();
      mailOptions.attachments = [{
        filename: fileName,
        path: `${publicPath}/${filePath}`
      }];
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
}

exports.sendSimpleHtmlEmail = async function (config = null, item = null) {
  try {
    const mailHost = config?.mail_host || "";
    const mailPort = config?.mail_port || "";
    const mailAuthEmail = config?.mail_auth_email || "";
    const mailAuthPassword = config?.mail_auth_password || "";
    const mailFromEmail = config?.mail_from_email || "";
    const mailFromName = config?.mail_from_name || "";

    let to = item?.to || "";
    let name = item?.name || "";
    let cc = item?.cc || "";
    let bcc = item?.bcc || "";
    let subject = item?.subject || "";
    let emailContent = item?.content || "";
    let filePath = item?.filePath || "";
    if (bcc) { bcc = bcc?.split(","); }

    if (mailHost && mailPort && mailAuthEmail && mailAuthPassword && to) {
      let transport = nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        auth: {
          user: mailAuthEmail,
          pass: mailAuthPassword
        }
      })

      // console.log("transport ",transport)
      const mailOptions = {
        to: `(${name} ${to})`,
        subject: subject,
        html: emailContent
      }

      if (bcc?.length) { mailOptions.bcc = bcc; }

      if (mailFromEmail) {
        mailOptions.from = `(${mailFromName} ${mailFromEmail})`;
      }

      if (filePath && fs.existsSync(`${publicPath}/${filePath}`)) {
        mailOptions.attachments = [{
          filename: path.basename(filePath),
          path: `${publicPath}/${filePath}`
        }]
      }

      // console.log("mailOptions ", mailOptions)
      await transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error.message, "err");
          return false;
        } else {
          console.log("Email sent: " + info.response);
          return true;
        }
      });
    } else {
      throw Error("sendSimpleHtmlEmail -> No SMTP config found.");
    }
  } catch (error) {
    console.log("sendSimpleHtmlEmail catch -> ", error?.message);
  }
}

exports.sendAzureM365Email = async function (config = null, item = null) {
  try {
    const clientId = config?.client_id || "";
    const clientSecret = config?.secret_value || "";
    const tenantId = config?.tenant_id || "";
    const fromEmail = config?.from_email || "";
    const fromName = config?.from_name || "";

    const msURL = "https://login.microsoftonline.com";
    const graphSendMailUrl = `https://graph.microsoft.com/v1.0/users/${fromEmail}/sendMail`;
    const tokenScope = ["https://graph.microsoft.com/.default"];

    let to = item?.to || "";
    let name = item?.name || "";
    let cc = item?.cc || "";
    let bcc = item?.bcc || "";
    let subject = item?.subject || "";
    let emailContent = item?.content || "";
    let filePath = item?.filePath || "";

    if (clientId && clientSecret && tenantId && fromEmail && fromName && to) {
      const msalConfig = {
        auth: {
          clientId,
          clientSecret,
          authority: `${msURL}/${tenantId}`
        }
      }

      const cca = new ConfidentialClientApplication(msalConfig);

      const tokenResponse = await cca.acquireTokenByClientCredential({ scopes: tokenScope })
      const accessToken = tokenResponse?.accessToken || "";
      if (accessToken) {
        // ** Handle BCC recipients
        const bccRecipients = (Array.isArray(bcc) ? bcc : bcc.split(","))
          .map((email) => email.trim()).filter(Boolean).map((email) => ({
            emailAddress: { address: email }
          }))

        // ** Handle CC recipients
        const ccRecipients = (Array.isArray(cc) ? cc : cc.split(","))
          .map((email) => email.trim()).filter(Boolean).map((email) => ({
            emailAddress: { address: email }
          }))

        const emailData = {
          message: {
            subject,
            body: {
              contentType: "HTML", // HTML | Text
              content: emailContent || ""
            },
            from: {
              emailAddress: {
                name: fromName,
                address: fromEmail
              }
            },
            toRecipients: [{
              emailAddress: {
                address: to,
                name: name || ""
              }
            }],
            ccRecipients,
            bccRecipients,
            attachments: []
          },
          saveToSentItems: false
        }

        // Handle file attachment if provided
        if (filePath) {
          const fullFilePath = `${publicPath}/${filePath}`;
          if (fs.existsSync(fullFilePath)) {
            const fileName = path.basename(filePath);
            const fileBuffer = fs.readFileSync(fullFilePath);

            emailData.message.attachments.push({
              "@odata.type": "#microsoft.graph.fileAttachment",
              name: fileName,
              contentBytes: fileBuffer.toString("base64"),
              contentType: "application/octet-stream"
            })
          }
        }

        const response = await axios.post(graphSendMailUrl, emailData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        })

        if (response.status === 202) {
          console.log("sendAzureM365Email sent successfully!");
          return true;
        } else {
          console.log(`sendAzureM365Email Unexpected response: ${response.status}`);
          return false;
        }
      } else {
        throw Error("sendAzureM365Email -> Getting issue while generating token.")
      }

    } else {
      throw Error("sendAzureM365Email -> No M365 config found.");
    }
  } catch (error) {
    console.log("sendAzureM365Email catch -> ", error.message);
  }
}
