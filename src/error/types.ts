import { Lang } from "@/types";

// 檔案相關錯誤
export enum FileCheckResult {
    /**
     * 必填欄位未填
     */
    REQUIRED,
    /**
     * 不存在該檔案
     */
    NOT_EXIST,
    /**
     * 檔案不存在
     */
    NOT_READABLE,
}

export type FileErrorParams = {
    [FileCheckResult.REQUIRED]: string;
    [FileCheckResult.NOT_EXIST]: string;
    [FileCheckResult.NOT_READABLE]: undefined;
};

// 共用工具類型
export type Formatter<Code extends number | string, Param extends Record<Code, unknown | undefined>> =
    Param[Code] extends undefined ? () => string : (p: Param[Code]) => string;

export type Catalog<Code extends number | string, Param extends Record<Code, unknown | undefined>> =
    Record<Lang, { [K in Code]: Formatter<K, Param> }>;

export type ArgsTuple<T extends number | string, Param extends Record<T, unknown | undefined>> =
    Param[T] extends undefined ? [] : [Param[T]] 