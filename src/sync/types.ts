import { UseAI } from "../config/types";
import { ApiResponseTypes } from "../http/types";

type AIProvider = 'openai' | 'google';

interface SyncContext {
    lang: string;
    useAI: {
        apiKey: string;
        provider: AIProvider;
    } | undefined;
}

type UseAIConfig = UseAI & {}

type TranslationQueue = Array<{ index: number, text: string }>

type ProviderConfig = {
    name: AIProvider;
    getResponse: (input: string[], lang: string, useAI: UseAI) => Promise<ApiResponseTypes<any>>;
    getError: (error: any) => { type: string, code: any, status: any, message: any, method: any, url: any };
    extractContent: (data: any) => string | undefined;
}

export type {
    AIProvider, ProviderConfig, SyncContext,
    TranslationQueue,
    UseAIConfig
};

