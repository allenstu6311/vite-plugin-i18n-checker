import type { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { handleError } from '../../errorHandling';
import { TsParserCheckResult } from '../../errorHandling/schemas/parser';
import { deepAssign } from '../../utils';
import { I18nData } from '../types';
import { extractArrayLiteral, extractObjectLiteral, resolveInitializerValue } from './extract';
import { TsParserState } from './state';


function handleVariableDeclaration(nodePath: NodePath<t.VariableDeclaration>, state: TsParserState) {
    nodePath.node.declarations.forEach(declaration => {
        // 只處理一般具名變數（排除解構賦值，如 const { a, b } = ...）
        if (!t.isIdentifier(declaration.id)) return;

        // 變數名稱（左側），例如 const foo = ... 中的 "foo"
        const varName = declaration.id.name;

        // 初始值節點（右側的 AST Node），例如 const foo = { ... } 中的 { ... }
        // 若未賦值（如 let foo;）則為 null
        const initializer = declaration.init;

        // 若此變數名稱已被 import alias 映射，則使用 alias 對應的名稱存入 state
        // 例如 import { foo as bar } from '...' → varName='bar'，importedName='foo'
        const importedName = state.getAlias(varName) || varName;

        // 如果遇到重複的變數名稱，會直接覆蓋，暫時不檢查
        // if (state.hasLocalConst(importedName)) handlePluginError(getTsParserErrorMessage(TsParserCheckResult.REAPET_VARIABLE_NAME, varName))

        if (t.isObjectExpression(initializer)) {
            // const foo = { ... }
            state.setLocalConst(importedName, extractObjectLiteral(initializer, state));
        } else if (t.isArrayExpression(initializer)) {
            // const foo = [ ... ]
            // 注意：不可落入下方 else，否則 (initializer as any)?.value 為 undefined，
            // 導致後續引用此變數時回傳 undefined 而非陣列內容
            state.setLocalConst(importedName, extractArrayLiteral(initializer, state));
        } else {
            // const foo = 'string' | 123 | true | null | BinaryExpression | TemplateLiteral | 其他
            // 統一走 NODE_VALUE_RESOLVERS，確保無 .value 屬性的節點（如 BinaryExpression）也能正確解析
            state.setLocalConst(importedName, resolveInitializerValue(initializer, state));
        }
    });
}

function handleImportDeclaration(nodePath: NodePath<t.ImportDeclaration>, state: TsParserState): string {
    let importKey = '';

    nodePath.node.specifiers.forEach(specifier => {
        if (t.isImportDefaultSpecifier(specifier)) {
            // Default import: import foo from './bar'
            importKey = specifier.local.name;

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
            importKey = specifier.local.name;
        }
    });

    return importKey;
}

function handleExportDefault({
    nodePath,
    state,
    result,
    isEntryFile,
    importKey,
}:
    {
        nodePath: NodePath<t.ExportDefaultDeclaration>,
        state: TsParserState,
        result: I18nData,
        isEntryFile: boolean,
        importKey?: string,
    }) {
    const node = nodePath.node.declaration;

    if (t.isObjectExpression(node)) {
        if (isEntryFile) {
            // 第一層內容
            deepAssign(result, extractObjectLiteral(node, state));
        } else if (importKey) {
            // import 的內容
            state.setResolvedImport(importKey, extractObjectLiteral(node, state));
        }
    } else if (t.isIdentifier(node)) {
        const variable = state.getLocalConst(node.name);
        if (isEntryFile) {
            deepAssign(result, variable);
        } else if (importKey) {
            state.setResolvedImport(importKey, variable);
        }
    } else if (t.isArrayExpression(node)) {
        handleError(TsParserCheckResult.INCORRECT_EXPORT_DEFAULT, node.type);

    } else {
        handleError(TsParserCheckResult.INCORRECT_EXPORT_DEFAULT, node.type);
    }
}

function handleFunctionDeclaration(nodePath: NodePath<t.FunctionDeclaration>, state: TsParserState) {
    const node = nodePath.node;
    const nodeInfo = node.id;
    const body = node.body;

    const returnStmt = body.body.find(n => n.type === 'ReturnStatement');
    if (returnStmt && returnStmt?.argument?.type === 'ObjectExpression' && nodeInfo) {
        state.setLocalConst(nodeInfo.name, extractObjectLiteral(returnStmt.argument, state));
    }
}

export { handleExportDefault, handleFunctionDeclaration, handleImportDeclaration, handleVariableDeclaration };

