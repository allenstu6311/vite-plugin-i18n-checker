import { walkTree } from "../../checker/diff";
import { startSpinner, stopSpinner } from "../../report";
import { UseAIConfig } from "../types";
import { parseResponseError, printFinalErrorSummary } from "./api/error";
import { getAIResponse } from './api/index';
import { createBatchesByChars, safeJsonParse } from "./utils";

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
            const parsed = safeJsonParse(data, useAI.provider);
            batchItems.forEach((item, index) => {
                onAdd(item.pathStack, parsed.translations[index]);
            });
        } else {
            // console.log('error', error);
            const errorInfo = parseResponseError(error, useAI.provider);
            status.failed += batchItems.length;
            batchItems.forEach((item, index) => {
                // 如果 error，則寫入source的value
                onAdd(item.pathStack, item.value);
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

