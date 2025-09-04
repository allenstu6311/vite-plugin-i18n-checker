type Lang = 'zh_CN' | 'en_US'

type Override<T, U> = Omit<T, keyof U> & U;

export type { Override, Lang }


