import fs from 'fs';
import micromatch from 'micromatch';
import { resolve } from "path";
import { getGlobalConfig } from "../config";
import { isDirectory, isObject } from "../utils";
import { normalizePath, resolveSourcePaths } from "./path";

type LangList = {
  fileName: string;
  lang: string;
}

function shouldIgnore(filePath: string, exclude: (string | RegExp)[]) {
  return exclude.some(pattern => {
    if (typeof pattern === 'string') {
      const currentPath = normalizePath(filePath);
      const ignorePath = normalizePath(resolve(process.cwd(), pattern));
      return micromatch.isMatch(currentPath, ignorePath);
    }
    return pattern.test(filePath);
  });
}

function matchLocaleRules(lang: string, localeRules: Record<string, string>) {
  const key = Object.keys(localeRules).find(pattern => micromatch.isMatch(lang, pattern));
  return key ? localeRules[key] : '';
}

export function getTotalLang({
  localesPath,
  extensions,
}: {
  localesPath: string,
  extensions: string,
}): LangList[] {
  const globalConfig = getGlobalConfig();
  const { exclude, sync } = globalConfig;
  const { sourceName } = resolveSourcePaths(globalConfig);
  let langs: LangList[] = [];
  const localeRules = isObject(sync) ? sync.localeRules : {};

  if (isDirectory(resolve(localesPath, sourceName))) {
    langs = fs.readdirSync(localesPath)
      .filter(fileName => fileName !== sourceName)
      .map(fileName => {
        const isDir = isDirectory(resolve(localesPath, fileName));
        if (isDir) {
          return {
            fileName,
            lang: matchLocaleRules(fileName, localeRules),
          };
        }
        return {
          fileName,
          lang: '',
        };
      });
  } else {
    langs = fs.readdirSync(localesPath)
      .filter(fileName => fileName !== sourceName && fileName.endsWith(extensions))
      .map(fileName => {
        return {
          fileName,
          lang: matchLocaleRules(fileName, localeRules),
        };
      });
  }

  return langs.filter(file => file.lang && !shouldIgnore(resolve(localesPath, file.fileName), exclude));
}