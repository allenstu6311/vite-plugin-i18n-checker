import { AbnormalType, BaseParseHandlerParamCommonOptionalKey } from "../types";
import { classifyAbnormalType } from "./classify";
import { collectAbnormalKeys } from "./collect";


export const checkAndCollectAbnormalKey = (ctx: BaseParseHandlerParamCommonOptionalKey, abnormalKeys: Record<string, any>, template: Record<string, any>) => {
    const abnormalType = classifyAbnormalType(ctx)
    if (abnormalType) {
        const { pathStack, indexStack } = ctx
        collectAbnormalKeys({
            abnormalKeys,
            abnormalType,
            pathStack,
            indexStack,
            source: template,
        })
        return false
    }
    return true
}