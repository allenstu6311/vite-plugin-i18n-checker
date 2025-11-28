import { UseAI } from "../config/types";

type AIProvider = 'openai' | 'google';

interface SyncContext {
    lang: string;
    useAI: {
        apiKey: string;
        provider: AIProvider;
    } | undefined;
}

type UseAIConfig = UseAI & {
    batchSize?: number;
    maxBatchSize?: number;
}

type TranslationQueue = Array<{ index: number, text: string }>

type TranslationErrorItem = {
    pathStack: string;
    value: string;
    errorCode: string;
    errorStatus: string;
    errorMessage: string;
}

interface TranslationErrorHint {
    code: number;
    possibleCauses: string[];
    suggestions: string[];
}

type ProviderErrorMap = Record<string, TranslationErrorHint>;

export type {
    AIProvider, ProviderErrorMap, SyncContext, TranslationErrorItem,
    TranslationQueue,
    UseAIConfig
};

