import { getValueByPath } from '@/abnormal/detector/collect';
import { AbnormalType } from '@/abnormal/types';
import { ParserType } from '@/parser/types';
import { syncKeys } from '@/sync';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanupTempFile, createTempFile, hasKey, parseFileContent } from './helper';

/**
 * 多語系 + 多層物件同步測試
 * 測試多個語系檔案在多層物件結構下的同步功能
 */
describe('多語系 + 多層物件同步測試', () => {
    const tempFiles: string[] = [];
    const locales = ['en_US', 'zh_CN', 'es_ES', 'fr_FR'];

    afterEach(() => {
        tempFiles.forEach(cleanupTempFile);
        tempFiles.length = 0;
    });

    it('應該能在 JS 格式的多語系檔案中添加深層 key（4層物件）', () => {
        // 創建 4 個語系檔案
        const filePaths: string[] = [];

        locales.forEach(locale => {
            const content = `export default {
            app: {
                    core: {
                    config: {
                            theme: '${locale === 'zh_CN' ? '深色' : locale === 'es_ES' ? 'oscuro' : locale === 'fr_FR' ? 'sombre' : 'dark'}',
                            language: '${locale}'
                        }
                    }
                }
            };`;
            const filePath = createTempFile(content, 'js');
            filePaths.push(filePath);
            tempFiles.push(filePath);
        });

        // 定義異常 keys（在 app.core.config 層級添加新 key）
        const abnormalKeys = {
            app: {
                core: {
                    config: {
                        notifications: AbnormalType.ADD_KEY
                    }
                }
            }
        };

        // 模板（包含要添加的 key）
        const template = {
            app: {
                core: {
                    config: {
                        theme: 'dark',
                        language: 'en_US',
                        notifications: true
                    }
                }
            }
        };

        // 對每個語系檔案執行同步
        filePaths.forEach((filePath, index) => {
            const localeTarget = {
                app: {
                    core: {
                        config: {
                            theme: locales[index] === 'zh_CN' ? '深色' : locales[index] === 'es_ES' ? 'oscuro' : locales[index] === 'fr_FR' ? 'sombre' : 'dark',
                            language: locales[index]
                        }
                    }
                }
            };

            syncKeys({
                abnormalKeys,
                template,
                target: localeTarget,
                filePath,
                extensions: ParserType.JS
            });
        });

        // 驗證所有語系檔案都正確添加了 key
        filePaths.forEach((filePath, index) => {
            const result = parseFileContent(filePath, ParserType.JS);
            expect(hasKey(result, ['app', 'core', 'config', 'notifications'])).toBe(true);
            expect(getValueByPath(result, ['app', 'core', 'config', 'notifications'])).toBe(true);
            // 驗證原有內容保留
            expect(hasKey(result, ['app', 'core', 'config', 'theme'])).toBe(true);
            expect(hasKey(result, ['app', 'core', 'config', 'language'])).toBe(true);
        });
    });

    it('應該能在 JS 格式的多語系檔案中刪除深層 key（4層物件）', () => {
        // 創建 4 個語系檔案
        const filePaths: string[] = [];

        locales.forEach(locale => {
            const content = `export default {
                    app: {
                        core: {
                        config: {
                            theme: '${locale === 'zh_CN' ? '深色' : locale === 'es_ES' ? 'oscuro' : locale === 'fr_FR' ? 'sombre' : 'dark'}',
                            language: '${locale}',
                            extra: 'to-be-deleted'
                        }
                        }
                    }
                };`;
            const filePath = createTempFile(content, 'js');
            filePaths.push(filePath);
            tempFiles.push(filePath);
        });

        // 定義異常 keys（在 app.core.config 層級刪除 key）
        const abnormalKeys = {
            app: {
                core: {
                    config: {
                        extra: AbnormalType.DELETE_KEY
                    }
                }
            }
        };

        // 模板（不包含要刪除的 key）
        const template = {
            app: {
                core: {
                    config: {
                        theme: 'dark',
                        language: 'en_US'
                    }
                }
            }
        };

        // 對每個語系檔案執行同步
        filePaths.forEach((filePath, index) => {
            const localeTarget = {
                app: {
                    core: {
                        config: {
                            theme: locales[index] === 'zh_CN' ? '深色' : locales[index] === 'es_ES' ? 'oscuro' : locales[index] === 'fr_FR' ? 'sombre' : 'dark',
                            language: locales[index],
                            extra: 'to-be-deleted'
                        }
                    }
                }
            };

            syncKeys({
                abnormalKeys,
                template,
                target: localeTarget,
                filePath,
                extensions: ParserType.JS
            });
        });

        // 驗證所有語系檔案都正確刪除了 key
        filePaths.forEach((filePath) => {
            const result = parseFileContent(filePath, ParserType.JS);
            expect(hasKey(result, ['app', 'core', 'config', 'extra'])).toBe(false);
            // 驗證原有內容保留
            expect(hasKey(result, ['app', 'core', 'config', 'theme'])).toBe(true);
            expect(hasKey(result, ['app', 'core', 'config', 'language'])).toBe(true);
        });
    });

    it('應該能在 JSON 格式的多語系檔案中添加深層 key（4層物件）', () => {
        // 創建 4 個語系檔案
        const filePaths: string[] = [];

        locales.forEach(locale => {
            const content = JSON.stringify({
                app: {
                    core: {
                        config: {
                            theme: locale === 'zh_CN' ? '深色' : locale === 'es_ES' ? 'oscuro' : locale === 'fr_FR' ? 'sombre' : 'dark',
                            language: locale
                        }
                    }
                }
            }, null, 2);
            const filePath = createTempFile(content, 'json');
            filePaths.push(filePath);
            tempFiles.push(filePath);
        });

        // 定義異常 keys（在 app.core.config 層級添加新 key）
        const abnormalKeys = {
            app: {
                core: {
                    config: {
                        notifications: AbnormalType.ADD_KEY
                    }
                }
            }
        };

        // 模板（包含要添加的 key）
        const template = {
            app: {
                core: {
                    config: {
                        theme: 'dark',
                        language: 'en_US',
                        notifications: true
                    }
                }
            }
        };

        // 對每個語系檔案執行同步
        filePaths.forEach((filePath, index) => {
            const localeTarget = {
                app: {
                    core: {
                        config: {
                            theme: locales[index] === 'zh_CN' ? '深色' : locales[index] === 'es_ES' ? 'oscuro' : locales[index] === 'fr_FR' ? 'sombre' : 'dark',
                            language: locales[index]
                        }
                    }
                }
            };

            syncKeys({
                abnormalKeys,
                template,
                target: localeTarget,
                filePath,
                extensions: ParserType.JSON
            });
        });

        // 驗證所有語系檔案都正確添加了 key
        filePaths.forEach((filePath) => {
            const result = parseFileContent(filePath, ParserType.JSON);
            expect(hasKey(result, ['app', 'core', 'config', 'notifications'])).toBe(true);
            expect(getValueByPath(result, ['app', 'core', 'config', 'notifications'])).toBe(true);
            // 驗證原有內容保留
            expect(hasKey(result, ['app', 'core', 'config', 'theme'])).toBe(true);
            expect(hasKey(result, ['app', 'core', 'config', 'language'])).toBe(true);
        });
    });

    it('應該能在 JSON 格式的多語系檔案中刪除深層 key（4層物件）', () => {
        // 創建 4 個語系檔案
        const filePaths: string[] = [];

        locales.forEach(locale => {
            const content = JSON.stringify({
                app: {
                    core: {
                        config: {
                            theme: locale === 'zh_CN' ? '深色' : locale === 'es_ES' ? 'oscuro' : locale === 'fr_FR' ? 'sombre' : 'dark',
                            language: locale,
                            extra: 'to-be-deleted'
                        }
                    }
                }
            }, null, 2);
            const filePath = createTempFile(content, 'json');
            filePaths.push(filePath);
            tempFiles.push(filePath);
        });

        // 定義異常 keys（在 app.core.config 層級刪除 key）
        const abnormalKeys = {
            app: {
                core: {
                    config: {
                        extra: AbnormalType.DELETE_KEY
                    }
                }
            }
        };

        // 模板（不包含要刪除的 key）
        const template = {
            app: {
                core: {
                    config: {
                        theme: 'dark',
                        language: 'en_US'
                    }
                }
            }
        };

        // 對每個語系檔案執行同步
        filePaths.forEach((filePath, index) => {
            const localeTarget = {
                app: {
                    core: {
                        config: {
                            theme: locales[index] === 'zh_CN' ? '深色' : locales[index] === 'es_ES' ? 'oscuro' : locales[index] === 'fr_FR' ? 'sombre' : 'dark',
                            language: locales[index],
                            extra: 'to-be-deleted'
                        }
                    }
                }
            };

            syncKeys({
                abnormalKeys,
                template,
                target: localeTarget,
                filePath,
                extensions: ParserType.JSON
            });
        });

        // 驗證所有語系檔案都正確刪除了 key
        filePaths.forEach((filePath) => {
            const result = parseFileContent(filePath, ParserType.JSON);
            expect(hasKey(result, ['app', 'core', 'config', 'extra'])).toBe(false);
            // 驗證原有內容保留
            expect(hasKey(result, ['app', 'core', 'config', 'theme'])).toBe(true);
            expect(hasKey(result, ['app', 'core', 'config', 'language'])).toBe(true);
        });
    });
});

