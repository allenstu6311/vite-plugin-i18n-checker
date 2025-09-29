import { AbnormalType } from "../types";

const abnormalMessageMap  = {
    zh_CN: {
        [AbnormalType.DIFF_STRUCTURE_TYPE]: '結構類型不符（陣列與物件不匹配)',
        [AbnormalType.DIFF_ARRAY_LENGTH]: '陣列長度不同',
        [AbnormalType.MISS_FILE]: '檔案不存在',
    },
    en_US: {
        [AbnormalType.DIFF_STRUCTURE_TYPE]: 'Structure type mismatch (array vs object)',
        [AbnormalType.DIFF_ARRAY_LENGTH]: 'Array length mismatch',
        [AbnormalType.MISS_FILE]: 'File not found',
    },
}

export {
    abnormalMessageMap 
}