import { isArray, isObject, isPrimitive } from "./is";

/**
 * 深層合併：將 source 的 key 補入 target（不覆蓋已存在的 key）。
 *
 * 修復說明：
 * 1. 使用 hasOwnProperty 取代 falsy 判斷，避免 false / 0 / '' / null 被錯誤覆蓋。
 * 2. 遞迴時傳入正確的巢狀 target，修正舊版在父層設值的錯誤。
 */
export function deepAssign(target: Record<string, any>, source: Record<string, any>): void {
    if (!isObject(source) || !isObject(target)) return;

    for (const key of Object.keys(source)) {
        const sourceVal = source[key];

        if (!Object.prototype.hasOwnProperty.call(target, key)) {
            // key 不存在於 target → 直接複製（含整棵子樹）
            target[key] = sourceVal;
        } else if (isObject(sourceVal) && isObject(target[key])) {
            // 雙方皆為純物件 → 遞迴 merge
            deepAssign(target[key], sourceVal);
        }
        // 其餘情況（target 已有 primitive / array / 型別不符）→ 保留 target 原值，不覆蓋
    }
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