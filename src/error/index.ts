import { Lang } from "@/types";
import { FileCheckResult, FileErrorParams } from "./schemas/file/types";
import { fileErrorMap, tsParserErrors } from "./catalogs";
import { TsParserCheckResult, TsParserErrorParams } from "./schemas/parser/ts/types";
import { ArgsTuple } from "./schemas/shared/types";

export function createErrorMessageManager(defaultLang: Lang = 'zh_CN') {
    let currentLang = defaultLang;

    const FILE_ERRORS = '[FILE_ERRORS]'
    const TS_PARSER_ERRORS = '[TS_PARSER_ERRORS]';

    return {
        setLang(lang: Lang) {
            currentLang = lang
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
    }
}
const { setLang, getFileMessage, getTsParserMessage } = createErrorMessageManager()
export const setCurrentLang = setLang
export const getFileErrorMessage = getFileMessage
export const getTsParserErrorMessage = getTsParserMessage