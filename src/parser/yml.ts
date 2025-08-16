import YAML from 'yaml';

export function parseYmlCode(code: string) {
    return YAML.parse(code);
}