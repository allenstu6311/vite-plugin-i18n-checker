import { AbnormalType } from "../../abnormal/types";
import { walkTree } from "../../checker/diff";
import { printAiErrorSummary } from "../../report";
import { isObject } from "../../utils";
import { startSpinner, stopSpinner, updateSpinner } from "../../utils/spinner";
import { SyncContext, UseAIConfig } from "../types";
import { getAIResponse } from "./api";
import { parseResponseError } from "./api/error";
import { createBatchesByChars, safeJsonParse } from "./utils";

// 錯誤收集器：按語言分組收集 AI 翻譯錯誤
const errorCollector: Record<string, {
    status: { total: number, success: number, failed: number },
    errorRecord: Record<string, { pathStack: string, value: string, error: any }[]>,
    lang: string,
    useAI: UseAIConfig
}> = {};

function revertAddKeyToMissing(abnormalKeys: Record<string, any>, pathStack: (string | number)[]) {
    let ref = abnormalKeys;
    let index = 0;
    for (let i = 0; i < pathStack.length - 1; i++) {
        const key = pathStack[i];
        // 避免source跟target的結構不同
        if (!isObject(ref[key])) break;
        ref = ref[key];
        index = i;
    }
    const lastKey = pathStack[index];
    ref[lastKey] = AbnormalType.MISS_KEY;
}

function processTranslationValue(value: any, prevPathStack: (string | number)[]) {
    const result: { pathStack: (string | number)[], value: any }[] = [];
    walkTree({
        root: value,
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

async function processTranslationQueue({
    abnormalKeys,
    queue,
    context,
    onAdd,
}: {
    abnormalKeys: Record<string, any>,
    queue: { pathStack: (string | number)[], value: any }[],
    context: SyncContext,
    onAdd: (pathStack: (string | number)[], value: string) => void;
}) {
    const { useAI, lang } = context;
    if (!useAI) return;
    const { provider } = useAI;

    // 初始化或獲取該語言的錯誤收集器
    if (!errorCollector[lang]) {
        errorCollector[lang] = {
            status: { total: 0, success: 0, failed: 0 },
            errorRecord: {},
            lang,
            useAI
        };
    }

    const MAX_AI_BATCH_CHARS = 600;
    const batch = createBatchesByChars(queue, MAX_AI_BATCH_CHARS);

    // 累加 total
    errorCollector[lang].status.total += queue.length;

    const errorRecord: Record<string, { pathStack: string, value: string, error: any }[]> = {};
    startSpinner(`[${lang}] AI translating... 0/${batch.length}`);

    for (let i = 0; i < batch.length; i++) {
        const batchItems = batch[i];

        const { success, data, error } = await getAIResponse(
            batchItems.map(item => item.value),
            lang,
            useAI
        );

        if (success) {
            const parsed = safeJsonParse(data, provider);
            batchItems.forEach((item, index) => {
                onAdd(item.pathStack, parsed.translations[index]);
            });
            errorCollector[lang].status.success += batchItems.length;
        } else {
            const errorInfo = parseResponseError(error, provider);
            errorCollector[lang].status.failed += batchItems.length;
            batchItems.forEach((item, index) => {
                // 如果 AI 翻譯失敗，則將 ADD_KEY 恢復為 MISS_KEY
                revertAddKeyToMissing(abnormalKeys, item.pathStack);

                const errorType = errorInfo.status;
                if (!errorRecord[errorType]) {
                    errorRecord[errorType] = [];
                }
                errorRecord[errorType].push({
                    pathStack: item.pathStack.join('.'),
                    value: batchItems[index].value,
                    error: errorInfo
                });
            });
        }
        updateSpinner(`[${lang}] AI translating... ${i + 1}/${batch.length}`);
    }
    stopSpinner(`[${lang}] AI translation completed (${batch.length} batches)`);

    // 合併 errorRecord 到 errorCollector
    const collectorErrorRecord = errorCollector[lang].errorRecord;
    for (const errorType in errorRecord) {
        if (!collectorErrorRecord[errorType]) {
            collectorErrorRecord[errorType] = [];
        }
        collectorErrorRecord[errorType].push(...errorRecord[errorType]);
    }
}

/**
 * 統一輸出所有語言的 AI 翻譯錯誤報告
 */
function outputAIErrorSummaries() {
    for (const lang in errorCollector) {
        const data = errorCollector[lang];
        if (Object.keys(data.errorRecord).length > 0) {
            printAiErrorSummary
                ({
                    status: data.status,
                    errorRecord: data.errorRecord,
                    lang: data.lang,
                    useAI: data.useAI,
                });
        }
    }
    // 清理收集器
    for (const lang in errorCollector) {
        delete errorCollector[lang];
    }
}


export { outputAIErrorSummaries, processTranslationQueue, processTranslationValue };

