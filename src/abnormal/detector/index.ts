import micromatch from "micromatch";
import { getGlobalConfig } from "../../config";
import { isString } from "../../utils/is";
import { CollectAbnormalKeysParam } from "../types";
import { classifyAbnormalType } from "./classify";
import { collectAbnormalKeys } from "./collect";

/**
 * item[0].item[1].item[2] → item.0.item.1.item.2
 */
function formatPathStack(pathStack: (string | number)[]) {
    return pathStack
        .map((key, idx) => {
            const prev = pathStack[idx - 1];
            if (typeof key === 'string') {
                // 前一個是數字 → 要補上 '.'
                if (idx > 0 && typeof prev === 'number') return `.${key}`;
                // 正常物件屬性名稱
                return idx === 0 ? `${key}` : `.${key}`;
            }
            if (typeof key === 'number') return `${key}`;

            return '';
        })
        .join('');
}

const isIgnoreKey = (pathStack: (string | number)[]) => {
    const { ignoreKeys } = getGlobalConfig();
    const keyPathStack  = formatPathStack(pathStack);
    return ignoreKeys.some(ignoreKey => {
        // micromatch.isMatch 不接受空字串Pattern
        if (ignoreKey === '') return false;
        if (isString(ignoreKey)) return micromatch.isMatch(keyPathStack , ignoreKey);
        return ignoreKey.test(keyPathStack );
    });
};

export const classifyAndCollectAbnormalKey = (
    ctx: CollectAbnormalKeysParam,
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    recurse?: () => void,
) => {
    const { pathStack } = ctx;
    if (isIgnoreKey(pathStack)) return;
    const abnormalType = classifyAbnormalType(ctx);

    if (abnormalType) {
        collectAbnormalKeys({
            abnormalKeys,
            abnormalType,
            pathStack,
            source: template,
        });
        return;
    }
    if (recurse) recurse();
};