import * as t from '@babel/types';
import { getAstPropKey } from '../../parser/ts/helper';

const insertIntoObject = ({
    objectExpr,
    sourceParent,
    lastKey,
    valueNode,
}: {
    objectExpr: t.ObjectExpression;
    sourceParent: t.ObjectExpression;
    lastKey: string;
    valueNode: t.Expression;
}) => {
    const exists = objectExpr.properties.some(
        prop => t.isObjectProperty(prop) && getAstPropKey(prop.key) === lastKey
    );
    if (exists) return;

    const sourceProp = sourceParent.properties.find(
        prop => t.isObjectProperty(prop) && getAstPropKey(prop.key) === lastKey
    ) as t.ObjectProperty | undefined;
    if (!sourceProp) return;

    const clonedProp = t.cloneNode(sourceProp, true);
    clonedProp.value = valueNode;
    objectExpr.properties.push(clonedProp);
};

const insertIntoArray = ({
    arrayExpr,
    lastKey,
    valueNode,
}: {
    arrayExpr: t.ArrayExpression;
    lastKey: string;
    valueNode: t.Expression;
}) => {
    const index = Number(lastKey);
    if (!Number.isInteger(index)) return;
    arrayExpr.elements[index] = valueNode;
};

export { insertIntoArray, insertIntoObject };

