import * as t from '@babel/types';
import { getAstPropKey } from '../parser/ts/helper';

function getProperty(node: t.ObjectExpression, key: string) {
    return node.properties.find(p => {
        if (t.isObjectProperty(p)) {
            return getAstPropKey(p.key) === key;
        }
        return false;
    }) as t.ObjectProperty | undefined;
}

function findObjectPropertyIndexByKey(node: t.ObjectExpression, key: string) {
    return node.properties.findIndex(el => {
        if (t.isObjectProperty(el)) {
            return getAstPropKey(el.key) === key;
        }
    });
}

function getExportDefaultObject(ast: t.File) {
    const exportNode = ast.program.body.find(stmt =>
        t.isExportDefaultDeclaration(stmt)
    );
    if (!exportNode) return null;
    if (!t.isObjectExpression(exportNode.declaration)) return null;
    return exportNode.declaration; // 這就是 export default {} 的 ObjectExpression
}


export { findObjectPropertyIndexByKey, getExportDefaultObject, getProperty };

