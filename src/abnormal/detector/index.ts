import micromatch from "micromatch";
import { getGlobalConfig } from "../../config";
import { CollectAbnormalKeysParam } from "../types";
import { classifyAbnormalType } from "./classify";
import { collectAbnormalKeys } from "./collect";

const isIgnoreKey = (pathStack: (string | number)[]) => {
    const { ignoreKeys } = getGlobalConfig();
    return ignoreKeys.some(ignoreKey => micromatch.isMatch(pathStack.join('.'), ignoreKey))
}

export const classifyAndCollectAbnormalKey = (
    ctx: CollectAbnormalKeysParam,
    abnormalKeys: Record<string, any>,
    template: Record<string, any>
) => {
    const { pathStack, indexStack } = ctx;
    if (isIgnoreKey(pathStack)) return true

    const abnormalType = classifyAbnormalType(ctx)
    if (abnormalType) {
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