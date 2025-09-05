import { isArray } from "../../utils";
import { AbnormalType } from "../types";

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
    let abnormalKeysRef = abnormalKeys; // 暫存指標

    pathStack.forEach((preKey, prevIndex) => {
        sourceRef = sourceRef[preKey]; // 因為sourceRef是最外層的template，所以需要先進入內部

        if (isArray(sourceRef)) {
            abnormalKeysRef[preKey] = abnormalKeysRef[preKey] || [];
            const index = indexStack[indexStackCount] ?? 0;
            entryCorrectIndex(abnormalKeysRef[preKey], index);

            if(prevIndex === pathStack.length - 1){
                // 結尾為陣列
               abnormalKeysRef[preKey] = abnormalType;
            }else{
                abnormalKeysRef = abnormalKeysRef[preKey];
            }
            indexStackCount++;
        } else {
            if (prevIndex === pathStack.length - 1) {
                abnormalKeysRef[preKey] = abnormalType;
            } else {
                abnormalKeysRef[preKey] = abnormalKeysRef[preKey] || {};
                abnormalKeysRef = abnormalKeysRef[preKey];
            }
        }
    })
}
