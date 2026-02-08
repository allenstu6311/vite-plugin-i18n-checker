// import * as babelParser from '@babel/parser';
import * as t from '@babel/types';
import fs from 'fs';
import recast from 'recast';
import typescriptParser from 'recast/parsers/typescript.js';
import { getValueByPath } from '../../abnormal/detector/collect';
import { findObjectPropertyByKey, getExportDefaultObject, isArray } from '../../utils';
import { findObjectPropertyIndexByKey, getAstPropKey } from '../../utils/ast';
import { toAstKey, valueToASTNode } from './helper';

function generateAstAndCode(filePath: string) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const ast = recast.parse(code, {
        parser: typescriptParser
    });
    return { ast, code };
}

function sortASTBySourceObject(targetNode: t.ObjectExpression, sourceObject: Record<string, any>) {
    const order = Object.keys(sourceObject);

    targetNode.properties.sort((a, b) => {
        if (t.isObjectProperty(a) && t.isObjectProperty(b)) {
            const aKey = getAstPropKey(a.key);
            const bKey = getAstPropKey(b.key);
            return order.indexOf(aKey) - order.indexOf(bKey);
        }
        return 0;
    });
}


function addKeyToAST({
    targetFileAst,
    sourceObject,
    pathStack,
    value,
}: {
    targetFileAst: t.File;
    sourceObject: Record<string, any>;
    pathStack: (string | number)[];
    value: any;
}) {
    const targetExportDefaultObject = getExportDefaultObject(targetFileAst);
    if (!targetExportDefaultObject) return;

    const generateNextNode = (shouldBeArray: boolean) => shouldBeArray ? t.arrayExpression([]) : t.objectExpression([]);
    const isPrimitiveNode = (node: t.Node) => !t.isObjectExpression(node) && !t.isArrayExpression(node);

    let sourceRef: any = sourceObject;
    let current: t.ObjectExpression | t.ArrayExpression = targetExportDefaultObject;

    // 走到倒數第二層，確保中間節點都存在
    for (let i = 0; i < pathStack.length - 1; i++) {
        const key = pathStack[i];
        // const nextKey = pathStack[i + 1];

        const nextSource = sourceRef ? sourceRef[key as any] : undefined;
        if (!nextSource) return;
        const shouldBeArray = isArray(nextSource);
        // const shouldBeObject = isObject(nextSource);

        if (t.isObjectExpression(current)) {
            if (typeof key !== 'string') return;

            let prop = findObjectPropertyByKey(current, key);
            if (!prop) {
                // 缺節點：依 source 型態建立中間節點
                const nextNode = generateNextNode(shouldBeArray);

                prop = t.objectProperty(toAstKey(key), nextNode);
                current.properties.push(prop);

                // 確保每個層級排序都正確
                if (sourceRef && typeof sourceRef === 'object' && !isArray(sourceRef)) {
                    sortASTBySourceObject(current, sourceRef);
                }
            }

            const valueNode = prop.value;
            // 如果 valueNode 不是 object 或 array，則不合法
            if (isPrimitiveNode(valueNode)) return;
            current = valueNode;
            sourceRef = nextSource;
            continue;
        }

        if (t.isArrayExpression(current)) {
            if (typeof key !== 'number') return;

            const index = key;
            let elem = current.elements[index] as any;

            if (!elem || isPrimitiveNode(elem)) {
                const nextNode = generateNextNode(shouldBeArray);
                current.elements[index] = nextNode;
                elem = nextNode;
            }

            if (!t.isObjectExpression(elem) && !t.isArrayExpression(elem)) return;
            current = elem;
            sourceRef = nextSource;
            continue;
        }

        return;
    }

    // 現在 current 是倒數第二層
    const lastKey = pathStack[pathStack.length - 1];
    const valueNode = valueToASTNode(value);

    if (t.isObjectExpression(current)) {
        if (typeof lastKey !== 'string') return;
        current.properties.push(t.objectProperty(toAstKey(lastKey), valueNode));

        const sourceObjectRef = getValueByPath(sourceObject, pathStack.slice(0, -1));
        if (sourceObjectRef && typeof sourceObjectRef === 'object' && !isArray(sourceObjectRef)) {
            sortASTBySourceObject(current, sourceObjectRef);
        }
        return;
    }

    if (t.isArrayExpression(current)) {
        if (typeof lastKey !== 'number') return;
        current.elements[lastKey] = valueNode;
        return;
    }
}

function deleteKeyFromAST({
    targetFileAst,
    pathStack,
}: {
    targetFileAst: t.File;
    pathStack: (string | number)[];
}) {
    const targetExportDefaultObject = getExportDefaultObject(targetFileAst);
    if (!targetExportDefaultObject) return;

    let current: t.ObjectExpression | t.ArrayExpression = targetExportDefaultObject;

    // 走到倒數第二層
    for (let i = 0; i < pathStack.length - 1; i++) {
        const key = pathStack[i];

        if (t.isObjectExpression(current)) {
            const prop = findObjectPropertyByKey(current, String(key));

            if (!prop || !t.isObjectExpression(prop.value) && !t.isArrayExpression(prop.value)) {
                return; // 路徑不存在 → 不刪
            }

            current = prop.value as t.ObjectExpression | t.ArrayExpression;
            continue;
        }

        if (t.isArrayExpression(current)) {
            const index = Number(key);
            if (!Number.isInteger(index)) return;

            const element = current.elements[index] as t.ObjectExpression | t.ArrayExpression;
            if (!element || (!t.isObjectExpression(element) && !t.isArrayExpression(element))) {
                return; // 路徑不存在 → 不刪
            }
            current = element;
            continue;
        }

        return; // 其他型態 → 不合法
    }

    // 現在 current 是倒數第二層
    const lastKey = pathStack[pathStack.length - 1];

    if (t.isObjectExpression(current)) {
        const index = findObjectPropertyIndexByKey(current, String(lastKey));
        if (index !== -1) current.properties.splice(index, 1);
    }

    if (t.isArrayExpression(current)) {
        const index = Number(lastKey);
        if (Number.isInteger(index)) current.elements.splice(index, 1);
    }
}

export { addKeyToAST, deleteKeyFromAST, generateAstAndCode };

