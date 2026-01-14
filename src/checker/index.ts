
import fs from 'fs';
import { relative, resolve } from "path";
import { processAbnormalKeys } from "../abnormal/processor";
import { abnormalMessageMap } from "../abnormal/processor/msg";
import { AbnormalState } from '../abnormal/processor/type';
import { AbnormalType } from "../abnormal/types";
import { getGlobalConfig } from "../config";
import { resolveSourcePaths } from "../helpers";
import { parseFile } from "../parser";
import { writeDiffReport } from '../report';
import { syncKeys } from '../sync';
import { SyncContext } from '../sync/types';
import { isDirectory, isEmptyObject, isFileReadable } from "../utils";
import { diff } from "./diff";

// 遞迴檢查
export async function runChecker(filePath: string, abormalManager: AbnormalState, lang: string) {
    const globalConfig = getGlobalConfig();
    const { sourcePath } = resolveSourcePaths(globalConfig);
    const { extensions, errorLocale, sync } = globalConfig;
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
                if (!isFileReadable(path)) {
                    const { missFile } = abormalManager;
                    missFile.push({
                        filePaths: relative(process.cwd(), filePath),
                        desc: abnormalMessageMap[errorLocale][AbnormalType.MISS_FILE] || '',
                        key: ''
                    });
                    return;
                }
            }

            const sourceLocaleFile = fs.readFileSync(sourcePath, 'utf-8');
            const targetFile = fs.readFileSync(filePath, 'utf-8');

            if (!targetFile) {
                const { emptyFile } = abormalManager;
                emptyFile.push({
                    filePaths: relative(process.cwd(), filePath),
                    desc: abnormalMessageMap[errorLocale][AbnormalType.EMPTY_FILE] || '',
                    key: ''
                });
                return;
            }

            const sourceLocaleData = parseFile(sourceLocaleFile, extensions);
            const targetFileData = parseFile(targetFile, extensions);

            // 執行比對邏輯
            const abnormalKeys = diff({
                source: sourceLocaleData,
                target: targetFileData,
            });


            if (sync) {
                const { useAI } = sync || {};
                const context: SyncContext = {
                    lang,
                    useAI,
                };

                const syncResult = await syncKeys({
                    abnormalKeys,
                    template: sourceLocaleData,
                    target: targetFileData,
                    extensions,
                    filePath,
                    sourcePath,
                    context,
                    sync
                });

                if (!isEmptyObject(abnormalKeys)) {
                    // 生成差異報告
                    await writeDiffReport({
                        globalConfig,
                        targetFilePath: filePath,
                        targetFileContent: targetFile,
                        targetFileSyncResult: syncResult,
                    });
                }
            }
            // 轉換報告資料格式
            processAbnormalKeys(
                relative(process.cwd(), filePath),
                abnormalKeys,
                abormalManager
            );
        }
    }
    await runValidate(sourcePath, filePath);
}