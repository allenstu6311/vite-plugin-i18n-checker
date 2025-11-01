type AbnormalKeyTypes = {
    filePaths: string,
    key?: string,
    desc?: string
}

// 狀態容器類型
type AbnormalState = {
    missingKey: AbnormalKeyTypes[];
    extraKey: AbnormalKeyTypes[];
    invalidKey: AbnormalKeyTypes[];
    missFile: AbnormalKeyTypes[];
};

export type {
    AbnormalKeyTypes,
    AbnormalState
};

