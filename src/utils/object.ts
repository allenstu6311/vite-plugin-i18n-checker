import { walkTree } from "../checker/diff";

export function deepAssign(target: Record<string, any>, source: Record<string, any>): void {
    walkTree({
        node: source,
        handler: {
            handleArray: ({ node, pathStack, indexStack, recurse }) => {
                recurse()
            },
            handleObject: ({ node, pathStack, indexStack, recurse }) => {
                recurse()
            },
            handlePrimitive: ({ node, pathStack, indexStack }) => {
                const key = pathStack[pathStack.length - 1];
                target[key] = node;
            },
        },
        pathStack: [],
        indexStack: [],
    })
}