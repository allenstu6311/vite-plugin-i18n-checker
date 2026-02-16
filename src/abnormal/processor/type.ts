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

// 帶方法的管理器類型
type AbnormalManager = AbnormalState & {
    hasError: () => boolean;
    hasWarning: () => boolean;
};

export type {
    AbnormalKeyTypes, AbnormalManager, AbnormalState
};

