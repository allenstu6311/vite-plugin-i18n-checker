import chalk from "chalk";
import { missingKey, extraKey, invalidKey, missFile } from "../abnormal/processor";
import { AbnormalKeyTypes } from "../abnormal/processor/type";
import Table from 'cli-table3';
import { isEmptyArray } from "../utils/is";
import { ReportConfig, ReportType } from "./types";

function printReport({
    abnormalKeys,
    type,
}: {
    abnormalKeys: AbnormalKeyTypes[],
    type?: ReportType
}) {
    const color = type === 'warning' ? 'yellow' : 'red';
    var table = new Table({
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
    ])
    abnormalKeys.forEach(item => {
        table.push(
            [item.filePaths, item.key, item.desc]
        )
    })
    console.log(chalk[color](table.toString()));
    console.log();
}

export function generateReport() {
    console.log();
    let hasError = false;

    const reportConfigs: ReportConfig[] = [
        { items: missingKey, label: 'Missing keys', color: chalk.red.bold, type: 'error' },
        { items: invalidKey, label: 'Invalid keys', color: chalk.red.bold, type: 'error' },
        { items: extraKey, label: 'Extra keys', color: chalk.yellow.bold, type: 'warning' },
        { items: missFile, label: 'Missing files', color: chalk.red.bold, type: 'error' },
    ];

    for (const { items, label, color, type } of reportConfigs) {
        if (!isEmptyArray(items)) {
            console.log(color(label));
            printReport({
                abnormalKeys: items,
                type,
            });
            // 清空陣列避免重複打印
            items.length = 0;
            if (type === 'error') hasError = true;
        }
    }
    return { hasError };
}