import * as babelGenerator from '@babel/generator';
import YAML from 'yaml';
import { getValueByPath } from "../abnormal/detector/collect";
import { AbnormalType } from "../abnormal/types";
import { walkTree } from "../checker/diff";
import { ParserType, SupportedParserType } from "../parser/types";
import { getAIResponse } from './ai';
import { addKeyToAST, deleteKeyFromAST, generateAstAndCode } from './ast';
import { SyncContext } from './types';

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

function processAbnormalKeys({
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
    const promises: Promise<void>[] = [];
    walkTree({
        node: abnormalKeys,
        handler: {
            handleArray: ({ recurse }) => recurse(),
            handleObject: ({ recurse }) => recurse(),
            handlePrimitive: async ({ node, pathStack }) => {
                const { lang, useAI } = context || {};

                if (node === AbnormalType.ADD_KEY) {
                    const value = getValueByPath<string>(template, pathStack);
                    // 收集非同步操作
                    const promise = (async () => {
                        const currentLang = lang?.split('.')[0];
                        if (!currentLang || !useAI) {
                            onAdd(pathStack, value);
                            return;
                        }
                        // AI 翻譯或其他非同步操作
                        const aiResponse = await getAIResponse(value, currentLang, useAI);
                        console.log('aiResponse', aiResponse);
                        // 等待非同步操作完成後再執行 onAdd
                        onAdd(pathStack, aiResponse);
                    })();

                    promises.push(promise);
                } else if (node === AbnormalType.DELETE_KEY) {
                    onDelete(pathStack);
                }
            }
        },
        pathStack: []
    });
    if (promises.length > 0) {
        return Promise.all(promises);
    }
}

function syncFile(target: Record<string, any>, extensions: SupportedParserType) {
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

// function syncWithAst({
//     abnormalKeys,
//     template,
//     astInfo,
//     context
// }: {
//     abnormalKeys: Record<string, any>,
//     template: Record<string, any>,
//     astInfo: { ast: t.File, code: string },
//     context?: SyncContext,
// }) {
//     const { ast, code } = astInfo;
//     processAbnormalKeys({
//         abnormalKeys,
//         template,
//         context,
//         onAdd: (pathStack, value) => addKeyToAST(ast, pathStack, value),
//         onDelete: (pathStack) => deleteKeyFromAST(ast, pathStack, abnormalKeys)
//     });

//     const output = babelGenerator.generate(ast, {
//         compact: false,
//         concise: false,
//         jsescOption: {
//             minimal: true // 只轉義必要的字符，保留中文等 Unicode 字符
//         }
//     }, code);
//     return output.code;
// }

function getSyncCode({
    abnormalKeys,
    template,
    target,
    filePath,
    extensions,
    context
}: {
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    target: Record<string, any>,
    filePath: string,
    extensions: SupportedParserType,
    context?: SyncContext,
}) {
    if (extensions === ParserType.TS || extensions === ParserType.JS) {
        const { ast, code } = generateAstAndCode(filePath);
        processAbnormalKeys({
            abnormalKeys,
            template,
            context,
            onAdd: (p, v) => addKeyToAST(ast, p, v),
            onDelete: (p) => deleteKeyFromAST(ast, p, abnormalKeys)
        });

        return babelGenerator.generate(ast, { jsescOption: { minimal: true } }, code).code;
    }
    processAbnormalKeys({
        abnormalKeys,
        template,
        context,
        onAdd: (pathStack, value) => addKey({ pathStack, value, target }),
        onDelete: (pathStack) => deleteKey({ pathStack, target })
    });
    return syncFile(target, extensions);
}

async function getAsyncSyncCode({
    abnormalKeys,
    template,
    target,
    filePath,
    extensions,
    context
}: {
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    target: Record<string, any>,
    filePath: string,
    extensions: SupportedParserType,
    context?: SyncContext,
}) {
    if (extensions === ParserType.TS || extensions === ParserType.JS) {
        const { ast, code } = generateAstAndCode(filePath);

        // 等 AI
        await processAbnormalKeys({
            abnormalKeys,
            template,
            context,
            onAdd: (p, v) => addKeyToAST(ast, p, v),
            onDelete: (p) => deleteKeyFromAST(ast, p, abnormalKeys)
        });

        return babelGenerator.generate(ast, { jsescOption: { minimal: true } }, code).code;
    }

    // JSON / YAML 版本
    await processAbnormalKeys({
        abnormalKeys,
        template,
        context,
        onAdd: (p, v) => addKey({ pathStack: p, value: v, target }),
        onDelete: (p) => deleteKey({ pathStack: p, target })
    });

    return syncFile(target, extensions);
}

export {
    getAsyncSyncCode, getSyncCode
};

