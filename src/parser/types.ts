export enum ParserType {
    YML = 'yml',
    JSON = 'json',
    TS = 'ts',
    JS = 'js',
}

export type I18nData = {
    [key: string]: string | I18nData | I18nData[];
  };
