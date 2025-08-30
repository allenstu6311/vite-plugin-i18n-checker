import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { I18nData } from './types';
import { TsParserCheckResult } from '../error/schemas/parser/ts';
import { getTsParserErrorMessage } from '../error';
import { error, warning } from '../utils';

let constMap: Record<string, t.ObjectExpression> = {};

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
        // 解析export default 的物件
        ExportDefaultDeclaration(path) {
            const node = path.node.declaration;
            if (t.isObjectExpression(node)) {
                // export default 的物件
                result = { ...result, ...extractObjectLiteral(node) };
            }else if(t.isIdentifier(node)){
                // export default 的變數
                const found = constMap[node.name];
                if(found && t.isObjectExpression(found)) result = { ...result, ...extractObjectLiteral(found) };
            } else {
                error(getTsParserErrorMessage(TsParserCheckResult.INCORRECT_EXPORT_DEFAULT))
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

            if (t.isStringLiteral(val) || t.isNumericLiteral(val) || t.isBooleanLiteral(val)) {
                obj[key] = val.value;
            } else if (t.isObjectExpression(val)) {
                obj[key] = extractObjectLiteral(val);
            } else if (t.isArrayExpression(val)) {
                obj[key] = extractArrayLiteral(val);
            } else {
                warning(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_VALUE_TYPE,  val.type));
            }
        } else if (t.isSpreadElement(prop)) {
            extractSpreadElement(prop.argument, obj)

        } else {
            warning(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_OBJECT_PROPERTY));
        }
    });

    return obj;
}

/**
 * 擷取 key 名稱（支援 Identifier 與 StringLiteral）
 */
function getKey(keyNode: t.Expression | t.Identifier | t.PrivateName | t.StringLiteral): string {
    if (t.isIdentifier(keyNode)) return keyNode.name;
    if (t.isStringLiteral(keyNode)) return keyNode.value;
    error(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_KEY_TYPE));
    return ''
}

function getVariableName(node: t.Expression): string {
    if (t.isIdentifier(node)) return node.name;
    error(getTsParserErrorMessage(TsParserCheckResult.SPREAD_NOT_IDENTIFIER));
    return ''
}


function extractArrayLiteral(node: t.ArrayExpression): any[] {
    const arr: any[] = [];

    node.elements.forEach(el => {
        if (t.isStringLiteral(el)) {
            arr.push(el.value);
        } else if (t.isNumericLiteral(el)) {
            arr.push(el.value);
        } else if (t.isObjectExpression(el)) {
            arr.push(extractObjectLiteral(el)); // 假設不需展開變數
        } else if (t.isArrayExpression(el)) {
            arr.push(extractArrayLiteral(el)); // 遞迴處理巢狀陣列
        } else {
            warning(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_ARRAY_ELEMENT));
        }
    });

    return arr;
}

function extractSpreadElement(node: t.Expression, obj: I18nData): void {
    const variable = getVariableName(node);
    const data = constMap[variable];

    if (!data) {
        error(getTsParserErrorMessage(TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND));
        return
    }

    const spreadData = extractObjectLiteral(data)
    Object.assign(obj, spreadData);
}
