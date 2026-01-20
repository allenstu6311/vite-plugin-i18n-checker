import * as t from '@babel/types';

function getNextValueNode(isLast: boolean, valueNode: t.Expression, sourceNode: t.ObjectExpression | t.ArrayExpression) {
    if (isLast) {
        return valueNode;
    }
    return t.isObjectExpression(sourceNode) ? t.objectExpression([]) : t.arrayExpression([]);
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
                    t.identifier(key),
                    valueToASTNode(val)
                )
            )
        );
    }
    throw new Error(`Unsupported value type: ${typeof value}`);
}

export { getNextValueNode, valueToASTNode };

