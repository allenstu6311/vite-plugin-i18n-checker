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
            const importedName = state.getAlias(varName) || varName;

            // 如果遇到重複的變數名稱，會直接覆蓋，暫時不檢查
            // if (state.hasLocalConst(importedName)) handlePluginError(getTsParserErrorMessage(TsParserCheckResult.REAPET_VARIABLE_NAME, varName))
            if (t.isObjectExpression(init)) {
                state.setLocalConst(importedName, extractObjectLiteral(init, state));
            } else {
                state.setLocalConst(importedName, (init as any)?.value);
            }
        }
    });
}

function handleImportDeclaration(nodePath: NodePath<t.ImportDeclaration>, state: TsParserState) {
    let activeImportKey = '';

    nodePath.node.specifiers.forEach(specifier => {
        if (t.isImportDefaultSpecifier(specifier)) {
            // Default import: import foo from './bar'
            activeImportKey = specifier.local.name;

        } else if (t.isImportSpecifier(specifier)) {
            // Named import: import { foo, bar as baz } from './module'
            const importedName = t.isIdentifier(specifier.imported)
                ? specifier.imported.name
                : specifier.imported.value;
            const localName = specifier.local.name;

            // 建立命名導入的 alias 映射。
            // 例如 import { foo as bar } from './mod' 時：
            //   importedName = 'foo'
            //   localName = 'bar'
            // → state.setAlias('foo', 'bar')
            //
            // 此映射將影響：
            // - handleVariableDeclaration：若後續宣告 const bar，需移除 alias。
            // - handleExportDefault：識別 bar 對應的 import 結果。
            if (importedName !== localName) state.setAlias(importedName, localName);

        } else if (t.isImportNamespaceSpecifier(specifier)) {
            // Namespace import: import * as foo from './bar'
            activeImportKey = specifier.local.name;
        }
    });

    if (activeImportKey) {
        state.setActiveImportKey(activeImportKey);
        state.setResolvedImport(activeImportKey, {});
    }
}

function handleExportDefault({
    nodePath,
    state,
    result,
    isMainFile
}:
    {
        nodePath: NodePath<t.ExportDefaultDeclaration>,
        state: TsParserState,
        result: I18nData,
        isMainFile: boolean
    }) {
    const node = nodePath.node.declaration;
    const activeImportKey = state.getActiveImportKey();

    if (t.isObjectExpression(node)) {
        if (activeImportKey) {
            // import 的內容
            state.setResolvedImport(activeImportKey, extractObjectLiteral(node, state));

        } else if (isMainFile) {
            // 第一層內容
            deepAssign(result, extractObjectLiteral(node, state));
        }
    } else if (t.isIdentifier(node)) {
        const variable = state.getLocalConst(node.name);
        if (variable && activeImportKey) {
            state.setResolvedImport(activeImportKey, variable);
        } else if (isMainFile) {
            deepAssign(result, variable);
        }
    } else {
        handlePluginError(getTsParserErrorMessage(TsParserCheckResult.INCORRECT_EXPORT_DEFAULT));
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
