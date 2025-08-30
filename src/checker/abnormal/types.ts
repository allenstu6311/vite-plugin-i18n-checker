import { Override } from "@/types";
import { BaseParseHandlerParamCommon } from "../type";

export enum AbnormalType {
    MISS_KEY = 'missKey',
    DIFF_TYPE = 'diffType',
    DIFF_ARRAY_LENGTH = 'diffArrayLength',
    EXTRA_KEY = 'extraKey',
}

export type BaseParseHandlerParamCommonOptionalKey = Override<BaseParseHandlerParamCommon, { key?: string }>;