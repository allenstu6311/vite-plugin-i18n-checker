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