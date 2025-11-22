import { UseAI } from "../../config/types";


const getTemplate = (items: any[], lang: string) => `
你是一個極簡主義者（minimalist）翻譯機器。
你的唯一職責是將輸入的 JSON 陣列翻譯成目標語系，並以**純 JSON**格式輸出。

目標語系：${lang}
翻譯方向：中文 → ${lang}

**格式規則 (極度嚴格)：**
1. **必須**輸出單一、完整、可被 JSON.parse() 解析的 JSON 物件。
2. **結構必須且只能是**：{"translations":[...]}
3. 你**絕對禁止**輸出任何程式碼區塊標記（\`\`\`）、任何額外文字、解釋、註解、標題或前言後語。

要翻譯的 JSON 陣列：
${JSON.stringify(items)}
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
    if (response.status !== 200) {
        console.error('requestAI error', response.status, response.statusText);
    }
    return response.json();
}

export const getOpenAIAIResponse = async (input: any[], lang: string, useAI: UseAI) => {
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

async function getGoogleAIResponse(input: any[], lang: string, useAI: UseAI) {
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

export async function getAIResponse(input: any[], lang: string, useAI: UseAI) {
    const { provider } = useAI;
    switch (provider) {
        case 'google': return getGoogleAIResponse(input, lang, useAI);
        case 'openai': return getOpenAIAIResponse(input, lang, useAI);
        default: return input;
    }
}