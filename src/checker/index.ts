import fs from 'fs';
import { relative, resolve } from "path";
import { processAbnormalKeys } from "../abnormal/processor";
import { abnormalMessageMap } from "../abnormal/processor/msg";
import { AbnormalState } from '../abnormal/processor/type';
import { AbnormalType } from "../abnormal/types";
import { getGlobalConfig } from "../config";
import { resolveSourcePaths } from "../helpers";
import { parseFile } from "../parser";
import { syncAsyncKeys, syncKeys } from '../sync';
import { SyncContext } from '../sync/types';
import { isDirectory, isFileReadable, isObject } from "../utils";
import { diff } from "./diff";


// 遞迴檢查
export async function runChecker(filePath: string, abormalManager: AbnormalState, lang: string) {
    const { sourcePath } = resolveSourcePaths(getGlobalConfig());
    const { extensions, errorLocale, sync } = getGlobalConfig();
    const formatExtensions = extensions.includes('.') ? extensions : `.${extensions}`;


    async function runValidate(sourcePath: string, filePath: string) {
        const shouldRecursive = isDirectory(sourcePath);
        if (shouldRecursive) {
            fs.readdirSync(sourcePath).forEach(file => {
                runValidate(resolve(sourcePath, file), resolve(filePath, file));
            });
        } else if (sourcePath.endsWith(formatExtensions)) {
            for (const path of [sourcePath, filePath]) {
                if (!isFileReadable(path)) {
                    const { missFile } = abormalManager;
                    missFile.push({
                        filePaths: relative(process.cwd(), filePath),
                        desc: abnormalMessageMap[errorLocale][AbnormalType.MISS_FILE] || '',
                    });
                    return; // ⬅️ 直接中斷 runValidate
                }
            }

            const sourceLocaleFile = fs.readFileSync(sourcePath, 'utf-8');
            const targetFile = fs.readFileSync(filePath, 'utf-8');

            const sourceLocaleData = parseFile(sourceLocaleFile, extensions);
            const targetFileData = parseFile(targetFile, extensions);

            // 執行比對邏輯
            const abnormalKeys = diff({
                source: sourceLocaleData,
                target: targetFileData,
            });


            if (sync) {
                const useAI = isObject(sync) ? sync.useAI : undefined;
                const context: SyncContext = {
                    lang,
                    useAI,
                };

                if (useAI) {
                    await syncAsyncKeys({
                        abnormalKeys,
                        template: sourceLocaleData,
                        target: targetFileData,
                        extensions,
                        filePath,
                        context
                    });
                } else {
                    syncKeys({
                        abnormalKeys,
                        template: sourceLocaleData,
                        target: targetFileData,
                        extensions,
                        filePath,
                        context
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