export enum AbnormalType {
    MISS_KEY = 'missKey',
    DIFF_STRUCTURE_TYPE = 'diffStructureType', // 陣列與物件結構類型不匹配
    DIFF_ARRAY_LENGTH = 'diffArrayLength',
    EXTRA_KEY = 'extraKey',
    MISS_FILE = 'missFile',
}

export type CollectAbnormalKeysParam = {
    source: Record<string, any>,
    target: Record<string, any>,
    pathStack: (string | number)[],
    indexStack: number[],
    key?: string,
}

