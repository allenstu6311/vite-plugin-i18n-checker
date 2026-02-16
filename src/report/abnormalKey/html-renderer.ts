import { resolve } from "path";
import { AbnormalKeyTypes } from "../../abnormal/processor/type";
import { writeFileEnsureDir } from "../../helpers";
import { FileGroup, HTMLReportSection } from "./types";

// CSS 樣式常量
const CSS_STYLES = `
  /* ========== CSS Variables ========== */
  :root {
    /* Colors */
    --bg-primary: #f6f8fa;
    --bg-card: #ffffff;
    --border: #d0d7de;
    --border-light: #e5e7eb;
    --text-primary: #24292f;
    --text-secondary: #57606a;

    /* Status Colors */
    --error: #dc2626;
    --error-bg: #fef2f2;
    --warning: #f59e0b;
    --warning-bg: #fffbeb;
    --info: #3b82f6;
    --info-bg: #eff6ff;

    /* Spacing */
    --radius: 8px;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-hover: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  /* ========== Base Styles ========== */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: 24px;
    line-height: 1.6;
  }

  /* ========== Header ========== */
  .header {
    max-width: 1200px;
    margin: 0 auto 24px;
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .subtitle {
    color: var(--text-secondary);
    font-size: 14px;
  }

  /* ========== Container ========== */
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ========== Section (First Level) ========== */
  .section {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 16px;
    box-shadow: var(--shadow);
    transition: box-shadow 0.2s;
  }

  .section:hover {
    box-shadow: var(--shadow-hover);
  }

  .section > summary {
    padding: 16px 20px;
    cursor: pointer;
    list-style: none;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    font-size: 16px;
    border-radius: var(--radius);
    transition: background 0.2s;
  }

  .section > summary:hover {
    background: var(--bg-primary);
  }

  .section > summary::-webkit-details-marker {
    display: none;
  }

  /* Status Badge */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .badge.error {
    background: var(--error-bg);
    color: var(--error);
  }

  .badge.warning {
    background: var(--warning-bg);
    color: var(--warning);
  }

  .badge.info {
    background: var(--info-bg);
    color: var(--info);
  }

  /* Chevron Icon */
  .section > summary::before {
    content: '▶';
    font-size: 12px;
    color: var(--text-secondary);
    transition: transform 0.2s;
  }

  .section[open] > summary::before {
    transform: rotate(90deg);
  }

  /* ========== File Group (Second Level) ========== */
  .section-content {
    padding: 0 20px 16px;
  }

  .file-group {
    border: 1px solid var(--border-light);
    border-radius: 6px;
    margin-bottom: 12px;
    background: #fafbfc;
  }

  .file-group:last-child {
    margin-bottom: 0;
  }

  .file-group > summary {
    padding: 12px 16px;
    cursor: pointer;
    list-style: none;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .file-group > summary:hover {
    background: #f0f1f2;
  }

  .file-group > summary::-webkit-details-marker {
    display: none;
  }

  .file-group > summary::before {
    content: '▶';
    font-size: 10px;
    color: var(--text-secondary);
    transition: transform 0.2s;
  }

  .file-group[open] > summary::before {
    transform: rotate(90deg);
  }

  .file-name {
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    color: var(--text-primary);
  }

  .count {
    margin-left: auto;
    color: var(--text-secondary);
    font-size: 13px;
  }

  /* ========== Table ========== */
  .table-container {
    padding: 12px 16px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    background: white;
    border-radius: 6px;
    overflow: hidden;
  }

  thead {
    background: #f6f8fa;
  }

  th {
    padding: 10px 12px;
    text-align: left;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 2px solid var(--border);
  }

  td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border-light);
  }

  tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background: #f9fafb;
  }

  .key-cell {
    font-family: ui-monospace, SFMono-Regular, monospace;
    color: #0969da;
    font-size: 13px;
  }

  /* ========== Pagination ========== */
  .pagination {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .pagination button {
    padding: 6px 12px;
    border: 1px solid var(--border);
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
    color: var(--text-primary);
  }

  .pagination button:hover {
    background: var(--bg-primary);
    border-color: var(--text-secondary);
  }

  .pagination button.active {
    background: var(--info);
    color: white;
    border-color: var(--info);
  }
`;

// 按文件路徑分組
function groupByFile(items: AbnormalKeyTypes[]): FileGroup[] {
  const groupMap = new Map<string, AbnormalKeyTypes[]>();

  items.forEach(item => {
    const filePath = item.filePaths;
    if (!groupMap.has(filePath)) {
      groupMap.set(filePath, []);
    }
    groupMap.get(filePath)!.push(item);
  });

  return Array.from(groupMap.entries()).map(([filePath, items]) => ({
    filePath,
    items
  }));
}

