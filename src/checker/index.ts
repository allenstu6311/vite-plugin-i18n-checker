import { relative, resolve } from "path";
import { isDirectory, isFileReadable } from "../utils";
import fs from 'fs'
import { getGlobalConfig, handlePluginError } from "../config";
import { getFileErrorMessage } from "../error";
import { FileCheckResult } from "../error/schemas/file";
import { parseFile } from "../parser";
import { diff } from "./diff";
import { missFile, processAbnormalKeys } from "../abnormal/processor";
import { resolveSourcePaths } from "../helpers";
import { abnormalMessageMap } from "../abnormal/processor/msg";
import { AbnormalType } from "../abnormal/types";


// 遞迴檢查
export function runChecker(filePath: string) {
    const { sourcePath } = resolveSourcePaths(getGlobalConfig());
    const { extensions, outputLang } = getGlobalConfig();
    const formatExtensions = extensions.includes('.') ? extensions : `.${extensions}`;

    function runValidate(sourcePath: string, filePath: string) {
        const shouldRecursive = isDirectory(sourcePath);
        if (shouldRecursive) {
            fs.readdirSync(sourcePath).forEach(file => {
                runValidate(resolve(sourcePath, file), resolve(filePath, file))
            })
        } else if (sourcePath.endsWith(formatExtensions)) {
            for (const path of [sourcePath, filePath]) {
                if (!isFileReadable(path)) {
                    // const message = getFileErrorMessage(FileCheckResult.NOT_EXIST, path);
                    // handlePluginError(message);
                    missFile.push({
                        filePaths: relative(process.cwd(), filePath),
                        key: '',
                        desc: abnormalMessageMap[outputLang][AbnormalType.MISS_FILE] || '',
                    })
                    return; // ⬅️ 直接中斷 runValidate
                }
            }

            const baseLocaleFile = fs.readFileSync(sourcePath, 'utf-8');
            const targetFile = fs.readFileSync(filePath, 'utf-8');

            const  baseLocaleData = parseFile(baseLocaleFile, extensions);
            const targetFileData = parseFile(targetFile, extensions);

            // 執行比對邏輯
            const abnormalKeys = diff({
                source: baseLocaleData,
                target: targetFileData,
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