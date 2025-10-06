import { resolve } from "path"
import { isDirectory } from "../utils"
import fs from 'fs'
import { getGlobalConfig } from "../config";
import { resolveSourcePaths } from "./path";
import micromatch from 'micromatch';

function shouldIgnore(file: string, ignoreFiles: (string | RegExp)[]) {
  return ignoreFiles.some(ignoreFile => {
    if (typeof ignoreFile === 'string') {
      return micromatch.isMatch(file, ignoreFile)
    }
    return ignoreFile.test(file)
  })
}

export function getTotalLang({
  localesPath,
  extensions,
}: {
  localesPath: string,
  extensions: string,
}): string[] {
  const globalConfig = getGlobalConfig();
  const { ignoreFiles } = globalConfig;
  const { sourceName } = resolveSourcePaths(globalConfig);
  let langs = [];

  if (isDirectory(resolve(localesPath, sourceName))) {
    langs = fs.readdirSync(localesPath)
      .filter(fileName => isDirectory(resolve(localesPath, fileName)) && fileName !== sourceName)
  } else {
    langs = fs.readdirSync(localesPath).filter(fileName => fileName !== sourceName && fileName.endsWith(extensions))
  }
  return langs.filter(file => !shouldIgnore(file, ignoreFiles))
}