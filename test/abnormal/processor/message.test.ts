import { abnormalMessageMap } from '@/abnormal/config';
import { createAbormalManager, processAbnormalKeys } from '@/abnormal/processor';
import { AbnormalState } from '@/abnormal/processor/type';
import { AbnormalType } from '@/abnormal/types';
import { setGlobalConfig } from '@/config';
import { beforeEach, describe, expect, it } from 'vitest';

/**
 * processAbnormalKeys 描述訊息測試
 * 測試 invalidKey 的 desc 是否正確（來自 abnormalMessageMap 或自定義規則）
 */
describe('processAbnormalKeys 描述訊息測試', () => {
    let abnormalManager: AbnormalState;

    beforeEach(() => {
        abnormalManager = createAbormalManager();
    });

    it('結構類型不符應該有正確的描述訊息', () => {
        const abnormalKeys = {
            'invalidField': AbnormalType.DIFF_STRUCTURE_TYPE
        };

        processAbnormalKeys('test.ts', abnormalKeys, abnormalManager);
        const { invalidKey } = abnormalManager;

        expect(invalidKey[0].desc).toBe(abnormalMessageMap[AbnormalType.DIFF_STRUCTURE_TYPE]);
    });

    it('陣列長度不同應該有正確的描述訊息', () => {
        const abnormalKeys = {
            'items': AbnormalType.DIFF_ARRAY_LENGTH
        };

        processAbnormalKeys('test.ts', abnormalKeys, abnormalManager);
        const { invalidKey } = abnormalManager;

        expect(invalidKey[0].desc).toBe(abnormalMessageMap[AbnormalType.DIFF_ARRAY_LENGTH]);
    });

    it('自定義規則應該使用自定義訊息作為 desc', () => {
        setGlobalConfig({
            rules: [
                {
                    abnormalType: 'custom',
                    check: (ctx) => ctx.key === 'theme',
                    msg: '不可輸入theme當key'
                }
            ]
        });

        const abnormalKeys = {
            'theme': 'custom'
        };

        processAbnormalKeys('test.ts', abnormalKeys, abnormalManager);
        const { invalidKey } = abnormalManager;

        expect(invalidKey[0].desc).toBe('不可輸入theme當key');
    });

    it('多個自定義規則應該使用對應的描述訊息', () => {
        setGlobalConfig({
            rules: [
                {
                    abnormalType: 'custom1',
                    check: (ctx) => ctx.key === 'field1',
                    msg: '自定義訊息1'
                },
                {
                    abnormalType: 'custom2',
                    check: (ctx) => ctx.key === 'field2',
                    msg: '自定義訊息2'
                }
            ]
        });

        const abnormalKeys = {
            'field1': 'custom1',
            'field2': 'custom2'
        };

        processAbnormalKeys('test.ts', abnormalKeys, abnormalManager);
        const { invalidKey } = abnormalManager;

        expect(invalidKey).toHaveLength(2);
        expect(invalidKey[0].desc).toBe('自定義訊息1');
        expect(invalidKey[1].desc).toBe('自定義訊息2');
    });

    it('缺少描述訊息時應該使用空字串', () => {
        setGlobalConfig({
            rules: [
                {
                    abnormalType: 'noMsg',
                    check: (ctx) => ctx.key === 'test',
                    msg: undefined
                }
            ]
        });

        const abnormalKeys = {
            'test': 'noMsg'
        };

        processAbnormalKeys('test.ts', abnormalKeys, abnormalManager);
        const { invalidKey } = abnormalManager;
        expect(invalidKey[0].desc).toBe('');
    });
});
