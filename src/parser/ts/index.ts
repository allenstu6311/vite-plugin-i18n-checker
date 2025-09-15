import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { I18nData } from '../types';
import { TsParserCheckResult } from '../../error/schemas/parser/ts';
import { getTsParserErrorMessage } from '../../error';
import { warning } from '../../utils';
import { getGlobalConfig, handlePluginError } from '../../config';
import path from 'path';
import { resolveSourcePaths } from '../../helpers';
import fs from 'fs';
import { isObject, isRepeatKey } from '../../utils/is';
import { handleExportDefault, handleFunctionDeclaration, handleImportDeclaration, handleVariableDeclaration } from './visitors';
import createTsParserState from './state';
import { getFilePath } from './helper';


export function parseTsCode(code: string) {
    const result: I18nData = {};
    const state = createTsParserState();

    function recoursiveParse(
        parseCode: string,
        filePath: string,
    ) {

        if (state.isVisited(filePath)) return;
        state.markVisited(filePath);

        const ast = parse(parseCode, {
            sourceType: 'module',
            plugins: ['typescript'],
        });

        ((traverse as any).default as typeof traverse)(ast, {
            // --- 蒐集宣告 ---
            FunctionDeclaration: nodePath => handleFunctionDeclaration(nodePath, state),
            VariableDeclaration: nodePath => handleVariableDeclaration(nodePath, state),


           // --- 解析子檔案 ---
            ImportDeclaration: nodePath => {
                handleImportDeclaration(nodePath, state);
                const node = nodePath.node.source;
                const resolved = getFilePath(node, filePath);
                const fileCode = fs.readFileSync(resolved, 'utf-8');

                // 進入新檔案遞迴解析
                recoursiveParse(fileCode, resolved);
            },
            // export default
            ExportDefaultDeclaration: nodePath => handleExportDefault(nodePath, state, result)
        });
    }
    recoursiveParse(code, '');
    return result;
}





