import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import fs from 'fs';
import { AbnormalType } from "../abnormal/types";
import { getAstPropKey } from '../parser/ts/helper';

const traverseNs = ((traverse as any).default || traverse) as typeof traverse;

function generateAstAndCode(filePath: string) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const ast = babelParser.parse(code, {
        sourceType: 'module',
        plugins: ['typescript']
    });
    return { ast, code };
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

function enterNestedObject(node: t.ObjectExpression, pathStack: (string | number)[]): t.ObjectExpression | undefined {
    let currentObject = node;
    // 根據 pathStack 定位
    for (let i = 0; i < pathStack.length - 1; i++) {
        const key = String(pathStack[i]);
        const prop = currentObject.properties.find(p => {
            if (t.isObjectProperty(p)) {
                const propKey = getAstPropKey(p.key);
                return propKey === key;
            }
            return false;
        }) as t.ObjectProperty | undefined;

        if (prop && t.isObjectExpression(prop.value)) {
            currentObject = prop.value;
        } else {
            return; // 找不到對應路徑
        }
    }
    return currentObject;
}

function getTargetObjectAndKey(
    ast: t.File,
    pathStack: (string | number)[]
): { targetObject: t.ObjectExpression, lastKey: string } | null {
    let result: { targetObject: t.ObjectExpression, lastKey: string } | null = null;

    traverseNs(ast, {
        ExportDefaultDeclaration(path) {
            const node = path.node.declaration;
            if (!t.isObjectExpression(node)) return;
            const currentObject = enterNestedObject(node, pathStack);
            if (!currentObject) return;

            const lastKey = String(pathStack[pathStack.length - 1]);
            result = { targetObject: currentObject, lastKey };
        }
    });

    return result;
}

function addKeyToAST(
    ast: t.File,
    pathStack: (string | number)[],
    value: any
) {
    const result = getTargetObjectAndKey(ast, pathStack);
    if (!result) return;

    const { targetObject, lastKey } = result;
    const newProperty = t.objectProperty(
        t.identifier(lastKey),
        valueToASTNode(value)
    );
    targetObject.properties.push(newProperty);
}

function deleteKeyFromAST(
    ast: t.File,
    pathStack: (string | number)[],
    abnormalKeys: Record<string, any>,
) {
    const result = getTargetObjectAndKey(ast, pathStack);
    if (!result) return;

    const { targetObject, lastKey } = result;
    const index = targetObject.properties.findIndex(p => {
        if (t.isObjectProperty(p)) {
            const propKey = getAstPropKey(p.key);
            return propKey === lastKey;
        }
        return false;
    });

    if (index !== -1) {
        targetObject.properties.splice(index, 1);
    } else {
        // 刪除同步不處理展開變數的異常，直接轉換回EXTRA_KEY
        let abnormalKeysRef = abnormalKeys;
        for (let i = 0; i < pathStack.length; i++) {
            const key = pathStack[i];
            if (i === pathStack.length - 1) {
                abnormalKeysRef[key] = AbnormalType.EXTRA_KEY;
            } else {
                abnormalKeysRef = abnormalKeysRef[key];
            }
        }
    }
}

export {
    addKeyToAST,
    deleteKeyFromAST,
    enterNestedObject,
    generateAstAndCode,
    getTargetObjectAndKey,
    valueToASTNode
};

