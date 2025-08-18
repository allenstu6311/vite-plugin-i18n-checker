export type BaseParseParam = {
    source: Record<string, any>,
    target: Record<string, any>,
    handler: BaseParseHandler,
    prev: string[],
    indexBox: number[],
}

export type BaseParseHandlerParamCommon = {
    source: Record<string, any>,
    target: Record<string, any>,
    key: string,
    prev: string[],
    indexBox: number[],
}

export type BaseParseHandlerParamWithRecurse = BaseParseHandlerParamCommon & {
    recurse: () => void
}

export type BaseParseHandler = {
    handleArray: (param: BaseParseHandlerParamWithRecurse) => void;
    handleObject: (param: BaseParseHandlerParamWithRecurse) => void;
    handleVal: (param: BaseParseHandlerParamCommon) => void;
}