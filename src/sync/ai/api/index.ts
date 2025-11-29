import { UseAI } from "../../../config/types";
import { getGoogleAIResponse, getOpenAIAIResponse } from "./client";

export async function getAIResponse(input: string[], lang: string, useAI: UseAI) {
    const { provider } = useAI;
    switch (provider) {
        case 'google': return getGoogleAIResponse(input, lang, useAI);
        case 'openai': return getOpenAIAIResponse(input, lang, useAI);
        default: return { success: false, data: null, error: { status: 500, message: 'Unknown provider' } };
    }
}