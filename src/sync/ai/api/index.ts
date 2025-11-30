import { UseAI } from "../../../config/types";
import { PROVIDER_REGISTRY } from "../provider";

export async function getAIResponse(input: string[], lang: string, useAI: UseAI) {
    const { provider } = useAI;
    return PROVIDER_REGISTRY[provider]?.getResponse(input, lang, useAI) || { success: false, data: null, error: { code: 400, message: 'Unknown provider' } };
}