import fs from 'fs';
import micromatch from 'micromatch';
import { resolve } from "path";
import { I18nCheckerOptions } from '../config/types';
import { handleError } from '../errorHandling';
import { FileCheckResult } from '../errorHandling/schemas/file';
import { isDirectory } from "../utils";
import { normalizePath, resolveSourcePaths } from "./path";

type LangList = {
  fileName: string;
  lang: string;
}

export function isValidLocale(lang: string): boolean {
  return /^(?:[a-z]{2}[-_][A-Z]{2}|[a-z]{2})$/.test(lang);
}

function matchesPattern(filePath: string, pattern: string | RegExp) {
  const normalizedPath = normalizePath(filePath);

  if (typeof pattern === 'string') {
    const resolvedPatternPath = normalizePath(resolve(process.cwd(), pattern));
    return micromatch.isMatch(normalizedPath, resolvedPatternPath);
  }
  return pattern.test(normalizedPath);
}

function shouldIgnore(filePath: string, exclude: (string | RegExp)[]) {
  return exclude.some(pattern => matchesPattern(filePath, pattern));
}

function shouldInclude(filePath: string, include: (string | RegExp)[]) {
  return include.some(pattern => matchesPattern(filePath, pattern));
}

function matchLocaleRules(fileName: string, localeRules: Record<string, string>) {
  if (!localeRules) return '';
  const key = Object.keys(localeRules).find(pattern => micromatch.isMatch(fileName, pattern));
  const lang = key ? localeRules[key] : '';

  if (lang && !isValidLocale(lang)) {
    handleError(FileCheckResult.UNSUPPORTED_LANG, lang);
    return '';
  };
  return lang;
}

export function getTotalLang({
  localesPath,
  extensions,
  config
}: {
  localesPath: string,
  extensions: string,
  config: I18nCheckerOptions
}): LangList[] {
  const { exclude, sync, include } = config;
  const { sourceName } = resolveSourcePaths(config);
  const localeRules = sync?.useAI?.localeRules ?? {};
  const isFolderMode = isDirectory(resolve(localesPath, sourceName));

  const entries = fs.readdirSync(localesPath);
  const filtered = isFolderMode
    ? entries.filter(fileName => fileName !== sourceName)
    : entries.filter(fileName => fileName !== sourceName && fileName.endsWith(extensions));

  const langs = filtered.map(fileName => {
    return {
      fileName,
      lang: matchLocaleRules(fileName, localeRules) || '',
    };
  });


  return langs.filter(file => {
    if (!file.fileName) return false;
    const filePath = resolve(localesPath, file.fileName);
    if (include.length > 0 && !shouldInclude(filePath, include)) return false;
    return !shouldIgnore(filePath, exclude);
  });
}