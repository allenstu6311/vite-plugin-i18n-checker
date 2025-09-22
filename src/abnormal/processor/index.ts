import { getGlobalConfig } from "../../config";
import { baseParse } from "../../checker/diff";
import { AbnormalType } from "../types";
import { abnormalMessageMap  } from "./msg";
import { AbnormalKeyTypes } from "./type";

export const missingKey: AbnormalKeyTypes[] = [];
export const extraKey: AbnormalKeyTypes[] = [];
export const invaildKey: AbnormalKeyTypes[] = [];
export const missFile: AbnormalKeyTypes[] = [];

const handleAbnormalKeyPath = (pathStack: (string | number)[]) => {
    return pathStack
        .map(preKey => (isNaN(Number(preKey)) ? preKey : `[${preKey}]`)) // 如果key是數字轉成[index]
        .join('.')
        .replace(/\.\[/g, '['); // .[ => []
}

export function processAbnormalKeys(filePaths: string, abnormalKeys: Record<string, any>) {
    const { outputLang } = getGlobalConfig();

    baseParse({
        source: abnormalKeys,
        target: abnormalKeys,
        handler: {
            handleArray: ({ source, target, pathStack, indexStack, recurse }) => {
                recurse()
            },
            handleObject: ({ source, target, pathStack, indexStack, recurse }) => {
                recurse()
            },
            handlePrimitive: ({ source, target, key, pathStack, indexStack }) => {
                // console.log('handlePrimitive', source[key])
                const type = source[key] as AbnormalType;

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
                        invaildKey.push({
                            filePaths,
                            key: handleAbnormalKeyPath(pathStack),
                            desc: abnormalMessageMap [outputLang][type] || '',
                        })
                        break;
                }
            },
        },
        pathStack: [],
        indexStack: [],
    })
}