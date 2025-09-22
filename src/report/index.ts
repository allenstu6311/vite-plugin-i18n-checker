import chalk from "chalk";
import { missingKey, extraKey, invaildKey, missFile } from "../abnormal/processor";
import { AbnormalKeyTypes } from "../abnormal/processor/type";
import Table from 'cli-table3';
import { isEmptyArray } from "../utils/is";

function printReport({
    abnormalKeys,
    type,
}: {
    abnormalKeys: AbnormalKeyTypes[],
    type?: 'warning' | 'error'
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
    if (!isEmptyArray(missingKey)) {
        console.log(chalk.red.bold('Missing keys'));
        printReport({
            abnormalKeys: missingKey,
            type: 'error'
        })
    }
    if (!isEmptyArray(invaildKey)) {
        console.log(chalk.red.bold('Invalid keys'));
        printReport({
            abnormalKeys: invaildKey,
            type: 'error'
        })
    }
    if (!isEmptyArray(extraKey)) {
        console.log(chalk.yellow.bold('Extra keys'));
        printReport({
            abnormalKeys: extraKey,
            type: 'warning'
        })
    }

    if(!isEmptyArray(missFile)) {
        console.log(chalk.red.bold('Missing files'));
        printReport({
            abnormalKeys: missFile,
            type: 'error'
        })
    }
}