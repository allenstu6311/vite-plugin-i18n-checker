import { AIProvider } from "../types";

function parseGoogleResponseError(error: any) {
    const res = error?.response;
    const { data } = res || {};
    const { url, method } = res?.config || {};
    const { code, message, status } = data?.error || {};

    return {
        type: "GOOGLE_API_ERROR",
        code,
        status,
        message: message,
        method,
        url
    };
}


function parseOpenAIResponseError(error: any) {
    const res = error?.response;
    const { data } = res || {};
    const { url, method } = res?.config || {};
    const { message, code } = data?.error || {};

    return {
        type: "OPENAI_API_ERROR",
        code: res.status,
        status: code,
        message: message,
        method,
        url
    };
}

function printFinalErrorSummary({
    status,
    errorRecord,
    lang,
}: {
    status: {
        total: number,
        success: number,
        failed: number,
    },
    errorRecord: Record<string, { pathStack: string, value: string, error: any }[]>;
    lang: string;
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
        console.log('errorHint', errorHint);
        if (!errorHint) continue;

        const items = errorRecord[key];
        const displayItems = items.slice(0, MAX_DISPLAY);
        const remaining = items.length - displayItems.length;

        /**
         * 可加入provider讓錯誤報告更準確
         */
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
        switch (provider) {
            case 'google':
                return parseGoogleResponseError(error);
            case 'openai':
                return parseOpenAIResponseError(error);
        }
    }

    if (error.code === "ECONNABORTED") {
        const { url, method } = error?.config || {};

        return {
            type: "TIMEOUT",
            status: "TIMEOUT",
            statusText: error.code,
            message: error.message,
            url,
            method,
            code: error.code,
        };
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

