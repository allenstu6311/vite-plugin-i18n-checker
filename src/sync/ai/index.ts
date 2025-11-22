import { walkTree } from "../../checker/diff";

import { isArray } from "../../utils";
import { UseAIConfig } from "../types";
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
        const itemSize = item.value.length;

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

    const batch = createBatchesByChars(queue, 5000);
    for (let i = 0; i < batch.length; i++) {
        const batchItems = batch[i];
        const response = await getAIResponse(batchItems.map(item => item.value), lang, useAI);
        // console.log('response', response);
        const parsed = safeJsonParse(response);
        const translations = parsed.translations;

        // 按索引對應回 pathStack
        batchItems.forEach((item, index) => {
            onAdd(item.pathStack, translations[index]);
        });
    }
}


export { processTranslationQueue, processTranslationValue };

