import { isArray } from "../utils/is";

export const isDiffType = (a: Record<string, any>, b: Record<string, any>) => {
    const typeA = Object.prototype.toString.call(a);
    const typeB = Object.prototype.toString.call(b);
    return typeA !== typeB;
};

export const isDiffArrayLength = (a: any, b: any) => {
    if(isArray(a) && isArray(b)){
        return a.length !== b.length;
    }
    return false;
}

const getPrevKeys = (prev: string[]) => {}

export const updateErrorKeys = (errorKeys: Record<string, any>, key: string, source: Record<string, any>, target: Record<string, any>) => {
    errorKeys[key] = {
        source,
        target,
    }
}