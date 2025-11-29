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

export type {
    AIProvider,
    SyncContext,
    TranslationQueue,
    UseAIConfig
};

