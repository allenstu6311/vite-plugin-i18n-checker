import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { TsParserState } from './state';
import { extractObjectLiteral } from './extract';
import { I18nData } from '../types';
import { handlePluginError } from '../../error';
import { getTsParserErrorMessage } from '../../error';
import { TsParserCheckResult } from '../../error/schemas/parser/ts';
import { deepAssign } from '../../utils';


function handleVariableDeclaration(nodePath: NodePath<t.VariableDeclaration>, state: TsParserState) {
    nodePath.node.declarations.forEach(declaration => {
        if (t.isIdentifier(declaration.id)) {
            const varName = declaration.id.name;
            const init = declaration.init;
            const importedName = state.getAlias(varName) ? state.getAlias(varName) : varName;

            if (state.hasLocalConst(importedName)) handlePluginError(getTsParserErrorMessage(TsParserCheckResult.REAPET_VARIABLE_NAME, varName));
            // 如果該名稱之前是從 import { foo as bar } 這類語法建立的 alias，
            // 但現在又在本地宣告 const bar = {...}，這在 JS 裡是語法錯誤（同名衝突）。
            // 因此需要把這個 alias 從 state 裡移除，避免後續還錯誤地認為 bar 指向 import 的 foo。
            if (state.hasAlias(varName)) state.removeAlias(varName)
            if (t.isObjectExpression(init)) state.setLocalConst(importedName, extractObjectLiteral(init, state));
        }
    })
}

function handleImportDeclaration(nodePath: NodePath<t.ImportDeclaration>, state: TsParserState) {
    let activeImportKey = '';


    nodePath.node.specifiers.forEach(specifier => {
        if (t.isImportDefaultSpecifier(specifier)) {
            // Default import: import foo from './bar'
            activeImportKey = specifier.local.name;

        } else if (t.isImportSpecifier(specifier)) {
            // Named import: import { foo, bar as baz } from './module'
            const importedName = t.isIdentifier(specifier.imported) // 原始名稱
                ? specifier.imported.name
                : specifier.imported.value;
            const localName = specifier.local.name;  // 變更的名字

            // 使用as變更名字
            if (importedName !== localName) {
                state.setAlias(importedName, localName);
            }
        } else if (t.isImportNamespaceSpecifier(specifier)) {
            // Namespace import: import * as foo from './bar'
            activeImportKey = specifier.local.name;
        }
    })

    if (activeImportKey) {
        state.setActiveImportKey(activeImportKey)
        state.setResolvedImport(activeImportKey, {})
    }
}

function handleExportDefault({ nodePath, state, result, deep }: { nodePath: NodePath<t.ExportDefaultDeclaration>, state: TsParserState, result: I18nData, deep: number }) {
    const node = nodePath.node.declaration;
    const activeImportKey = state.getActiveImportKey();

    if (t.isObjectExpression(node)) {
        if (activeImportKey) {
            // import 的內容
            state.setResolvedImport(activeImportKey, extractObjectLiteral(node, state))

        } else if (deep === 0) {
            // 第一層內容
            deepAssign(result, extractObjectLiteral(node, state))
        }
    } else if (t.isIdentifier(node)) {
        const variable = state.getLocalConst(node.name);
        if (variable && activeImportKey) {
            state.setResolvedImport(activeImportKey, variable)
        } else if (deep === 0) {
            deepAssign(result, variable)
        }
    } else {
        handlePluginError(getTsParserErrorMessage(TsParserCheckResult.INCORRECT_EXPORT_DEFAULT))
    }
}

function handleFunctionDeclaration(nodePath: NodePath<t.FunctionDeclaration>, state: TsParserState) {
    const node = nodePath.node;
    const nodeInfo = node.id;
    const body = node.body;

    const returnStmt = body.body.find(n => n.type === 'ReturnStatement');
    if (returnStmt && returnStmt?.argument?.type === 'ObjectExpression' && nodeInfo) {
        state.setLocalConst(nodeInfo.name, returnStmt.argument);
    }
}

export { handleVariableDeclaration, handleImportDeclaration, handleExportDefault, handleFunctionDeclaration };
