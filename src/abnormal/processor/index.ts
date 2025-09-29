import { getGlobalConfig } from "../../config";
import { walkTree } from "../../checker/diff";
import { AbnormalType } from "../types";
import { abnormalMessageMap  } from "./msg";
import { AbnormalKeyTypes } from "./type";

export const missingKey: AbnormalKeyTypes[] = [];
export const extraKey: AbnormalKeyTypes[] = [];
export const invalidKey: AbnormalKeyTypes[] = [];
export const missFile: AbnormalKeyTypes[] = [];

const handleAbnormalKeyPath = (pathStack: (string | number)[]) => {
    return pathStack
        .map(preKey => (isNaN(Number(preKey)) ? preKey : `[${preKey}]`)) // 如果key是數字轉成[index]
        .join('.')
        .replace(/\.\[/g, '['); // .[ => []
}

export function processAbnormalKeys(filePaths: string, abnormalKeys: Record<string, any>) {
    const { outputLang } = getGlobalConfig();

    walkTree({
        node: abnormalKeys,
        handler: {
            handleArray: ({ node,  pathStack, indexStack, recurse }) => {
                recurse()
            },
            handleObject: ({ node,  pathStack, indexStack, recurse }) => {
                recurse()
            },
            handlePrimitive: ({ node, pathStack, indexStack }) => {
                // const key = pathStack[pathStack.length - 1];
                const type = node as AbnormalType;
                switch (type) {
                    case AbnormalType.MISS_KEY:
                        missingKey.push({
                            filePaths,
                            key: handleAbnormalKeyPath(pathStack),
                        })
                        break;
                    case AbnormalType.EXTRA_KEY:
                        extraKey.push({
                            filePaths,
                            key: handleAbnormalKeyPath(pathStack),
                        })
                        break;
                    default:
                        invalidKey.push({
                            filePaths,
                            key: handleAbnormalKeyPath(pathStack),
                            desc: abnormalMessageMap[outputLang][type] || '',
                        })
                        break;
                }
            },
        },
        pathStack: [],
        indexStack: [],
    })
}