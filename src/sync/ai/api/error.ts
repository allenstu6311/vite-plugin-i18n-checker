import { AIProvider, UseAIConfig } from "../../types";
import { PROVIDER_REGISTRY } from "../provider";

function printFinalErrorSummary({
    status,
    errorRecord,
    lang,
    useAI,
}: {
    status: {
        total: number,
        success: number,
        failed: number,
    },
    errorRecord: Record<string, { pathStack: string, value: string, error: any }[]>;
    lang: string;
    useAI: UseAIConfig;
}) {
    const { total, success, failed } = status;

    console.log('\n──────────────────────────────────────────');
    console.log(`🔴  AI Translation Summary (${lang})`);
    console.log('──────────────────────────────────────────');

    console.log(`Total tasks: ${total}`);
    console.log(`Success:     ${success}`);
    console.log(`Failed:      ${failed}\n`);

    const MAX_DISPLAY = 15; // 🔥 可調整

    for (const key in errorRecord) {
        const errorHint = errorRecord[key][0].error;
        if (!errorHint) continue;

        const items = errorRecord[key];
        const displayItems = items.slice(0, MAX_DISPLAY);
        const remaining = items.length - displayItems.length;

        const provider = useAI.provider;
        console.log(`  Provider: ${provider}`);
        console.log(`  Error type: ${key} (${errorHint.code || 'N/A'})`);
        console.log(`  Message: ${errorHint.message}\n`);

        // 印出前 n 筆
        displayItems.forEach(item => {
            console.log(`  ✖ ${item.pathStack} → "${item.value}"`);
        });

        // 剩餘項目
        if (remaining > 0) {
            console.log(`  ...and ${remaining} more\n`);
        } else {
            console.log('');
        }
        console.log('');
    }
}

function parseResponseError(error: any, provider: AIProvider) {
    const res = error?.response;
    if (res) {
        const errorInfo = PROVIDER_REGISTRY[provider]?.getError(error);
        if (errorInfo) return errorInfo;
    }

    if (error.code) {
        const { url, method } = error?.config || {};

        const networkErrors = [
            "ECONNABORTED",   // axios timeout
            "ETIMEDOUT",      // socket timeout
            "ENOTFOUND",      // DNS lookup fail
            "EAI_AGAIN",      // DNS temp fail
            "ECONNRESET",     // server reset connection
            "ECONNREFUSED",   // server refused
        ];

        if (networkErrors.includes(error.code)) {
            return {
                type: "NETWORK_ERROR",
                status: "NETWORK_ERROR",
                message: error.message,
                url,
                method,
                code: error.code,
            };
        }
    }

    return {
        type: "UNKNOWN_ERROR",
        status: "UNKNOWN_ERROR",
        message: error.message,
        url: error.config?.url || '',
        method: error.config?.method || '',
        code: error.code,
    };
}

export { parseResponseError, printFinalErrorSummary };

