import { parseTsCode } from "./ts";
import { ParserType } from "./types";

export function parseFile(code: string, extensions: string) {
    switch (extensions) {
        case ParserType.TS:
            return parseTsCode(code);
        // case '.js':
        //     return parseJsCode(source);
        default:
            return code;
    }
}