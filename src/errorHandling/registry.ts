import { ConfigCheckResult } from './schemas/config';
import { FileCheckResult } from './schemas/file';
import { TsParserCheckResult } from './schemas/parser';
import { RuntimeCheckResult } from './schemas/runtime';

const ERROR_PREFIX = '[Vite-I18n-Checker]';

const withPrefix = <T extends Record<string, (...args: any[]) => string>>(
    prefix: string,
    group: T
) => Object.fromEntries(
    Object.entries(group).map(([code, fn]) => [
        code,
        (...args: Parameters<typeof fn>) => `${ERROR_PREFIX}${prefix}${fn(...args)}`,
    ])
) as { [K in keyof T]: (...args: Parameters<T[K]>) => string };

const fileErrors = {
    [FileCheckResult.NOT_EXIST]: (filePath: string) => `File not found: ${filePath}`,
    [FileCheckResult.UNSUPPORTED_LANG]: (lang: string) => `Unsupported language: ${lang}`,
    [FileCheckResult.UNSUPPORTED_FILE_TYPE]: (fileType: string) => `Unsupported file type: ${fileType}`,
};

const configErrors = {
    [ConfigCheckResult.REQUIRED]: (key: string) => `Required field not filled: ${key}`,
    [ConfigCheckResult.NOT_INITIALIZED]: () => `Not initialized`,
    [ConfigCheckResult.LOCALE_RULES_PATTERN_EMPTY]: () => `Pattern cannot be empty`,
    [ConfigCheckResult.LOCALE_RULES_PATTERN_INVALID_CHARS]: (pattern: string) =>
        `Pattern "${pattern}" contains unsupported characters. Only allowed: letters, numbers, underscore(_), hyphen(-), dot(.), slash(/), asterisk(*)`,
    [ConfigCheckResult.LOCALE_RULES_PATTERN_UNSUPPORTED_GLOB]: (pattern: string, unsupportedChar: string) =>
        `Pattern "${pattern}" contains unsupported glob syntax "${unsupportedChar}". Only * and ** wildcards are supported`,
    [ConfigCheckResult.LOCALE_RULES_PATTERN_INVALID_DOUBLE_STAR]: (pattern: string) =>
        `Pattern "${pattern}" has incorrect ** usage. ** must be a separate path segment, e.g., **/folder/** or folder/**`,
    [ConfigCheckResult.LOCALE_RULES_PATTERN_PURE_WILDCARD]: (pattern: string) =>
        `Pattern "${pattern}" must contain at least one fixed text (non-wildcard character). For example: **/locale/** instead of **/*/**`,
    [ConfigCheckResult.CUSTOM_RULE_NOT_DEFINED]: (type: string) => `Custom rule not defined: ${type}`,
};

const runtimeErrors = {
    [RuntimeCheckResult.CHECK_FAILED]: () => `i18n check failed. See report above for details.`,
};

const tsErrors = {
    [TsParserCheckResult.INCORRECT_EXPORT_DEFAULT]: () => `export default incorrect`,
    [TsParserCheckResult.SPREAD_NOT_IDENTIFIER]: () => `SpreadElement variable is not an Identifier`,
    [TsParserCheckResult.SPREAD_VARIABLE_NOT_FOUND]: (variable: string) =>
        `SpreadElement variable not found: ${variable}`,
    [TsParserCheckResult.UNSUPPORTED_KEY_TYPE]: (type: string) =>
        `Unsupported key type: ${type}`,
    [TsParserCheckResult.UNSUPPORTED_VALUE_TYPE]: (key: string, valueType: string) =>
        `${key} Unsupported value type: ${valueType} this key will not be added to the final i18n list`,
    [TsParserCheckResult.UNSUPPORTED_ARRAY_ELEMENT]: () => `Unsupported array element`,
    [TsParserCheckResult.UNSUPPORTED_OBJECT_PROPERTY]: () => `Unsupported object property`,
    [TsParserCheckResult.REAPET_KEY]: (key: string) => `Repeat key: ${key}`,
    [TsParserCheckResult.REAPET_VARIABLE_NAME]: (variable: string) => `Repeat variable name: ${variable}`,
};

export const errorRegistry = {
    ...withPrefix('[FILE_ERRORS] ', fileErrors),
    ...withPrefix('[CONFIG_ERRORS] ', configErrors),
    ...withPrefix('[RUNTIME_ERRORS] ', runtimeErrors),
    ...withPrefix('[TS_PARSER_ERRORS] ', tsErrors),
};
