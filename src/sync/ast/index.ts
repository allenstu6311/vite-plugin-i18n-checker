import * as babelParser from '@babel/parser';
import * as t from '@babel/types';
import fs from 'fs';
import { getExportDefaultObject, getProperty } from '../../utils';
import { findObjectPropertyIndexByKey } from '../../utils/ast';
import { getNextValueNode, resetAbnormalKeys, valueToASTNode } from './helper';

function generateAstAndCode(filePath: string) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const ast = babelParser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript']
    });
    return { ast, code };
}

function addKeyToAST({
    targetAst,
    sourceAst,
    pathStack,
    value,
}: {
    targetAst: t.File;
    sourceAst: t.File;
    pathStack: (string | number)[];
    value: any;
}) {
    const targetRoot = getExportDefaultObject(targetAst);
    const sourceRoot = getExportDefaultObject(sourceAst);
    if (!targetRoot || !sourceRoot) return;
    const valueNode = valueToASTNode(value);

    let currentTarget: t.ObjectExpression | t.ArrayExpression = targetRoot;
    let currentSource: t.ObjectExpression | t.ArrayExpression = sourceRoot;

    for (let i = 0; i < pathStack.length; i++) {
        const key = String(pathStack[i]);
        const isLast = i === pathStack.length - 1;

        if (t.isObjectExpression(currentSource) && t.isObjectExpression(currentTarget)) {
            let targetNode = getProperty(currentTarget, key);
            const sourceNode = getProperty(currentSource, key);
            if (!sourceNode) return;
            if (!targetNode) {
                // target不一定是完整的，所以需要clone sourceNode
                targetNode = t.cloneNode(sourceNode, false);
                targetNode.value = getNextValueNode(isLast, valueNode, sourceNode.value as t.ObjectExpression | t.ArrayExpression);
                currentTarget.properties.push(targetNode);
            }
            currentTarget = targetNode.value as t.ObjectExpression | t.ArrayExpression;
            currentSource = sourceNode.value as t.ObjectExpression | t.ArrayExpression;
            continue;
        }

        if (t.isArrayExpression(currentSource) && t.isArrayExpression(currentTarget)) {
            const nextIndex = Number(key);
            if (!Number.isInteger(nextIndex)) return;

            if (!currentTarget.elements[nextIndex]) {
                currentTarget.elements[nextIndex] = isLast ? valueNode : t.objectExpression([]);
            }
            currentTarget = currentTarget.elements[nextIndex] as t.ObjectExpression | t.ArrayExpression;
            currentSource = currentSource.elements[nextIndex] as t.ObjectExpression | t.ArrayExpression;
            continue;
        }
        return;
    }
}

function deleteKeyFromAST({
    targetAst,
    pathStack,
    abnormalKeys,
}: {
    targetAst: t.File;
    pathStack: (string | number)[];
    abnormalKeys: Record<string, any>;
}) {

    const root = getExportDefaultObject(targetAst);
    if (!root) return;

    let current: t.ObjectExpression | t.ArrayExpression = root;

    // 走到倒數第二層
    for (let i = 0; i < pathStack.length - 1; i++) {
        const key = pathStack[i];

        if (t.isObjectExpression(current)) {
            const prop = getProperty(current, String(key));

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
    resetAbnormalKeys(abnormalKeys, pathStack);
}

export { addKeyToAST, deleteKeyFromAST, generateAstAndCode };

