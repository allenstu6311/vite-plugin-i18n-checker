import { abnormalMessageMap } from '@/abnormal/config';
import { createAbnormalManager, processAbnormalKeys } from '@/abnormal/processor';
import { AbnormalState } from '@/abnormal/processor/type';
import { AbnormalType } from '@/abnormal/types';
import { beforeEach, describe, expect, it } from 'vitest';

/**
 * processAbnormalKeys 異常分類測試
 * 測試異常鍵值是否正確分類到對應的陣列中（missingKey、extraKey、invalidKey）
 */
describe('processAbnormalKeys 異常分類測試', () => {
    let abnormalManager: AbnormalState;

    beforeEach(() => {
        abnormalManager = createAbnormalManager();
    });

    it('缺少鍵值應該歸類到 missingKey', () => {
        const abnormalKeys = {
            'missingField': AbnormalType.MISS_KEY
        };

        processAbnormalKeys('test.ts', abnormalKeys, abnormalManager);
        const { missingKey } = abnormalManager;

        expect(missingKey).toHaveLength(1);
        expect(missingKey[0]).toEqual({
            filePaths: 'test.ts',
            key: 'missingField',
            desc: ''
        });
    });

    it('額外鍵值應該歸類到 extraKey', () => {
        const abnormalKeys = {
            'extraField': AbnormalType.EXTRA_KEY
        };

        processAbnormalKeys('test.ts', abnormalKeys, abnormalManager);
        const { extraKey } = abnormalManager;

        expect(extraKey).toHaveLength(1);
        expect(extraKey[0]).toEqual({
            filePaths: 'test.ts',
            key: 'extraField',
            desc: ''
        });
    });

    it('結構類型不符應該歸類到 invalidKey', () => {
        const abnormalKeys = {
            'invalidField': AbnormalType.DIFF_STRUCTURE_TYPE
        };

        processAbnormalKeys('test.ts', abnormalKeys, abnormalManager);
        const { invalidKey } = abnormalManager;

        expect(invalidKey).toHaveLength(1);
        expect(invalidKey[0]).toEqual({
            filePaths: 'test.ts',
            key: 'invalidField',
            desc: abnormalMessageMap[AbnormalType.DIFF_STRUCTURE_TYPE]
        });
    });

    it('陣列長度不同應該歸類到 invalidKey', () => {
        const abnormalKeys = {
            'items': AbnormalType.DIFF_ARRAY_LENGTH
        };

        processAbnormalKeys('test.ts', abnormalKeys, abnormalManager);
        const { invalidKey } = abnormalManager;

        expect(invalidKey).toHaveLength(1);
        expect(invalidKey[0]).toEqual({
            filePaths: 'test.ts',
            key: 'items',
            desc: abnormalMessageMap[AbnormalType.DIFF_ARRAY_LENGTH]
        });
    });

    it('多個缺少鍵值應該全部歸類到 missingKey', () => {
        const abnormalKeys = {
            'field1': AbnormalType.MISS_KEY,
            'field2': AbnormalType.MISS_KEY,
            'field3': AbnormalType.MISS_KEY
        };

        processAbnormalKeys('test.ts', abnormalKeys, abnormalManager);
        const { missingKey } = abnormalManager;

        expect(missingKey).toHaveLength(3);
        expect(missingKey.map(item => item.key)).toEqual(['field1', 'field2', 'field3']);
    });

    it('不同異常類型應該分別歸類到對應陣列', () => {
        const abnormalKeys = {
            'missing': AbnormalType.MISS_KEY,
            'extra': AbnormalType.EXTRA_KEY,
            'invalid': AbnormalType.DIFF_STRUCTURE_TYPE
        };

        processAbnormalKeys('test.ts', abnormalKeys, abnormalManager);
        const { missingKey, extraKey, invalidKey } = abnormalManager;

        expect(missingKey).toHaveLength(1);
        expect(extraKey).toHaveLength(1);
        expect(invalidKey).toHaveLength(1);
    });
});
