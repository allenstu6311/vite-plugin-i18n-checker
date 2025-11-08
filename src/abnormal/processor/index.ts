import { walkTree } from "../../checker/diff";
import { getGlobalConfig } from "../../config";
import { AbnormalType } from "../types";
import { abnormalMessageMap } from "./msg";
import { AbnormalState } from "./type";

// 建立新狀態容器（每次檢查開始時建立）
export function createAbormalManager(): AbnormalState {
    return {
        missingKey: [],
        extraKey: [],
        invalidKey: [],
        missFile: [],
        deleteKeys: [],
        addKeys: [],
    };
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
        node: abnormalKeys,
        handler: {
            handleArray: ({ recurse }) => {
                recurse();
            },
            handleObject: ({ recurse }) => {
                recurse();
            },
            handlePrimitive: ({ node, pathStack }) => {
                const { missingKey, extraKey, invalidKey, deleteKeys, addKeys } = abormalManager;
                const type = node as AbnormalType;
                switch (type) {
                    case AbnormalType.MISS_KEY:
                        missingKey.push({
                            filePaths,
                            key: handleAbnormalKeyPath(pathStack),
                        });
                        break;
                    case AbnormalType.EXTRA_KEY:
                        extraKey.push({
                            filePaths,
                            key: handleAbnormalKeyPath(pathStack),
                        });
                        break;
                    case AbnormalType.DELETE_KEY:
                        deleteKeys.push({
                            filePaths,
                            key: handleAbnormalKeyPath(pathStack),
                        });
                        break;
                    case AbnormalType.ADD_KEY:
                        addKeys.push({
                            filePaths,
                            key: handleAbnormalKeyPath(pathStack),
                        });
                        break;
                    default:
                        invalidKey.push({
                            filePaths,
                            key: handleAbnormalKeyPath(pathStack),
                            desc: abnormalMessageMap[errorLocale][type] || customRulesMsg[type] || '',
                        });
                        break;
                }
            },
        },
        pathStack: [],
    });
}