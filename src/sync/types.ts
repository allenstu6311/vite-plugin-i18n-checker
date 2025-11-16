type AIProvider = 'openai' | 'google';

interface SyncContext {
    lang: string;
    useAI: {
        apiKey: string;
        provider: AIProvider;
    } | undefined;
}

export type {
    AIProvider, SyncContext
};

