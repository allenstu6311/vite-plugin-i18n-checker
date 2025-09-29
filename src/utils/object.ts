import { walkTree } from "../checker/diff";

export function deepAssign(target: Record<string, any>, source: Record<string, any>): void {
    const assignNode = (node: unknown, pathStack: (string | number)[], recurse?: () => void) => {
        const key = pathStack[pathStack.length - 1];
        if (!target[key]) {
            target[key] = node;
        } else if (recurse) {
            recurse();
        }
    };

    walkTree({
        node: source,
        handler: {
            handleArray: ({ node, pathStack, recurse }) => assignNode(node, pathStack, recurse),
            handleObject: ({ node, pathStack, recurse }) => assignNode(node, pathStack, recurse),
            handlePrimitive: ({ node, pathStack }) => assignNode(node, pathStack),
        },
        pathStack: [],
        indexStack: [],
    });
}