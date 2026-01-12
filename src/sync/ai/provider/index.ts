import { ApiResponseTypes } from "../../../http/types";
import { AIProvider, UseAIConfig } from "../../types";
import { GoogleProvider } from "./gemini";
import { OpenAIProvider } from "./openai";

const PROVIDER_REGISTRY = {
    gemini: GoogleProvider,
    openai: OpenAIProvider,
} satisfies Record<AIProvider, {
    getResponse: (input: string[], lang: string, useAI: UseAIConfig) => Promise<ApiResponseTypes<any>>,
    getError: (error: any) => { type: string, code: any, status: any, message: any, method: any, url: any },
    extractContent: (data: any) => string | undefined,
}>;

export { PROVIDER_REGISTRY };

