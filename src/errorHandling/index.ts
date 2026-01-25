import { error } from '../utils';
import { getGlobalConfig } from '../config';
import { errorRegistry } from './registry';

export function handleError<C extends keyof typeof errorRegistry>(
    code: C,
    ...args: Parameters<(typeof errorRegistry)[C]>
) {
    const message = errorRegistry[code](...args);
    const { failOnError } = getGlobalConfig();
    if (failOnError) {
        throw new Error(message);
    }
    error(message);
}
