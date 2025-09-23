import { CollectAbnormalKeysParam } from "../types";
import { classifyAbnormalType } from "./classify";
import { collectAbnormalKeys } from "./collect";


export const classifyAndCollectAbnormalKey = (
    ctx: CollectAbnormalKeysParam, 
    abnormalKeys: Record<string, any>, 
    template: Record<string, any>
) => {
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