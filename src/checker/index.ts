import { resolve } from "path";
import { isDirectory, isFileReadable } from "../utils";
import fs from 'fs'
import { getGlobalConfig } from "../config";
import { getFilePaths } from "../path";
import { getFileErrorMessage } from "../error";
import { FileCheckResult } from "../error/types";
import { error } from "console";
import { parseFile } from "../parser";

// 遞迴檢查
export function runChecker(filePath: string) {
    const { sourcePath } = getFilePaths();
    const { recursive, extensions } = getGlobalConfig();

    function runValidate(sourcePath: string, filePath: string) {

        const shouldRecursive = isDirectory(filePath) && recursive;
        if (shouldRecursive) {
            fs.readdirSync(filePath).forEach(file => {
                runValidate(resolve(sourcePath, file), resolve(filePath, file))
            })
        } else if (filePath.endsWith(extensions)) {


            if (!isFileReadable(sourcePath)) {
                const message = getFileErrorMessage(FileCheckResult.NOT_EXIST, sourcePath)
                error(message)
            }
            const sourcefile = fs.readFileSync(sourcePath, 'utf-8');
            const file = fs.readFileSync(filePath, 'utf-8');
            console.log('parseFile', parseFile(sourcefile, extensions))
            // console.log('file', parseFile(file, extensions))

            // parseFile(sourcefile, extensions)
            // console.log('parseFile', parseFile)
            // console.log('filePath', filePath)
            // 執行比對邏輯

        }
    }

    runValidate(sourcePath, filePath)

}