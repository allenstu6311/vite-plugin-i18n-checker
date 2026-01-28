import { getGlobalConfig } from '../config';
import { error, warning } from '../utils';
import { errorRegistry } from './registry';

type ErrorCode = keyof typeof errorRegistry;

function getHandler<C extends ErrorCode>(code: C) {
    return errorRegistry[code] as (...inner: Parameters<(typeof errorRegistry)[C]>) => string;
}

export function handleError<C extends ErrorCode>(
    code: C,
    ...args: Parameters<(typeof errorRegistry)[C]>
) {
    const handler = getHandler(code);
    const message = handler(...args);
    const { failOnError } = getGlobalConfig();
    if (failOnError) {
        throw new Error(message);
    }
    error(message);
}

export function handleWarning<C extends ErrorCode>(
    code: C,
    ...args: Parameters<(typeof errorRegistry)[C]>
) {
    const handler = getHandler(code);
    const message = handler(...args);
    warning(message);
}

export function getErrorMessage<C extends ErrorCode>(
    code: C,
    ...args: Parameters<(typeof errorRegistry)[C]>
) {
    const handler = getHandler(code);
    return handler(...args);
}
