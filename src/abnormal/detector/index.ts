import micromatch from "micromatch";
import { getGlobalConfig } from "../../config";
import { CollectAbnormalKeysParam } from "../types";
import { classifyAbnormalType } from "./classify";
import { collectAbnormalKeys } from "./collect";

const isIgnoreKey = (pathStack: (string | number)[]) => {
    const { ignoreKeys } = getGlobalConfig();
    const currentPath = pathStack.join('.');

    return ignoreKeys.some(ignoreKey => {
        // micromatch.isMatch 不接受空字串Pattern
        if (ignoreKey === '') return currentPath === ''
        return micromatch.isMatch(currentPath, ignoreKey)
    })
}

export const classifyAndCollectAbnormalKey = (
    ctx: CollectAbnormalKeysParam,
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    recurse?: () => void,
) => {
    const { pathStack, indexStack } = ctx;
    if (isIgnoreKey(pathStack)) return

    const abnormalType = classifyAbnormalType(ctx)
    if (abnormalType) {
        collectAbnormalKeys({
            abnormalKeys,
            abnormalType,
            pathStack,
            indexStack,
            source: template,
        })
        return;

    }
    if (recurse) recurse()
}