import YAML from 'yaml';
import { ParserType } from "../parser/types";
import { ReportType } from "./types";


function getColor(type: ReportType = 'error') {
    switch (type) {
        case 'warning': return 'yellow';
        case 'error': return 'red';
        case 'success': return 'green';
        case 'info': return 'cyan';
    }
}

function normalizeJson(content: string) {
    const obj = JSON.parse(content);
    return JSON.stringify(obj, null, 2) + '\n';
}

function normalizeYaml(content: string) {
    const obj = YAML.parse(content);
    return YAML.stringify(obj);
}

function normilzeContent(extensions: string, targetFileContent: string, targetFileSyncResult: string) {
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

export {
    getColor,
    normilzeContent
};

