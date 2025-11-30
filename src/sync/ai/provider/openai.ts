import { http } from "../../../http/interceptors";
import { ProviderConfig, UseAIConfig } from "../../types";
import { getTemplate } from "../utils";


const getOpenAIAIResponse = async (input: string[], lang: string, useAI: UseAIConfig) => {
    return http.post<any>(`https://api.openai.com/v1/chat/completions`, {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: getTemplate(input, lang),
            }
        ]
    }, {
        headers: {
            'Authorization': `Bearer ${useAI.apiKey}`,
        },
    }, {
        // retry: 3,
        onError: (error) => {
            // console.log('error', error.response.data);
        }
    });
};

function parseOpenAIResponseError(error: any) {
    const res = error?.response;
    const { data } = res || {};
    const { url, method } = res?.config || {};
    const { message, code } = data?.error || {};

    return {
        type: "OPENAI_API_ERROR",
        code: res.status,
        status: code,
        message: message,
        method,
        url
    };
}


export const OpenAIProvider: ProviderConfig = {
    name: 'openai',
    getResponse: getOpenAIAIResponse,
    getError: parseOpenAIResponseError,
    extractContent: (data: any) =>
        data?.choices?.[0]?.message?.content,
};
