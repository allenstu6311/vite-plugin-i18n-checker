import { handleError } from "../errorHandling";
import { ConfigCheckResult } from "../errorHandling/schemas/config";
import { FileCheckResult } from "../errorHandling/schemas/file";
import { isValidLocale } from "../helpers/lang";
import { isEmptyObject } from "../utils";

/**
 * 驗證 locale rules 的格式
 */
export function validateLocaleRules(localeRules: Record<string, string>): void {
    if (isEmptyObject(localeRules)) {
        handleError(ConfigCheckResult.REQUIRED, 'localeRules');
    }

    /**
 * 驗證單個 pattern
 */
    function validatePattern(pattern: string): void {
        // 1. 檢查是否為空
        if (!pattern || pattern.trim() === '') {
            handleError(ConfigCheckResult.LOCALE_RULES_PATTERN_EMPTY);
        }

        // 2. 檢查是否只包含允許的字元
        // 允許: a-z A-Z 0-9 _ - . / *
        const validChars = /^[a-zA-Z0-9_.\/*-]+$/;
        if (!validChars.test(pattern)) {
            handleError(ConfigCheckResult.LOCALE_RULES_PATTERN_INVALID_CHARS, pattern);
        }

        // 3. 檢查是否包含不支援的 glob 語法
        const unsupportedGlobs = ['{', '}', '[', ']', '!', '?', '(', ')'];
        for (const char of unsupportedGlobs) {
            if (pattern.includes(char)) {
                handleError(ConfigCheckResult.LOCALE_RULES_PATTERN_UNSUPPORTED_GLOB, pattern, char);
            }
        }

        // 4. 檢查 ** 的使用是否正確
        // ** 必須單獨成為一個 segment（前後都是 / 或在開頭/結尾）
        if (pattern.includes('**')) {
            const invalidDoubleGlob = /\*\*[^/]|[^/]\*\*/;
            if (invalidDoubleGlob.test(pattern)) {
                handleError(ConfigCheckResult.LOCALE_RULES_PATTERN_INVALID_DOUBLE_STAR, pattern);
            }
        }

        // 5. 檢查是否為純通配符（沒有固定文字）
        if (isPureWildcard(pattern)) {
            handleError(ConfigCheckResult.LOCALE_RULES_PATTERN_PURE_WILDCARD, pattern);
        }
    }

    /**
     * 檢查 pattern 是否為純通配符（沒有固定文字）
     */
    function isPureWildcard(pattern: string): boolean {
        // 移除所有通配符和斜線，看是否還有剩餘字元
        const withoutWildcards = pattern.replace(/\*+|\//g, '');
        return withoutWildcards.length === 0;
    }

    for (const [pattern, value] of Object.entries(localeRules)) {
        validatePattern(pattern);
        if (!isValidLocale(value)) {
            handleError(FileCheckResult.UNSUPPORTED_LANG, value);
        }
    }
}

/**
 * 驗證 custom rules 的格式（只檢查 shape，不檢查行為正確性）
 */
export function validateCustomRules(rules: unknown): void {
    if (!Array.isArray(rules)) {
        handleError(ConfigCheckResult.RULES_INVALID_TYPE, typeof rules);
    }

    (rules as any[]).forEach((rule, index) => {
        const abnormalType = rule?.abnormalType;
        const check = rule?.check;
        const msg = rule?.msg;

        if (typeof abnormalType !== 'string') {
            handleError(ConfigCheckResult.RULE_INVALID_ITEM, index, 'abnormalType', 'string', typeof abnormalType);
        }
        if (typeof check !== 'function') {
            handleError(ConfigCheckResult.RULE_INVALID_ITEM, index, 'check', 'function', typeof check);
        }
        if (msg != null && typeof msg !== 'string') {
            handleError(ConfigCheckResult.RULE_INVALID_ITEM, index, 'msg', 'string', typeof msg);
        }
    });
}


