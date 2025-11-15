import fs from 'fs';
import { AbnormalType } from "../abnormal/types";
import { SyncOptions } from '../config/types';
import { SupportedParserType } from "../parser/types";
import { isBoolean, isFalsy } from '../utils/is';
import { getAsyncSyncCode, getSyncCode } from './serializer';
import { SyncContext } from './types';

export function getAbnormalType(sync: SyncOptions, abnormalType: AbnormalType | string) {
    if (isFalsy(sync)) return abnormalType;

    const autoFill = isBoolean(sync) ? sync : (sync.autoFill ?? true);
    const autoDelete = isBoolean(sync) ? sync : (sync.autoDelete ?? true);

    if (autoFill && abnormalType === AbnormalType.MISS_KEY) return AbnormalType.ADD_KEY;
    if (autoDelete && abnormalType === AbnormalType.EXTRA_KEY) return AbnormalType.DELETE_KEY;

    return abnormalType;
}

function syncContent(
    filePath: string,
    syncCode: string
) {
    // 讀取原檔案內容
    const originalContent = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8')
        : '';

    // 如果內容相同，就不寫入（避免觸發檔案變更事件）
    if (originalContent === syncCode) {
        return; // 內容沒變，不寫入
    }
    fs.writeFileSync(filePath, syncCode, 'utf-8');
}

export function syncKeys({
    abnormalKeys,
    template,
    target,
    filePath,
    extensions,
    context
}: {
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    target: Record<string, any>,
    filePath: string,
    extensions: SupportedParserType,
    context?: SyncContext,
}) {
    const syncCode = getSyncCode({ abnormalKeys, template, target, filePath, extensions, context });
    // 檢查是否為空或只有空白
    if (!syncCode || !syncCode.trim()) {
        return; // 不寫入
    }

    // 讀取原檔案內容
    const originalContent = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf-8')
        : '';

    // 如果內容相同，就不寫入（避免觸發檔案變更事件）
    if (originalContent === syncCode) {
        return; // 內容沒變，不寫入
    }
    fs.writeFileSync(filePath, syncCode, 'utf-8');
}

export async function syncAsyncKeys({
    abnormalKeys,
    template,
    target,
    filePath,
    extensions,
    context
}: {
    abnormalKeys: Record<string, any>,
    template: Record<string, any>,
    target: Record<string, any>,
    filePath: string,
    extensions: SupportedParserType,
    context?: SyncContext,
}) {
    const syncCode = await getAsyncSyncCode({ abnormalKeys, template, target, filePath, extensions, context });
    syncContent(filePath, syncCode);
}

