import { AbnormalType, BaseParseHandlerParamCommonOptionalKey } from "../types";
import { isDiffArrayLength, isDiffMissingKey, isDiffType } from "../../checker/utils";

type Rule = {
    abnormalType: AbnormalType;
    check: (ctx: BaseParseHandlerParamCommonOptionalKey) => boolean;
};

const rules: Rule[] = [
    { abnormalType: AbnormalType.MISS_KEY, check: ({ target, key }) => !!key && isDiffMissingKey(target, key!)},
    { abnormalType: AbnormalType.EXTRA_KEY, check: ({ source, key }) => !!key && isDiffMissingKey(source, key!) },
    { abnormalType: AbnormalType.DIFF_ARRAY_LENGTH, check: ({ source, target }) => isDiffArrayLength(source, target) },
    { abnormalType: AbnormalType.DIFF_TYPE, check: ({ source, target }) => isDiffType(source, target) },
];

export const classifyAbnormalType = (ctx: BaseParseHandlerParamCommonOptionalKey): AbnormalType | null => {
    for (const rule of rules) {
        if (rule.check(ctx)) return rule.abnormalType;
    }
    return null;
};
