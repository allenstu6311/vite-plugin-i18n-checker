import { AbnormalType, CollectAbnormalKeysParam } from "../types";
import { isDiffArrayLength, isDiffType } from "../../utils/is";

type Rule = {
    abnormalType: AbnormalType;
    check: (ctx: CollectAbnormalKeysParam) => boolean;
};

const rules: Rule[] = [
    { abnormalType: AbnormalType.MISS_KEY, check: ({ target }) => !target},
    { abnormalType: AbnormalType.EXTRA_KEY, check: ({ source }) => !source },
    { abnormalType: AbnormalType.DIFF_ARRAY_LENGTH, check: ({ source, target }) => isDiffArrayLength(source, target) },
    { abnormalType: AbnormalType.DIFF_STRUCTURE_TYPE, check: ({ source, target }) => isDiffType(source, target) },
];

export const classifyAbnormalType = (ctx: CollectAbnormalKeysParam): AbnormalType | null => {
    for (const rule of rules) {
        if (rule.check(ctx)) return rule.abnormalType;
    }
    return null;
};