// 獲取當前時間字串
function getCurrentTimestamp(): string {
  const now = new Date();
  return now.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

// 渲染完整的 HTML 報告
function renderKeyCheckHtmlReport(sections: HTMLReportSection[]) {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>i18n Checker Report</title>
  <style>${CSS_STYLES}</style>
</head>
<body>
  <div class="header">
    <h1>📋 i18n Checker Report</h1>
    <p class="subtitle">Generated: ${getCurrentTimestamp()}</p>
  </div>

  <div class="container">
    ${sections.map((section, index) => renderSection(section, index)).join('')}
  </div>

  <script>
    // 分頁功能初始化
    document.addEventListener('DOMContentLoaded', function() {
      const pageButtons = document.querySelectorAll('.page-btn');

      // 初始化：隱藏所有非第一頁的行
      document.querySelectorAll('table[id^="table-"]').forEach(function(table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(function(row) {
          const page = parseInt(row.getAttribute('data-page'));
          row.style.display = page === 1 ? '' : 'none';
        });
      });

      // 綁定分頁按鈕點擊事件
      pageButtons.forEach(function(button) {
        button.addEventListener('click', function() {
          const tableId = this.getAttribute('data-table');
          const page = parseInt(this.getAttribute('data-page'));
          const table = document.getElementById(tableId);

          // 顯示/隱藏對應頁的行
          const rows = table.querySelectorAll('tbody tr');
          rows.forEach(function(row) {
            const rowPage = parseInt(row.getAttribute('data-page'));
            row.style.display = rowPage === page ? '' : 'none';
          });

          // 更新按鈕狀態
          const buttons = table.parentElement.querySelectorAll('.page-btn');
          buttons.forEach(function(btn) {
            btn.classList.remove('active');
          });
          this.classList.add('active');
        });
      });
    });
  </script>
</body>
</html>`;
}

// 渲染單個 Section（第一層折疊）
function renderSection(section: HTMLReportSection, sectionIndex: number): string {
  const fileGroups = groupByFile(section.items);
  const totalCount = section.items.length;

  return `
  <details class="section" open>
    <summary>
      <span class="badge ${section.type}">${section.type.toUpperCase()}</span>
      ${section.label}
      <span class="count">${totalCount} ${totalCount === 1 ? 'issue' : 'issues'}</span>
    </summary>

    <div class="section-content">
      ${fileGroups.map((group, index) => {
        const groupIndex = sectionIndex * 1000 + index; // 確保每個表格有唯一 ID
        return renderFileGroup(group, groupIndex);
      }).join('')}
    </div>
  </details>`;
}

// 渲染單個文件組（第二層折疊）
function renderFileGroup(fileGroup: FileGroup, groupIndex: number): string {
  const count = fileGroup.items.length;
  const ITEMS_PER_PAGE = 20;
  const needsPagination = count > ITEMS_PER_PAGE;
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
  const tableId = `table-${groupIndex}`;

  // 渲染分頁按鈕
  const renderPagination = () => {
    if (!needsPagination) return '';

    const buttons = Array.from({ length: totalPages }, (_, i) => {
      const page = i + 1;
      return `<button class="page-btn ${page === 1 ? 'active' : ''}" data-table="${tableId}" data-page="${page}">${page}</button>`;
    }).join('');

    return `<div class="pagination">${buttons}</div>`;
  };

  return `
  <details class="file-group">
    <summary>
      <span class="file-name">${fileGroup.filePath}</span>
      <span class="count">${count} ${count === 1 ? 'issue' : 'issues'}</span>
    </summary>

    <div class="table-container">
      <table id="${tableId}">
        <thead>
          <tr>
            <th>File</th>
            <th>Key</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          ${fileGroup.items.map((item, index) => {
            const pageNumber = Math.floor(index / ITEMS_PER_PAGE) + 1;
            return renderRow(item, pageNumber);
          }).join('')}
        </tbody>
      </table>
      ${renderPagination()}
    </div>
  </details>`;
}

// 渲染表格行
function renderRow(item: AbnormalKeyTypes, pageNumber: number = 1): string {
  return `
  <tr data-page="${pageNumber}">
    <td>${item.filePaths}</td>
    <td class="key-cell">${item.key ?? ''}</td>
    <td>${item.desc ?? ''}</td>
  </tr>`;
}

// 寫入 HTML 報告
export async function writeAbnormalKeyHtmlReport(htmlSections: HTMLReportSection[], reportDir: string) {
  const html = renderKeyCheckHtmlReport(htmlSections);
  const url = resolve(reportDir, 'index.html');
  await writeFileEnsureDir(url, html);
}
