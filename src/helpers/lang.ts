import { resolve } from "path";
import { isDirectory } from "../utils";
import fs from 'fs';
import { getGlobalConfig } from "../config";
import { normalizePath, resolveSourcePaths } from "./path";
import micromatch from 'micromatch';

function shouldIgnore(filePath: string, exclude: (string | RegExp)[]) {
  return exclude.some(pattern  => {
    if (typeof pattern  === 'string') {
      const currentPath = normalizePath(filePath);
      const ignorePath = normalizePath(resolve(process.cwd(), pattern ));
      return micromatch.isMatch(currentPath, ignorePath);
    }
    return pattern .test(filePath);
  });
}

export function getTotalLang({
  localesPath,
  extensions,
}: {
  localesPath: string,
  extensions: string,
}): string[] {
  const globalConfig = getGlobalConfig();
  const { exclude } = globalConfig;
  const { sourceName } = resolveSourcePaths(globalConfig);
  let langs = [];

  if (isDirectory(resolve(localesPath, sourceName))) {
    langs = fs.readdirSync(localesPath)
      .filter(fileName => isDirectory(resolve(localesPath, fileName)) && fileName !== sourceName);
  } else {
    langs = fs.readdirSync(localesPath).filter(fileName => fileName !== sourceName && fileName.endsWith(extensions));
  }

  return langs.filter(file => !shouldIgnore(resolve(localesPath, file), exclude));
}