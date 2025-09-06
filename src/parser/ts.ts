import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { I18nData } from './types';
import { TsParserCheckResult } from '../error/schemas/parser/ts';
import { getTsParserErrorMessage } from '../error';
import { error, warning } from '../utils';
import { getGlobalConfig, handlePluginError } from '../config';
import path from 'path';
import { resolveSourcePaths } from '../helpers';
import fs from 'fs';

let constMap: Record<string, t.ObjectExpression> = {};
let importMap: Record<string, I18nData> = {};

const NODE_VALUE_RESOLVERS: Record<string, (val: any) => any> = {
    StringLiteral: (val) => val.value,
    NumericLiteral: (val) => val.value,
    BooleanLiteral: (val) => val.value,
    NullLiteral: () => null,
    Identifier: () => undefined,
    ObjectExpression: (val) => extractObjectLiteral(val),
    ArrayExpression: (val) => extractArrayLiteral(val),
};

export function parseTsCode(code: string) {
    constMap = {};
    const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript'], // 支援 TS 語法
    });

    let result: I18nData = {};

    ((traverse as any).default as typeof traverse)(ast, {
        // 解析變數
        VariableDeclaration(path) {
            path.node.declarations.forEach(declaration => {
                const varName = (declaration.id as t.Identifier).name;
                const init = declaration.init;

                if (t.isObjectExpression(init)) {
                    constMap[varName] = init;
                }
            })
        },
        ImportDeclaration(importPath, state) {
            const node = importPath.node.source;
            const importName = importPath.node.specifiers[0].local.name; // test

            const { sourcePath } = resolveSourcePaths(getGlobalConfig())
            const { extensions } = getGlobalConfig()

            const resolved = path.resolve(
                path.dirname(sourcePath), 
                node.value
            );

            const content = fs.readFileSync(`${resolved}.${extensions}`, 'utf-8');

            const ast = parse(content, {
                sourceType: 'module',
                plugins: ['typescript'],
            });

            ((traverse as any).default as typeof traverse)(ast, {
                ExportDefaultDeclaration(path) {
                    const node = path.node.declaration;
                    if (t.isObjectExpression(node)) {
                        importMap[importName] = extractObjectLiteral(node);
                    }
                },
            })
        },
        // 解析export default 的物件
        ExportDefaultDeclaration(path) {
            const node = path.node.declaration;

            if (t.isObjectExpression(node)) {
                // export default 的物件
                result = { ...result, ...extractObjectLiteral(node) };
            } else if (t.isIdentifier(node)) {
                // export default內部的變數
                const found = constMap[node.name];
                if (found && t.isObjectExpression(found)) result = { ...result, ...extractObjectLiteral(found) };
            } else {
                handlePluginError(getTsParserErrorMessage(TsParserCheckResult.INCORRECT_EXPORT_DEFAULT))
            }
        },
    });
    return result;
}

/**
 * 遞迴擷取 ObjectExpression → JS 物件
 */
function extractObjectLiteral(node: t.ObjectExpression): I18nData {
    const obj: I18nData = {};

    node.properties.forEach(prop => {

        if (t.isObjectProperty(prop)) {
            const key = getKey(prop.key);
            const val = prop.value;
            const resolver = NODE_VALUE_RESOLVERS[val.type];

            if (resolver) {
                obj[key] = resolver(val);


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

    if (constMap[variable]) {
        spreadData = extractObjectLiteral(constMap[variable]);
    } else if (importMap[variable]) {
        spreadData = importMap[variable];
    } else {
        handlePluginError(getTsParserErrorMessage(TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND));
        return
    }
    Object.assign(obj, spreadData);
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

function getVariableName(node: t.Expression): string {
    if (t.isIdentifier(node)) return node.name;
    handlePluginError(getTsParserErrorMessage(TsParserCheckResult.SPREAD_NOT_IDENTIFIER));
    return ''
}