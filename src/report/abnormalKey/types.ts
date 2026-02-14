import { AbnormalKeyTypes } from "../../abnormal/processor/type";
import { ReportType } from "../types";

type ReportConfig = {
    items: AbnormalKeyTypes[],
    label: string,
    color: (text: string) => string,
    type: ReportType
}

type HTMLReportSection = {
    label: string;
    type: ReportType;
    items: AbnormalKeyTypes[];
}

export type {
    ReportConfig,
    HTMLReportSection
};