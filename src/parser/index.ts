import { parseJsCode } from "./js";
import { parseTsCode } from "./ts";
import { ParserType } from "./types";

export function parseFile(code: string, extensions: string) {
    switch (extensions) {
        case ParserType.TS:
            return parseTsCode(code);
        case ParserType.JS:
            return parseTsCode(code);
        default:
            return code;
    }
}