import chalk from "chalk";
import Table from 'cli-table3';
import { AbnormalKeyTypes } from "../../abnormal/processor/type";
import { ReportType } from "../types";

function getColor(type: ReportType = 'error') {
  switch (type) {
    case 'warning': return 'yellow';
    case 'error': return 'red';
    case 'success': return 'green';
    case 'info': return 'cyan';
  }
}

export function printCliKeyCheckReport({
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
