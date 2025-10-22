import { isArray } from "../../utils";
import { AbnormalType } from "../types";

// 確保 `abnormalKeys` 陣列的長度至少達到指定的索引位置。
// 如果陣列長度不足，填充空物件 `{}` 以補齊。
// 用於避免索引錯誤，特別是在記錄 log 時能正確映射到對應的索引位置。
const entryCorrectIndex = (abnormalKeys: Record<string, unknown>[], index: number) => {
    while (abnormalKeys.length < index) {
        abnormalKeys.push({});
    }
};

export const collectAbnormalKeys = ({
    abnormalKeys,
    abnormalType,
    pathStack,
    source
}: {
    abnormalKeys: Record<string, any>,
    abnormalType: AbnormalType | string,
    pathStack: (string | number)[],
    source: Record<string, any>,
}) => {
    let sourceRef = source;
    let abnormalKeysRef = abnormalKeys;

    for (let i = 0; i < pathStack.length; i++) {
        const key = pathStack[i];
        const isLast = i === pathStack.length - 1;
        const nextKey = pathStack[i + 1];

        // 先移動 source 指標
        sourceRef = sourceRef[key];
        if (isLast) {
            // 最後一層，直接賦值
            abnormalKeysRef[key] = abnormalType;
        } else {
            // 如果該 key 還沒初始化，根據 sourceRef 的類型來初始化
            if (abnormalKeysRef[key] === undefined) {
                abnormalKeysRef[key] = isArray(sourceRef) ? [] : {};
            }

            if (isArray(abnormalKeysRef[key])) {
                entryCorrectIndex(abnormalKeysRef[key] as any, nextKey as number);
            }

            // 移動 abnormalKeys 指標
            abnormalKeysRef = abnormalKeysRef[key];
        }
    }
};

export function getValueByPath<T extends Record<string, any>>(obj: Record<string, any>, path: (string | number)[]): T {
    return path.reduce((acc, k) => (acc != null ? acc[k] : undefined), obj) as T;
}