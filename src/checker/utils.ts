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