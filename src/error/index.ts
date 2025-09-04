import { Lang } from "../types";
import { FileCheckResult, FileErrorParams } from "./schemas/file";
import { configErrorMap, fileErrorMap, tsParserErrors } from "./catalogs";
import { TsParserCheckResult, TsParserErrorParams } from "./schemas/parser/ts";
import { ArgsTuple } from "./schemas/shared/types";
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
            ...args: ArgsTuple<T, FileErrorParams>): string {
            return FILE_ERRORS + (fileErrorMap[currentLang][code])(args as any) || '';
        },

        getTsParserMessage<T extends TsParserCheckResult>(
            code: T,
            ...args: ArgsTuple<T, TsParserErrorParams>): string {
            return TS_PARSER_ERRORS + (tsParserErrors[currentLang][code])(args as any) || '';
        },
        getConfigMessage<T extends ConfigCheckResult>(
            code: T,
            ...args: ArgsTuple<T, ConfigErrorParams>): string {
            return CONFIG_ERRORS + (configErrorMap[currentLang][code])(args as any) || '';
        },
    }
}
const { setLang, getFileMessage, getTsParserMessage, getConfigMessage } = createErrorMessageManager()
export const setErrorMsgLang = setLang
export const getFileErrorMessage = getFileMessage
export const getTsParserErrorMessage = getTsParserMessage
export const getConfigErrorMessage = getConfigMessage