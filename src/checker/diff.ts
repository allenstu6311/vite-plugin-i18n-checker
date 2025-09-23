import { isArray, isObject, isPrimitive, isUndefined } from "../utils";
import { classifyAndCollectAbnormalKey } from "../abnormal/detector";
import { WalkTreeHandler } from "./type";
import { getValueByPath } from "../abnormal/detector/collect";

export function walkTree({
    node,
    handler,
    pathStack,
    indexStack,
}: {
    node: Record<string, any>,
    handler: WalkTreeHandler,
    pathStack: (string | number)[],
    indexStack: number[],
}) {
    const { handleArray, handleObject, handlePrimitive } = handler;
    Object.keys(node).forEach(key => {
        const nodeValue = node[key];

        if (isArray<Record<string, any>>(nodeValue)) {
            handleArray({
                node: nodeValue,
                pathStack: [...pathStack, key],
                indexStack,
                recurse: () => {
                    nodeValue.forEach((item: Record<string, any>, index: number) => {
                        // 原始資料型別不必再比對
                        if (isPrimitive(item)) return;
                        indexStack.push(index);
                        walkTree({
                            node: nodeValue[index],
                            handler,
                            pathStack: [...pathStack, key, index],
                            indexStack,
                        })
                        indexStack.pop();
                    })
                }
            })
        } else if (isObject(nodeValue)) {
            // console.log('nodeValue', nodeValue)
            handleObject({
                node: nodeValue,
                pathStack: [...pathStack, key],
                indexStack,
                recurse: () => {
                    walkTree({
                        node: nodeValue,
                        handler,
                        pathStack: [...pathStack, key],
                        indexStack,
                    })
                }
            })
        } else {
            handlePrimitive({
                node: nodeValue,
                pathStack: [...pathStack, key],
                indexStack,
            })
        }
    })
}

export function diff({
    source,
    target,
}: {
    source: Record<string, any>,
    target: Record<string, any>,
}) {
    const abnormalKeys: Record<string, any> = {};

    walkTree({
        node: source,
        handler: {
            handleArray: ({ node,  pathStack, indexStack, recurse }) => {
                const targetVal = getValueByPath(target, pathStack);
                const shouldContinue = classifyAndCollectAbnormalKey({ source: node, target: targetVal,  pathStack, indexStack }, abnormalKeys, source)
                if (shouldContinue) recurse()
            },
            handleObject: ({ node,  pathStack, indexStack, recurse }) => {
                const targetVal = getValueByPath(target, pathStack);
                const shouldContinue = classifyAndCollectAbnormalKey({ source: node, target: targetVal,  pathStack, indexStack }, abnormalKeys, source)
                if (shouldContinue) recurse()
            },
            handlePrimitive: ({ node,  pathStack, indexStack }) => {
                const targetVal = getValueByPath(target, pathStack); 
                classifyAndCollectAbnormalKey({ source: node, target: targetVal, pathStack, indexStack }, abnormalKeys, source)
            },
        },
        pathStack: [],
        indexStack: [],
    })

    // 捕捉EXTRA_KEY
    walkTree({
        node: target,
        handler: {
            handleArray: ({ node,  pathStack, indexStack, recurse }) => {
                const sourceVal = getValueByPath(source, pathStack); 
                const shouldContinue = classifyAndCollectAbnormalKey({ source: sourceVal, target: node, pathStack, indexStack }, abnormalKeys, target)
                if (shouldContinue) recurse()
            },
            handleObject: ({ node, pathStack, indexStack, recurse }) => {
                const sourceVal = getValueByPath(source, pathStack); 
                const shouldContinue = classifyAndCollectAbnormalKey({ source: sourceVal, target: node, pathStack, indexStack }, abnormalKeys, target)
                if (shouldContinue) recurse()
            },
            handlePrimitive: ({ node, pathStack, indexStack }) => {
                const sourceVal = getValueByPath(source, pathStack); 
                classifyAndCollectAbnormalKey({ source: sourceVal, target: node, pathStack, indexStack }, abnormalKeys, target)
            },
        },
        pathStack: [],
        indexStack: [],
    })

    return abnormalKeys
}