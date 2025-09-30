var axios = require("axios");

var { getReplaceValue } = require("../helper");

let openAIAPIUrl = "https://api.openai.com";
let geminiAPIUrl = "https://generativelanguage.googleapis.com";

// OpenAI models: gpt-4 | gpt-3.5-turbo
// Gemini models: gemini-1.5-pro | gemini-1.5-flash

let descriptionWritePrompt = `You are a cybersecurity expert and professional content writer with over 20 years of experience.

You are given the name of a cybersecurity tool from an application, along with a short description and relevant keywords.
Based on these three inputs, generate exactly 5 unique, concise, and professional descriptions of this tool.

Each description should:
- Be written in a professional tone.
- Be between 25–40 words.
- Highlight the tool's purpose and its value in a cybersecurity context.
- Be user-friendly for both technical and semi-technical users.

Return your response strictly as a JSON object with this format and no extra text:
{
    "result": [
        { "description": "..." },
        { "description": "..." },
        { "description": "..." },
        { "description": "..." },
        { "description": "..." }
    ]
}

Tool Name: {TOOL_NAME}
Framework Name: {FRAMEWORK_NAME}
Tool Description: {TOOL_DESCRIPTION}
Keywords: {KEYWORDS}`;

exports.writeDescriptionWithGemini = async function (credentials = null, payload = null) {
    try {
        if (!credentials || !credentials?.api_key) {
            throw new Error("API key is required for Gemini service.");
        }

        let prompt = descriptionWritePrompt;
        prompt = getReplaceValue('{TOOL_NAME}', payload?.name || "", prompt);
        prompt = getReplaceValue('{FRAMEWORK_NAME}', payload?.framework_name || "", prompt);
        prompt = getReplaceValue('{TOOL_DESCRIPTION}', payload?.description || "", prompt);
        prompt = getReplaceValue('{KEYWORDS}', payload?.keywords || "", prompt);

        let model = "gemini-2.5-flash";
        var headers = {
            "Content-Type": "application/json"
        }

        var bodyContent = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        }

        var apiUrl = `${geminiAPIUrl}/v1/models/${model}:generateContent?key=${credentials.api_key}`;
        var apiResponse = await axios.post(apiUrl, bodyContent, { headers }).then((res) => res.data).catch((error) => error);
        if (apiResponse?.response?.status && apiResponse?.response?.data?.error) {
            let error = apiResponse?.response?.data?.error;
            throw Error(error?.message || apiResponse?.response?.statusText || "Something went wrong with Gemini API.");
        } else if (apiResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return extractJsonFromContent(apiResponse?.candidates?.[0]?.content?.parts?.[0]?.text);
        } else {
            throw Error("No valid response received from Gemini API.");
        }

    } catch (error) {
        console.log("writeDescriptionWithGemini catch ==== ", error);
        throw Error(error?.message);
    }
}

exports.writeDescriptionWithOpenAI = async function (credentials = null, payload = null) {
    try {
        if (!credentials || !credentials?.api_key) {
            throw new Error("API key is required for OpenAI service.");
        }

        let prompt = descriptionWritePrompt;
        prompt = getReplaceValue('{TOOL_NAME}', payload?.name || "", prompt);
        prompt = getReplaceValue('{FRAMEWORK_NAME}', payload?.framework_name || "", prompt);
        prompt = getReplaceValue('{TOOL_DESCRIPTION}', payload?.description || "", prompt);
        prompt = getReplaceValue('{KEYWORDS}', payload?.keywords || "", prompt);

        let model = "gpt-3.5-turbo";
        var headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${credentials.api_key}`
        }

        var bodyContent = {
            model,
            temperature: 0.7,
            max_tokens: 1000,
            messages: [{
                role: "system",
                content: prompt
            }]
        }

        var apiUrl = `${openAIAPIUrl}/v1/chat/completions`;
        var apiResponse = await axios.post(apiUrl, bodyContent, { headers }).then((res) => res.data).catch((error) => error);
        if (apiResponse?.response?.status && apiResponse?.response?.data?.error) {
            let error = apiResponse?.response?.data?.error;
            throw Error(error?.message || apiResponse?.response?.statusText || "Something went wrong with OpenAI API.");
        } else if(apiResponse?.choices?.[0]?.message?.content) {
            return extractJsonFromContent(apiResponse?.choices?.[0]?.message?.content);
        } else {
            throw Error("No valid response received from OpenAI API.");
        }

    } catch (error) {
        console.log("writeDescriptionWithOpenAI catch ==== ", error);
        throw Error(error?.message);
    }
}

const extractJsonFromContent = (jsonData) => {
    try {
        // Clean and extract actual JSON
        let jsonText = typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData);

        // Remove markdown formatting (e.g., ```json ... ```)
        jsonText = jsonText.replace(/```json/i, '')
            .replace(/```/g, '').trim();

        const data = JSON.parse(jsonText);
        if (!Array.isArray(data?.result)) {
            throw new Error("Invalid format: 'result' should be an array");
        }

        return data?.result.filter(item => item && typeof item.description === 'string').map(item => ({
            description: item.description.trim()
        }));
    } catch (error) {
        console.log("extractJsonFromContent catch ==== ", error);
        return [];
    }
}
