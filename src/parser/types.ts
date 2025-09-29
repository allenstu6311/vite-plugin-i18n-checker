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