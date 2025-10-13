export enum AbnormalType {
    /**
     * 缺失 key
     */
    MISS_KEY = 'missKey',
    /**
     * 結構類型不匹配
     */
    DIFF_STRUCTURE_TYPE = 'diffStructureType',
    /**
     * 陣列長度不匹配
     */
    DIFF_ARRAY_LENGTH = 'diffArrayLength',
    /**
     * 額外 key
     */
    EXTRA_KEY = 'extraKey',
    /**
     * 缺失檔案
     */
    MISS_FILE = 'missFile',
}

export type CollectAbnormalKeysParam = {
    source: Record<string, any>,
    target: Record<string, any>,
    pathStack: (string | number)[],
    indexStack: number[],
    key: string,
    isPrimitive?: boolean,
}

