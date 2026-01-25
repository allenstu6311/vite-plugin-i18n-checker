import { walkTree } from "../../checker/diff";
import { getGlobalConfig } from "../../config";
import { handleError } from "../../errorHandling";
import { ConfigCheckResult } from "../../errorHandling/schemas/config";
import { Lang } from "../../types";
import { isMissingKey } from "../../utils/is";
import { ABNORMAL_CONFIG, AbnormalConfigItem } from "../config";
import { AbnormalType } from "../types";
import { abnormalMessageMap } from "./msg";
import { AbnormalState } from "./type";

const invalidKeyConfig = ABNORMAL_CONFIG.find(config => config.stateKey === 'invalidKey');

// 建立新狀態容器（每次檢查開始時建立）
export function createAbormalManager(): AbnormalState {
    return ABNORMAL_CONFIG.reduce((acc, config) => {
        acc[config.stateKey] = [];
        return acc;
    }, {} as AbnormalState);
}

const handleAbnormalKeyPath = (pathStack: (string | number)[]) => {
    return pathStack
        .map(preKey => (isNaN(Number(preKey)) ? preKey : `[${preKey}]`)) // 如果key是數字轉成[index]
        .join('.')
        .replace(/\.\[/g, '['); // .[ => []
};

export function processAbnormalKeys(filePaths: string, abnormalKeys: Record<string, any>, abormalManager: AbnormalState) {
    const { errorLocale, rules } = getGlobalConfig();
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
                    abormalManager,
                    errorLocale,
                    customRulesMsg,
                });
            },
        },
        pathStack: [],
    });
}

function resolveAbnormalConfig(type: AbnormalType | string) {
    return ABNORMAL_CONFIG.find(config => config.types.includes(type as AbnormalType));
}

function resolveAbnormalDesc({
    type,
    config,
    errorLocale,
    customRulesMsg,
}: {
    type: AbnormalType | string;
    config?: AbnormalConfigItem;
    errorLocale: Lang;
    customRulesMsg: Record<string, string>;
}) {
    if (!config) return '';
    const messageMap = abnormalMessageMap[errorLocale] as Record<string, string>;
    const messageKey = config.messageKeys?.[type as AbnormalType];
    if (messageKey) {
        return messageMap[messageKey] || customRulesMsg[type] || '';
    }
    if (customRulesMsg[type]) {
        return customRulesMsg[type];
    }
    return '';
}

function recordKeyAbnormal({
    type,
    filePaths,
    pathStack,
    abormalManager,
    errorLocale,
    customRulesMsg,
}: {
    type: AbnormalType | string;
    filePaths: string;
    pathStack: (string | number)[];
    abormalManager: AbnormalState;
    errorLocale: Lang;
    customRulesMsg: Record<string, string>;
}) {
    const resolvedConfig = resolveAbnormalConfig(type);
    // 自訂規則會落到 invalidKey（避免未知類型被默默歸類）
    const config = resolvedConfig || (!isMissingKey(customRulesMsg, type) ? invalidKeyConfig : undefined);

    if (!config) {
        handleError(ConfigCheckResult.CUSTOM_RULE_NOT_DEFINED, type);
        return;
    };
    abormalManager[config.stateKey].push({
        filePaths,
        key: handleAbnormalKeyPath(pathStack),
        desc: resolveAbnormalDesc({ type, config, errorLocale, customRulesMsg }),
    });
}

export function recordFileAbnormal(type: AbnormalType, filePaths: string, abormalManager: AbnormalState) {
    const { errorLocale, rules } = getGlobalConfig();
    const customRulesMsg: Record<string, string> = {};
    if (rules) {
        for (const rule of rules) {
            const { abnormalType, msg } = rule;
            customRulesMsg[abnormalType] = msg || '';
        }
    }
    const config = resolveAbnormalConfig(type);
    if (!config) return;
    abormalManager[config.stateKey].push({
        filePaths,
        key: '',
        desc: resolveAbnormalDesc({ type, config, errorLocale, customRulesMsg }),
    });
}