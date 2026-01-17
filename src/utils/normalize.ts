import YAML from 'yaml';
import { ParserType } from '../parser/types';

function normalizeJson(content: string) {
    if (!content) return '';
    const obj = JSON.parse(content);
    return JSON.stringify(obj, null, 2) + '\n';
}

function normalizeYaml(content: string) {
    if (!content) return '';
    const obj = YAML.parse(content);
    return YAML.stringify(obj);
}

export function normalizeContent(
    extensions: string,
    targetFileContent: string,
    targetFileSyncResult: string
) {
    switch (extensions) {
        case ParserType.JSON:
            return {
                targetContent: normalizeJson(targetFileContent),
                targetSyncContent: normalizeJson(targetFileSyncResult),
            };
        case ParserType.YML:
        case ParserType.YAML:
            return {
                targetContent: normalizeYaml(targetFileContent),
                targetSyncContent: normalizeYaml(targetFileSyncResult),
            };
        default:
            return {
                targetContent: targetFileContent,
                targetSyncContent: targetFileSyncResult,
            };
    }
}

export function normilzeContent(
    extensions: string,
    targetFileContent: string,
    targetFileSyncResult: string
) {
    return normalizeContent(extensions, targetFileContent, targetFileSyncResult);
}
