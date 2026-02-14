import { handleError } from "../errorHandling";
import { ConfigCheckResult } from "../errorHandling/schemas/config";

/**
 * 驗證 custom rules 的格式（只檢查 shape，不檢查行為正確性）
 */
export function validateCustomRules(rules: unknown): void {
    if (!Array.isArray(rules)) {
        handleError(ConfigCheckResult.RULES_INVALID_TYPE, typeof rules);
    }

    (rules as any[]).forEach((rule, index) => {
        const abnormalType = rule?.abnormalType;
        const check = rule?.check;
        const msg = rule?.msg;

        if (typeof abnormalType !== 'string') {
            handleError(ConfigCheckResult.RULE_INVALID_ITEM, index, 'abnormalType', 'string', typeof abnormalType);
        }
        if (typeof check !== 'function') {
            handleError(ConfigCheckResult.RULE_INVALID_ITEM, index, 'check', 'function', typeof check);
        }
        if (msg != null && typeof msg !== 'string') {
            handleError(ConfigCheckResult.RULE_INVALID_ITEM, index, 'msg', 'string', typeof msg);
        }
    });
}


