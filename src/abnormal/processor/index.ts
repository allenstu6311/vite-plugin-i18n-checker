import { baseParse } from "../../checker/diff";
import { AbnormalType } from "../types";
import { AbnormalKeyTypes } from "./type";

export const missingKey: AbnormalKeyTypes[] = [];
export const extraKey: AbnormalKeyTypes[] = [];
export const invaildKey: AbnormalKeyTypes[] = [];

export function processAbnormalKeys(filePaths: string, abnormalKeys: Record<string, any>){
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
                switch (source[key]) {
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
                        })
                        break;
                }
            },
        },
        pathStack: [],
        indexStack: [],
    })
}