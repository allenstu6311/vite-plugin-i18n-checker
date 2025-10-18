import { FileCheckResult, FileErrorParams } from "./schemas/file";
import { configErrorMap, fileErrorMap, runtimeErrorMap, tsParserErrors } from "./catalogs";
import { TsParserCheckResult, TsParserErrorParams } from "./schemas/parser/ts";
import { ConfigCheckResult, ConfigErrorParams } from "./schemas/config";
import { getGlobalConfig } from "../config";
import { error } from "../utils";
import { RuntimeCheckResult, RuntimeErrorParams } from "./schemas/runtime";

export function createErrorMessageManager() {
  const { errorLocale } = getGlobalConfig();

  const FILE_ERRORS = '[FILE_ERRORS] ';
  const TS_PARSER_ERRORS = '[TS_PARSER_ERRORS] ';
  const CONFIG_ERRORS = '[CONFIG_ERRORS] ';
  const RUNTIME_ERRORS = '[RUNTIME_ERRORS] ';

  return {
    getFileMessage<T extends FileCheckResult>(
      code: T,
      ...args: Parameters<FileErrorParams[T]>): string {
      return FILE_ERRORS + (fileErrorMap[errorLocale][code] as (...args: any[]) => string)(...args) || '';
    },

    getTsParserMessage<T extends TsParserCheckResult>(
      code: T,
      ...args: Parameters<TsParserErrorParams[T]>): string {
      return TS_PARSER_ERRORS + (tsParserErrors[errorLocale][code] as (...args: any[]) => string)(...args) || '';
    },
    getConfigMessage<T extends ConfigCheckResult>(
      code: T,
      ...args: Parameters<ConfigErrorParams[T]>): string {
      return CONFIG_ERRORS + (configErrorMap[errorLocale][code] as (...args: any[]) => string)(...args) || '';
    },

    getRuntimeMessage<T extends RuntimeCheckResult>(
      code: T,
      ...args: Parameters<RuntimeErrorParams[T]>): string {
      return RUNTIME_ERRORS + (runtimeErrorMap[errorLocale][code] as (...args: any[]) => string)(...args) || '';
    },
  };
}

export const handlePluginError = (message: string) => {
  const { failOnError } = getGlobalConfig();
  if (failOnError) {
    throw new Error(message);
  } else {
    error(message);
  }
};

type ErrorMessageManagerTypes = ReturnType<typeof createErrorMessageManager>;

let manager: ErrorMessageManagerTypes | null = null;

export function initErrorMessageManager() {
  if (!manager) {
    manager = createErrorMessageManager();
  }
  return manager;
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

export const getRuntimeErrorMessage = <
  T extends RuntimeCheckResult
>(
  code: T,
  ...args: Parameters<RuntimeErrorParams[T]>
): string => {
  return initErrorMessageManager().getRuntimeMessage(code, ...args);
};

export const getConfigErrorMessage = (...args: Parameters<ErrorMessageManagerTypes['getConfigMessage']>) => initErrorMessageManager().getConfigMessage(...args);