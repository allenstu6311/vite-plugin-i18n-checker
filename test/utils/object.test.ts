import { deepAssign, sortObject } from '@/utils/object';
import { describe, expect, it } from 'vitest';

/**
 * deepAssign 工具函數測試
 *
 * 重點驗證：
 * 1. Falsy 值不應被覆蓋（false / 0 / '' / null）
 * 2. 巢狀物件 merge 應在正確層級，不得汙染父層
 * 3. 新 key 應正常補入
 */
describe('deepAssign', () => {
    // ─── 基本功能 ───────────────────────────────────────────────
    it('應將 source 中不存在於 target 的 key 補入', () => {
        const target: Record<string, any> = { a: 1 };
        deepAssign(target, { b: 2, c: 3 });
        expect(target).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('target 已有的 key（非物件）不應被覆蓋', () => {
        const target: Record<string, any> = { a: 'original' };
        deepAssign(target, { a: 'new' });
        expect(target.a).toBe('original');
    });

    it('空 source 不應改變 target', () => {
        const target: Record<string, any> = { a: 1 };
        deepAssign(target, {});
        expect(target).toEqual({ a: 1 });
    });

    it('空 target 應複製 source 所有 key', () => {
        const target: Record<string, any> = {};
        deepAssign(target, { a: 1, b: 2 });
        expect(target).toEqual({ a: 1, b: 2 });
    });

    // ─── Bug 1：Falsy 值不得被覆蓋 ────────────────────────────
    it('[Bug] target 中的 false 值不應被 source 覆蓋', () => {
        const target: Record<string, any> = { enabled: false };
        deepAssign(target, { enabled: true });
        // !false === true，舊版會錯誤地以 source 覆蓋
        expect(target.enabled).toBe(false);
    });

    it('[Bug] target 中的 0 值不應被 source 覆蓋', () => {
        const target: Record<string, any> = { count: 0 };
        deepAssign(target, { count: 99 });
        // !0 === true，舊版會錯誤地以 source 覆蓋
        expect(target.count).toBe(0);
    });

    it('[Bug] target 中的空字串不應被 source 覆蓋', () => {
        const target: Record<string, any> = { label: '' };
        deepAssign(target, { label: 'new label' });
        // !'' === true，舊版會錯誤地以 source 覆蓋
        expect(target.label).toBe('');
    });

    it('[Bug] target 中的 null 值不應被 source 覆蓋', () => {
        const target: Record<string, any> = { data: null };
        deepAssign(target, { data: 'something' });
        // !null === true，舊版會錯誤地以 source 覆蓋
        expect(target.data).toBeNull();
    });

    // ─── Bug 2：巢狀 merge 應在正確層級 ──────────────────────
    it('[Bug] 巢狀物件 merge 後子 key 應在正確層級（不汙染父層）', () => {
        const target: Record<string, any> = { a: { x: 1 } };
        const source = { a: { y: 2 } };
        deepAssign(target, source);
        // 舊版 deepAssign 會把 y 設在 target.y，而非 target.a.y
        expect(target).toEqual({ a: { x: 1, y: 2 } });
        // 確認沒有汙染父層
        expect(target.y).toBeUndefined();
    });

    it('[Bug] 三層巢狀 merge 不應汙染任何父層', () => {
        const target: Record<string, any> = {
            level1: {
                level2: { x: 'original' }
            }
        };
        const source = {
            level1: {
                level2: { y: 'new' }
            }
        };
        deepAssign(target, source);
        expect(target).toEqual({
            level1: {
                level2: { x: 'original', y: 'new' }
            }
        });
        // 確認沒有在任何父層汙染
        expect(target.y).toBeUndefined();
        expect((target.level1 as any).y).toBeUndefined();
    });

    it('巢狀物件中 target 沒有的 key 應完整複製', () => {
        const target: Record<string, any> = { a: {} };
        deepAssign(target, { a: { nested: { deep: 'value' } } });
        expect(target).toEqual({ a: { nested: { deep: 'value' } } });
    });

    it('[Bug] i18n 真實場景：spread 巢狀 form 物件 merge', () => {
        // 模擬 TS 解析中 extractObjectLiteral 的實際流程：
        //   const base = { form: { save: '儲存' } };
        //   export default { form: { title: '表單' }, ...base }
        // 此時 obj = { form: { title: '表單' } }
        // deepAssign(obj, { form: { save: '儲存' } })
        const obj: Record<string, any> = { form: { title: '表單' } };
        deepAssign(obj, { form: { save: '儲存' } });
        // 正確結果：form 下有 title AND save
        expect(obj).toEqual({ form: { title: '表單', save: '儲存' } });
        // 舊版 bug：obj.save = '儲存'（錯誤地設在父層）
        expect((obj as any).save).toBeUndefined();
    });
});

/**
 * sortObject 工具函數測試
 */
describe('sortObject', () => {
    it('依照 source key 順序排列 target', () => {
        const source = { c: 3, a: 1, b: 2 };
        const target = { a: 10, b: 20, c: 30 };
        const result = sortObject(source, target);
        expect(Object.keys(result)).toEqual(['c', 'a', 'b']);
        expect(result).toEqual({ c: 30, a: 10, b: 20 });
    });

    it('target 中有 source 沒有的 key 時，result 中應不包含該 key', () => {
        const source = { a: 1 };
        const target = { a: 10, extra: 99 };
        const result = sortObject(source, target);
        expect(result).toEqual({ a: 10 });
        expect((result as any).extra).toBeUndefined();
    });

    it('兩個 primitive 應直接回傳 target', () => {
        const result = sortObject('source' as any, 'target' as any);
        expect(result).toBe('target');
    });

    it('兩個陣列應依照索引遞迴排序', () => {
        const source = [{ b: 2, a: 1 }];
        const target = [{ a: 10, b: 20 }];
        const result = sortObject(source as any, target as any);
        expect(Object.keys(result[0])).toEqual(['b', 'a']);
    });

    it('source 為陣列、target 為陣列時，target 多的元素保留', () => {
        const source = [1, 2];
        const target = [10, 20, 30];
        const result = sortObject(source as any, target as any);
        // target 的第三個元素（source[2] undefined）應原樣保留
        expect(result).toEqual([10, 20, 30]);
    });

    it('空 source 回傳空物件', () => {
        const result = sortObject({}, { a: 1 });
        expect(result).toEqual({});
    });
});
