import pc from 'picocolors';
import { ABNORMAL_CONFIG } from "../../abnormal/config";
import { AbnormalState } from "../../abnormal/processor/type";
import { isEmptyArray } from "../../utils/is";
import { getColor } from "../../utils/logger";
import { printCliKeyCheckReport } from "./cli-renderer";
import { writeAbnormalKeyHtmlReport } from "./html-renderer";
import { HTMLReportSection, ReportConfig } from "./types";

export async function outputKeyCheckReport(abnormalManager: AbnormalState, reportDir: string) {
  const reportConfigs: ReportConfig[] = ABNORMAL_CONFIG.map(config => ({
    items: abnormalManager[config.stateKey],
    label: config.label,
    color: (text: string) => pc.bold(getColor(config.color)(text)),
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
