import { extractObjectLiteral } from '@/parser/ts/extract';
import createTsParserState from '@/parser/ts/state';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';

/**
 * extract 變數引用測試
 * 測試 extractObjectLiteral 對變數引用的處理，包括本地常數、import 引用等
 */
describe('extract 變數引用測試', () => {
    it('處理本地常數引用', () => {
        const state = createTsParserState();
        const localData = { localKey: 'localValue', nested: { deep: 'value' } };
        state.setLocalConst('localVar', localData);

        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('data'), t.identifier('localVar'))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            data: localData
        });
    });

    it('處理 import 引用', () => {
        const state = createTsParserState();
        const importData = { importKey: 'importValue', config: { setting: 'value' } };
        state.setResolvedImport('importedVar', importData);

        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('data'), t.identifier('importedVar'))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            data: importData
        });
    });

    it('處理未定義變數', () => {
        const state = createTsParserState();
        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('data'), t.identifier('undefinedVar'))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            data: 'undefinedVar' // 未定義時返回識別符名稱
        });
    });

    it('處理變數引用優先級（本地 > import）', () => {
        const state = createTsParserState();
        const localData = { localKey: 'localValue' };
        const importData = { importKey: 'importValue' };

        state.setLocalConst('sameVar', localData);
        state.setResolvedImport('sameVar', importData);

        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('data'), t.identifier('sameVar'))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            data: localData // 本地常數優先
        });
    });

    it('處理複雜變數引用鏈', () => {
        const state = createTsParserState();
        const baseData = { base: 'value' };
        const derivedData = { derived: 'value', ...baseData };

        state.setLocalConst('baseVar', baseData);
        state.setLocalConst('derivedVar', derivedData);

        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('base'), t.identifier('baseVar')),
            t.objectProperty(t.identifier('derived'), t.identifier('derivedVar'))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            base: baseData,
            derived: derivedData
        });
    });

    it('邊境：循環引用處理', () => {
        const state = createTsParserState();
        const circularData: any = { name: 'circular' };
        circularData.self = circularData; // 建立循環引用

        state.setLocalConst('circularVar', circularData);

        const objectNode = t.objectExpression([
            t.objectProperty(t.identifier('data'), t.identifier('circularVar'))
        ]);

        const result = extractObjectLiteral(objectNode, state);
        expect(result).toEqual({
            data: circularData
        });
    });
});
