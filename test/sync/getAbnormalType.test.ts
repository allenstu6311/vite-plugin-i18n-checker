import { AbnormalType } from '@/abnormal/types';
import { getAbnormalType } from '@/sync';
import { describe, expect, it } from 'vitest';

/**
 * getAbnormalType 測試
 * 測試異常類型轉換邏輯
 */
describe('getAbnormalType 測試', () => {
    it('當 sync 為 false 時，應該返回原始類型', () => {
        expect(getAbnormalType(false, AbnormalType.MISS_KEY)).toBe(AbnormalType.MISS_KEY);
        expect(getAbnormalType(false, AbnormalType.EXTRA_KEY)).toBe(AbnormalType.EXTRA_KEY);
    });

    it('當 sync 為 true 時，應該轉換 MISS_KEY 為 ADD_KEY', () => {
        expect(getAbnormalType(true, AbnormalType.MISS_KEY)).toBe(AbnormalType.ADD_KEY);
    });

    it('當 sync 為 true 時，應該轉換 EXTRA_KEY 為 DELETE_KEY', () => {
        expect(getAbnormalType(true, AbnormalType.EXTRA_KEY)).toBe(AbnormalType.DELETE_KEY);
    });

    it('當 sync 為物件且 autoFill 為 true 時，應該轉換 MISS_KEY 為 ADD_KEY', () => {
        expect(getAbnormalType({ autoFill: true, autoDelete: false }, AbnormalType.MISS_KEY))
            .toBe(AbnormalType.ADD_KEY);
    });

    it('當 sync 為物件且 autoDelete 為 true 時，應該轉換 EXTRA_KEY 為 DELETE_KEY', () => {
        expect(getAbnormalType({ autoFill: false, autoDelete: true }, AbnormalType.EXTRA_KEY))
            .toBe(AbnormalType.DELETE_KEY);
    });

    it('當 sync 為物件且 autoFill 為 false 時，不應該轉換 MISS_KEY', () => {
        expect(getAbnormalType({ autoFill: false, autoDelete: true }, AbnormalType.MISS_KEY))
            .toBe(AbnormalType.MISS_KEY);
    });

    it('當 sync 為物件且 autoDelete 為 false 時，不應該轉換 EXTRA_KEY', () => {
        expect(getAbnormalType({ autoFill: true, autoDelete: false }, AbnormalType.EXTRA_KEY))
            .toBe(AbnormalType.EXTRA_KEY);
    });

    it('應該保持其他異常類型不變', () => {
        expect(getAbnormalType(true, AbnormalType.DIFF_STRUCTURE_TYPE))
            .toBe(AbnormalType.DIFF_STRUCTURE_TYPE);
        expect(getAbnormalType(true, AbnormalType.DIFF_ARRAY_LENGTH))
            .toBe(AbnormalType.DIFF_ARRAY_LENGTH);
    });
});

