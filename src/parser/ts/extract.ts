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
};

const NODE_VALUE_RESOLVERS: NodeResolverMap = {
    StringLiteral: (val: t.StringLiteral) => val.value,
    NumericLiteral: (val: t.NumericLiteral) => val.value,
    BooleanLiteral: (val: t.BooleanLiteral) => val.value,
    NullLiteral: (_val: t.NullLiteral) => null,
    ObjectExpression: (val: t.ObjectExpression, state) => extractObjectLiteral(val, state),
    ArrayExpression: (val: t.ArrayExpression, state) => extractArrayLiteral(val, state),
    Identifier: (val: t.Identifier) => val.name,
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
            const val = prop.value 
            const resolver = NODE_VALUE_RESOLVERS[val.type as keyof NodeResolverMap];

            if (resolver) {
                const parsedValue = resolver(val as any, state);
                const localConstData = state.getLocalConst(parsedValue);
                const resolvedImportData = state.getResolvedImport(parsedValue as string);

                // 如果解析結果是本地常數，展開其內容；否則直接使用
                if (localConstData) {
                    obj[key] = localConstData;
                } else if (resolvedImportData) {
                    obj[key] = resolvedImportData;
                } else {
                    obj[key] = parsedValue as I18nData;
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

