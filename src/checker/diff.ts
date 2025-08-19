import { isArray, isObject, isPrimitive, isUndefined } from "../utils/is";
import { collectAbnormalKeys } from "./abnormal";
import { AbnormalType, BaseParseHandler, BaseParseParam } from "./type";
import { isDiffArrayLength, isDiffType } from "./utils";

function baseParse({
    source,
    target,
    handler,
    prev,
    indexBox,
}: BaseParseParam) {
    const { handleArray, handleObject, handlePrimitive } = handler;
    Object.keys(source).forEach(key => {

        const sourceValue = source[key];
        const targetValue = target[key];

        if (isArray(sourceValue) && !isUndefined(targetValue)) {
            handleArray({
                source: sourceValue,
                target: targetValue,
                key,
                prev,
                indexBox,
                recurse: () => {
                    sourceValue.forEach((item: Record<string, any>, index: number) => {
                        // 原始資料型別不必再比對
                        if (isPrimitive(item)) return;
                        indexBox.push(index);
                        baseParse({
                            source: sourceValue,
                            target: targetValue[index],
                            handler,
                            prev: [...prev, key],
                            indexBox,
                        })
                        indexBox.pop();
                    })
                }
            })
        } else if (isObject(sourceValue) && !isUndefined(targetValue)) {
            handleObject({
                source: sourceValue,
                target: targetValue,
                key,
                prev,
                indexBox,
                recurse: () => {
                    baseParse({
                        source: sourceValue,
                        target: targetValue,
                        handler,
                        prev: [...prev, key],
                        indexBox,
                    })
                }
            })
        } else {
            handlePrimitive({
                source,
                target,
                key,
                prev: [...prev, key],
                indexBox,
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
    const indexBox: number[] = [];  // 保存每一层的索引
    const prev: string[] = [];  // 保存前面的key
    const abnormalKeys: Record<string, any> = {};

    baseParse({
        source,
        target,
        handler: {
            handleArray: ({ source, target, key, prev, indexBox, recurse }) => {
                if (isDiffArrayLength(source, target)) {
                    console.log('isDiffArrayLength')
                } else if (isDiffType(source, target)) {
                    console.log('handleArray isDiffType', source, target)
                } else {
                    console.log('source', source)
                    recurse()
                }
                // console.log(key)
            },
            handleObject: ({ source, target, key, prev, indexBox, recurse }) => {
                if (isDiffType(source, target)) {
                    console.log('handleObject isDiffType', source, target)
                } else {
                    recurse()
                }
            },
            handlePrimitive: ({ source, target, key, prev, indexBox }) => {
                // console.log('prev',prev)
                // console.log('handlePrimitive',source)
                // console.log('target',target)
                // console.log('source',source)

                if(!target || !target.hasOwnProperty(key)){
                    console.log('target is undefined',key)
                    collectAbnormalKeys({
                        abnormalKeys,
                        abnormalType: AbnormalType.MISS_KEY,
                        prev,
                        indexBox,
                        source,
                    })
                }
            },
        },
        prev,
        indexBox,
    })

    return abnormalKeys
}