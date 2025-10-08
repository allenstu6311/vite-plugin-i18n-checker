import { handlePluginError } from "../../error";
import { getTsParserErrorMessage } from "../../error";
import { TsParserCheckResult } from "../../error/schemas/parser/ts";
import * as t from '@babel/types';
import { I18nData } from "../types";
import { isRepeatKey, deepAssign } from "../../utils";
import { getKey, getVariableName } from "./helper";
import { warning } from "../../utils";
import { TsParserState } from "./state";

type NodeResolverMap = {
    StringLiteral: (val: t.StringLiteral, state: TsParserState) => string;
    NumericLiteral: (val: t.NumericLiteral, state: TsParserState) => number;
    BooleanLiteral: (val: t.BooleanLiteral, state: TsParserState) => boolean;
    NullLiteral: (val: t.NullLiteral, state: TsParserState) => null;
    ObjectExpression: (val: t.ObjectExpression, state: TsParserState) => object;
    ArrayExpression: (val: t.ArrayExpression, state: TsParserState) => any[];
    Identifier: (val: t.Identifier, state: TsParserState) => string;
    TemplateLiteral: (val: t.TemplateLiteral, state: TsParserState) => string;
};

const NODE_VALUE_RESOLVERS: NodeResolverMap = {
    StringLiteral: (val: t.StringLiteral) => val.value,
    NumericLiteral: (val: t.NumericLiteral) => val.value,
    BooleanLiteral: (val: t.BooleanLiteral) => val.value,
    NullLiteral: (_val: t.NullLiteral) => null,
    ObjectExpression: (val: t.ObjectExpression, state) => extractObjectLiteral(val, state),
    ArrayExpression: (val: t.ArrayExpression, state) => extractArrayLiteral(val, state),
    Identifier: (val: t.Identifier) => val.name,
    TemplateLiteral: (val: t.TemplateLiteral) => val.quasis[0].value.cooked || '',
};

function resolveVariableReference(identifier: string | any, state: TsParserState): I18nData | null {
    if (typeof identifier !== 'string') return null;
    
    // 先查找本地常數定義
    const localConstData = state.getLocalConst(identifier);
    if (localConstData) return localConstData;
    
    // 再查找 import 的外部引用
    const resolvedImportData = state.getResolvedImport(identifier);
    if (resolvedImportData) return resolvedImportData;
    return null;
}

/**
 * 遞迴擷取 ObjectExpression → JS 物件
 */
function extractObjectLiteral(node: t.ObjectExpression, state: TsParserState): I18nData {
    const obj: I18nData = {};

    node.properties.forEach(prop => {

        if (t.isObjectProperty(prop)) {
            const key = getKey(prop.key);
            if (key && isRepeatKey(obj, key)) {
                handlePluginError(getTsParserErrorMessage(TsParserCheckResult.REAPET_KEY, key));
                return;
            }
            state.setPathStack(key);
            const val = prop.value
            const resolver = NODE_VALUE_RESOLVERS[val.type as keyof NodeResolverMap];

            if (resolver) {
                // TypeScript 無法推導動態映射的參數類型，但運行時類型由 NODE_VALUE_RESOLVERS 保證
                const parsedValue = resolver(val as any, state)
                // parsedValue 可能是識別符名稱或字面值，嘗試解析變數引用
                const resolvedData = resolveVariableReference(parsedValue, state) ?? parsedValue as I18nData;
                obj[key] = resolvedData;

                state.popPathStack();
            } else {
                const problemPath = state.getPathStack().join('.');
                warning(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_VALUE_TYPE, problemPath, val.type));
            }

        } else if (t.isSpreadElement(prop)) {
            extractSpreadElement(prop.argument, obj, state)
        } else {
            warning(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_OBJECT_PROPERTY));
        }
    });
    return obj;
}

function extractArrayLiteral(node: t.ArrayExpression, state: TsParserState): any[] {
    const arr: any[] = [];

    node.elements.forEach((el, index) => {
        state.setPathStack(`[${index}]`);
        if (t.isStringLiteral(el)) {
            arr.push(el.value);
        } else if (t.isNumericLiteral(el)) {
            arr.push(el.value);
        } else if (t.isObjectExpression(el)) {
            arr.push(extractObjectLiteral(el, state));
        } else if (t.isArrayExpression(el)) {
            arr.push(extractArrayLiteral(el, state));
        } else {
            warning(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_ARRAY_ELEMENT));
        }
        state.popPathStack();
    });

    return arr;
}

function extractSpreadElement(node: t.Expression, obj: I18nData, state: TsParserState): void {
    const variable = getVariableName(node);
    // variable 可能是識別符名稱或字面值，嘗試解析變數引用
    const resolvedData = resolveVariableReference(variable, state);

    if(resolvedData){
        deepAssign(obj, resolvedData);
    } else {
        handlePluginError(getTsParserErrorMessage(TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND, variable));
    }
}

export { extractObjectLiteral, extractArrayLiteral, extractSpreadElement };

