import { createAbormalManager, processAbnormalKeys } from '@/abnormal/processor';
import { AbnormalState } from '@/abnormal/processor/type';
import { AbnormalType } from '@/abnormal/types';
import { beforeEach, describe, expect, it } from 'vitest';

/**
 * processAbnormalKeys 邊境情況測試
 * 測試空物件、混合異常、複雜路徑等邊境情況
 */
describe('processAbnormalKeys 邊境情況測試', () => {
    let abormalManager: AbnormalState;

    beforeEach(() => {
        abormalManager = createAbormalManager();
    });

    it('空異常物件應該不產生任何記錄', () => {
        processAbnormalKeys('test.ts', {}, abormalManager);
        const { missingKey, extraKey, invalidKey } = abormalManager;

        expect(missingKey).toHaveLength(0);
        expect(extraKey).toHaveLength(0);
        expect(invalidKey).toHaveLength(0);
    });

    it('只有空物件的異常應該不產生任何記錄', () => {
        const abnormalKeys = {
            'empty': {}
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey, extraKey, invalidKey } = abormalManager;

        expect(missingKey).toHaveLength(0);
        expect(extraKey).toHaveLength(0);
        expect(invalidKey).toHaveLength(0);
    });

    it('只有空陣列的異常應該不產生任何記錄', () => {
        const abnormalKeys = {
            'empty': []
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey, extraKey, invalidKey } = abormalManager;

        expect(missingKey).toHaveLength(0);
        expect(extraKey).toHaveLength(0);
        expect(invalidKey).toHaveLength(0);
    });

    it('多種異常類型混合應該正確分類到對應陣列', () => {
        const abnormalKeys = {
            'missingField': AbnormalType.MISS_KEY,
            'extraField': AbnormalType.EXTRA_KEY,
            'invalidField': AbnormalType.DIFF_STRUCTURE_TYPE,
            'nested': {
                'missing': AbnormalType.MISS_KEY,
                'extra': AbnormalType.EXTRA_KEY
            },
            'array': [
                {
                    'itemMissing': AbnormalType.MISS_KEY
                }
            ]
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey, extraKey, invalidKey } = abormalManager;

        expect(missingKey).toHaveLength(3);
        expect(extraKey).toHaveLength(2);
        expect(invalidKey).toHaveLength(1);
    });

    it('真實 i18n 翻譯檔案場景應該正確處理', () => {
        const abnormalKeys = {
            'app': {
                'common': {
                    'delete': AbnormalType.EXTRA_KEY
                },
                'login': {
                    'submit': AbnormalType.MISS_KEY
                },
                'dashboard': {
                    'stats': AbnormalType.DIFF_ARRAY_LENGTH
                }
            }
        };

        processAbnormalKeys('locales/zh_TW.ts', abnormalKeys, abormalManager);
        const { missingKey, extraKey, invalidKey } = abormalManager;

        expect(missingKey).toHaveLength(1);
        expect(missingKey[0].filePaths).toBe('locales/zh_TW.ts');
        expect(missingKey[0].key).toBe('app.login.submit');

        expect(extraKey).toHaveLength(1);
        expect(extraKey[0].key).toBe('app.common.delete');

        expect(invalidKey).toHaveLength(1);
        expect(invalidKey[0].key).toBe('app.dashboard.stats');
    });

    it('大型複雜結構應該正確處理', () => {
        const abnormalKeys = {
            'level1': {
                'level2': {
                    'level3': {
                        'items': [
                            {
                                'level4': {
                                    'field': AbnormalType.MISS_KEY
                                }
                            }
                        ]
                    }
                }
            }
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey } = abormalManager;

        expect(missingKey[0].key).toBe('level1.level2.level3.items[0].level4.field');
    });
});
