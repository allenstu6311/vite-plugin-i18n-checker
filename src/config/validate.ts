import { handleError } from "../errorHandling";
import { ConfigCheckResult } from "../errorHandling/schemas/config";
import { isObject } from "../utils";
import { ReportOptions } from "./types";

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

/**
 * 驗證 report 設定（只檢查 retention 欄位格式）
 */
export function validateReport(report: Partial<ReportOptions>): void {
    if (report == null) return;
    if (!isObject(report)) {
        handleError(ConfigCheckResult.REPORT_INVALID, String(report));
        return;
    }

    const { retention } = report;
    if (retention) {
        const num = Number(retention);
        if (!Number.isFinite(num) || !Number.isInteger(num) || num < 0) {
            handleError(ConfigCheckResult.REPORT_TIME_INVALID, String(retention));
        }
    }
}


