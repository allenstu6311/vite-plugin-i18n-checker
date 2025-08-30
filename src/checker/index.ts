import { relative, resolve } from "path";
import { isDirectory, isFileReadable } from "../utils";
import fs from 'fs'
import { getGlobalConfig } from "../config";
import { getFilePaths } from "../path";
import { getFileErrorMessage } from "../error";
import { FileCheckResult } from "../error/types";
import { error } from "console";
import { parseFile } from "../parser";
import { diff } from "./diff";
import { processAbnormalKeys } from "../abnormal/processor";


// 遞迴檢查
export function runChecker(filePath: string) {
    const { sourcePath } = getFilePaths();
    const { extensions } = getGlobalConfig();

    function runValidate(sourcePath: string, filePath: string) {
        const shouldRecursive = isDirectory(sourcePath);
        if (shouldRecursive) {
            fs.readdirSync(sourcePath).forEach(file => {
                runValidate(resolve(sourcePath, file), resolve(filePath, file))
            })
        } else if (sourcePath.endsWith(extensions)) {
            [sourcePath, filePath].forEach((path) => {
                if (!isFileReadable(path)) {
                    const message = getFileErrorMessage(FileCheckResult.NOT_EXIST, path);
                    error(message);
                }
            });

            const sourcefile = fs.readFileSync(sourcePath, 'utf-8');
            const file = fs.readFileSync(filePath, 'utf-8');

            const sourceData = parseFile(sourcefile, extensions);
            const fileData = parseFile(file, extensions);
            // console.log('parseFile', parseFile(sourcefile, extensions))

            // 執行比對邏輯
            const abnormalKeys = diff({
                source: sourceData,
                target: fileData,
            })
            // 轉換報告資料格式
            processAbnormalKeys(
                relative(process.cwd(), filePath),
                abnormalKeys
            )
        }
    }
    runValidate(sourcePath, filePath)
}