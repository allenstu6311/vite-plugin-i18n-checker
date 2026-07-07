import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import fs from 'fs';
import { getGlobalConfig } from '../../config';
import { handleError } from '../../errorHandling';
import { FileCheckResult } from '../../errorHandling/schemas/file';
import { resolveSourcePaths } from '../../helpers';
import { isPathExists } from '../../utils/is';
import { I18nData } from '../types';
import { getFilePath } from './helper';
import createTsParserState from './state';
import { handleExportDefault, handleImportDeclaration, handleVariableDeclaration } from './visitors';

const traverseNs = ((traverse as any).default || traverse) as typeof traverse;

export function parseTsCode(code: string) {
    const result: I18nData = {};
    const state = createTsParserState();
    const config = getGlobalConfig();
    const { sourcePath } = resolveSourcePaths(config);
    // 以 filePath 快取各檔案的 export default 結果。
    // 宣告於閉包內，每次 parseTsCode 呼叫都是全新的 Map，不跨檔案/跨語系共用。
    const fileExportCache = new Map<string, I18nData>();

    function recursiveParser({
        parseCode,
        filePath,
        isEntryFile,
        importKey,
    }: {
        parseCode: string,
        filePath: string,
        isEntryFile: boolean,
        importKey?: string,
    }) {
        if (state.isVisited(filePath)) {
            // 同檔已解析過（isVisited 短路避免重跑 traverse），
            // 但仍需把快取的 export default 綁到這次的 importKey，
            // 否則同檔第二次 default import 的名稱會解析不到值。
            if (importKey && fileExportCache.has(filePath)) {
                state.setResolvedImport(importKey, fileExportCache.get(filePath)!);
            }
            return;
        }
        state.markVisited(filePath);

        const ast = parse(parseCode, {
            sourceType: 'module',
            plugins: ['typescript'],
        });

        traverseNs(ast, {
            // --- 蒐集宣告 ---
            // FunctionDeclaration: nodePath => handleFunctionDeclaration(nodePath, state),
            VariableDeclaration: nodePath => handleVariableDeclaration(nodePath, state),
            // ArrayExpression: nodePath => handleArrayExpression(nodePath, state),

            // --- 解析子檔案 ---
            ImportDeclaration: nodePath => {
                const importKey = handleImportDeclaration(nodePath, state);
                const source = nodePath.node.source;

                const resolved = getFilePath(source.value, filePath);

                if (!isPathExists(resolved)) {
                    handleError(FileCheckResult.NOT_EXIST, resolved);
                } else {
                    const fileCode = fs.readFileSync(resolved, 'utf-8');
                    // 進入新檔案遞迴解析，將 import key 傳入，由子檔案的 export default 消費
                    recursiveParser({ parseCode: fileCode, filePath: resolved, isEntryFile: false, importKey });
                }
            },
            // export default
            ExportDefaultDeclaration: nodePath => {
                const data = handleExportDefault({ nodePath, state, result, isEntryFile, importKey });
                // 非 entry 檔的 export default 結果以 filePath 快取，供同檔後續 import 重複綁定
                if (!isEntryFile && data !== undefined) {
                    fileExportCache.set(filePath, data);
                }
            }
        });
    }
    recursiveParser({ parseCode: code, filePath: sourcePath, isEntryFile: true });
    return result;
}





