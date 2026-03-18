import { AbnormalType } from '@/abnormal/types';
import { diff } from '@/checker/diff';
import { setGlobalConfig } from '@/config';
import { describe, expect, it } from 'vitest';

/**
 * diff ignoreKeys 功能測試
 * 測試 ignoreKeys 是否能正確忽略指定的 key path
 * 注意：path 格式為 a.b0.c（陣列索引直接接在後面，不加 .）
 * 例如：items[1].name → items1.name
 */
describe('diff ignoreKeys 功能測試', () => {

    it('應該忽略巢狀 object path', () => {
        setGlobalConfig({ ignoreKeys: ['user.profile.name'] });

        const source = {
            user: {
                profile: {
                    name: 'test',
                    age: 20
                }
            }
        };
        const target = {
            user: {
                profile: {
                    age: 20
                    // 缺少 name
                }
            }
        };

        const result = diff({ source, target });
        expect(result).toEqual({});
    });

    it('應該忽略陣列索引 path', () => {
        // 注意：formatPathStack 格式是 items1.name（數字直接接在後面，不加 .）
        setGlobalConfig({ ignoreKeys: ['items1.name'] });

        const source = {
            items: [
                { id: 1, name: 'item1' },
                { id: 2, name: 'item2' }
            ]
        };
        const target = {
            items: [
                { id: 1, name: 'item1' },
                { id: 2 } // 缺少 name
            ]
        };

        const result = diff({ source, target });
        expect(result).toEqual({});
    });

    it('glob pattern ** 應該忽略任意層級', () => {
        setGlobalConfig({ ignoreKeys: ['**.theme'] });

        const source = {
            app: {
                settings: {
                    theme: 'dark'
                }
            },
            user: {
                preferences: {
                    theme: 'light'
                }
            }
        };
        const target = {
            app: {
                settings: {
                    // 缺少 theme
                }
            },
            user: {
                preferences: {
                    // 缺少 theme
                }
            }
        };

        const result = diff({ source, target });
        expect(result).toEqual({});
    });

    it('多個 ignoreKeys 應該都生效', () => {
        setGlobalConfig({ ignoreKeys: ['user.email', 'settings.theme'] });

        const source = {
            user: {
                name: 'test',
                email: 'test@example.com'
            },
            settings: {
                language: 'zh',
                theme: 'dark'
            }
        };
        const target = {
            user: {
                name: 'test'
                // 缺少 email
            },
            settings: {
                language: 'zh'
                // 缺少 theme
            }
        };

        const result = diff({ source, target });
        expect(result).toEqual({});
    });

    it('不符合的 ignoreKeys 不應影響正常偵測', () => {
        setGlobalConfig({ ignoreKeys: ['nonexistent.path'] });

        const source = {
            user: {
                name: 'test',
                email: 'test@example.com'
            }
        };
        const target = {
            user: {
                name: 'test'
                // 缺少 email
            }
        };

        const result = diff({ source, target });
        // email 不在 ignoreKeys 中，應該正常檢測到
        expect(result).toEqual({
            user: {
                email: AbnormalType.MISS_KEY
            }
        });
    });

    it('空字串 ignoreKeys 不應該忽略任何 key', () => {
        setGlobalConfig({ ignoreKeys: [''] });

        const source = {
            user: {
                name: 'test',
                email: 'test@example.com'
            },
            settings: {
                theme: 'dark'
            }
        };
        const target = {
            // 全部缺少
        };

        const result = diff({ source, target });
        // 空字串會導致全部被忽略
        expect(result).toEqual({
            user: AbnormalType.MISS_KEY,
            settings: AbnormalType.MISS_KEY
        });
    });

    // ========== RegExp 測試 ==========

    it('RegExp 應該能匹配 path', () => {
        setGlobalConfig({ ignoreKeys: [/user\.email/] });

        const source = {
            user: {
                name: 'test',
                email: 'test@example.com'
            }
        };
        const target = {
            user: {
                name: 'test'
            }
        };

        const result = diff({ source, target });
        expect(result).toEqual({});
    });

    it('RegExp 使用 .* 應該匹配任意層級', () => {
        // 匹配任何以 theme 結尾的 path
        setGlobalConfig({ ignoreKeys: [/.*\.theme$/] });

        const source = {
            app: {
                settings: {
                    theme: 'dark'
                }
            },
            user: {
                preferences: {
                    theme: 'light'
                }
            }
        };
        const target = {
            app: {
                settings: {}
            },
            user: {
                preferences: {}
            }
        };

        const result = diff({ source, target });
        expect(result).toEqual({});
    });

    it('複雜結構：深層巢狀 + 陣列 + 混合 pattern', () => {
        // 混合使用 glob 和 RegExp，部分忽略、部分偵測
        setGlobalConfig({
            ignoreKeys: [
                '**.description',           // glob: 忽略任意層級的 description
                /^pages\d+\.meta/,          // RegExp: 忽略 pages[n].meta 及其子路徑
                'settings.advanced.debug',  // 精確路徑
            ]
        });

        const source = {
            pages: [
                {
                    id: 'home',
                    title: 'Home',
                    description: 'Welcome page',  // 應該被忽略 (**.description)
                    meta: {
                        author: 'Admin',          // 應該被忽略 (pages0.meta.)
                        tags: ['featured']        // 應該被忽略 (pages0.meta.)
                    },
                    content: {
                        hero: {
                            title: 'Hello',
                            description: 'Hero desc'  // 應該被忽略 (**.description)
                        }
                    }
                },
                {
                    id: 'about',
                    title: 'About',
                    description: 'About us',      // 應該被忽略 (**.description)
                    meta: {
                        author: 'Team'            // 應該被忽略 (pages1.meta.)
                    }
                }
            ],
            settings: {
                general: {
                    language: 'zh-TW',
                    description: 'App settings'   // 應該被忽略 (**.description)
                },
                advanced: {
                    debug: true,                  // 應該被忽略 (精確路徑)
                    timeout: 3000                 // 應該被偵測
                }
            },
            footer: {
                copyright: '2024',                // 應該被偵測
                links: [
                    { label: 'Privacy', url: '/privacy' }  // 應該被偵測
                ]
            }
        };

        const target = {
            pages: [
                {
                    id: 'home',
                    title: 'Home',
                    // description 缺少 → 忽略
                    meta: {
                        // author, tags 缺少 → 忽略
                    },
                    content: {
                        hero: {
                            title: 'Hello'
                            // description 缺少 → 忽略
                        }
                    }
                },
                {
                    id: 'about',
                    title: 'About'
                    // description 缺少 → 忽略
                    // meta 整個缺少 → 忽略
                }
            ],
            settings: {
                general: {
                    language: 'zh-TW'
                    // description 缺少 → 忽略
                },
                advanced: {
                    // debug 缺少 → 忽略
                    // timeout 缺少 → 應該偵測到！
                }
            },
            footer: {
                // copyright 缺少 → 應該偵測到！
                links: [
                    { label: 'Privacy' }  // url 缺少 → 應該偵測到！
                ]
            }
        };

        const result = diff({ source, target });

        // 只有未被忽略的 key 應該出現
        expect(result).toEqual({
            settings: {
                advanced: {
                    timeout: AbnormalType.MISS_KEY
                }
            },
            footer: {
                copyright: AbnormalType.MISS_KEY,
                links: [
                    { url: AbnormalType.MISS_KEY }
                ]
            }
        });
    });
});
