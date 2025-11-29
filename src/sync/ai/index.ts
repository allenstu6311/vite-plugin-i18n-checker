import { walkTree } from "../../checker/diff";
import { startSpinner, stopSpinner } from "../../report";
import { AIProvider, UseAIConfig } from "../types";
import { parseGoogleResponseError, parseOpenAIResponseError } from "./helper";
import { getAIResponse } from './model';


// 按字符大小分批
function createBatchesByChars(
    queue: { pathStack: (string | number)[], value: string }[],
    maxChars: number
): { pathStack: (string | number)[], value: string }[][] {
    const batches = [];
    let currentBatch = [];
    let currentBatchSize = 0;

    for (const item of queue) {
        const itemSize = String(item.value).length;
        // 如果加上這個 item 會超過限制，開始新批次
        if (currentBatchSize + itemSize > maxChars && currentBatch.length > 0) {
            batches.push(currentBatch);
            currentBatch = [];
            currentBatchSize = 0;
        }

        currentBatch.push(item);
        currentBatchSize += itemSize;
    }

    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }

    return batches;
}

function getDataWithProvider(data: any, provider: AIProvider) {
    switch (provider) {
        case 'google':
            return data?.candidates?.[0]?.content?.parts[0]?.text;
        case 'openai':
            return data?.choices?.[0]?.message?.content;
        default:
            return data;
    }
}

function safeJsonParse(data: any, provider: AIProvider) {
    const output = getDataWithProvider(data, provider);
    let text = output.trim();
    // 1. 去掉 code block
    text = text.replace(/^```[a-z]*\s*/i, '').replace(/```$/i, '').trim();

    // 2. 如果是單純一行中文（如 測試），自動包成 JSON 結構
    if (!text.startsWith('{') && !text.startsWith('[')) {
        return {
            translations: [text]
        };
    }

    // 3. 嘗試 JSON.parse
    try {
        return JSON.parse(text);
    } catch (err) {
        console.error("AI 回傳不是有效 JSON：", text);
        return { translations: [text] };
    }
}

function processTranslationValue(value: any, prevPathStack: (string | number)[]) {
    const result: { pathStack: (string | number)[], value: any }[] = [];
    walkTree({
        node: value,
        handler: {
            handleArray: ({ recurse }) => recurse(),
            handleObject: ({ recurse }) => recurse(),
            handlePrimitive: ({ node, pathStack }) => {
                result.push({ pathStack, value: node });
            }
        },
        pathStack: [...prevPathStack]
    });
    return result;
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
        if (!errorHint) continue;

        const items = errorRecord[key];
        const displayItems = items.slice(0, MAX_DISPLAY);
        const remaining = items.length - displayItems.length;

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

async function processTranslationQueue({
    queue,
    lang,
    useAI,
    onAdd,
}: {
    queue: { pathStack: (string | number)[], value: any }[],
    lang: string,
    useAI: UseAIConfig,
    onAdd: (pathStack: (string | number)[], value: string) => void;
}) {
    const status = {
        total: 0,
        success: 0,
        failed: 0,
    };

    status.total = queue.length;
    const MAX_AI_BATCH_CHARS = 600;
    const batch = createBatchesByChars(queue, MAX_AI_BATCH_CHARS);

    const errorRecord: Record<string, { pathStack: string, value: string, error: any }[]> = {};
    console.log(`即將開始翻譯${lang}任務，共 ${batch.length} 批次`);
    startSpinner('AI translating...');

    for (let i = 0; i < batch.length; i++) {
        const batchItems = batch[i];

        const { success, data, error } = await getAIResponse(
            batchItems.map(item => item.value),
            lang,
            useAI
        );
        if (success) {
            const parsed = safeJsonParse(data, useAI.provider);
            batchItems.forEach((item, index) => {
                onAdd(item.pathStack, parsed.translations[index]);
            });
        } else {
            // console.log('error', error);
            const errorInfo = parseResponseError(error, useAI.provider);
            status.failed += batchItems.length;
            batchItems.forEach((item, index) => {
                if (!errorRecord[errorInfo.status]) {
                    errorRecord[errorInfo.status] = [...(errorRecord[error.status] || []), {
                        pathStack: item.pathStack.join('.'),
                        value: batchItems[index].value,
                        error: errorInfo
                    }];
                } else {
                    errorRecord[errorInfo.status].push({
                        pathStack: item.pathStack.join('.'),
                        value: batchItems[index].value,
                        error: errorInfo
                    });
                }
            });
        }
        console.log(`已完成 ${i + 1} / ${batch.length}`);
    }
    stopSpinner('AI translation completed');
    if (Object.keys(errorRecord).length > 0) {
        printFinalErrorSummary({
            status,
            errorRecord,
            lang,
        });
    }
}


export { processTranslationQueue, processTranslationValue };

