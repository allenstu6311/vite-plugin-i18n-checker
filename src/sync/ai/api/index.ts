import { UseAI } from "../../../config/types";
import { getErrorMessage } from "../../../errorHandling";
import { SyncCheckResult } from "../../../errorHandling/schemas/sync";
import { PROVIDER_REGISTRY } from "../provider";

export async function getAIResponse(input: string[], lang: string, useAI: UseAI) {
    const { provider } = useAI;
    return (
        PROVIDER_REGISTRY[provider]?.getResponse(input, lang, useAI) || {
            success: false,
            data: null,
            error: {
                code: 400,
                message: getErrorMessage(SyncCheckResult.AI_UNKNOWN_PROVIDER, provider),
            },
        }
    );
}