import fs from 'fs';
import micromatch from 'micromatch';
import { resolve } from "path";
import { getGlobalConfig } from "../config";
import { getFileErrorMessage, handlePluginError } from '../error';
import { FileCheckResult } from '../error/schemas/file';
import { isDirectory, isObject } from "../utils";
import { normalizePath, resolveSourcePaths } from "./path";

type LangList = {
  fileName: string;
  lang: string;
}

export function isValidLocale(lang: string): boolean {
  return /^(?:[a-z]{2}[-_][A-Z]{2}|[a-z]{2})$/.test(lang);
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

function matchLocaleRules(fileName: string, localeRules: Record<string, string>) {
  if (!localeRules) return '';
  const key = Object.keys(localeRules).find(pattern => micromatch.isMatch(fileName, pattern));
  const lang = key ? localeRules[key] : '';

  if (lang && !isValidLocale(lang)) {
    handlePluginError(getFileErrorMessage(FileCheckResult.UNSUPPORTED_LANG, lang));
    return '';
  };
  return lang;
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
            lang: matchLocaleRules(fileName, localeRules) || fileName,
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

  return langs.filter(file => file.fileName && !shouldIgnore(resolve(localesPath, file.fileName), exclude));
}