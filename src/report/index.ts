import chalk from "chalk";
import Table from 'cli-table3';
import { AbnormalKeyTypes, AbnormalState } from "../abnormal/processor/type";
import { success } from "../utils";
import { isEmptyArray } from "../utils/is";
import { ReportConfig, ReportType } from "./types";

function getColor(type: ReportType = 'error') {
    switch (type) {
        case 'warning': return 'yellow';
        case 'error': return 'red';
        case 'success': return 'green';
        case 'info': return 'cyan';
    }
}
function printReport({
    abnormalKeys,
    type,
    maxLength = 10,
}: {
    abnormalKeys: AbnormalKeyTypes[],
    type?: ReportType,
    maxLength?: number,
}) {
    const color = getColor(type);
    const table = new Table({
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
            , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
            , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
            , 'right': '║', 'right-mid': '╢', 'middle': '│'
        },
        style: {
            border: [color]
        }
    });

    table.push([
        'file', 'key', 'remark'
    ]);
    // abnormalKeys.forEach(item => {
    //     table.push(
    //         [item.filePaths, item.key, item.desc]
    //     );
    // });
    abnormalKeys.slice(0, maxLength).forEach(item => {
        table.push(
            [item.filePaths, item.key, item.desc]
        );
    });
    if (abnormalKeys.length > maxLength) {
        table.push([`... ${abnormalKeys.length - maxLength} more`]);
    }
    console.log(chalk[color](table.toString()));
    console.log();
}

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

    for (const { items, label, color, type } of reportConfigs) {
        if (!isEmptyArray(items)) {
            console.log();
            console.log(color(label));
            printReport({
                abnormalKeys: items,
                type
            });
            // 清空陣列避免重複打印
            items.length = 0;
            if (type === 'error') hasError = true;
            if (type === 'warning') hasWarning = true;
        }
    }
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

export function progressBar(current: number, total: number) {
    const percent = current / total;
    const barLength = 20;
    const filled = Math.round(percent * barLength);
    const bar = '█'.repeat(filled) + '-'.repeat(barLength - filled);

    process.stdout.write(`\r[${bar}] ${(percent * 100).toFixed(1)}% (${current}/${total})`);
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
