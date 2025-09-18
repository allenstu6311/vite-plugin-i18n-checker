import path from "path";
import { getGlobalConfig, handlePluginError } from "../../config";
import { getTsParserErrorMessage } from "../../error";
import { TsParserCheckResult } from "../../error/schemas/parser/ts";
import { resolveSourcePaths } from "../../helpers";
import * as t from '@babel/types';

/**
 * 擷取 key 名稱（支援 Identifier 與 StringLiteral）
 */
function getKey(keyNode: t.Expression | t.Identifier | t.PrivateName | t.StringLiteral): string {
    if (t.isIdentifier(keyNode)) return keyNode.name;
    if (t.isStringLiteral(keyNode)) return keyNode.value;
    handlePluginError(getTsParserErrorMessage(TsParserCheckResult.UNSUPPORTED_KEY_TYPE));
    return ''
}

function getVariableName(node: t.Node): string {
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

export { getKey, getVariableName, getFilePath };