import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { UseAI } from "../config/types";

const getTemplate = (input: string, lang: string) => `
你是一個專業的翻譯人員，請你將以下文字翻譯成${lang}：
${input}
只輸出翻譯結果，不要任何解釋或多餘的文字
`;

export const getOpenAIAIResponse = async (input: string, lang: string, useAI: UseAI) => {
    const { apiKey } = useAI;
    const ai = new OpenAI({ apiKey });
    const response = await ai.responses.create({
        model: "gpt-4o-mini",
        input: getTemplate(input, lang),
    });
    return response.output_text;
};

async function getGoogleAIResponse(input: string, lang: string, useAI: UseAI) {
    const { apiKey } = useAI;
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: getTemplate(input, lang),
    });
    return response.text;
}


export async function getAIResponse(input: string, lang: string, useAI: UseAI) {
    const { provider } = useAI;
    switch (provider) {
        case 'google': return getGoogleAIResponse(input, lang, useAI);
        case 'openai': return getOpenAIAIResponse(input, lang, useAI);
        default: return input;
    }
}