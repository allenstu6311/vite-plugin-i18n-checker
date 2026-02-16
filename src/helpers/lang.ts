import fs from 'fs';
import micromatch from 'micromatch';
import { resolve } from "path";
import { I18nCheckerOptions } from '../config/types';
import { isDirectory, isPathExists } from "../utils";
import { normalizePath, resolveSourcePaths } from "./path";


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

export function getTotalLang({
  localesPath,
  extensions,
  config
}: {
  localesPath: string,
  extensions: string,
  config: I18nCheckerOptions
}): string[] {
  const { exclude, include } = config;
  const { sourceName, sourcePath } = resolveSourcePaths(config);
  if(!isPathExists(localesPath)) return [];
  const isFolderMode = isDirectory(sourcePath);

  const entries = fs.readdirSync(localesPath);
  const filtered = isFolderMode
    ? entries.filter(fileName => fileName !== sourceName)
    : entries.filter(fileName => fileName !== sourceName && fileName.endsWith(extensions));

  return filtered.filter(fileName => {
    if (!fileName) return false;
    const filePath = resolve(localesPath, fileName);
    if (include.length > 0 && !shouldInclude(filePath, include)) return false;
    return !shouldIgnore(filePath, exclude);
  });
}