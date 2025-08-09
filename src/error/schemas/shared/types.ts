import { Lang } from "@/types";

export type Formatter<Code extends number | string, Param extends Record<Code, unknown | undefined>> =
    Param[Code] extends undefined ? () => string : (p: Param[Code]) => string;

export type Catalog<Code extends number | string, Param extends Record<Code, unknown | undefined>> =
    Record<Lang, { [K in Code]: Formatter<K, Param> }>;

export type ArgsTuple<T extends number | string, Param extends Record<T, unknown | undefined>> =
    Param[T] extends undefined ? [] : [Param[T]]
