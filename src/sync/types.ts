type AIProvider = 'openai' | 'google' | 'custom';

interface SyncContext {
    lang: string;
    useAI: {
        apiKey: string;
        provider: AIProvider;
    } | undefined;
    // filePath: string;
}

export type {
    AIProvider, SyncContext
};

