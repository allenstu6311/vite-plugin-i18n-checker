import { isString, isUndefined } from "../../utils/is";

function createTsParserState() {
    let localConstMap: Record<string, any> = {};
    let resolvedImportMap: Record<string, any> = {};
    let aliasMap: Record<string, string> = {};
    let visited: Record<string, boolean> = {};
    let activeImportKey: string[] = [];
    let pathStack: string[] = [];

    return {
        hasLocalConst: (key: string) => !!localConstMap[key],
        // localConstMap
        setLocalConst: (key: string, value: unknown) => {
            localConstMap[key] = value;
        },
        getLocalConst: (key?: unknown) => {
            if (isUndefined(key)) return localConstMap;
            if (key && isString(key)) return localConstMap[key];
            return null
        },
        removeLocalConst: (key: string) => { delete localConstMap[key]; },
        // resolvedImportMap
        setResolvedImport: (key: string, value: unknown) => { resolvedImportMap[key] = value; },
        getResolvedImport: (key?: string) => {
            if (isUndefined(key)) return resolvedImportMap;
            if (key && isString(key)) return resolvedImportMap[key];
            return null
        },

        // aliasMap
        hasAlias: (key: string) => !!aliasMap[key],
        setAlias: (imported: string, local: string) => { aliasMap[imported] = local; },
        getAlias: (imported: string) => aliasMap[imported],
        removeAlias: (imported: string) => { delete aliasMap[imported]; },

        // visited
        markVisited: (filePath: string) => { visited[filePath] = true; },
        isVisited: (filePath: string) => !!visited[filePath],

        // activeImportKey
        setActiveImportKey: (key: string) => {
            activeImportKey.push(key)
        },
        getActiveImportKey: () => activeImportKey.pop(),

        // pathStack
        setPathStack: (path: string) => { pathStack.push(path) },
        getPathStack: () => pathStack,
        popPathStack: () => pathStack.pop(),

        // reset
        reset: () => {
            localConstMap = {};
            resolvedImportMap = {};
            aliasMap = {};
            visited = {};
        },

        debug: () => ({ localConstMap, resolvedImportMap, aliasMap, visited })
    };
}

export type TsParserState = ReturnType<typeof createTsParserState>;

export default createTsParserState;