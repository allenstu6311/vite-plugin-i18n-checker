import { Override } from "../types";
import { BaseParseHandlerParamCommon } from "../checker/type";

export enum AbnormalType {
    MISS_KEY = 'missKey',
    DIFF_STRUCTURE_TYPE = 'diffStructureType', // 陣列與物件結構類型不匹配
    DIFF_ARRAY_LENGTH = 'diffArrayLength',
    EXTRA_KEY = 'extraKey',
}

export type BaseParseHandlerParamCommonOptionalKey = Override<BaseParseHandlerParamCommon, { key?: string }>;