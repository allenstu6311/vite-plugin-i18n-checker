import { getGlobalConfig } from "../../config";
import { baseParse } from "../../checker/diff";
import { AbnormalType } from "../types";
import { invalidKeyMap } from "./msg";
import { AbnormalKeyTypes } from "./type";

export const missingKey: AbnormalKeyTypes[] = [];
export const extraKey: AbnormalKeyTypes[] = [];
export const invaildKey: AbnormalKeyTypes[] = [];

export function processAbnormalKeys(filePaths: string, abnormalKeys: Record<string, any>){
    const { outputLang} = getGlobalConfig();

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
                            key: pathStack.join('.'),
                        })
                        break;
                    case AbnormalType.EXTRA_KEY:
                        extraKey.push({
                            filePaths,
                            key: pathStack.join('.'),
                        })
                        break;
                    default:
                        invaildKey.push({
                            filePaths,
                            key: pathStack.join('.'),
                            desc: invalidKeyMap[lang][type] || '',
                        })
                        break;
                }
            },
        },
        pathStack: [],
        indexStack: [],
    })
}