import { baseParse } from "../checker/diff";

export function deepAssign(target: Record<string, any>, source: Record<string, any>): void {
    baseParse({
        source,
        target,
        handler: {
            handleArray: ({ source, target, pathStack, indexStack, recurse }) => {
                recurse()
            },
            handleObject: ({ source, target, pathStack, indexStack, recurse }) => {
                recurse()
            },
            handlePrimitive: ({ source, target, key, pathStack, indexStack }) => {
                target[key] = source[key];
            },
        },
        pathStack: [],
        indexStack: [],
    })
}