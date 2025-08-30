import { messageManager } from "./message";


export const { error, warning, success } = messageManager();

export {
    isDirectory,
    isFileReadable,
    isFile,
    isObject,
    isArray,
    isPrimitive,
    isUndefined,
    isEmptyObject
} from './is'