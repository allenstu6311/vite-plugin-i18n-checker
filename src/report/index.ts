import chalk from "chalk";
import { AbnormalKeyTypes, AbnormalState } from "../abnormal/processor/type";
import { success } from "../utils";
import { isEmptyArray } from "../utils/is";
import { printCliKeyCheckReport, writeHtmlReport } from "./keyCheck";
import { ReportConfig, ReportType } from "./types";

export function generateReport(abormalManager: AbnormalState) {
    let hasError = false;
    let hasWarning = false;
    const { missingKey, invalidKey, extraKey, missFile, deleteKeys, addKeys } = abormalManager;

    const reportConfigs: ReportConfig[] = [
        { items: missingKey, label: 'Missing keys', color: chalk.red.bold, type: 'error' },
        { items: invalidKey, label: 'Invalid keys', color: chalk.red.bold, type: 'error' },
        { items: extraKey, label: 'Extra keys', color: chalk.yellow.bold, type: 'warning' },
        { items: missFile, label: 'Missing files', color: chalk.red.bold, type: 'error' },
        { items: deleteKeys, label: 'Delete keys', color: chalk.cyan.bold, type: 'info' },
        { items: addKeys, label: 'Add keys', color: chalk.green.cyan, type: 'info' },
    ];

    const htmlSections: Array<{ label: string; type: ReportType; items: AbnormalKeyTypes[] }> = [];

    for (const { items, label, color, type } of reportConfigs) {
        if (!isEmptyArray(items)) {
            // 打印報告
            console.log();
            console.log(color(label));
            printCliKeyCheckReport({
                abnormalKeys: items,
                type
            });

            // 設置錯誤狀態
            if (type === 'error') hasError = true;
            if (type === 'warning') hasWarning = true;

            // 收集 htmlSections（同時進行）
            htmlSections.push({
                label,
                type,
                items: [...items]
            });
        }
    }

    writeHtmlReport(htmlSections);
    return { hasError, hasWarning };
}

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

let spinner: NodeJS.Timeout | null = null;
export function startSpinner(text = '翻譯中') {
    if (spinner !== null) return;

    const frames = ['◐', '◓', '◑', '◒'];
    let i = 0;

    spinner = setInterval(() => {
        process.stdout.write(`\r${frames[i = ++i % frames.length]} ${text}... `);
    }, 100);
}

export function stopSpinner(text = '完成') {
    if (spinner !== null) {
        clearInterval(spinner);
        spinner = null;
        process.stdout.write(`\r✔ ${text}\n`);
    }
}
