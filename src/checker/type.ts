export type WorkTreeParam = {
    node: Record<string, any>,
    pathStack: (string | number)[],
    indexStack: number[],
}

type WorkTreeParamWithRecurse = WorkTreeParam & {
    recurse: () => void
}

export type WalkTreeHandler = {
    handleArray: (param: WorkTreeParamWithRecurse) => void;
    handleObject: (param: WorkTreeParamWithRecurse) => void;
    handlePrimitive: (param: WorkTreeParam) => void;
}
