import * as t from '@babel/types';
import path from "path";
import { getGlobalConfig } from "../../config";
import { getTsParserErrorMessage, handlePluginError } from "../../error";
import { TsParserCheckResult } from "../../error/schemas/parser/ts";

/**
 * 擷取 key 名稱（支援 Identifier 與 StringLiteral）
 */
function getAstPropKey(keyNode: t.Expression | t.Identifier | t.PrivateName | t.StringLiteral): string {
    if (t.isIdentifier(keyNode)) return keyNode.name;
    if (t.isStringLiteral(keyNode)) return keyNode.value;
    if (t.isNumericLiteral(keyNode)) return keyNode.value.toString();
    handlePluginError(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_KEY_TYPE, keyNode.type));
    return '';
}

function getVariableName(node: t.Node): string {
    if (t.isIdentifier(node)) {
        return node.name;
    }
    if (t.isCallExpression(node)) {
        return getVariableName(node.callee);
    }
    handlePluginError(getTsParserErrorMessage(TsParserCheckResult.SPREAD_NOT_IDENTIFIER));
    return '';
}

function getFilePath(soruce: string, filePath: string) {
    const { extensions } = getGlobalConfig();
    const resolved = path.resolve(
        path.dirname(filePath),
        soruce
    );
    return `${resolved}.${extensions}`;
}

export { getAstPropKey, getFilePath, getVariableName };

