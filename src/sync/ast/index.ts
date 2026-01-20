// import * as babelParser from '@babel/parser';
import * as t from '@babel/types';
import fs from 'fs';
import recast from 'recast';
import typescriptParser from 'recast/parsers/typescript.js';
import { getExportDefaultObject, getProperty, walkObject } from '../../utils';
import { findObjectPropertyIndexByKey, getAstPropKey, getNodeByPath } from '../../utils/ast';
import { valueToASTNode } from './helper';

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
    targetAst,
    sourceCode,
    pathStack,
    value,
}: {
    targetAst: t.File;
    sourceCode: Record<string, any>;
    pathStack: (string | number)[];
    value: any;
}) {
    const targetRoot = getExportDefaultObject(targetAst);
    if (!targetRoot) return;
    const valueNode = valueToASTNode(value);
    const currentTarget = getNodeByPath(targetRoot, pathStack.slice(0, -1));
    if (!currentTarget) return;

    // 插入邏輯
    const lastKey = String(pathStack[pathStack.length - 1]);
    const newNode = t.objectProperty(t.identifier(lastKey), valueNode);
    currentTarget.properties.push(newNode);

    // 排序
    const sourceObject = walkObject(sourceCode, pathStack.slice(0, -1));
    if (!sourceObject) return;
    sortASTBySourceObject(currentTarget, sourceObject);
}

function deleteKeyFromAST({
    targetAst,
    pathStack,
}: {
    targetAst: t.File;
    pathStack: (string | number)[];
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
}

export { addKeyToAST, deleteKeyFromAST, generateAstAndCode };

