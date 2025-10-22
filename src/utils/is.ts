import fs from 'fs';
import { Primitive } from '../types';

export function isDirectory(filePath: string): boolean {
  return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
}

export function isFile(filePath: string): boolean {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

export function isFileReadable(path: string): boolean {
  return fs.existsSync(path);
}

export function isObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null;
}

export function isArray<T extends unknown[]>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null ||
    (typeof value !== 'object' && typeof value !== 'function')
  );
}

export function isUndefined(value: unknown): boolean {
  return value === undefined;
}

export function isEmptyObject(obj: unknown): boolean {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj) &&
    Object.keys(obj as Record<string, unknown>).length === 0
  );
}

export function isEmptyArray(array: unknown[]): boolean {
  return array.length === 0;
}

export const isDiffType = (a: unknown, b: unknown) => {
  const getCategory = (val: unknown): 'array' | 'object' | 'primitive' => {
    if (isArray(val)) return 'array';
    if (isObject(val)) return 'object';
    return 'primitive';
  };

  return getCategory(a) !== getCategory(b);
};

export const isDiffArrayLength = (a: unknown, b: unknown) => {
  if (isArray(a) && isArray(b)) {
    return a.length !== b.length;
  }
  return false;
};

export function isMissingKey(target: unknown, key: string): boolean {
  return !target || !Object.prototype.hasOwnProperty.call(target, key);
}

export function isRepeatKey(target: Record<string, unknown>, key: string): boolean {
  return target && Object.prototype.hasOwnProperty.call(target, key);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isFalsy(value: unknown): value is false | "" | null | undefined | typeof NaN {
  return value === false ||
    value === "" ||
    value === null ||
    value === undefined ||
    Number.isNaN(value);
}