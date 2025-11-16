import { UseAI } from "../config/types";

const getTemplate = (input: string, lang: string) => `
你是一個專業的翻譯人員，請你將以下文字翻譯成${lang}：
${input}
只輸出翻譯結果，不要任何解釋或多餘的文字
`;

async function requestAI(url: string, body: any, headers: Record<string, string> = {}) {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
    return response.json();
}

export const getOpenAIAIResponse = async (input: string, lang: string, useAI: UseAI) => {
    const response = await requestAI(`https://api.openai.com/v1/chat/completions`,
        {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: getTemplate(input, lang),
                }
            ]
        },
        {
            'Authorization': `Bearer ${useAI.apiKey}`,
        });
    return response?.choices[0]?.message?.content || input;
};

async function getGoogleAIResponse(input: string, lang: string, useAI: UseAI) {
    const response = await requestAI(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${useAI.apiKey}`, {
        contents: [
            {
                parts: [
                    {
                        text: getTemplate(input, lang),
                    }
                ]
            }
        ]
    });
    return response?.candidates?.[0]?.content?.parts[0]?.text || input;
}

export async function getAIResponse(input: string, lang: string, useAI: UseAI) {
    const { provider } = useAI;
    switch (provider) {
        case 'google': return getGoogleAIResponse(input, lang, useAI);
        case 'openai': return getOpenAIAIResponse(input, lang, useAI);
        default: return input;
    }
}