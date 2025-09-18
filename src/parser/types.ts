export enum ParserType {
    YML = 'yml',
    JSON = 'json',
    TS = 'ts',
    JS = 'js',
    YAML = 'yaml',
}

export type I18nData = {
    [key: string]: I18nData | I18nData[];
  };
