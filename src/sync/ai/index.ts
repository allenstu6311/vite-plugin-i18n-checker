import { walkTree } from "../../checker/diff";
import { startSpinner, stopSpinner } from "../../report";
import { isArray } from "../../utils";
import { UseAIConfig } from "../types";
import errorMap from "./errorMap";
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

function safeJsonParse(output: string) {
    if (isArray(output)) return { translations: output };
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
        throw err;
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

function printFinalErrorSummary({
    status,
    errorRecord,
    useAI,
}: {
    status: {
        total: number,
        success: number,
        failed: number,
    },
    errorRecord: Record<string, { pathStack: string, value: string }[]>;
    useAI: UseAIConfig;
}) {
    const { total, success, failed } = status;

    console.log('\n──────────────────────────────────────────');
    console.log('🔴  AI Translation Summary');
    console.log('──────────────────────────────────────────');

    console.log(`Total tasks: ${total}`);
    console.log(`Success:    ${success}`);
    console.log(`Failed:     ${failed}\n`);

    const MAX_DISPLAY = 20; // 🔥 可調整

    const { provider } = useAI;

    for (const key in errorRecord) {
        const errorHint = errorMap[provider][key];

        if (!errorHint) continue;

        const items = errorRecord[key];
        const displayItems = items.slice(0, MAX_DISPLAY);
        const remaining = items.length - displayItems.length;

        console.log(`  Error type: ${key} (${errorHint.code})\n`);

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

        console.log(`  Possible reasons:`);
        errorHint.possibleCauses.forEach(cause => {
            console.log(`  • ${cause}`);
        });

        console.log(`  Recommended checks:`);
        errorHint.suggestions.forEach(suggestion => {
            console.log(`  • ${suggestion}`);
        });

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
    const batch = createBatchesByChars(queue, 1000);

    const promises = [];
    const errorRecord: Record<string, { pathStack: string, value: string }[]> = {};

    startSpinner('AI translating...');
    for (let i = 0; i < batch.length; i++) {
        const batchItems = batch[i];
        const task = async () => {
            const response = await getAIResponse(
                batchItems.map(item => item.value),
                lang,
                useAI
            );

            status.success += batchItems.length;
            const parsed = safeJsonParse(response);
            const translations = parsed.translations;
            batchItems.forEach((item, index) => {
                onAdd(item.pathStack, translations[index]);
            });
        };

        promises.push(
            task().catch(({ input, error }: { input: string[], error: any }) => {
                status.failed += batchItems.length;

                batchItems.forEach((item, index) => {
                    // 如果 AI 翻譯失敗，則使用原始文字
                    onAdd(item.pathStack, input[index]);

                    if (!errorRecord[error.status]) {
                        errorRecord[error.status] = [...(errorRecord[error.status] || []), {
                            pathStack: item.pathStack.join('.'),
                            value: input[index],
                        }];
                    } else {
                        errorRecord[error.status].push({
                            pathStack: item.pathStack.join('.'),
                            value: input[index],
                        });
                    }
                });
            })

        );
    }
    await Promise.allSettled(promises);
    stopSpinner('AI translation completed');
    if (Object.keys(errorRecord).length > 0) {
        printFinalErrorSummary({
            status,
            errorRecord,
            useAI,
        });
    }
}


export { processTranslationQueue, processTranslationValue };

