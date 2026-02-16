import { classifyAndCollectAbnormalKey } from "../abnormal/detector";
import { getValueByPath } from "../abnormal/detector/collect";
import { isArray, isObject, isPrimitive } from "../utils";
import { CheckPrimitiveKeyPresenceParams, WalkTreeHandler } from "./type";


function processArrayItems(
    items: any[],
    handler: WalkTreeHandler,
    basePath: (string | number)[],
) {
    items.forEach((item, index) => {
        const currentPath = [...basePath, index];

        if (isPrimitive(item)) {
            handler.handlePrimitive({
                parentNode: items,
                node: item,
                pathStack: currentPath,
                key: index,
            });
            return;
        }

        walkTree({
            root: item,
            handler,
            pathStack: currentPath,
        });
    });
}

export function walkTree({
    root,
    handler,
    pathStack,
}: {
    root: Record<string, any>,
    handler: WalkTreeHandler,
    pathStack: (string | number)[],
}) {
    const { handleArray, handleObject, handlePrimitive } = handler;

    // 🟢 若 node 自身是陣列，直接交給 handleArray，避免被 Object.keys() 當物件展開
    if (isArray(root)) {
        const arrayNode = root as any[];
        const key = pathStack.length > 0 ? pathStack[pathStack.length - 1] : 0;

        handleArray({
            parentNode: root,
            node: arrayNode,
            pathStack,
            key,
            recurse: () => processArrayItems(arrayNode, handler, pathStack),
        });
        return;
    }

    // 🧩 否則才跑原本的 Object.keys()
    Object.keys(root).forEach(key => {
        const node = root[key];

        if (isArray(node)) {
            handleArray({
                parentNode: root,
                node,
                pathStack: [...pathStack, key],
                key,
                recurse: () => processArrayItems(node, handler, [...pathStack, key]),
            });
        } else if (isObject(node)) {
            handleObject({
                parentNode: root,
                node,
                pathStack: [...pathStack, key],
                key,
                recurse: () => {
                    walkTree({
                        root: node,
                        handler,
                        pathStack: [...pathStack, key],
                    });
                }
            });
        } else {
            handlePrimitive({
                parentNode: root,
                node,
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
    const parentSource = getValueByPath<Record<string, any>>(source, pathStack.slice(0, -1));
    const parentTarget = getValueByPath<Record<string, any>>(target, pathStack.slice(0, -1));

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
        root: source,
        handler: {
            handleArray: ({ node, pathStack, key, recurse }) => {
                const targetVal = getValueByPath<Record<string, any>>(target, pathStack);
                classifyAndCollectAbnormalKey({ source: node, target: targetVal, pathStack, key }, abnormalKeys, source, recurse);
            },
            handleObject: ({ node, pathStack, key, recurse }) => {
                const targetVal = getValueByPath<Record<string, any>>(target, pathStack);
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
        root: target,
        handler: {
            handleArray: ({ node, pathStack, key, recurse }) => {
                const sourceVal = getValueByPath<Record<string, any>>(source, pathStack);
                classifyAndCollectAbnormalKey({ source: sourceVal, target: node, pathStack, key }, abnormalKeys, target, recurse);
            },
            handleObject: ({ node, pathStack, key, recurse }) => {
                const sourceVal = getValueByPath<Record<string, any>>(source, pathStack);
                classifyAndCollectAbnormalKey({ source: sourceVal, target: node, pathStack, key }, abnormalKeys, target, recurse);
            },
            handlePrimitive: ({ pathStack, key }) => checkPrimitiveKeyPresence({ source, target, pathStack, key, abnormalKeys }),
        },
        pathStack: [],
    });
    return abnormalKeys;
}