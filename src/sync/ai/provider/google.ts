import { http } from "../../../http/interceptors";
import { ProviderConfig, UseAIConfig } from "../../types";
import { getTemplate } from "../utils";

async function getGoogleAIResponse(input: string[], lang: string, useAI: UseAIConfig) {
    return http.post<any>(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${useAI.apiKey}`, {
        contents: [
            {
                parts: [
                    {
                        text: getTemplate(input, lang),
                    }
                ]
            }
        ],
    }, {}, {
        // retry: 3
    });
}

function parseGoogleResponseError(error: any) {
    const res = error?.response;
    const { data } = res || {};
    const { url, method } = res?.config || {};
    const { code, message, status } = data?.error || {};

    return {
        type: "GOOGLE_API_ERROR",
        code,
        status,
        message: message,
        method,
        url
    };
}

export const GoogleProvider: ProviderConfig = {
    name: 'google',
    getResponse: getGoogleAIResponse,
    getError: parseGoogleResponseError,
    extractContent: (data: any) =>
        data?.candidates?.[0]?.content?.parts[0]?.text,
};