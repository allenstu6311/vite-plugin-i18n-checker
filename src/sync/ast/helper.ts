import * as t from '@babel/types';
import { handleError } from '../../errorHandling';
import { SyncCheckResult } from '../../errorHandling/schemas/sync';

function getNextValueNode(isLast: boolean, valueNode: t.Expression, sourceNode: t.ObjectExpression | t.ArrayExpression) {
    if (isLast) {
        return valueNode;
    }
    return t.isObjectExpression(sourceNode) ? t.objectExpression([]) : t.arrayExpression([]);
}

/**
 * 將 key 轉換成 AST 節點，強制使用字串引號
 */
function toAstKey(key: string) {
    return t.stringLiteral(key);
}

function valueToASTNode(value: any): t.Expression {
    if (typeof value === 'string') {
        return t.stringLiteral(value);
    } else if (typeof value === 'number') {
        return t.numericLiteral(value);
    } else if (typeof value === 'boolean') {
        return t.booleanLiteral(value);
    } else if (value === null) {
        return t.nullLiteral();
    } else if (Array.isArray(value)) {
        return t.arrayExpression(
            value.map(item => valueToASTNode(item))
        );
    } else if (typeof value === 'object') {
        return t.objectExpression(
            Object.entries(value).map(([key, val]) =>
                t.objectProperty(
                    toAstKey(key),
                    valueToASTNode(val)
                )
            )
        );
    }
    handleError(SyncCheckResult.AST_UNSUPPORTED_VALUE_TYPE, typeof value);
    return t.nullLiteral();
}

export { getNextValueNode, toAstKey, valueToASTNode };

