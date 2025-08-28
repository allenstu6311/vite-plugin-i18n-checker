import { isArray } from "../utils/is";
import { AbnormalType } from "./type";

// 確保 `abnormalKeys` 陣列的長度至少達到指定的索引位置。
// 如果陣列長度不足，填充空物件 `{}` 以補齊。
// 用於避免索引錯誤，特別是在記錄 log 時能正確映射到對應的索引位置。
const entryCorrectIndex = (abnormalKeys: any[], index: number) => {
    while (abnormalKeys.length <= index) {
        abnormalKeys.push({});
    }
};

export const collectAbnormalKeys = ({
    abnormalKeys,
    abnormalType,
    pathStack,
    indexStack,
    source
}: {
    abnormalKeys: Record<string, any>,
    abnormalType: AbnormalType,
    pathStack: string[],
    indexStack: number[],
    source: Record<string, any>,
}) => {
    let indexStackCount = 0;
    let sourceRef = source;

    console.log('pathStack',pathStack)

    pathStack.forEach((preKey, prevIndex) => {
        sourceRef = sourceRef[preKey];
        // 如果是如果是
        if (isArray(sourceRef) && abnormalType !== AbnormalType.MISS_KEY) {
            abnormalKeys[preKey] = abnormalKeys[preKey] || [];
            const index = indexStack[indexStackCount];
            entryCorrectIndex(abnormalKeys[preKey], index);

            // 進入陣列索引
            sourceRef = sourceRef[index];
            // abnormalKeys = abnormalKeys[preKey][index];
            if (index === pathStack.length - 1) {
                abnormalKeys[preKey] = abnormalType;
            } else {
                abnormalKeys = abnormalKeys[preKey][index];
            }
            indexStackCount++;
        } else {

            if (prevIndex === pathStack.length - 1) {
                abnormalKeys[preKey] = abnormalType;
            } else {
                abnormalKeys[preKey] = abnormalKeys[preKey] || {};
            }
        }
    })

    console.log('abnormalKeys', abnormalKeys)
}