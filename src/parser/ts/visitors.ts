import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { TsParserState } from './state';
import { extractObjectLiteral } from './extract';
import { I18nData } from '../types';
import { handlePluginError } from '../../config';
import { getTsParserErrorMessage } from '../../error';
import { TsParserCheckResult } from '../../error/schemas/parser/ts';
import { deepAssign } from '../../utils';


function handleVariableDeclaration(nodePath: NodePath<t.VariableDeclaration>, state: TsParserState) {
    nodePath.node.declarations.forEach(declaration => {
        if (t.isIdentifier(declaration.id)) {
            const varName = declaration.id.name;
            const init = declaration.init;

            if (t.isObjectExpression(init)) {
                const importedName = state.getAlias(varName) ? state.getAlias(varName) : varName;
                state.setLocalConst(importedName, extractObjectLiteral(init, state));
            }
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

function handleExportDefault(nodePath: NodePath<t.ExportDefaultDeclaration>, state: TsParserState, result: I18nData) {
    const node = nodePath.node.declaration;
    const activeImportKey = state.getActiveImportKey();
    if (t.isObjectExpression(node)) {
        if (activeImportKey) {
            state.setResolvedImport(activeImportKey, extractObjectLiteral(node, state))

        } else {
            deepAssign(result, extractObjectLiteral(node, state))
        }
    } else if (t.isIdentifier(node)) {
        const variable = state.getLocalConst(node.name);
        if (variable && activeImportKey) {
            state.setResolvedImport(activeImportKey, variable)
        } else {
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
