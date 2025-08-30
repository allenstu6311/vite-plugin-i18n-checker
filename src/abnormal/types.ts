import { Override } from "@/types";
import { BaseParseHandlerParamCommon } from "../checker/type";

export enum AbnormalType {
    MISS_KEY = 'missKey',
    DIFF_TYPE = 'diffType',
    DIFF_ARRAY_LENGTH = 'diffArrayLength',
    EXTRA_KEY = 'extraKey',
}

export type BaseParseHandlerParamCommonOptionalKey = Override<BaseParseHandlerParamCommon, { key?: string }>;