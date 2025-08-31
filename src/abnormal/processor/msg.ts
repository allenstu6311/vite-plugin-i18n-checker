import { AbnormalType } from "../types";

const invalidKeyMap = {
    zh_CN: {
        [AbnormalType.DIFF_TYPE]: '類型不符',
        [AbnormalType.DIFF_ARRAY_LENGTH]: '陣列長度不同',
    },
    en_US: {
        [AbnormalType.DIFF_TYPE]: 'Type mismatch',
        [AbnormalType.DIFF_ARRAY_LENGTH]: 'Array length mismatch',
    },
}

export {
    invalidKeyMap
}