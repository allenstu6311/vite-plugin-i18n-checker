import { extractSpreadElement } from '@/parser/ts/extract';
import createTsParserState from '@/parser/ts/state';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';

/**
 * extract 展開運算子測試
 * 測試 extractSpreadElement 對展開運算子的處理，包括本地常數、import 資料等
 */
describe('extract 展開運算子測試', () => {
    it('處理本地常數 spread', () => {
        const state = createTsParserState();
        const spreadData = { key1: 'value1', key2: 'value2' };
        state.setLocalConst('spreadVar', spreadData);

        const obj = { existing: 'value' };
        const identifier = t.identifier('spreadVar');

        extractSpreadElement(identifier, obj, state);

        expect(obj).toEqual({
            existing: 'value',
            key1: 'value1',
            key2: 'value2'
        });
    });

    it('處理 import 資料 spread', () => {
        const state = createTsParserState();
        const importData = { importKey: 'importValue', config: { setting: 'value' } };
        state.setResolvedImport('importedVar', importData);

        const obj = { existing: 'value' };
        const identifier = t.identifier('importedVar');

        extractSpreadElement(identifier, obj, state);

        expect(obj).toEqual({
            existing: 'value',
            importKey: 'importValue',
            config: { setting: 'value' }
        });
    });

    it('處理多個 spread 操作', () => {
        const state = createTsParserState();
        const data1 = { key1: 'value1' };
        const data2 = { key2: 'value2' };

        state.setLocalConst('var1', data1);
        state.setLocalConst('var2', data2);

        const obj = { existing: 'value' };

        extractSpreadElement(t.identifier('var1'), obj, state);
        extractSpreadElement(t.identifier('var2'), obj, state);

        expect(obj).toEqual({
            existing: 'value',
            key1: 'value1',
            key2: 'value2'
        });
    });

    it('處理 spread 與普通屬性混合', () => {
        const state = createTsParserState();
        const spreadData = { spreadKey: 'spreadValue' };
        state.setLocalConst('spreadVar', spreadData);

        const obj = {
            existing: 'value',
            normal: 'property'
        };

        extractSpreadElement(t.identifier('spreadVar'), obj, state);

        expect(obj).toEqual({
            existing: 'value',
            normal: 'property',
            spreadKey: 'spreadValue'
        });
    });

    it('處理巢狀 spread', () => {
        const state = createTsParserState();
        const nestedData = {
            level1: {
                level2: {
                    deep: 'value'
                }
            }
        };
        state.setLocalConst('nestedVar', nestedData);

        const obj = { existing: 'value' };
        extractSpreadElement(t.identifier('nestedVar'), obj, state);

        expect(obj).toEqual({
            existing: 'value',
            level1: {
                level2: {
                    deep: 'value'
                }
            }
        });
    });

    it('邊境：找不到變數的 spread', () => {
        const state = createTsParserState();
        const obj = { existing: 'value' };
        const identifier = t.identifier('unknownVar');

        // 這個測試會觸發錯誤處理
        const result = extractSpreadElement(identifier, obj, state);
        expect(result).toBeUndefined();
        expect(obj).toEqual({ existing: 'value' }); // 物件不應被修改
    });
});
