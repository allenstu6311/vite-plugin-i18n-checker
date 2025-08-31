import { isFile, isFileReadable } from "../utils"
import { getGlobalConfig } from "../config"
import { getFileErrorMessage } from "../error"
import { FileCheckResult } from "../error/types"
import { error } from "../utils"
import { resolve } from "path"

function pathManager() {

    const validatePath = (sourcePath: string, basePath: string) => {
        if (!isFileReadable(sourcePath)) {
            error(getFileErrorMessage(FileCheckResult.NOT_EXIST, sourcePath))
        }

        if (!isFileReadable(basePath)) {
            error(getFileErrorMessage(FileCheckResult.NOT_EXIST, basePath))
        }
    }

    return {
        getPaths() {
            const config = getGlobalConfig()
            const { source, localesPath, extensions } = config;

            // source 是檔案，自動加副檔名
            const sourceIsFile = isFile(resolve(localesPath, `${source}.${extensions}`));
            const sourceName = source + (sourceIsFile ? `.${extensions}` : '')
            const sourcePath = resolve(localesPath, sourceName)

            validatePath(sourcePath, localesPath);
            return { sourcePath, sourceName }
        },
    }
}

const { getPaths } = pathManager()
export const getFilePaths = getPaths