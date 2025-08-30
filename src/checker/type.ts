import { Override } from "@/types"

export type BaseParseParam = {
    source: Record<string, any>,
    target: Record<string, any>,
    handler: BaseParseHandler,
    pathStack: string[],
    indexStack: number[],
}

export type BaseParseHandlerParamCommon = {
    source: Record<string, any>,
    target: Record<string, any>,
    key: string,
    pathStack: string[],
    indexStack: number[],
}

export type BaseParseHandlerParamWithRecurse = Override<BaseParseHandlerParamCommon, {
    recurse: () => void
    // key?: string
}>

export type BaseParseHandler = {
    handleArray: (param: BaseParseHandlerParamWithRecurse) => void;
    handleObject: (param: BaseParseHandlerParamWithRecurse) => void;
    handlePrimitive: (param: BaseParseHandlerParamCommon) => void;
}
