import { isFalsy, isString, isUndefined } from "../../utils/is";

function createTsParserState() {
    let localConstMap: Record<string, any> = {};
    let resolvedImportMap: Record<string, any> = {};
    let aliasMap: Record<string, string> = {};
    let visited: Record<string, boolean> = {};
    let activeImportKey: string[] = [];

    return {
        // localConstMap
        setLocalConst: (key: string, value: any) => {
            localConstMap[key] = value;
        },
        getLocalConst: (key?: unknown) => {
            if (isUndefined(key)) return localConstMap;
            if (key && isString(key)) return localConstMap[key];
            return null
        },

        // resolvedImportMap
        setResolvedImport: (key: string, value: any) => { resolvedImportMap[key] = value; },
        getResolvedImport: (key?: string) => {
            if (isUndefined(key)) return resolvedImportMap;
            if (key && isString(key)) return resolvedImportMap[key];
            return null
        },

        // aliasMap
        setAlias: (imported: string, local: string) => { aliasMap[imported] = local; },
        getAlias: (imported: string) => aliasMap[imported],

        // visited
        markVisited: (filePath: string) => { visited[filePath] = true; },
        isVisited: (filePath: string) => !!visited[filePath],

        // activeImportKey
        setActiveImportKey: (key: string) => {
            activeImportKey.push(key)
        },
        getActiveImportKey: () => activeImportKey.pop(),

        // reset
        reset: () => {
            localConstMap = {};
            resolvedImportMap = {};
            aliasMap = {};
            visited = {};
        },

        // debug（可選）
        debug: () => ({ localConstMap, resolvedImportMap, aliasMap, visited })
    };
}

export type TsParserState = ReturnType<typeof createTsParserState>;

export default createTsParserState;

// export const { setLocalConst, getLocalConst, setResolvedImport, getResolvedImport, setAlias, getAlias, markVisited, isVisited, setActiveImportKey, getActiveImportKey, reset, debug } = createTsParserState();