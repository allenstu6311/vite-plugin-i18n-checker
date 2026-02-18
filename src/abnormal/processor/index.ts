import { walkTree } from "../../checker/diff";
import { getGlobalConfig } from "../../config";
import { handleError } from "../../errorHandling";
import { ConfigCheckResult } from "../../errorHandling/schemas/config";
import { isMissingKey } from "../../utils/is";
import { ABNORMAL_CONFIG, AbnormalConfigItem } from "../config";
import { AbnormalType } from "../types";
import { AbnormalManager, AbnormalState } from "./type";

const invalidKeyConfig = ABNORMAL_CONFIG.find(config => config.stateKey === 'invalidKey');

// 建立新狀態容器（每次檢查開始時建立）
export function createAbnormalManager(): AbnormalManager {
    const state = ABNORMAL_CONFIG.reduce((acc, config) => {
        acc[config.stateKey] = [];
        return acc;
    }, {} as AbnormalState);

    const manager = state as AbnormalManager;
    manager.hasError = () => ABNORMAL_CONFIG
        .filter(c => c.level === 'error')
        .some(c => state[c.stateKey].length > 0);
    manager.hasWarning = () => ABNORMAL_CONFIG
        .filter(c => c.level === 'warning')
        .some(c => state[c.stateKey].length > 0);
    return manager;
}

const handleAbnormalKeyPath = (pathStack: (string | number)[]) => {
    return pathStack
        .map(preKey => (isNaN(Number(preKey)) ? preKey : `[${preKey}]`)) // 如果key是數字轉成[index]
        .join('.')
        .replace(/\.\[/g, '['); // .[ => []
};

export function processAbnormalKeys(filePaths: string, abnormalKeys: Record<string, any>, abnormalManager: AbnormalState) {
    const { rules } = getGlobalConfig();
    const customRulesMsg: Record<string, string> = {};
    if (rules) {
        for (const rule of rules) {
            const { abnormalType, msg } = rule;
            customRulesMsg[abnormalType] = msg || '';
        }
    }

    walkTree({
        root: abnormalKeys,
        handler: {
            handleArray: ({ recurse }) => {
                recurse();
            },
            handleObject: ({ recurse }) => {
                recurse();
            },
            handlePrimitive: ({ node, pathStack }) => {
                recordKeyAbnormal({
                    type: node as AbnormalType,
                    filePaths,
                    pathStack,
                    abnormalManager,
                    customRulesMsg,
                });
            },
        },
        pathStack: [],
    });
}

function resolveAbnormalConfig(type: AbnormalType) {
    return ABNORMAL_CONFIG.find(config => (config.types as AbnormalType[]).includes(type));
}

function resolveAbnormalDesc({
    type,
    config,
    customRulesMsg,
}: {
    type: AbnormalType | string;
    config?: AbnormalConfigItem;
    customRulesMsg: Record<string, string>;
}) {
    if (!config) return '';
    const errorMessage = config.msg?.[type as AbnormalType];
    return customRulesMsg[type] || errorMessage || '';
}

function recordKeyAbnormal({
    type,
    filePaths,
    pathStack,
    abnormalManager,
    customRulesMsg,
}: {
    type: AbnormalType;
    filePaths: string;
    pathStack: (string | number)[];
    abnormalManager: AbnormalState;
    customRulesMsg: Record<string, string>;
}) {
    const resolvedConfig = resolveAbnormalConfig(type);

    const config = resolvedConfig
        // 自訂義規則須進入到 invalidKey 處理
        || (!isMissingKey(customRulesMsg, type) ? invalidKeyConfig : undefined);

    if (!config) {
        handleError(ConfigCheckResult.CUSTOM_RULE_NOT_DEFINED, type);
        return;
    };
    abnormalManager[config.stateKey].push({
        filePaths,
        key: handleAbnormalKeyPath(pathStack),
        desc: resolveAbnormalDesc({ type, config, customRulesMsg }),
    });
}

export function recordFileAbnormal(type: AbnormalType, filePaths: string, abnormalManager: AbnormalState) {
    const { rules } = getGlobalConfig();
    const customRulesMsg: Record<string, string> = {};
    if (rules) {
        for (const rule of rules) {
            const { abnormalType, msg } = rule;
            customRulesMsg[abnormalType] = msg || '';
        }
    }
    const config = resolveAbnormalConfig(type);
    if (!config) return;
    abnormalManager[config.stateKey].push({
        filePaths,
        key: '',
        desc: resolveAbnormalDesc({ type, config, customRulesMsg }),
    });
}