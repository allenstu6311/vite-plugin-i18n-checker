import { configErrors } from './schemas/config';
import { fileErrors } from './schemas/file';
import { tsErrors } from './schemas/parser';
import { runtimeErrors } from './schemas/runtime';
import { syncErrors } from './schemas/sync';

const ERROR_PREFIX = '[Vite-I18n-Checker]';

const withPrefix = <T extends Record<string, (...args: any[]) => string>>(
    prefix: string,
    group: T
) => Object.fromEntries(
    Object.entries(group).map(([code, fn]) => [
        code,
        (...args: Parameters<typeof fn>) => `${ERROR_PREFIX}${prefix}${fn(...args)}`,
    ])
) as { [K in keyof T]: (...args: Parameters<T[K]>) => string };

export const errorRegistry = {
    ...withPrefix('[FILE_ERRORS] ', fileErrors),
    ...withPrefix('[CONFIG_ERRORS] ', configErrors),
    ...withPrefix('[RUNTIME_ERRORS] ', runtimeErrors),
    ...withPrefix('[TS_PARSER_ERRORS] ', tsErrors),
    ...withPrefix('[SYNC_ERRORS] ', syncErrors),
};
