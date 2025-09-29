import { processAbnormalKeys, missingKey, extraKey, invalidKey, missFile } from '@/abnormal/processor';
import { describe, expect, it, beforeEach } from 'vitest';
import { AbnormalType } from '@/abnormal/types';

describe('processAbnormalKeys 函數測試', () => {
    beforeEach(() => {
        // 清空全域陣列
        missingKey.length = 0;
        extraKey.length = 0;
        invalidKey.length = 0;
        missFile.length = 0;
    });

    describe('基本異常處理測試', () => {
        it('處理缺少鍵值異常', () => {
            const abnormalKeys = {
                'missingField': AbnormalType.MISS_KEY
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(missingKey).toHaveLength(1);
            expect(missingKey[0]).toEqual({
                filePaths: 'test.ts',
                key: 'missingField'
            });
        });

        it('處理額外鍵值異常', () => {
            const abnormalKeys = {
                'extraField': AbnormalType.EXTRA_KEY
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(extraKey).toHaveLength(1);
            expect(extraKey[0]).toEqual({
                filePaths: 'test.ts',
                key: 'extraField'
            });
        });

        it('處理其他類型異常', () => {
            const abnormalKeys = {
                'invalidField': AbnormalType.DIFF_STRUCTURE_TYPE
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(invalidKey).toHaveLength(1);
            expect(invalidKey[0]).toEqual({
                filePaths: 'test.ts',
                key: 'invalidField',
                desc: '結構類型不符（陣列與物件不匹配)'
            });
        });
    });

    describe('巢狀結構異常處理測試', () => {
        it('處理巢狀物件的缺少鍵值', () => {
            const abnormalKeys = {
                'user': {
                    'profile': {
                        'email': AbnormalType.MISS_KEY
                    }
                }
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(missingKey).toHaveLength(1);
            expect(missingKey[0]).toEqual({
                filePaths: 'test.ts',
                key: 'user.profile.email'
            });
        });

        it('處理巢狀物件的額外鍵值', () => {
            const abnormalKeys = {
                'settings': {
                    'theme': AbnormalType.EXTRA_KEY,
                    'language': AbnormalType.EXTRA_KEY
                }
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(extraKey).toHaveLength(2);
            expect(extraKey[0]).toEqual({
                filePaths: 'test.ts',
                key: 'settings.theme'
            });
            expect(extraKey[1]).toEqual({
                filePaths: 'test.ts',
                key: 'settings.language'
            });
        });

        it('處理深層巢狀結構異常', () => {
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

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(missingKey).toHaveLength(1);
            expect(missingKey[0]).toEqual({
                filePaths: 'test.ts',
                key: 'level1.level2.level3.level4.deepField'
            });
        });
    });

    describe('陣列結構異常處理測試', () => {
        it('處理陣列中的物件異常', () => {
            const abnormalKeys = {
                'items': [
                    {},
                    {
                        'name': AbnormalType.MISS_KEY
                    }
                ]
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(missingKey).toHaveLength(1);
            expect(missingKey[0]).toEqual({
                filePaths: 'test.ts',
                key: 'items[1].name'
            });
        });

        it('處理巢狀陣列異常', () => {
            const abnormalKeys = {
                'categories': [
                    [
                        {
                            'name': AbnormalType.EXTRA_KEY
                        }
                    ]
                ]
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(extraKey).toHaveLength(1);
            expect(extraKey[0]).toEqual({
                filePaths: 'test.ts',
                key: 'categories[0][0].name'
            });
        });

        it('處理陣列長度異常', () => {
            const abnormalKeys = {
                'items': AbnormalType.DIFF_ARRAY_LENGTH
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(invalidKey).toHaveLength(1);
            expect(invalidKey[0]).toEqual({
                filePaths: 'test.ts',
                key: 'items',
                desc: '陣列長度不同'
            });
        });
    });

    describe('混合異常處理測試', () => {
        it('處理多種異常類型混合', () => {
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

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(missingKey).toHaveLength(3);
            expect(extraKey).toHaveLength(2);
            expect(invalidKey).toHaveLength(1);

            expect(missingKey[0]).toEqual({
                filePaths: 'test.ts',
                key: 'missingField'
            });
            expect(missingKey[1]).toEqual({
                filePaths: 'test.ts',
                key: 'nested.missing'
            });
            expect(missingKey[2]).toEqual({
                filePaths: 'test.ts',
                key: 'array[0].itemMissing'
            });

            expect(extraKey[0]).toEqual({
                filePaths: 'test.ts',
                key: 'extraField'
            });
            expect(extraKey[1]).toEqual({
                filePaths: 'test.ts',
                key: 'nested.extra'
            });

            expect(invalidKey[0]).toEqual({
                filePaths: 'test.ts',
                key: 'invalidField',
                desc: '結構類型不符（陣列與物件不匹配)'
            });
        });
    });

    describe('路徑處理測試', () => {
        it('處理數字索引路徑', () => {
            const abnormalKeys = {
                'items': [
                    {},
                    {},
                    {
                        'name': AbnormalType.MISS_KEY
                    }
                ]
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(missingKey[0].key).toBe('items[2].name');
        });

        it('處理混合路徑', () => {
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

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(extraKey[0].key).toBe('data.items[0].nested.value');
        });
    });

    describe('多語言支援測試', () => {
        it('使用英文錯誤訊息', () => {
            const abnormalKeys = {
                'invalidField': AbnormalType.DIFF_STRUCTURE_TYPE
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(invalidKey[0].desc).toBe('結構類型不符（陣列與物件不匹配)');
        });

        it('使用中文錯誤訊息', () => {
            const abnormalKeys = {
                'invalidField': AbnormalType.DIFF_ARRAY_LENGTH
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(invalidKey[0].desc).toBe('陣列長度不同');
        });
    });

    describe('邊界情況測試', () => {
        it('處理空異常物件', () => {
            processAbnormalKeys('test.ts', {});

            expect(missingKey).toHaveLength(0);
            expect(extraKey).toHaveLength(0);
            expect(invalidKey).toHaveLength(0);
        });

        it('處理只有空物件的異常', () => {
            const abnormalKeys = {
                'empty': {}
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(missingKey).toHaveLength(0);
            expect(extraKey).toHaveLength(0);
            expect(invalidKey).toHaveLength(0);
        });

        it('處理只有空陣列的異常', () => {
            const abnormalKeys = {
                'empty': []
            };

            processAbnormalKeys('test.ts', abnormalKeys);

            expect(missingKey).toHaveLength(0);
            expect(extraKey).toHaveLength(0);
            expect(invalidKey).toHaveLength(0);
        });
    });
});
