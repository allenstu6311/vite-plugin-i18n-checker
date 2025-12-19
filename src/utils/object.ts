import { walkTree } from "../checker/diff";
import { isArray, isPrimitive } from "./is";

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
        root: source,
        handler: {
            handleArray: ({ node, pathStack, recurse }) => assignNode(node, pathStack, recurse),
            handleObject: ({ node, pathStack, recurse }) => assignNode(node, pathStack, recurse),
            handlePrimitive: ({ node, pathStack }) => assignNode(node, pathStack),
        },
        pathStack: [],
    });
}

export function walkObject(object: Record<string, any>, pathStack: (string | number)[]) {
    let current = object;
    for (let i = 0; i < pathStack.length; i++) {
        if (current == null) return null;
        const key = pathStack[i];
        current = current[key];
    }
    return current;
}

export function hasOwn(object: Record<string, any>, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(object, key);
}

export function sortObject(source: Record<string, any>, target: Record<string, any>): Record<string, any> {
    if (isPrimitive(source) && isPrimitive(target)) return target;
    if (isArray(source) && isArray(target)) {
        return target.map((item: any, index: number) => {
            const sourceItem = source[index];
            if (sourceItem !== undefined) {
                return sortObject(sourceItem, item);
            }
            return item;
        });
    }
    const result: Record<string, any> = {};
    for (const key of Object.keys(source)) {
        if (hasOwn(target, key)) {
            result[key] = sortObject(source[key], target[key]);
        }
    }
    return result;
}