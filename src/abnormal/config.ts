import { AbnormalType } from "./types";

export type AbnormalConfigItem = {
    stateKey: string;
    label: string;
    level: 'warning' | 'error' | 'success' | 'info';
    color: 'red' | 'yellow' | 'green' | 'cyan';
    types: AbnormalType[];
    messageKeys?: Partial<Record<AbnormalType, AbnormalType>>;
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
        messageKeys: {
            [AbnormalType.DIFF_STRUCTURE_TYPE]: AbnormalType.DIFF_STRUCTURE_TYPE,
            [AbnormalType.DIFF_ARRAY_LENGTH]: AbnormalType.DIFF_ARRAY_LENGTH,
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
        messageKeys: {
            [AbnormalType.MISS_FILE]: AbnormalType.MISS_FILE,
        },
    },
    {
        stateKey: 'deleteKeys',
        label: 'Delete keys',
        level: 'info',
        color: 'cyan',
        types: [AbnormalType.DELETE_KEY],
    },
    {
        stateKey: 'addKeys',
        label: 'Add keys',
        level: 'info',
        color: 'green',
        types: [AbnormalType.ADD_KEY],
    },
    {
        stateKey: 'emptyFile',
        label: 'Empty files',
        level: 'error',
        color: 'red',
        types: [AbnormalType.EMPTY_FILE],
        messageKeys: {
            [AbnormalType.EMPTY_FILE]: AbnormalType.EMPTY_FILE,
        },
    },
];
