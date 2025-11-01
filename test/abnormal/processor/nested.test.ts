import { createAbormalManager, processAbnormalKeys } from '@/abnormal/processor';
import { AbnormalState } from '@/abnormal/processor/type';
import { AbnormalType } from '@/abnormal/types';
import { beforeEach, describe, expect, it } from 'vitest';

/**
 * processAbnormalKeys 巢狀結構路徑轉換測試
 * 測試巢狀物件的路徑是否能正確轉換成點號連接的字串路徑
 */
describe('processAbnormalKeys 巢狀結構路徑轉換測試', () => {
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

    it('深層巢狀結構的路徑應該正確轉換', () => {
        const abnormalKeys = {
            'level1': {
                'level2': {
                    'level3': {
                        'level4': {
                            'deepField': AbnormalType.MISS_KEY
                        }
                    }
                }
            }
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey } = abormalManager;

        expect(missingKey[0].key).toBe('level1.level2.level3.level4.deepField');
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

    it('不同巢狀層級的異常應該分別記錄', () => {
        const abnormalKeys = {
            'top': AbnormalType.MISS_KEY,
            'middle': {
                'nested': AbnormalType.MISS_KEY,
                'deep': {
                    'deepest': AbnormalType.MISS_KEY
                }
            }
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey } = abormalManager;

        expect(missingKey).toHaveLength(3);
        expect(missingKey.map(item => item.key)).toContain('top');
        expect(missingKey.map(item => item.key)).toContain('middle.nested');
        expect(missingKey.map(item => item.key)).toContain('middle.deep.deepest');
    });

    it('巢狀物件中的混合異常類型應該正確分類', () => {
        const abnormalKeys = {
            'container': {
                'missing': AbnormalType.MISS_KEY,
                'extra': AbnormalType.EXTRA_KEY,
                'invalid': AbnormalType.DIFF_STRUCTURE_TYPE
            }
        };

        processAbnormalKeys('test.ts', abnormalKeys, abormalManager);
        const { missingKey, extraKey, invalidKey } = abormalManager;

        expect(missingKey[0].key).toBe('container.missing');
        expect(extraKey[0].key).toBe('container.extra');
        expect(invalidKey[0].key).toBe('container.invalid');
    });
});

