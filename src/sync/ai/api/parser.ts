import { AIProvider } from "../../types";

function getDataWithProvider(data: any, provider: AIProvider) {
    switch (provider) {
        case 'google':
            return data?.candidates?.[0]?.content?.parts[0]?.text;
        case 'openai':
            return data?.choices?.[0]?.message?.content;
        default:
            return data;
    }
}

function safeJsonParse(data: any, provider: AIProvider) {
    const output = getDataWithProvider(data, provider);
    let text = output.trim();
    // 1. 去掉 code block
    text = text.replace(/^```[a-z]*\s*/i, '').replace(/```$/i, '').trim();

    // 2. 如果是單純一行中文（如 測試），自動包成 JSON 結構
    if (!text.startsWith('{') && !text.startsWith('[')) {
        return {
            translations: [text]
        };
    }

    // 3. 嘗試 JSON.parse
    try {
        return JSON.parse(text);
    } catch (err) {
        console.error("AI 回傳不是有效 JSON：", text);
        return { translations: [text] };
    }
}

export { safeJsonParse };
