import { createAbormalManager, processAbnormalKeys } from '@/abnormal/processor';
import { AbnormalState } from '@/abnormal/processor/type';
import { AbnormalType } from '@/abnormal/types';
import { beforeEach, describe, expect, it } from 'vitest';

/**
 * processAbnormalKeys 基礎路徑轉換測試
 * 放最簡單且最核心的路徑轉換規則：物件點號、陣列索引
 */
describe('processAbnormalKeys 基礎路徑轉換測試', () => {
    let abormalManager: AbnormalState;

    beforeEach(() => {
        abormalManager = createAbormalManager();
    });

    it('兩層巢狀物件的路徑應該用點號連接', () => {
        const abnormalKeys = {
            'user': {
                'email': AbnormalType.MISS_KEY
            }
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey } = abormalManager;

        expect(missingKey[0].key).toBe('user.email');
    });

    it('三層巢狀物件的路徑應該正確轉換', () => {
        const abnormalKeys = {
            'user': {
                'profile': {
                    'email': AbnormalType.MISS_KEY
                }
            }
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey } = abormalManager;

        expect(missingKey[0].key).toBe('user.profile.email');
    });

    it('多個巢狀異常應該分別記錄', () => {
        const abnormalKeys = {
            'settings': {
                'theme': AbnormalType.EXTRA_KEY,
                'language': AbnormalType.EXTRA_KEY
            }
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { extraKey } = abormalManager;

        expect(extraKey).toHaveLength(2);
        expect(extraKey[0].key).toBe('settings.theme');
        expect(extraKey[1].key).toBe('settings.language');
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
});

