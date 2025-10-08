import { parse } from '@babel/parser';
import traverse  from '@babel/traverse';
import { I18nData } from '../types';
import { getFileErrorMessage, handlePluginError } from '../../error';
import fs from 'fs';
import { isFileReadable } from '../../utils/is';
import { handleExportDefault, handleFunctionDeclaration, handleImportDeclaration, handleVariableDeclaration } from './visitors';
import createTsParserState from './state';
import { getFilePath } from './helper';
import { FileCheckResult } from '../../error/schemas/file';

const traverseNs = ((traverse as any).default || traverse) as typeof traverse;

export function parseTsCode(code: string) {
    const result: I18nData = {};
    const state = createTsParserState();

    function recoursiveParse(
        parseCode: string,
        filePath: string,
        isMainFile: boolean,
    ) {

        if (state.isVisited(filePath)) return;
        state.markVisited(filePath);

        const ast = parse(parseCode, {
            sourceType: 'module',
            plugins: ['typescript'],
        });

        traverseNs(ast, {
            // --- 蒐集宣告 ---
            FunctionDeclaration: nodePath => handleFunctionDeclaration(nodePath, state),
            VariableDeclaration: nodePath => handleVariableDeclaration(nodePath, state),

            // --- 解析子檔案 ---
            ImportDeclaration: nodePath => {
                handleImportDeclaration(nodePath, state);
                const node = nodePath.node.source;
                const resolved = getFilePath(node, filePath);

                if (!isFileReadable(resolved)) {
                    handlePluginError(getFileErrorMessage(FileCheckResult.NOT_EXIST, resolved));
                } else {
                    const fileCode = fs.readFileSync(resolved, 'utf-8');
                    // 進入新檔案遞迴解析
                    recoursiveParse(fileCode, resolved, false);
                }
            },
            // export default
            ExportDefaultDeclaration: nodePath => handleExportDefault({ nodePath, state, result, isMainFile })
        });
    }
    recoursiveParse(code, '', true);
    return result;
}





