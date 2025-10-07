import { Primitive } from "../types";

export enum ParserType {
    YML = 'yml',
    JSON = 'json',
    TS = 'ts',
    JS = 'js',
    YAML = 'yaml',
}

export type I18nData = {
    [key: string]: I18nData | Primitive | (Primitive | I18nData)[];
};

export const ParserTypeList = Object.values(ParserType) as string[];

export type SupportedParserType = 'yml' | 'json' | 'ts' | 'js' | 'yaml';