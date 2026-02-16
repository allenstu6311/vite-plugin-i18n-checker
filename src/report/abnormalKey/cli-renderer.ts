import Table from 'cli-table3';
import { AbnormalKeyTypes } from "../../abnormal/processor/type";
import { getColor, type ColorName } from "../../utils/logger";
import { ReportType } from "../types";

const reportColorMap: Record<ReportType, ColorName> = {
  warning: 'yellow',
  error: 'red',
  success: 'green',
  info: 'cyan',
};

export function printCliKeyCheckReport({
  abnormalKeys,
  type = 'error',
  maxLength = 10,
}: {
  abnormalKeys: AbnormalKeyTypes[],
  type?: ReportType,
  maxLength?: number,
}) {
  const colorName = reportColorMap[type];
  const table = new Table({
    chars: {
      'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
      , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
      , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
      , 'right': '║', 'right-mid': '╢', 'middle': '│'
    },
    style: {
      border: [colorName]
    }
  });

  table.push([
    'file', 'key', 'remark'
  ]);

  abnormalKeys.slice(0, maxLength).forEach(item => {
    table.push(
      [item.filePaths, item.key, item.desc]
    );
  });

  if (abnormalKeys.length > maxLength) {
    table.push([`... ${abnormalKeys.length - maxLength} more`]);
  }
  console.log(getColor(colorName)(table.toString()));
  console.log();
}
