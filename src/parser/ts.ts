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

let localConstMap: Record<string, t.ObjectExpression> = {};
let resolvedImportMap: Record<string, I18nData> = {};


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
    let result: I18nData = {}
    const visited: Record<string, boolean> = {};

    parseFileAst({
        code,
        result,
        fromImport: false,
        filePath: '',
        visited
    });
    return result;
}

function parseFileAst({
    code,
    result,
    fromImport = false,
    filePath = '',
    visited
}: {
    code: string,
    result: I18nData,
    fromImport: boolean,
    filePath: string,
    visited: Record<string, boolean>
}) {


    // 避免循環引用
    if (visited[filePath]) return;
    visited[filePath] = true;


    const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript'],
    });

    ((traverse as any).default as typeof traverse)(ast, {
        // variable
        VariableDeclaration(nodePath) {
            nodePath.node.declarations.forEach(declaration => {
                const varName = (declaration.id as t.Identifier).name;
                const init = declaration.init;
                if (t.isObjectExpression(init)) {
                    localConstMap[varName] = init;
                }
            })
        },
        // import
        ImportDeclaration(nodePath) {
            const node = nodePath.node.source;
            const importName = nodePath.node.specifiers[0].local.name;
            resolvedImportMap[importName] = {};

            const resolved = getFilePath(node, filePath);
            const code = fs.readFileSync(resolved, 'utf-8');

            parseFileAst({
                code,
                result,
                fromImport: true,
                filePath: resolved,
                visited
            });
        },
        // export default
        ExportDefaultDeclaration(nodePath) {
            const node = nodePath.node.declaration;

            if (t.isObjectExpression(node)) {
                Object.assign(result, extractObjectLiteral(node));
            } else if (t.isIdentifier(node)) {
                // export default variable
                const found = localConstMap[node.name];
                if (found && t.isObjectExpression(found)) Object.assign(result, extractObjectLiteral(found));
            } else {
                handlePluginError(getTsParserErrorMessage(TsParserCheckResult.INCORRECT_EXPORT_DEFAULT))
            }
        },
        // export
        ExportSpecifier(nodePath) {
            const node = nodePath.node;
            const spreadName = node.local.name;
            Object.assign(result, extractObjectLiteral(localConstMap[spreadName]));
        }
    });
}

/**
 * 遞迴擷取 ObjectExpression → JS 物件
 */
function extractObjectLiteral(node: t.ObjectExpression): I18nData {
    const obj: I18nData = {};

    node.properties.forEach(prop => {

        if (t.isObjectProperty(prop)) {
            const key = getKey(prop.key);
            // console.log('extractObjectLiteral key', key);
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
    if (localConstMap[variable]) {
        spreadData = extractObjectLiteral(localConstMap[variable]);
    } else if (resolvedImportMap[variable]) {
        spreadData = resolvedImportMap[variable];
    } else {
        handlePluginError(getTsParserErrorMessage(TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND, variable));
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
    if (t.isIdentifier(node)) return node.name
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