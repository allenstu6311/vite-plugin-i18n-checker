import { createAbormalManager, processAbnormalKeys } from '@/abnormal/processor';
import { AbnormalState } from '@/abnormal/processor/type';
import { AbnormalType } from '@/abnormal/types';
import { beforeEach, describe, expect, it } from 'vitest';

/**
 * processAbnormalKeys 陣列路徑轉換測試
 * 測試陣列索引是否能正確轉換成 [index] 格式的路徑
 */
describe('processAbnormalKeys 陣列路徑轉換測試', () => {
    let abormalManager: AbnormalState;

    beforeEach(() => {
        abormalManager = createAbormalManager();
    });

    it('陣列索引應該轉換成 [index] 格式', () => {
        const abnormalKeys = {
            'items': [
                {},
                {
                    'name': AbnormalType.MISS_KEY
                }
            ]
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey } = abormalManager;

        expect(missingKey[0].key).toBe('items[1].name');
    });

    it('陣列中的多個索引應該正確處理', () => {
        const abnormalKeys = {
            'items': [
                {},
                {},
                {
                    'name': AbnormalType.MISS_KEY
                }
            ]
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey } = abormalManager;

        expect(missingKey[0].key).toBe('items[2].name');
    });

    it('巢狀陣列的路徑應該正確轉換', () => {
        const abnormalKeys = {
            'categories': [
                [
                    {
                        'name': AbnormalType.EXTRA_KEY
                    }
                ]
            ]
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { extraKey } = abormalManager;

        expect(extraKey[0].key).toBe('categories[0][0].name');
    });

    it('陣列中多個元素的異常應該分別記錄', () => {
        const abnormalKeys = {
            'items': [
                { 'field1': AbnormalType.MISS_KEY },
                { 'field2': AbnormalType.MISS_KEY },
                { 'field3': AbnormalType.MISS_KEY }
            ]
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey } = abormalManager;

        expect(missingKey).toHaveLength(3);
        expect(missingKey[0].key).toBe('items[0].field1');
        expect(missingKey[1].key).toBe('items[1].field2');
        expect(missingKey[2].key).toBe('items[2].field3');
    });

    it('混合路徑（物件與陣列）應該正確轉換', () => {
        const abnormalKeys = {
            'data': {
                'items': [
                    {
                        'nested': {
                            'value': AbnormalType.EXTRA_KEY
                        }
                    }
                ]
            }
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { extraKey } = abormalManager;

        expect(extraKey[0].key).toBe('data.items[0].nested.value');
    });

    it('陣列與巢狀物件混合的複雜路徑應該正確轉換', () => {
        const abnormalKeys = {
            'app': {
                'categories': [
                    {
                        'items': [
                            {
                                'name': AbnormalType.MISS_KEY
                            }
                        ]
                    }
                ]
            }
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey } = abormalManager;

        expect(missingKey[0].key).toBe('app.categories[0].items[0].name');
    });
});

