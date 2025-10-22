import { classifyAndCollectAbnormalKey } from "../abnormal/detector";
import { getValueByPath } from "../abnormal/detector/collect";
import { isArray, isObject, isPrimitive } from "../utils";
import { CheckPrimitiveKeyPresenceParams, WalkTreeHandler } from "./type";


export function walkTree({
    node,
    handler,
    pathStack,
}: {
    node: Record<string, any>,
    handler: WalkTreeHandler,
    pathStack: (string | number)[],
}) {
    const { handleArray, handleObject, handlePrimitive } = handler;

    // 🟢 新增：若 node 自身是陣列，直接交給 handleArray，避免被 Object.keys() 當物件展開
    if (isArray(node)) {
        handleArray({
            node,
            pathStack,
            key: pathStack.length ? pathStack[pathStack.length - 1] as string : '0',
            recurse: () => {
                node.forEach((item, index) => {

                    if (isPrimitive(item)) {
                        handlePrimitive({
                            node: item,
                            pathStack: [...pathStack, index],
                            key: pathStack.length ? pathStack[pathStack.length - 1] as string : '0',
                        });
                        return;
                    }
                    walkTree({
                        node: item,
                        handler,
                        pathStack: [...pathStack, index],
                    });
                });
            }
        });
        return;
    }

    // 🧩 否則才跑原本的 Object.keys()
    Object.keys(node).forEach(key => {
        const nodeValue = node[key];

        if (isArray(nodeValue)) {
            handleArray({
                node: nodeValue,
                pathStack: [...pathStack, key],
                key,
                recurse: () => {
                    nodeValue.forEach((item: Record<string, any>, index: number) => {
                        if (isPrimitive(item)) {
                            handlePrimitive({
                                node: item,
                                pathStack: [...pathStack, key, index],
                                key: index.toString(),
                            });
                            return;
                        };
                        walkTree({
                            node: nodeValue[index],
                            handler,
                            pathStack: [...pathStack, key, index],
                        });
                    });
                }
            });
        } else if (isObject(nodeValue)) {
            handleObject({
                node: nodeValue,
                pathStack: [...pathStack, key],
                key,
                recurse: () => {
                    walkTree({
                        node: nodeValue,
                        handler,
                        pathStack: [...pathStack, key],
                    });
                }
            });
        } else {
            handlePrimitive({
                node: nodeValue,
                pathStack: [...pathStack, key],
                key
            });
        }
    });
}


// 在 primitive 層，不比值，只確認父物件有沒有這個 key
function checkPrimitiveKeyPresence({
    source,
    target,
    pathStack,
    key,
    abnormalKeys
}: CheckPrimitiveKeyPresenceParams) {
    const parentSource = getValueByPath(source, pathStack.slice(0, -1));
    const parentTarget = getValueByPath(target, pathStack.slice(0, -1));

    return classifyAndCollectAbnormalKey(
        { source: parentSource, target: parentTarget, pathStack, key, isPrimitive: true },
        abnormalKeys,
        source,
    );
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
            handleArray: ({ node, pathStack, key, recurse }) => {
                const targetVal = getValueByPath(target, pathStack);
                classifyAndCollectAbnormalKey({ source: node, target: targetVal, pathStack, key }, abnormalKeys, source, recurse);
            },
            handleObject: ({ node, pathStack, key, recurse }) => {
                const targetVal = getValueByPath(target, pathStack);
                classifyAndCollectAbnormalKey({ source: node, target: targetVal, pathStack, key }, abnormalKeys, source, recurse);
            },
            handlePrimitive: ({ pathStack, key }) => {
                return checkPrimitiveKeyPresence({ source, target, pathStack, key, abnormalKeys });
            },
        },
        pathStack: [],
    });

    //捕捉EXTRA_KEY
    walkTree({
        node: target,
        handler: {
            handleArray: ({ node, pathStack, key, recurse }) => {
                const sourceVal = getValueByPath(source, pathStack);
                classifyAndCollectAbnormalKey({ source: sourceVal, target: node, pathStack, key }, abnormalKeys, target, recurse);
            },
            handleObject: ({ node, pathStack, key, recurse }) => {
                const sourceVal = getValueByPath(source, pathStack);
                classifyAndCollectAbnormalKey({ source: sourceVal, target: node, pathStack, key }, abnormalKeys, target, recurse);
            },
            handlePrimitive: ({ pathStack, key }) => checkPrimitiveKeyPresence({ source, target, pathStack, key, abnormalKeys }),
        },
        pathStack: [],
    });
    return abnormalKeys;
}