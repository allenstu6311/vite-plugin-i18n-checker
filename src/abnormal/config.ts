import { AbnormalType } from "./types";

export type AbnormalConfigItem = {
    stateKey: string;
    label: string;
    level: 'warning' | 'error' | 'success' | 'info';
    color: 'red' | 'yellow' | 'green' | 'cyan';
    types: AbnormalType[];
    msg?: Partial<Record<AbnormalType, string>>;
};

export const abnormalMessageMap = {
    [AbnormalType.DIFF_STRUCTURE_TYPE]: 'Data type mismatch',
    [AbnormalType.DIFF_ARRAY_LENGTH]: 'Array length mismatch',
    [AbnormalType.MISS_FILE]: 'File not found',
    [AbnormalType.EMPTY_FILE]: 'File is empty',
};

export const ABNORMAL_CONFIG: AbnormalConfigItem[] = [
    {
        stateKey: 'missingKey',
        label: 'Missing keys',
        level: 'error',
        color: 'red',
        types: [AbnormalType.MISS_KEY],
    },
    {
        stateKey: 'invalidKey',
        label: 'Invalid keys',
        level: 'error',
        color: 'red',
        types: [AbnormalType.DIFF_STRUCTURE_TYPE, AbnormalType.DIFF_ARRAY_LENGTH],
        msg: {
            [AbnormalType.DIFF_STRUCTURE_TYPE]: abnormalMessageMap[AbnormalType.DIFF_STRUCTURE_TYPE],
            [AbnormalType.DIFF_ARRAY_LENGTH]: abnormalMessageMap[AbnormalType.DIFF_ARRAY_LENGTH],
        },
    },
    {
        stateKey: 'extraKey',
        label: 'Extra keys',
        level: 'warning',
        color: 'yellow',
        types: [AbnormalType.EXTRA_KEY],
    },
    {
        stateKey: 'missFile',
        label: 'Missing files',
        level: 'error',
        color: 'red',
        types: [AbnormalType.MISS_FILE],
        msg: {
            [AbnormalType.MISS_FILE]: abnormalMessageMap[AbnormalType.MISS_FILE],
        },
    },
    {
        stateKey: 'emptyFile',
        label: 'Empty files',
        level: 'error',
        color: 'red',
        types: [AbnormalType.EMPTY_FILE],
        msg: {
            [AbnormalType.EMPTY_FILE]: abnormalMessageMap[AbnormalType.EMPTY_FILE],
        },
    },
];
