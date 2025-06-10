var SettingService = require("../services/setting.service");

const rootPath = require('path').resolve('');

const { getReplaceValue, getReadFileContent, sendPlatformTypeEmail } = require('../helper');

exports.toolSolutionContact = async function (req, res, next) {
    try {
        // Path to your HTML file
        const templatePath = `${rootPath}/templates/contactInquiry.html`;

        var name = req.body?.name || "";
        var email = req.body?.email || "";
        var subject = req.body?.subject || "";
        var message = req.body?.message || "";
        var frameworkName = req.body?.framework_name || "";
        var controlName = req.body?.control_name || "";
        var toolName = req.body?.tool_name || "";

        var emailContactInquiry = await SettingService.getSettingBySlug("app_setting_contact_inquiry") || null;
        var content = await getReadFileContent(templatePath);
        if (emailContactInquiry?.value && content) {
            var toEmail = emailContactInquiry.value;
            var htmlContent = content;
            htmlContent = getReplaceValue('{Contact_Name}', name, htmlContent);
            htmlContent = getReplaceValue('{Contact_Email}', email, htmlContent);
            htmlContent = getReplaceValue('{Contact_Message}', message, htmlContent);
            var frameworkContent = "";
            var controlContent = "";
            var toolContent = "";
            if (frameworkName) {
                frameworkContent = `<p><strong>Framework :</strong> ${frameworkName}</p>`
            }

            if (controlName) {
                controlContent = `<p><strong>Compliance Control :</strong> ${controlName}</p>`
            }

            if (toolName) {
                toolContent = `<p><strong>Solution Tool :</strong> ${toolName}</p>`
            }
            htmlContent = getReplaceValue('{Framework_Name}', frameworkContent, htmlContent);
            htmlContent = getReplaceValue('{Control_Name}', controlContent, htmlContent);
            htmlContent = getReplaceValue('{Tool_Name}', toolContent, htmlContent);
            let mailItem = {
                to: toEmail,
                bcc: email,
                name: "Contact",
                subject: subject,
                content: htmlContent
            }

            // console.log("toolSolutionContact mailItem >>> ", mailItem);
            await sendPlatformTypeEmail(mailItem);
            return res.status(200).json({ status: 200, flag: true, message: "Contact inquiry sent successfully." });
        }

        return res.status(200).json({ status: 200, flag: false, message: "Contact inquiry not available." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}
