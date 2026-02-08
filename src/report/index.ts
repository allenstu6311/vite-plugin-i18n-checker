import { success } from "../utils";

// 統一導出異常 key 報告
export { outputKeyCheckReport } from './abnormalKey';
// 導出差異報告
export { outputDiffReport } from './preview';
// 導出 AI 錯誤報告
export { printAiErrorSummary } from './aiError';
// 導出報告清理
export { cleanupReports } from './cleanup';

export function showSuccessMessage() {
    console.log();
    success('╔══════════════════════════════════════╗');
    success('║              i18n Check              ║');
    success('║                                      ║');
    success('║  Status: ✅ All checks passed        ║');
    success('║  Files:  All translation files OK    ║');
    success('╚══════════════════════════════════════╝');
    console.log();
}

