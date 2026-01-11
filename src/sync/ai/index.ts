import { AbnormalType } from "../../abnormal/types";
import { walkTree } from "../../checker/diff";
import { startSpinner, stopSpinner } from "../../report";
import { SyncContext } from "../types";
import { parseResponseError, printFinalErrorSummary } from "./api/error";
import { getAIResponse } from './api/index';
import { createBatchesByChars, safeJsonParse } from "./utils";

function revertAddKeyToMissing(abnormalKeys: Record<string, any>, pathStack: (string | number)[]) {
    let ref = abnormalKeys;
    for (let i = 0; i < pathStack.length - 1; i++) {
        const key = pathStack[i];
        ref = ref[key];
    }
    const lastKey = pathStack[pathStack.length - 1];
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

    const status = {
        total: 0,
        success: 0,
        failed: 0,
    };

    status.total = queue.length;
    const MAX_AI_BATCH_CHARS = 600;
    const batch = createBatchesByChars(queue, MAX_AI_BATCH_CHARS);

    const errorRecord: Record<string, { pathStack: string, value: string, error: any }[]> = {};
    console.log(`Starting translation task for ${lang}. Total batches: ${batch.length}.`);
    startSpinner(`AI translating...`);

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
        } else {
            const errorInfo = parseResponseError(error, provider);
            status.failed += batchItems.length;
            batchItems.forEach((item, index) => {
                // 如果 AI 翻譯失敗，則將 ADD_KEY 恢復為 MISS_KEY
                revertAddKeyToMissing(abnormalKeys, item.pathStack);

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
        console.log(`\n Completed ${i + 1} / ${batch.length}`);
    }
    stopSpinner(`AI translation completed`);
    if (Object.keys(errorRecord).length > 0) {
        printFinalErrorSummary({
            status,
            errorRecord,
            lang,
            useAI,
        });
    }
}


export { processTranslationQueue, processTranslationValue };

