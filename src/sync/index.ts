import fs from 'fs';
import { AbnormalType } from "../abnormal/types";
import { walkTree } from '../checker/diff';
import { SyncOptions } from '../config/types';
import { handleError } from '../errorHandling';
import { SyncCheckResult } from '../errorHandling/schemas/sync';
import { writeFileEnsureDir } from '../helpers';
import { SupportedParserType } from "../parser/types";
import { isBoolean, isFalsy } from '../utils/is';
import { normalizeContent } from '../utils/normalize';
import { getSyncCode } from './serializer';
import { SyncContext } from './types';

export function getAbnormalType(sync: SyncOptions, abnormalType: AbnormalType | string) {
    if (isFalsy(sync)) return abnormalType;

    const autoFill = isBoolean(sync) ? sync : (sync.autoFill ?? true);
    const autoDelete = isBoolean(sync) ? sync : (sync.autoDelete ?? false);

    if (autoFill && abnormalType === AbnormalType.MISS_KEY) return AbnormalType.ADD_KEY;
    if (autoDelete && abnormalType === AbnormalType.EXTRA_KEY) return AbnormalType.DELETE_KEY;

    return abnormalType;
}

/**
 * 如果不寫入檔案，則將異常 key 重置為 MISS_KEY 或 EXTRA_KEY
 */
function resetAbnormalKeys(abnormalKeys: Record<string, any>) {
    walkTree({
        root: abnormalKeys,
        handler: {
            handleArray: ({ recurse }) => {
                recurse();
            },
            handleObject: ({ recurse }) => {
                recurse();
            },
            handlePrimitive: ({ node, parentNode, key }) => {
                const value = node as AbnormalType;
                if (value === AbnormalType.ADD_KEY) parentNode[key] = AbnormalType.MISS_KEY;
                if (value === AbnormalType.DELETE_KEY) parentNode[key] = AbnormalType.EXTRA_KEY;
            },
        },
        pathStack: [],
    });
}

async function syncContent(
    filePath: string,
    syncCode: string,
    extensions: SupportedParserType,
    sync: SyncOptions,
    abnormalKeys: Record<string, any>
) {
    // 讀取原檔案內容
    const originalContent = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8')
        : '';

    // 如果內容相同，就不寫入（避免觸發檔案變更事件）
    const { targetContent, targetSyncContent } = normalizeContent(
        extensions,
        originalContent,
        syncCode
    );
    if (targetContent === targetSyncContent) {
        return; // 內容沒變，不寫入
    }

    const { override } = sync || {};
    if (!override) {
        resetAbnormalKeys(abnormalKeys);
        return;
    };

    try {
        await writeFileEnsureDir(filePath, syncCode);
    } catch (error) {
        handleError(SyncCheckResult.WRITE_FILE_FAILED, filePath, (error as any)?.message);
        return;
    }
}

export async function syncKeys({
    abnormalKeys,
    template,
    target,
    filePath,
    sourcePath,
    extensions,
    context,
    sync
}: {
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    target: Record<string, any>,
    filePath: string,
    sourcePath: string,
    extensions: SupportedParserType,
    context?: SyncContext,
    sync: SyncOptions
}) {
    const syncCode = await getSyncCode({ abnormalKeys, template, target, filePath, sourcePath, extensions, context });
    await syncContent(filePath, syncCode, extensions, sync, abnormalKeys);
    return syncCode;
}

