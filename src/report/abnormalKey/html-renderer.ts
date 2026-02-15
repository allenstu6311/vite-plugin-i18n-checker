import { resolve } from "path";
import { AbnormalKeyTypes } from "../../abnormal/processor/type";
import { writeFileEnsureDir } from "../../helpers";
import { HTMLReportSection } from "./types";

function renderKeyCheckHtmlReport(sections: HTMLReportSection[]) {
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

function renderSection(section: HTMLReportSection) {
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

export async function writeAbnormalKeyHtmlReport(htmlSections: HTMLReportSection[], reportDir: string) {
  const html = renderKeyCheckHtmlReport(htmlSections);
  const url = resolve(reportDir, 'index.html');
  await writeFileEnsureDir(url, html);
}
