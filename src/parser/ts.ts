import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { I18nData } from './types';
import { TsParserCheckResult } from '../error/schemas/parser/ts';
import { getTsParserErrorMessage } from '../error';
import { warning } from '../utils';
import { getGlobalConfig, handlePluginError } from '../config';
import path from 'path';
import { resolveSourcePaths } from '../helpers';
import fs from 'fs';
import { isObject, isRepeatKey } from '../utils/is';

let localConstMap: Record<string, t.ObjectExpression> = {};
let resolvedImportMap: Record<string, any> = {};
let functionMap: Record<string, t.FunctionExpression> = {};


const NODE_VALUE_RESOLVERS: Record<string, (val: any) => any> = {
    StringLiteral: (val) => val.value,
    NumericLiteral: (val) => val.value,
    BooleanLiteral: (val) => val.value,
    NullLiteral: () => null,
    ObjectExpression: (val) => extractObjectLiteral(val),
    ArrayExpression: (val) => extractArrayLiteral(val),
    Identifier: (val) => val.name,
};

export function parseTsCode(code: string) {
    const result: I18nData = {};
    const visited: Record<string, boolean> = {};
    const aliasMap: Record<string, string> = {};

    // reset
    localConstMap = {};
    resolvedImportMap = {};

    function recoursiveParse(
        parseCode: string,
        filePath: string,
        useImportKey?: string
    ) {
        // avoid circular reference
        if (visited[filePath]) return;
        if (filePath) visited[filePath] = true;

        const ast = parse(parseCode, {
            sourceType: 'module',
            plugins: ['typescript'],
        });

        ((traverse as any).default as typeof traverse)(ast, {
            // variable
            VariableDeclaration(nodePath) {
                nodePath.node.declarations.forEach(declaration => {
                    if (t.isIdentifier(declaration.id)) {
                        const varName = declaration.id.name;
                        const init = declaration.init;

                        if (t.isObjectExpression(init)) {
                            localConstMap[varName] = init;

                            // 別名映射
                            if (aliasMap[varName]) {
                                const importedName = aliasMap[varName];
                                localConstMap[importedName] = init;
                            }
                        }
                    }
                })
            },
            // function
            FunctionDeclaration(nodePath) {
                const node = nodePath.node;
                const nodeInfo = node.id;
                const body = node.body;

                const returnStmt = body.body.find(n => n.type === 'ReturnStatement');
                if (returnStmt && returnStmt?.argument?.type === 'ObjectExpression' && nodeInfo) {
                    localConstMap[nodeInfo.name] = returnStmt.argument;
                    //   console.log('Return object:', returnStmt.argument.properties);
                }
            },
            // import
            ImportDeclaration(nodePath) {
                const node = nodePath.node.source;
                let useImportKey = ''

                nodePath.node.specifiers.forEach(specifier => {
                    if (t.isImportDefaultSpecifier(specifier)) {
                        // Default import: import foo from './bar'
                        useImportKey = specifier.local.name;
                        resolvedImportMap[useImportKey] = {};

                    } else if (t.isImportSpecifier(specifier)) {
                        // Named import: import { foo, bar as baz } from './module'
                        const importedName = t.isIdentifier(specifier.imported) // 原始名稱
                            ? specifier.imported.name
                            : specifier.imported.value;
                        const localName = specifier.local.name;  // 變更的名字

                        if (importedName !== localName) {
                            aliasMap[importedName] = localName;
                        }
                    } else if (t.isImportNamespaceSpecifier(specifier)) {
                        // Namespace import: import * as foo from './bar'
                        useImportKey = specifier.local.name;
                        resolvedImportMap[useImportKey] = {};
                    }
                })
                const resolved = getFilePath(node, filePath);
                const fileCode = fs.readFileSync(resolved, 'utf-8');
                recoursiveParse(fileCode, resolved, useImportKey);
            },
            // export default
            ExportDefaultDeclaration(nodePath) {
                const node = nodePath.node.declaration;


                if (t.isObjectExpression(node)) {

                    if (useImportKey) {
                        assignResult(resolvedImportMap[useImportKey], extractObjectLiteral(node))

                    } else {
                        // 第一層的 export default
                        assignResult(result, extractObjectLiteral(node))
                    }

                } else if (t.isIdentifier(node)) {
                    // export default variable
                    const variable = localConstMap[node.name];
                    if (variable && t.isObjectExpression(variable)) {
                        if (useImportKey) {
                            assignResult(resolvedImportMap[useImportKey], extractObjectLiteral(variable))
                        } else {
                            assignResult(result, extractObjectLiteral(variable))
                        }
                    }

                } else {
                    handlePluginError(getTsParserErrorMessage(TsParserCheckResult.INCORRECT_EXPORT_DEFAULT))
                }
            },
        });
    }

    recoursiveParse(code, '');
    return result;
}

