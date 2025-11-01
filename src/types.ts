type Lang = 'zh_CN' | 'en_US'

type Override<T, U> = Omit<T, keyof U> & U;

type Primitive = string | number | boolean | null | undefined;

export type { Override, Lang, Primitive };


