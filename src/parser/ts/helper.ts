import * as t from '@babel/types';
import path from "path";
import { getGlobalConfig } from "../../config";
import { getTsParserErrorMessage, handlePluginError } from "../../error";
import { TsParserCheckResult } from "../../error/schemas/parser/ts";

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

export { getFilePath, getVariableName };

