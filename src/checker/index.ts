
import fs from 'fs';
import { relative, resolve } from "path";
import { processAbnormalKeys, recordFileAbnormal } from "../abnormal/processor";
import { AbnormalState } from '../abnormal/processor/type';
import { AbnormalType } from "../abnormal/types";
import { getGlobalConfig } from "../config";
import { resolveSourcePaths } from "../helpers";
import { parseFile } from "../parser";
import { isDirectory, isPathExists } from "../utils";
import { diff } from "./diff";

// 遞迴檢查
export async function runChecker(filePath: string, abnormalManager: AbnormalState) {
    const globalConfig = getGlobalConfig();
    const { sourcePath } = resolveSourcePaths(globalConfig);
    const { extensions } = globalConfig;
    const formatExtensions = extensions.includes('.') ? extensions : `.${extensions}`;


    async function runValidate(sourcePath: string, filePath: string) {
        const shouldRecursive = isDirectory(sourcePath);
        if (shouldRecursive) {
            for (const file of fs.readdirSync(sourcePath)) {
                await runValidate(
                    resolve(sourcePath, file),
                    resolve(filePath, file)
                );
            }
        } else if (sourcePath.endsWith(formatExtensions)) {
            for (const path of [sourcePath, filePath]) {
                if (!isPathExists(path)) {
                    recordFileAbnormal(
                        AbnormalType.MISS_FILE,
                        relative(process.cwd(), filePath),
                        abnormalManager
                    );
                    return;
                }
            }

            const sourceLocaleFile = fs.readFileSync(sourcePath, 'utf-8');
            const targetFile = fs.readFileSync(filePath, 'utf-8');

            if (!targetFile) {
                recordFileAbnormal(
                    AbnormalType.EMPTY_FILE,
                    relative(process.cwd(), filePath),
                    abnormalManager
                );
                return;
            }

            const sourceLocaleData = parseFile(sourceLocaleFile, extensions);
            const targetFileData = parseFile(targetFile, extensions);

            // 執行比對邏輯
            const abnormalKeys = diff({
                source: sourceLocaleData,
                target: targetFileData,
            });

            // 轉換報告資料格式
            processAbnormalKeys(
                relative(process.cwd(), filePath),
                abnormalKeys,
                abnormalManager
            );
        }
    }
    await runValidate(sourcePath, filePath);
}