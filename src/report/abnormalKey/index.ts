import chalk from "chalk";
import Table from 'cli-table3';
import { resolve } from "path";
import { ABNORMAL_CONFIG } from "../../abnormal/config";
import { AbnormalKeyTypes, AbnormalState } from "../../abnormal/processor/type";
import { writeFileEnsureDir } from "../../helpers";
import { isEmptyArray } from "../../utils/is";
import { ReportConfig, ReportType } from "../types";
import { getColor, startSpinner, stopSpinner } from "./helper";

function renderKeyCheckHtmlReport(sections: any[]) {
  return `
  <!doctype html>
  <html>
  <head>
  <meta charset="utf-8" />
  <title>i18n Checker Report</title>
  <style>
    body { font-family: system-ui; padding: 16px; }
    details {
      margin-bottom: 24px;
    }
    summary {
      list-style: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      user-select: none;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary::before {
      content: '▶';
      display: inline-block;
      margin-right: 8px;
      transition: transform 0.2s;
      font-size: 0.8em;
    }
    details[open] summary::before {
      transform: rotate(90deg);
    }
    summary h2 {
      margin: 0;
      display: inline;
    }
    h2.error { color: #dc2626; }
    h2.warning { color: #d97706; }
    h2.info { color: #2563eb; }
    table { 
        border-collapse: 
        collapse; width: 100%; 
        margin-bottom: 24px; 
        table-layout: fixed;
    }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
  </style>
  </head>
  <body>
  ${sections.map(renderSection).join('')}
  </body>
  </html>
  `;
}

function renderSection(section: any) {
  return `
  <details>
    <summary>
      <h2 class="${section.type}">
        ${section.label} (${section.items.length})
      </h2>
    </summary>
    <table>
      <thead>
        <tr>
          <th>File</th>
          <th>Key</th>
          <th>Remark</th>
        </tr>
      </thead>
      <tbody>
        ${section.items.map(renderRow).join('')}
      </tbody>
    </table>
  </details>
  `;
}

function renderRow(item: AbnormalKeyTypes) {
  return `
  <tr>
    <td>${item.filePaths}</td>
    <td>${item.key}</td>
    <td>${item.desc ?? ''}</td>
  </tr>
  `;
}

function printCliKeyCheckReport({
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

async function writeAbnormalKeyHtmlReport(htmlSections: any[], reportDir: string) {
  const html = renderKeyCheckHtmlReport(htmlSections);
  const url = resolve(reportDir + '/key-check', 'index.html');
  await writeFileEnsureDir(url, html);
}

export async function generateReport(abormalManager: AbnormalState, reportDir: string) {
  let hasError = false;
  let hasWarning = false;

  const reportConfigs: ReportConfig[] = ABNORMAL_CONFIG.map(config => ({
    items: abormalManager[config.stateKey],
    label: config.label,
    color: chalk[config.color].bold,
    type: config.level,
  }));

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
  if (hasError || hasWarning) {
    await writeAbnormalKeyHtmlReport(htmlSections, reportDir);
  }
  return { hasError, hasWarning };
}

export { startSpinner, stopSpinner };

