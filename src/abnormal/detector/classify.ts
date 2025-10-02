import { AbnormalType, CollectAbnormalKeysParam } from "../types";
import { isArray, isDiffArrayLength, isDiffType, isMissingKey, isObject, isString } from "../../utils/is";

type Rule = {
    abnormalType: AbnormalType;
    check: (ctx: CollectAbnormalKeysParam) => boolean;
};

function isSubtreeMissing(source: unknown, target: unknown): boolean {
    return (isObject(source) || isArray(source)) && target == null;
}

function isPropertyMissing(target: unknown, key?: string): boolean {
    return !!key && isMissingKey(target, key);
}

const rules: Rule[] = [
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

export const classifyAbnormalType = (ctx: CollectAbnormalKeysParam): AbnormalType | null => {
    for (const rule of rules) {
        if (rule.check(ctx)) return rule.abnormalType;
    }
    return null;
};
