import fs from 'fs'
import path from 'path'

export function isDirectory(filePath: string): boolean {
  return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()
}

export function isFile(filePath: string): boolean {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile()
}

export function isFileReadable(path: string): boolean {
  return fs.existsSync(path)
}

export function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null
}

export function isArray(value: any): boolean {
  return Array.isArray(value)
}

export function isPrimitive(value: unknown): boolean {
  return (
    value === null ||
    (typeof value !== 'object' && typeof value !== 'function')
  );
}

export function isUndefined(value: any): boolean {
  return value === undefined;
}

export function isEmptyObject(obj: any): boolean {
  return obj
    && typeof obj === 'object'
    && !Array.isArray(obj)
    && Object.keys(obj).length === 0;
}

export function isEmptyArray(array: any[]): boolean {
  return array.length === 0;
}

export const isDiffType = (a: Record<string, any>, b: Record<string, any>) => {
  const typeA = Object.prototype.toString.call(a);
  const typeB = Object.prototype.toString.call(b);
  return typeA !== typeB;
};

export const isDiffArrayLength = (a: any, b: any) => {
  if (isArray(a) && isArray(b)) {
    return a.length !== b.length;
  }
  return false;
}

export function isMissingKey(target: any, key: string): boolean {
  return !target || !Object.prototype.hasOwnProperty.call(target, key);
}

export function isRepeatKey(target: any, key: string): boolean {
  return target && Object.prototype.hasOwnProperty.call(target, key);
}

export function isString(value: any):  value is string  {
  return typeof value === 'string';
}

export function isFalsy(value: unknown): value is false | "" | null | undefined | typeof NaN {
  return value === false ||
    value === "" ||
    value === null ||
    value === undefined ||
    Number.isNaN(value);
}