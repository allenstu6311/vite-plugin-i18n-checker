import { AbnormalKeyTypes } from "../abnormal/processor/type";

type ReportType = 'warning' | 'error';

type ReportConfig = {
    key: AbnormalKeyTypes[],
    label: string,
    color: (text: string) => string,
    type: ReportType
}


export type {
    ReportType,
    ReportConfig
}