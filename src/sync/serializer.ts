// import * as babelGenerator from '@babel/generator';
import recast from "recast";
import YAML from 'yaml';
import { getValueByPath } from "../abnormal/detector/collect";
import { AbnormalType } from "../abnormal/types";
import { walkTree } from "../checker/diff";
import { parseTsCode } from "../parser/ast";
import { ParserType, SupportedParserType } from "../parser/types";
import { isArray, isPrimitive, sortObject } from '../utils';
import { processTranslationQueue, processTranslationValue } from './ai';
import { addKeyToAST, deleteKeyFromAST, generateAstAndCode } from './ast/index';
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
    source,
}: {
    pathStack: (string | number)[],
    value: any,
    target: Record<string, any>,
    source: Record<string, any>,
}) {
    let currentTarget = target;
    let currentSource = source;

    for (let i = 0; i < pathStack.length; i++) {
        const isLast = i === pathStack.length - 1;
        const key = pathStack[i];
        currentSource = currentSource[key];

        if (isLast) {
            currentTarget[key] = value;
        } else {
            if (currentTarget[key] === undefined) {
                currentTarget[key] = isArray(currentSource) ? [] : {};
            }
            currentTarget = currentTarget[key];
        }
    }
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

    const { useAI } = context || {};
    walkTree({
        root: abnormalKeys,
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

    if (translationQueue.length > 0 && context) {
        return processTranslationQueue({
            abnormalKeys,
            queue: translationQueue,
            context,
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

        const { ast } = generateAstAndCode(filePath);
        const { code: sourceCode } = generateAstAndCode(sourcePath);
        applyKeyDiffs({
            abnormalKeys,
            template,
            context,
            onAdd: (p, v) => addKeyToAST({ targetAst: ast, sourceCode: parseTsCode(sourceCode), pathStack: p, value: v }),
            onDelete: (p) => deleteKeyFromAST({ targetAst: ast, pathStack: p, abnormalKeys }),
        });

        return recast.print(ast, {
            trailingComma: true,
            reuseWhitespace: false,
            wrapColumn: Infinity,
        }).code;
    }
    applyKeyDiffs({
        abnormalKeys,
        template,
        context,
        onAdd: (pathStack, value) => addKey({ pathStack, value, target, source: template }),
        onDelete: (pathStack) => deleteKey({ pathStack, target })
    });
    const sortedTarget = sortObject(template, target);
    return stringifyFileContent(sortedTarget, extensions);
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
    context: SyncContext,
}) {
    if (extensions === ParserType.TS || extensions === ParserType.JS) {
        const { ast } = generateAstAndCode(filePath);
        const { code: sourceCode } = generateAstAndCode(sourcePath);
        await applyKeyDiffs({
            abnormalKeys,
            template,
            context,
            onAdd: (p, v) => addKeyToAST({ targetAst: ast, sourceCode: parseTsCode(sourceCode), pathStack: p, value: v }),
            onDelete: (p) => deleteKeyFromAST({ targetAst: ast, pathStack: p, abnormalKeys }),
        });
        return recast.print(ast, {
            trailingComma: true,
            reuseWhitespace: false,
            wrapColumn: Infinity,
        }).code;
    }

    await applyKeyDiffs({
        abnormalKeys,
        template,
        context,
        onAdd: (p, v) => addKey({ pathStack: p, value: v, target, source: template }),
        onDelete: (p) => deleteKey({ pathStack: p, target })
    });
    const sortedTarget = sortObject(template, target);
    return stringifyFileContent(sortedTarget, extensions);
}

export {
    getAsyncSyncCode, getSyncCode
};

