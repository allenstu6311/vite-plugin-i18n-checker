import { AbnormalType, CollectAbnormalKeysParam } from "../types";
import { isArray, isDiffArrayLength, isDiffType, isMissingKey, isObject, isString } from "../../utils/is";
import { getGlobalConfig } from "../../config";

export type Rule = {
    abnormalType: AbnormalType | string;
    check: (ctx: CollectAbnormalKeysParam) => boolean;
};

function isSubtreeMissing(source: unknown, target: unknown): boolean {
    return (isObject(source) || isArray(source)) && target == null;
}

function isPropertyMissing(target: unknown, key?: string): boolean {
    return !!key && isMissingKey(target, key);
}

const basicRules: Rule[] = [
    {
        abnormalType: AbnormalType.MISS_KEY,
        check: ({ source, target, key }) => isSubtreeMissing(source, target) || isPropertyMissing(target, key)
    },
    {
        abnormalType: AbnormalType.EXTRA_KEY,
        check: ({ source, target, key }) => isSubtreeMissing(target, source) || isPropertyMissing(source, key)
    },
    { abnormalType: AbnormalType.DIFF_ARRAY_LENGTH, check: ({ source, target }) => isDiffArrayLength(source, target) },
    { abnormalType: AbnormalType.DIFF_STRUCTURE_TYPE, check: ({ source, target, key }) => key ? isDiffType(source[key], target[key]) : isDiffType(source, target) },
];

export const classifyAbnormalType = (ctx: CollectAbnormalKeysParam): AbnormalType | string => {
    const { rules } = getGlobalConfig();

    const allRules = [...basicRules, ...rules];

    for (const rule of allRules) {
        if (rule.check(ctx)) return rule.abnormalType;
    }
    return '';
};
