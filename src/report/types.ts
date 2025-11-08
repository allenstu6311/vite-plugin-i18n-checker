import { AbnormalKeyTypes } from "../abnormal/processor/type";

type ReportType = 'warning' | 'error' | 'success' | 'info';

type ReportConfig = {
    items: AbnormalKeyTypes[],
    label: string,
    color: (text: string) => string,
    type: ReportType
}


export type {
    ReportConfig, ReportType
};

