function createMapReducer<T>() {
  const map = new Map<string, T>();
  return {
    set: (k: string, v: T) => map.set(k, v),
    get: (k: string) => map.get(k),
    has: (k: string) => map.has(k),
    delete: (k: string) => map.delete(k),
    clear: () => map.clear(),
    entries: () => Array.from(map.entries())
  };
}

function createSetReducer<T>() {
  const set = new Set<T>();
  return {
    add: (v: T) => set.add(v),
    has: (v: T) => set.has(v),
    delete: (v: T) => set.delete(v),
    clear: () => set.clear(),
    values: () => Array.from(set.values())
  };
}

function createTsParserState() {
  const localConstMap = createMapReducer<any>();
  const resolvedImportMap = createMapReducer<any>();
  const aliasMap = createMapReducer<string>();
  const visited = createSetReducer<string>();
  const activeImportKey: string[] = [];
  const pathStack: string[] = [];

  return {
    // localConstMap
    hasLocalConst: (key: string) => localConstMap.has(key),
    setLocalConst: (key: string, value: unknown) => localConstMap.set(key, value),
    getLocalConst: (key: string) => localConstMap.get(key),
    removeLocalConst: (key: string) => localConstMap.delete(key),

    // resolvedImportMap
    setResolvedImport: (key: string, value: unknown) => resolvedImportMap.set(key, value),
    getResolvedImport: (key: string) => resolvedImportMap.get(key),

    // aliasMap
    hasAlias: (key: string) => aliasMap.has(key),
    setAlias: (imported: string, local: string) => aliasMap.set(imported, local),
    getAlias: (imported: string) => aliasMap.get(imported),
    removeAlias: (imported: string) => aliasMap.delete(imported),

    // visited
    markVisited: (filePath: string) => visited.add(filePath),
    isVisited: (filePath: string) => visited.has(filePath),

    // activeImportKey
    setActiveImportKey: (key: string) => activeImportKey.push(key),
    getActiveImportKey: () => activeImportKey.pop(),

    // pathStack
    setPathStack: (path: string) => pathStack.push(path),
    getPathStack: () => pathStack,
    popPathStack: () => pathStack.pop(),

    // reset
    reset: () => {
      localConstMap.clear();
      resolvedImportMap.clear();
      aliasMap.clear();
      visited.clear();
    },

    debug: () => ({ localConstMap, resolvedImportMap, aliasMap, visited })
  };
}

export type TsParserState = ReturnType<typeof createTsParserState>;

export default createTsParserState;