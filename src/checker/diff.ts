import { isArray, isObject, isPrimitive, isUndefined } from "../utils";
import { checkAndCollectAbnormalKey } from "../abnormal/detector";
import { AbnormalType } from "../abnormal/types";
import { BaseParseHandler, BaseParseParam } from "./type";

export function baseParse({
    source,
    target,
    handler,
    pathStack,
    indexStack,
}: BaseParseParam) {
    const { handleArray, handleObject, handlePrimitive } = handler;
    Object.keys(source).forEach(key => {
        const sourceValue = source[key];
        const targetValue = target[key];
        const targetHasKey = !isUndefined(targetValue);

        if (isArray(sourceValue) && targetHasKey) {
            handleArray({
                source: sourceValue,
                target: targetValue,
                key,
                pathStack: [...pathStack, key],
                indexStack,
                recurse: () => {
                    sourceValue.forEach((item: Record<string, any>, index: number) => {
                        // 原始資料型別不必再比對
                        if (isPrimitive(item)) return;
                        indexStack.push(index);
                        baseParse({
                            source: sourceValue[index],
                            target: targetValue[index],
                            handler,
                            pathStack: [...pathStack, key],
                            indexStack,
                        })
                        indexStack.pop();
                    })
                }
            })
        } else if (isObject(sourceValue) && targetHasKey) {
            handleObject({
                source: sourceValue,
                target: targetValue,
                key,
                pathStack: [...pathStack, key],
                indexStack,
                recurse: () => {
                    baseParse({
                        source: sourceValue,
                        target: targetValue,
                        handler,
                        pathStack: [...pathStack, key],
                        indexStack,
                    })
                }
            })
        } else {
            handlePrimitive({
                source,
                target,
                key,
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
    const template = JSON.parse(JSON.stringify(source));
    const targetTemplate = JSON.parse(JSON.stringify(target));

    baseParse({
        source,
        target,
        handler: {
            handleArray: ({ source, target, pathStack, indexStack, recurse }) => {
                // console.log('source', source)
                // console.log('target', target)
                const shouldContinue = checkAndCollectAbnormalKey({ source, target, pathStack, indexStack }, abnormalKeys, template)
                if (shouldContinue) recurse()
            },
            handleObject: ({ source, target, key, pathStack, indexStack, recurse }) => {
                const shouldContinue = checkAndCollectAbnormalKey({ source, target, pathStack, indexStack }, abnormalKeys, template)
                if (shouldContinue) recurse()
            },
            handlePrimitive: ({ source, target, key, pathStack, indexStack }) => {
                // console.log('source', source)
                // console.log('target', target)
                checkAndCollectAbnormalKey({ source, target, key, pathStack, indexStack }, abnormalKeys, template)
            },
        },
        pathStack: [],
        indexStack: [],
    })

    // 捕捉EXTRA_KEY
    baseParse({
        source: target,
        target: source,
        handler: {
            handleArray: ({ source, target, pathStack, indexStack, recurse }) => {
                const shouldContinue = checkAndCollectAbnormalKey({ source, target, pathStack, indexStack }, abnormalKeys, template)
                if (shouldContinue) recurse()
            },
            handleObject: ({ source, target, pathStack, indexStack, recurse }) => {
                const shouldContinue = checkAndCollectAbnormalKey({ source, target, pathStack, indexStack }, abnormalKeys, template)
                if (shouldContinue) recurse()
            },
            handlePrimitive: ({ source, target, key, pathStack, indexStack }) => {
                /**
                 * soruce會變成比對的目標
                 * target會變成比對的來源
                 */
                checkAndCollectAbnormalKey({ source: target, target: source, key, pathStack, indexStack }, abnormalKeys, targetTemplate)
            },
        },
        pathStack: [],
        indexStack: [],
    })

    return abnormalKeys
}