// 需支援深度合併
function assignResult(result: I18nData, keyMap: I18nData) {
    // console.log('result', result)
    // console.log('keyMap', keyMap)
    Object.assign(result, keyMap);
}

/**
 * 遞迴擷取 ObjectExpression → JS 物件
 */
function extractObjectLiteral(node: t.ObjectExpression): I18nData {
    const obj: I18nData = {};

    node.properties.forEach(prop => {

        if (t.isObjectProperty(prop)) {
            const key = getKey(prop.key);

            if (isRepeatKey(obj, key)) {
                handlePluginError(getTsParserErrorMessage(TsParserCheckResult.REAPET_KEY, key));
                return;
            }
            const val = prop.value;
            const resolver = NODE_VALUE_RESOLVERS[val.type];

            if (resolver) {
                const parsedValue = resolver(val);

                // 如果解析結果是本地常數，展開其內容；否則直接使用
                if (localConstMap[parsedValue]) {
                    obj[key] = extractObjectLiteral(localConstMap[parsedValue]);
                } else if (resolvedImportMap[parsedValue]) {
                    obj[key] = resolvedImportMap[parsedValue];
                }else {
                    obj[key] = parsedValue;
                }

            } else {
                warning(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_VALUE_TYPE, val.type));
            }

        } else if (t.isSpreadElement(prop)) {
            extractSpreadElement(prop.argument, obj)

        } else {
            warning(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_OBJECT_PROPERTY));
        }
    });
    return obj;
}

function extractArrayLiteral(node: t.ArrayExpression): any[] {
    const arr: any[] = [];

    node.elements.forEach(el => {
        if (t.isStringLiteral(el)) {
            arr.push(el.value);
        } else if (t.isNumericLiteral(el)) {
            arr.push(el.value);
        } else if (t.isObjectExpression(el)) {
            arr.push(extractObjectLiteral(el));
        } else if (t.isArrayExpression(el)) {
            arr.push(extractArrayLiteral(el));
        } else {
            warning(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_ARRAY_ELEMENT));
        }
    });

    return arr;
}

function extractSpreadElement(node: t.Expression, obj: I18nData): void {
    const variable = getVariableName(node);
    let spreadData;

    if (localConstMap[variable]) {
        spreadData = extractObjectLiteral(localConstMap[variable]);
        assignResult(obj, spreadData);
    } else if (resolvedImportMap[variable]) {
        assignResult(obj, resolvedImportMap[variable])
    } else {
        handlePluginError(getTsParserErrorMessage(TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND, variable));
    }
}

/**
 * 擷取 key 名稱（支援 Identifier 與 StringLiteral）
 */
function getKey(keyNode: t.Expression | t.Identifier | t.PrivateName | t.StringLiteral): string {
    if (t.isIdentifier(keyNode)) return keyNode.name;
    if (t.isStringLiteral(keyNode)) return keyNode.value;
    handlePluginError(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_KEY_TYPE));
    return ''
}

function getVariableName(node: any): string {
    if (t.isIdentifier(node)) {
        return node.name
    }
    if (t.isCallExpression(node)) {
        return getVariableName(node.callee)
    }
    handlePluginError(getTsParserErrorMessage(TsParserCheckResult.SPREAD_NOT_IDENTIFIER));
    return ''
}

function getFilePath(node: t.StringLiteral, filePath: string) {
    const config = getGlobalConfig()
    const { sourcePath } = resolveSourcePaths(config)
    const { extensions } = config

    const currFilePath = filePath || sourcePath

    const resolved = path.resolve(
        path.dirname(currFilePath),
        node.value
    );
    return `${resolved}.${extensions}`
}