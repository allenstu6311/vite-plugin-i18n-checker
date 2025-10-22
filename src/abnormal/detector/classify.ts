import { getGlobalConfig } from "../../config";
import { isArray, isDiffArrayLength, isDiffType, isMissingKey, isObject } from "../../utils/is";
import { AbnormalType, CollectAbnormalKeysParam } from "../types";

export type Rule = {
    abnormalType: AbnormalType | string;
    check: (ctx: CollectAbnormalKeysParam) => boolean;
};

/**
 * 檢查整個子樹是否缺失。
 * - 當 source 是物件或陣列時，
 * - 且 target 為 null 或 undefined
 * 代表整個子層結構都不存在（例如 target 缺少 "a" 整棵樹）。
 */
function isSubtreeMissing(source: unknown, target: unknown): boolean {
    return (isObject(source) || isArray(source)) && target == null;
}

/**
 * 檢查 primitive 層的 key 是否缺失。
 *
 * 若 source 是原始型別、target 為 null 或 undefined，
 * 會退回上一層物件檢查該 key 是否存在。
 * （因實際缺的是上一層物件的屬性，而非值本身）
 */
function isPropertyMissing(target: unknown, key: string, isPrimitive?: boolean): boolean {
    return !!(isPrimitive && isMissingKey(target, key)) && !isArray(target);
}

const basicRules: Rule[] = [
    {
        abnormalType: AbnormalType.MISS_KEY,
        check: ({ source, target, key, isPrimitive }) => isSubtreeMissing(source, target) || isPropertyMissing(target, key, isPrimitive)
    },
    {
        abnormalType: AbnormalType.EXTRA_KEY,
        check: ({ source, target, key, isPrimitive }) => isSubtreeMissing(target, source) || isPropertyMissing(source, key, isPrimitive)
    },
    { abnormalType: AbnormalType.DIFF_ARRAY_LENGTH, check: ({ source, target, isPrimitive }) => !isPrimitive && isDiffArrayLength(source, target) },
    { abnormalType: AbnormalType.DIFF_STRUCTURE_TYPE, check: ({ source, target }) => isDiffType(source, target) },
];

export const classifyAbnormalType = (ctx: CollectAbnormalKeysParam): AbnormalType | string => {
    const { rules } = getGlobalConfig();

    const allRules = [...basicRules, ...rules];

    for (const rule of allRules) {
        if (rule.check(ctx)) return rule.abnormalType;
    }
    return '';
};
