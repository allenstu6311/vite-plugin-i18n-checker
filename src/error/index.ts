import { Lang } from "../types";
import { FileCheckResult, FileErrorParams } from "./schemas/file";
import { configErrorMap, fileErrorMap, tsParserErrors } from "./catalogs";
import { TsParserCheckResult, TsParserErrorParams } from "./schemas/parser/ts";
import { ConfigCheckResult, ConfigErrorParams } from "./schemas/config";
import { getGlobalConfig } from "../config";

export function createErrorMessageManager() {
    const { outputLang } = getGlobalConfig();
    let currentLang: Lang = outputLang;
    
    const FILE_ERRORS = '[FILE_ERRORS]'
    const TS_PARSER_ERRORS = '[TS_PARSER_ERRORS]';
    const CONFIG_ERRORS = '[CONFIG_ERRORS]';

    return {
        setLang(lang: Lang) {
            currentLang = lang ? lang : currentLang
        },
        getFileMessage<T extends FileCheckResult>(
            code: T,
            ...args: Parameters<FileErrorParams[T]>): string {
            return FILE_ERRORS + (fileErrorMap[currentLang][code] as (...args: any[]) => string)(...args) || '';
        },

        getTsParserMessage<T extends TsParserCheckResult>(
            code: T,
            ...args: Parameters<TsParserErrorParams[T]>): string {
            return TS_PARSER_ERRORS + (tsParserErrors[currentLang][code] as (...args: any[]) => string)(...args) || '';
        },
        getConfigMessage<T extends ConfigCheckResult>(
            code: T,
            ...args: Parameters<ConfigErrorParams[T]>): string {
            return CONFIG_ERRORS + (configErrorMap[currentLang][code] as (...args: any[]) => string)(...args) || '';
        },
    }
}
const { setLang, getFileMessage, getTsParserMessage, getConfigMessage } = createErrorMessageManager()
export const setErrorMsgLang = setLang
export const getFileErrorMessage = getFileMessage
export const getTsParserErrorMessage = getTsParserMessage
export const getConfigErrorMessage = getConfigMessage