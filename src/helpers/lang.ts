import { resolve } from "path"
import { isDirectory } from "../utils"
import fs from 'fs'

export function getTotalLang({
    localesPath,
    sourceName,
    extensions,
  }: {
    localesPath: string,
    sourceName: string,
    extensions: string,
  }): string[] {
    if (isDirectory(resolve(localesPath, sourceName))) {
      return fs.readdirSync(localesPath)
        .filter(file => {
          return isDirectory(resolve(localesPath, file)) && file !== sourceName
        })
    }
    return fs.readdirSync(localesPath).filter(file => file !== sourceName && file.endsWith(extensions))
  }