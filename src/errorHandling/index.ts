import { getGlobalConfig } from '../config';
import { error, warning } from '../utils';
import { appendCallStack, captureCallStack } from './callStack';
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

    const callStack = captureCallStack();
    const fullMessage = appendCallStack(message, callStack);

    if (failOnError) {
        throw new Error(fullMessage);
    }
    error(fullMessage);
}

export function handleWarning<C extends ErrorCode>(
    code: C,
    ...args: Parameters<(typeof errorRegistry)[C]>
) {
    const handler = getHandler(code);
    const message = handler(...args);

    const callStack = captureCallStack();
    const fullMessage = appendCallStack(message, callStack);

    warning(fullMessage);
}

export function getErrorMessage<C extends ErrorCode>(
    code: C,
    ...args: Parameters<(typeof errorRegistry)[C]>
) {
    const handler = getHandler(code);
    return handler(...args);
}
