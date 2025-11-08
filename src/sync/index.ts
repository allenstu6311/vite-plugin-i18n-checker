import * as babelGenerator from '@babel/generator';
import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import fs from 'fs';
import YAML from 'yaml';
import { getValueByPath } from "../abnormal/detector/collect";
import { AbnormalType } from "../abnormal/types";
import { walkTree } from "../checker/diff";
import { getAstPropKey } from '../parser/ts/helper';
import { ParserType, SupportedParserType } from "../parser/types";

const traverseNs = ((traverse as any).default || traverse) as typeof traverse;

export function getAbnormalType(abnormalType: AbnormalType) {
    switch (abnormalType) {
        case AbnormalType.MISS_KEY:
            return AbnormalType.ADD_KEY;
        case AbnormalType.EXTRA_KEY:
            return AbnormalType.DELETE_KEY;
        default:
            return abnormalType;
    }
}

function deleteKey({
    pathStack,
    target,
}: {
    pathStack: (string | number)[],
    target: Record<string, any>,
}) {
    for (let i = 0; i < pathStack.length; i++) {
        const key = pathStack[i];
        if (i === pathStack.length - 1) {
            delete target[key];
        } else {
            target = target[key];
        }
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
    for (let i = 0; i < pathStack.length; i++) {
        const key = pathStack[i];
        if (i === pathStack.length - 1) {
            target[key] = value;
        } else {
            target = target[key];
        }
    }
}

function valueToASTNode(value: any): t.Expression {
    if (typeof value === 'string') {
        return t.stringLiteral(value);
    } else if (typeof value === 'number') {
        return t.numericLiteral(value);
    } else if (typeof value === 'boolean') {
        return t.booleanLiteral(value);
    } else if (value === null) {
        return t.nullLiteral();
    } else if (Array.isArray(value)) {
        return t.arrayExpression(
            value.map(item => valueToASTNode(item))
        );
    } else if (typeof value === 'object') {
        return t.objectExpression(
            Object.entries(value).map(([key, val]) =>
                t.objectProperty(
                    t.identifier(key),
                    valueToASTNode(val)
                )
            )
        );
    }
    throw new Error(`Unsupported value type: ${typeof value}`);
}

function enterNestedObject(node: t.ObjectExpression, pathStack: (string | number)[]): t.ObjectExpression | undefined {
    let currentObject = node;
    // 根據 pathStack 定位
    for (let i = 0; i < pathStack.length - 1; i++) {
        const key = String(pathStack[i]);
        const prop = currentObject.properties.find(p => {
            if (t.isObjectProperty(p)) {
                const propKey = getAstPropKey(p.key);
                return propKey === key;
            }
            return false;
        }) as t.ObjectProperty | undefined;

        if (prop && t.isObjectExpression(prop.value)) {
            currentObject = prop.value;
        } else {
            return; // 找不到對應路徑
        }
    }
    return currentObject;
}

function addKeyToAST(
    ast: t.File,
    pathStack: (string | number)[],
    value: any
) {
    traverseNs(ast, {
        ExportDefaultDeclaration(path) {
            const node = path.node.declaration;
            if (!t.isObjectExpression(node)) return;
            const currentObject = enterNestedObject(node, pathStack);
            if (!currentObject) return;

            // 創建並添加新屬性
            const lastKey = String(pathStack[pathStack.length - 1]);
            const newProperty = t.objectProperty(
                t.identifier(lastKey),
                valueToASTNode(value)
            );
            currentObject.properties.push(newProperty);
        }
    });
}

function deleteKeyFromAST(
    ast: t.File,
    pathStack: (string | number)[],
    abnormalKeys: Record<string, any>,
) {
    traverseNs(ast, {
        ExportDefaultDeclaration(path) {
            const node = path.node.declaration;
            if (!t.isObjectExpression(node)) return;
            const currentObject = enterNestedObject(node, pathStack);
            if (!currentObject) return;

            // 找到要刪除的屬性
            const lastKey = String(pathStack[pathStack.length - 1]);
            const index = currentObject.properties.findIndex(p => {
                if (t.isObjectProperty(p)) {
                    const propKey = getAstPropKey(p.key);
                    return propKey === lastKey;
                }
                return false;
            });

            if (index !== -1) {
                currentObject.properties.splice(index, 1);
            } else {
                /**
                 * 刪除同步不處理展開變數的異常，直接轉換回EXTRA_KEY
                 */
                let abnormalKeysRef = abnormalKeys;
                for (let i = 0; i < pathStack.length; i++) {
                    const key = pathStack[i];
                    if (i === pathStack.length - 1) {
                        abnormalKeysRef[key] = AbnormalType.EXTRA_KEY;
                    } else {
                        abnormalKeysRef = abnormalKeysRef[key];
                    }
                }
            }
        }
    });
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

function syncWithAst(
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    filePath: string
) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const ast = babelParser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript']
    });

    walkTree({
        node: abnormalKeys,
        handler: {
            handleArray: ({ recurse }) => {
                recurse();
            },
            handleObject: ({ recurse }) => {
                recurse();
            },
            handlePrimitive: ({ node, pathStack }) => {
                if (node === AbnormalType.ADD_KEY) {
                    const value = getValueByPath(template, pathStack);
                    addKeyToAST(ast, pathStack, value);
                } else if (node === AbnormalType.DELETE_KEY) {
                    deleteKeyFromAST(ast, pathStack, abnormalKeys);
                }
            }
        },
        pathStack: [],
    });

    const output = babelGenerator.generate(ast, {
        compact: false,
        concise: false
    }, code);
    return output.code;
}


function getSyncCode({
    abnormalKeys,
    template,
    target,
    filePath,
    extensions
}: {
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    target: Record<string, any>,
    filePath: string,
    extensions: SupportedParserType,
}) {
    if (extensions === ParserType.TS || extensions === ParserType.JS) {
        return syncWithAst(abnormalKeys, template, filePath);
    } else {
        walkTree({
            node: abnormalKeys,
            handler: {
                handleArray: ({ recurse }) => {
                    recurse();
                },
                handleObject: ({ recurse }) => {
                    recurse();
                },
                handlePrimitive: ({ node, pathStack }) => {
                    if (node === AbnormalType.ADD_KEY) {
                        const value = getValueByPath(template, pathStack);
                        addKey({
                            pathStack,
                            value,
                            target,
                        });
                    } else if (node === AbnormalType.DELETE_KEY) {
                        deleteKey({
                            pathStack,
                            target,
                        });
                    }
                }
            },
            pathStack: [],
        });
        return syncFile(target, extensions);
    }
}


export function syncKeys({
    abnormalKeys,
    template,
    target,
    filePath,
    extensions
}: {
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    target: Record<string, any>,
    filePath: string,
    extensions: SupportedParserType,
}) {
    const syncCode = getSyncCode({ abnormalKeys, template, target, filePath, extensions });
    fs.writeFileSync(filePath, syncCode, 'utf-8');
}