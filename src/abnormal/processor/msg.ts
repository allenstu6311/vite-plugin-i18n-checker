import { AbnormalType } from "../types";

const abnormalMessageMap = {
    zh_CN: {
        [AbnormalType.DIFF_STRUCTURE_TYPE]: '資料類型不符',
        [AbnormalType.DIFF_ARRAY_LENGTH]: '陣列長度不同',
        [AbnormalType.MISS_FILE]: '檔案不存在',
        [AbnormalType.EMPTY_FILE]: '檔案為空',
    },
    en_US: {
        [AbnormalType.DIFF_STRUCTURE_TYPE]: 'Data type mismatch',
        [AbnormalType.DIFF_ARRAY_LENGTH]: 'Array length mismatch',
        [AbnormalType.MISS_FILE]: 'File not found',
        [AbnormalType.EMPTY_FILE]: 'File is empty',
    },
};

export {
    abnormalMessageMap
};
