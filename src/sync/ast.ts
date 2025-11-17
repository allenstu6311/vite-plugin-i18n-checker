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

function enterNestedObject(node: t.ObjectExpression | t.ArrayExpression, pathStack: (string | number)[]): t.ObjectExpression | t.ArrayExpression | undefined {
    let currentObject = node;
    // 根據 pathStack 定位
    for (let i = 0; i < pathStack.length - 1; i++) {
        const key = String(pathStack[i]);
        const prop = t.isObjectExpression(currentObject) ? currentObject.properties.find(p => {
            if (t.isObjectProperty(p)) {
                const propKey = getAstPropKey(p.key);
                return propKey === key;
            }
            return false;
        }) as t.ObjectProperty | undefined : undefined;

        if (!prop) return undefined;

        if (prop && t.isObjectExpression(prop.value)) {
            currentObject = prop.value;
        } else if (t.isArrayExpression(prop.value)) {
            const nextKey = pathStack[i + 1];

            // 檢查下一個 key 是否是數字索引
            if (typeof nextKey === 'number') {
                const arrayExpr = prop.value;
                const arrayElement = arrayExpr.elements[nextKey];
                if (arrayElement && t.isObjectExpression(arrayElement)) {
                    return arrayElement;
                } else {
                    return arrayExpr;
                }

            } else {
                return undefined;
            }
        }

        else {
            return undefined; // 找不到對應路徑
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
            result = { targetObject: currentObject as t.ObjectExpression, lastKey };
        }
    });

    return result;
}

function getExportDefaultObject(ast: t.File) {
    const exportNode = ast.program.body.find(stmt =>
        t.isExportDefaultDeclaration(stmt)
    ) as t.ExportDefaultDeclaration | undefined;

    if (!exportNode) return null;
    if (!t.isObjectExpression(exportNode.declaration)) return null;
    return exportNode.declaration; // 這就是 export default {} 的 ObjectExpression
}

function addKeyToAST(
    targetAst: t.File,
    sourceAst: t.File,
    pathStack: (string | number)[],
    value: any
) {
    const targetResult = getTargetObjectAndKey(targetAst, pathStack);
    const sourceResult = getTargetObjectAndKey(sourceAst, pathStack);
    if (!sourceResult) return;

    const { targetObject: sourceParent, lastKey } = sourceResult;
    const valueNode = valueToASTNode(value);

    const insertIntoObject = (objectExpr: t.ObjectExpression) => {
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

    const insertIntoArray = (arrayExpr: t.ArrayExpression) => {
        const index = Number(lastKey);
        if (!Number.isInteger(index)) return;
        arrayExpr.elements[index] = valueNode;
    };

    // 如果有找到目標物件，則直接插入
    if (targetResult) {
        if (t.isObjectExpression(targetResult.targetObject) && t.isObjectExpression(sourceParent)) {
            insertIntoObject(targetResult.targetObject);
            return;
        }
        if (t.isArrayExpression(targetResult.targetObject) && t.isArrayExpression(sourceParent)) {
            insertIntoArray(targetResult.targetObject);
            return;
        }
    }

    // 如果沒有找到目標物件，則需要遍歷整個 AST 來找到目標物件
    const root = getExportDefaultObject(targetAst);
    const sourceRoot = getExportDefaultObject(sourceAst);
    if (!root || !sourceRoot) return;

    let currentTarget: t.ObjectExpression | t.ArrayExpression = root;
    let currentSource: t.ObjectExpression | t.ArrayExpression = sourceRoot;

    for (let i = 0; i < pathStack.length - 1; i++) {
        const key = pathStack[i];

        if (t.isObjectExpression(currentSource) && t.isObjectExpression(currentTarget)) {
            let child = currentTarget.properties.find(
                prop => t.isObjectProperty(prop) && getAstPropKey(prop.key) === String(key)
            ) as t.ObjectProperty | undefined;

            const sourceChild = currentSource.properties.find(
                prop => t.isObjectProperty(prop) && getAstPropKey(prop.key) === String(key)
            ) as t.ObjectProperty | undefined;
            if (!sourceChild) return;

            if (!child) {
                child = t.cloneNode(sourceChild, false);
                child.value = t.isObjectExpression(sourceChild.value)
                    ? t.objectExpression([])
                    : t.arrayExpression([]);
                currentTarget.properties.push(child);
            }

            currentTarget = child.value as t.ObjectExpression | t.ArrayExpression;
            currentSource = sourceChild.value as t.ObjectExpression | t.ArrayExpression;
            continue;
        }

        if (t.isArrayExpression(currentSource) && t.isArrayExpression(currentTarget)) {
            const nextIndex = Number(key);
            if (!Number.isInteger(nextIndex)) return;

            if (!currentTarget.elements[nextIndex]) {
                currentTarget.elements[nextIndex] = t.objectExpression([]);
            }

            currentTarget = currentTarget.elements[nextIndex] as t.ObjectExpression | t.ArrayExpression;
            currentSource = currentSource.elements[nextIndex] as t.ObjectExpression | t.ArrayExpression;
            continue;
        }

        return;
    }

    if (t.isObjectExpression(currentTarget) && t.isObjectExpression(sourceParent)) {
        insertIntoObject(currentTarget);
    } else if (t.isArrayExpression(currentTarget) && t.isArrayExpression(sourceParent)) {
        insertIntoArray(currentTarget);
    }
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

