import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import fs from 'fs';
import { getGlobalConfig } from '../../config';
import { getFileErrorMessage, handlePluginError } from '../../error';
import { FileCheckResult } from '../../error/schemas/file';
import { resolveSourcePaths } from '../../helpers';
import { isFileReadable } from '../../utils/is';
import { I18nData } from '../types';
import { getFilePath } from './helper';
import createTsParserState from './state';
import { handleExportDefault, handleFunctionDeclaration, handleImportDeclaration, handleVariableDeclaration } from './visitors';

const traverseNs = ((traverse as any).default || traverse) as typeof traverse;

export function parseTsCode(code: string) {
    const result: I18nData = {};
    const state = createTsParserState();
    const config = getGlobalConfig();
    const { sourcePath } = resolveSourcePaths(config);

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
                const soruce = nodePath.node.source;
                const resolved = getFilePath(soruce.value, filePath);

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
    recoursiveParse(code, sourcePath, true);
    return result;
}





