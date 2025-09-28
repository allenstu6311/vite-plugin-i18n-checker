import { parseTsCode } from "./ts/";
import { ParserType } from "./types";
import YAML from 'yaml';

export function parseFile(code: string, extensions: string) {
    switch (extensions) {
        case ParserType.TS:
        case ParserType.JS:
            return parseTsCode(code);
        case ParserType.JSON:
            return JSON.parse(code);
        case ParserType.YML:
        case ParserType.YAML:
            return YAML.parse(code);
        default:
            return {};
    }
}