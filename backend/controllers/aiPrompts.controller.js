var AIPromptService = require("../services/aiPrompt.service");

var { aiServiceTypes, getAIIntegrationCredentials } = require("../helper");

const writeDescriptionAIFuntions = {
    [aiServiceTypes.gemini]: AIPromptService.writeDescriptionWithGemini,
    [aiServiceTypes.openai]: AIPromptService.writeDescriptionWithOpenAI,
}

exports.writeAiDescription = async function (req, res, next) {
    try {
        var descriptions = [];
        let aiServiceCredential = await getAIIntegrationCredentials();
        if (aiServiceCredential?.type && writeDescriptionAIFuntions?.[aiServiceCredential?.type]) {
            var descriptions = await writeDescriptionAIFuntions[aiServiceCredential?.type](aiServiceCredential, req.body);
        }

        return res.status(200).json({
            status: 200,
            flag: true,
            data: descriptions,
            message: "AI description received successfully."
        });
    } catch (error) {
        return res.status(200).json({ status: 200, flag: false, message: error.message });
    }
}
