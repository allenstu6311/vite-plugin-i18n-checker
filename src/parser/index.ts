import { parseJsonCode } from "./json";
import { parseTsCode } from "./ts/";
import { ParserType } from "./types";
import { parseYmlCode } from "./yml";

export function parseFile(code: string, extensions: string) {
    switch (extensions) {
        case ParserType.TS:
            return parseTsCode(code);
        case ParserType.JS:
            return parseTsCode(code);
        case ParserType.JSON:
            return parseJsonCode(code);
        case ParserType.YML:
            return parseYmlCode(code);
        case ParserType.YAML:
            return parseYmlCode(code);
        default:
            return code;
    }
}