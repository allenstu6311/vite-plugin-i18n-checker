import { isArray } from "../../utils/is";
import { AbnormalType, BaseParseHandlerParamCommonOptionalKey } from "./types";
import { isDiffArrayLength, isDiffMissingKey, isDiffType } from "../utils";
import { BaseParseHandlerParamCommon } from "../type";
import { classifyAbnormalType } from "./classify";
import { collectAbnormalKeys } from "./collect";


export const checkAndCollectAbnormalKey = (ctx: BaseParseHandlerParamCommonOptionalKey, abnormalKeys: Record<string, any>, template: Record<string, any>) => {
    const abnormalType = classifyAbnormalType(ctx)
    if (abnormalType) {
        const { source, pathStack, indexStack } = ctx
        // console.log('source', source)
        // console.log('template', template)
        collectAbnormalKeys({
            abnormalKeys,
            abnormalType,
            pathStack,
            indexStack,
            // source,
            source: template,
        })
        return false
    }
    return true
}