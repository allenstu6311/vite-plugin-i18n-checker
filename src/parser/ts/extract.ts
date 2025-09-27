import path from "path";
import { getGlobalConfig, handlePluginError } from "../../config";
import { getTsParserErrorMessage } from "../../error";
import { TsParserCheckResult } from "../../error/schemas/parser/ts";
import * as t from '@babel/types';
import { I18nData } from "../types";
import { isRepeatKey, deepAssign } from "../../utils";
import { getKey, getVariableName } from "./helper";
import { warning } from "../../utils";
import { TsParserState } from "./state";


const NODE_VALUE_RESOLVERS: Record<string, (val: any, state: TsParserState) => any> = {
    StringLiteral: (val) => val.value,
    NumericLiteral: (val) => val.value,
    BooleanLiteral: (val) => val.value,
    NullLiteral: () => null,
    ObjectExpression: (val, state) => extractObjectLiteral(val, state),
    ArrayExpression: (val, state) => extractArrayLiteral(val, state),
    Identifier: (val) => val.name,
};


/**
 * 遞迴擷取 ObjectExpression → JS 物件
 */
function extractObjectLiteral(node: t.ObjectExpression, state: TsParserState): I18nData {
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
                const parsedValue = resolver(val, state);
                const localConstData = state.getLocalConst(parsedValue);
                const resolvedImportData = state.getResolvedImport(parsedValue);

                // 如果解析結果是本地常數，展開其內容；否則直接使用
                if (localConstData) {
                    obj[key] =localConstData;
                } else if (resolvedImportData) {
                    obj[key] = resolvedImportData;
                } else {
                    obj[key] = parsedValue;
                }

            } else {
                warning(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_VALUE_TYPE, val.type));
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

    node.elements.forEach(el => {
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
    });

    return arr;
}

function extractSpreadElement(node: t.Expression, obj: I18nData, state: TsParserState): void {
    const variable = getVariableName(node);
    const localConstData = state.getLocalConst(variable);
    const resolvedImportData = state.getResolvedImport(variable);

    if (localConstData) {
        deepAssign(obj, localConstData);
    } else if (resolvedImportData) {
        deepAssign(obj, resolvedImportData)
    } else {
        handlePluginError(getTsParserErrorMessage(TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND, variable));
    }
}

export { extractObjectLiteral, extractArrayLiteral, extractSpreadElement };

