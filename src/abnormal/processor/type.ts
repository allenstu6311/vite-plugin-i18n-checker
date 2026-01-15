import { ABNORMAL_CONFIG } from "../config";

type AbnormalKeyTypes = {
    filePaths: string,
    key?: string,
    desc?: string
}

// 狀態容器類型
type AbnormalState = {
    [K in (typeof ABNORMAL_CONFIG)[number]['stateKey']]: AbnormalKeyTypes[];
};

export type {
    AbnormalKeyTypes,
    AbnormalState
};

