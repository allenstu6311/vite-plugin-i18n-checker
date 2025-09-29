import { FileCheckResult, FileErrorParams } from "./schemas/file";
import { configErrorMap, fileErrorMap, tsParserErrors } from "./catalogs";
import { TsParserCheckResult, TsParserErrorParams } from "./schemas/parser/ts";
import { ConfigCheckResult, ConfigErrorParams } from "./schemas/config";
import { getGlobalConfig } from "../config";
import { error } from "../utils";

export function createErrorMessageManager() {
  const { outputLang } = getGlobalConfig();

  const FILE_ERRORS = '[FILE_ERRORS] '
  const TS_PARSER_ERRORS = '[TS_PARSER_ERRORS] ';
  const CONFIG_ERRORS = '[CONFIG_ERRORS] ';

  return {
    getFileMessage<T extends FileCheckResult>(
      code: T,
      ...args: Parameters<FileErrorParams[T]>): string {
      return FILE_ERRORS + (fileErrorMap[outputLang][code] as (...args: any[]) => string)(...args) || '';
    },

    getTsParserMessage<T extends TsParserCheckResult>(
      code: T,
      ...args: Parameters<TsParserErrorParams[T]>): string {
      return TS_PARSER_ERRORS + (tsParserErrors[outputLang][code] as (...args: any[]) => string)(...args) || '';
    },
    getConfigMessage<T extends ConfigCheckResult>(
      code: T,
      ...args: Parameters<ConfigErrorParams[T]>): string {
      return CONFIG_ERRORS + (configErrorMap[outputLang][code] as (...args: any[]) => string)(...args) || '';
    },
  }
}

export const handlePluginError = (message: string) => {
  const { failOnError } = getGlobalConfig()
  if (failOnError) {
    throw new Error(message)
  } else {
    error(message)
  }
}

type ErrorMessageManagerTypes = ReturnType<typeof createErrorMessageManager>;

let manager: ErrorMessageManagerTypes | null = null

export function initErrorMessageManager() {
  if (!manager) {
    manager = createErrorMessageManager()
  }
  return manager
}

export const getFileErrorMessage = <
  T extends FileCheckResult
>(
  code: T,
  ...args: Parameters<FileErrorParams[T]>
): string => {
  return initErrorMessageManager().getFileMessage(code, ...args);
};

export const getTsParserErrorMessage = <
  T extends TsParserCheckResult
>(
  code: T,
  ...args: Parameters<TsParserErrorParams[T]>
): string => {
  return initErrorMessageManager().getTsParserMessage(code, ...args);
};

export const getConfigErrorMessage = (...args: Parameters<ErrorMessageManagerTypes['getConfigMessage']>) => initErrorMessageManager().getConfigMessage(...args);