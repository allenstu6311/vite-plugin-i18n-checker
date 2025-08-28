import { isArray, isObject, isPrimitive, isUndefined } from "../utils/is";
import { collectAbnormalKeys } from "./abnormal";
import { AbnormalType, BaseParseHandler, BaseParseParam } from "./type";
import { isDiffArrayLength, isDiffMissingKey, isDiffType } from "./utils";

function baseParse({
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
                            source: sourceValue,
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
    const indexStack: number[] = [];  // 保存每一层的索引
    const pathStack: string[] = [];  // 保存前面的key
    const abnormalKeys: Record<string, any> = {};

    baseParse({
        source,
        target,
        handler: {
            handleArray: ({ source, target, key, pathStack, indexStack, recurse }) => {
                if (isDiffArrayLength(source, target)) {
                    collectAbnormalKeys({
                        abnormalKeys,
                        abnormalType: AbnormalType.DIFF_ARRAY_LENGTH,
                        pathStack,
                        indexStack,
                        source,
                    })
                } else if (isDiffType(source, target)) {
                    collectAbnormalKeys({
                        abnormalKeys,
                        abnormalType: AbnormalType.DIFF_TYPE,
                        pathStack,
                        indexStack,
                        source,
                    })
                } else {
                    recurse()
                }
            },
            handleObject: ({ source, target, key, pathStack, indexStack, recurse }) => {
                if (isDiffType(source, target)) {
                    // console.log('handleObject isDiffType', source, target)
                    collectAbnormalKeys({
                        abnormalKeys,
                        abnormalType: AbnormalType.DIFF_TYPE,
                        pathStack,
                        indexStack,
                        source,
                    })
                } else {
                    recurse()
                }
            },
            handlePrimitive: ({ source, target, key, pathStack, indexStack }) => {
                if(isDiffMissingKey(target, key)){
                    collectAbnormalKeys({
                        abnormalKeys,
                        abnormalType: AbnormalType.MISS_KEY,
                        pathStack,
                        indexStack,
                        source,
                    })
                }
            },
        },
        pathStack,
        indexStack,
    })

    // 捕捉EXTRA_KEY
    baseParse({
        source: target,
        target: source,
        handler: {
            handleArray: ({ source, target, key, pathStack, indexStack, recurse }) => {
                recurse()
            },
            handleObject: ({ source, target, key, pathStack, indexStack, recurse }) => {
                recurse()
            },
            handlePrimitive: ({ source, target, key, pathStack, indexStack }) => {
                if(isDiffMissingKey(target, key)){
                    collectAbnormalKeys({
                        abnormalKeys,
                        abnormalType: AbnormalType.EXTRA_KEY,
                        pathStack,
                        indexStack,
                        source,
                    })
                }
            },
        },
        pathStack,
        indexStack,
    })

    return abnormalKeys
}