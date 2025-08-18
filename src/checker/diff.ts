import { isArray, isObject, isPrimitive } from "../utils/is";
import { BaseParseHandler, BaseParseParam } from "./type";
import { isDiffArrayLength, isDiffType } from "./utils";

function baseParse({
    source,
    target,
    handler,
    prev,
    indexBox,
}: BaseParseParam) {
    const { handleArray, handleObject, handleVal } = handler;
    // console.log('source',source)
    Object.keys(source).forEach(key => {

        const sourceValue = source[key];
        const targetValue = target[key];

        if (isArray(sourceValue)) {
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
        } else if (isObject(sourceValue)) {
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
            handleVal({
                source: sourceValue,
                target: targetValue,
                key,
                prev,
                indexBox,
            })
        }
    })
}


export function diff({
    source,
    target,
    errorKeys,
}: {
    source: Record<string, any>,
    target: Record<string, any>,
    errorKeys: Record<string, any>,
}) {
    const indexBox: number[] = [];  // 保存每一层的索引
    const prev: string[] = [];  // 保存前面的key

    baseParse({
        source,
        target,
        handler: {
            handleArray: ({ source, target, key, prev, indexBox, recurse }) => {
                if (isDiffArrayLength(source, target)) {
                    console.log('isDiffArrayLength')
                } else if (isDiffType(source, target)) {
                    console.log('isDiffType')
                } else {
                    console.log('source', source)
                    recurse()
                }
                // console.log(key)
            },
            handleObject: ({ source, target, key, prev, indexBox, recurse }) => {
                if (isDiffType(source, target)) {
                    console.log('isDiffType')
                } else {
                    recurse()
                }
            },
            handleVal: ({ source, target, key, prev, indexBox }) => {
                console.log(source)
            },
        },
        prev,
        indexBox,
    })
}