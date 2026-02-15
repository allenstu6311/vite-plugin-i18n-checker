import chalk from "chalk";
import { ABNORMAL_CONFIG } from "../../abnormal/config";
import { AbnormalState } from "../../abnormal/processor/type";
import { isEmptyArray } from "../../utils/is";
import { printCliKeyCheckReport } from "./cli-renderer";
import { writeAbnormalKeyHtmlReport } from "./html-renderer";
import { HTMLReportSection, ReportConfig } from "./types";

export async function outputKeyCheckReport(abormalManager: AbnormalState, reportDir: string) {
  const reportConfigs: ReportConfig[] = ABNORMAL_CONFIG.map(config => ({
    items: abormalManager[config.stateKey],
    label: config.label,
    color: chalk[config.color].bold,
    type: config.level,
  }));

  const htmlSections: HTMLReportSection[] = [];

  for (const { items, label, color, type } of reportConfigs) {
    if (!isEmptyArray(items)) {
      // 打印報告
      console.log();
      console.log(color(label));
      printCliKeyCheckReport({
        abnormalKeys: items,
        type
      });

      // 收集 htmlSections
      htmlSections.push({
        label,
        type,
        items: [...items]
      });
    }
  }

  if (htmlSections.length > 0) {
    await writeAbnormalKeyHtmlReport(htmlSections, reportDir);
  }
}
