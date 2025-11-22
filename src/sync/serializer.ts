import * as babelGenerator from '@babel/generator';
import YAML from 'yaml';
import { getValueByPath } from "../abnormal/detector/collect";
import { AbnormalType } from "../abnormal/types";
import { walkTree } from "../checker/diff";
import { ParserType, SupportedParserType } from "../parser/types";
import { isArray, isPrimitive } from '../utils';
import { getAIResponse } from './ai';
import { addKeyToAST, deleteKeyFromAST, generateAstAndCode } from './ast/index';
import { SyncContext, UseAIConfig } from './types';

function navigateToPath(
    target: Record<string, any>,
    pathStack: (string | number)[]
): { parent: Record<string, any>, lastKey: string | number } | null {
    let current = target;

    for (let i = 0; i < pathStack.length - 1; i++) {
        const key = pathStack[i];
        if (current[key] === undefined || typeof current[key] !== 'object') {
            return null; // 路徑不存在
        }
        current = current[key];
    }

    return {
        parent: current,
        lastKey: pathStack[pathStack.length - 1]
    };
}

function deleteKey({
    pathStack,
    target,
}: {
    pathStack: (string | number)[],
    target: Record<string, any>,
}) {
    const result = navigateToPath(target, pathStack);
    if (!result) return;
    const { parent, lastKey } = result;
    if (parent && lastKey) {
        delete parent[lastKey];
    }
}

function addKey({
    pathStack,
    value,
    target,
}: {
    pathStack: (string | number)[],
    value: any,
    target: Record<string, any>,
}) {
    const result = navigateToPath(target, pathStack);
    if (!result) return;
    const { parent, lastKey } = result;
    if (parent && lastKey) {
        parent[lastKey] = value;
    }
}

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

    const batch = createBatchesByChars(queue, useAI.maxBatchSize || 5000);
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

function applyKeyDiffs({
    abnormalKeys,
    template,
    context,
    onAdd,
    onDelete
}: {
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    context?: SyncContext,
    onAdd: (pathStack: (string | number)[], value: any) => void;
    onDelete: (pathStack: (string | number)[]) => void;
}) {
    const translationQueue: { pathStack: (string | number)[], value: any }[] = [];

    const { lang, useAI } = context || {};
    walkTree({
        node: abnormalKeys,
        handler: {
            handleArray: ({ recurse }) => recurse(),
            handleObject: ({ recurse }) => recurse(),
            handlePrimitive: ({ node, pathStack }) => {

                if (node === AbnormalType.ADD_KEY) {
                    const value = getValueByPath<string>(template, pathStack);
                    if (useAI) {
                        if (!isPrimitive(value)) {
                            const translationValues = processTranslationValue(value, pathStack);
                            translationQueue.push(...translationValues);
                        } else {
                            translationQueue.push({ pathStack, value });
                        }
                    } else {
                        onAdd(pathStack, value);
                    }

                } else if (node === AbnormalType.DELETE_KEY) {
                    onDelete(pathStack);
                }
            }
        },
        pathStack: []
    });

    if (translationQueue.length > 0 && useAI) {
        return processTranslationQueue({
            queue: translationQueue,
            lang: lang || '',
            useAI,
            onAdd: (p, v) => onAdd(p, v)
        });
    }
}

function stringifyFileContent(target: Record<string, any>, extensions: SupportedParserType) {
    switch (extensions) {
        case ParserType.JSON:
            return JSON.stringify(target, null, 2);
        case ParserType.YML:
        case ParserType.YAML:
            return YAML.stringify(target);
        default:
            return '';
    }
}

function getSyncCode({
    abnormalKeys,
    template,
    target,
    filePath,
    sourcePath,
    extensions,
    context
}: {
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    target: Record<string, any>,
    filePath: string,
    sourcePath: string,
    extensions: SupportedParserType,
    context?: SyncContext,
}) {
    if (extensions === ParserType.TS || extensions === ParserType.JS) {
        const { ast, code } = generateAstAndCode(filePath);
        const { ast: sourceAst } = generateAstAndCode(sourcePath);
        applyKeyDiffs({
            abnormalKeys,
            template,
            context,
            onAdd: (p, v) => addKeyToAST({ targetAst: ast, sourceAst, pathStack: p, value: v }),
            onDelete: (p) => deleteKeyFromAST({ targetAst: ast, pathStack: p, abnormalKeys }),
        });

        return babelGenerator.generate(ast, { jsescOption: { minimal: true } }, code).code;
    }
    applyKeyDiffs({
        abnormalKeys,
        template,
        context,
        onAdd: (pathStack, value) => addKey({ pathStack, value, target }),
        onDelete: (pathStack) => deleteKey({ pathStack, target })
    });
    return stringifyFileContent(target, extensions);
}

async function getAsyncSyncCode({
    abnormalKeys,
    template,
    target,
    filePath,
    sourcePath,
    extensions,
    context
}: {
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    target: Record<string, any>,
    filePath: string,
    sourcePath: string,
    extensions: SupportedParserType,
    context?: SyncContext,
}) {
    if (extensions === ParserType.TS || extensions === ParserType.JS) {
        const { ast, code } = generateAstAndCode(filePath);
        const { ast: sourceAst } = generateAstAndCode(sourcePath);
        await applyKeyDiffs({
            abnormalKeys,
            template,
            context,
            onAdd: (p, v) => addKeyToAST({ targetAst: ast, sourceAst, pathStack: p, value: v }),
            onDelete: (p) => deleteKeyFromAST({ targetAst: ast, pathStack: p, abnormalKeys }),
        });

        return babelGenerator.generate(ast, { jsescOption: { minimal: true } }, code).code;
    }

    await applyKeyDiffs({
        abnormalKeys,
        template,
        context,
        onAdd: (p, v) => addKey({ pathStack: p, value: v, target }),
        onDelete: (p) => deleteKey({ pathStack: p, target })
    });

    return stringifyFileContent(target, extensions);
}

export {
    getAsyncSyncCode, getSyncCode
};

