import { AbnormalType, BaseParseHandlerParamCommonOptionalKey } from "../types";
import { isDiffArrayLength, isMissingKey, isDiffType } from "../../utils/is";

type Rule = {
    abnormalType: AbnormalType;
    check: (ctx: BaseParseHandlerParamCommonOptionalKey) => boolean;
};

const rules: Rule[] = [
    { abnormalType: AbnormalType.MISS_KEY, check: ({ target, key }) => !!key && isMissingKey(target, key!)},
    { abnormalType: AbnormalType.EXTRA_KEY, check: ({ source, key }) => !!key && isMissingKey(source, key!) },
    { abnormalType: AbnormalType.DIFF_ARRAY_LENGTH, check: ({ source, target }) => isDiffArrayLength(source, target) },
    { abnormalType: AbnormalType.DIFF_STRUCTURE_TYPE, check: ({ source, target }) => isDiffType(source, target) },
];

export const classifyAbnormalType = (ctx: BaseParseHandlerParamCommonOptionalKey): AbnormalType | null => {
    for (const rule of rules) {
        if (rule.check(ctx)) return rule.abnormalType;
    }
    return null;
};
