#!/usr/bin/env node
import { program } from 'commander';
import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { createServer } from 'vite';
import i18nCheckerPlugin from '..';

program
    .option('-s, --sourceLocale <sourceLocale>')
    .option('-p, --localesPath <localesPath>')
    .option('-x, --extensions <extensions>')
    .option('-f, --failOnError')
    .option('-m, --applyMode <applyMode>')
    .option('--include <patterns...>')
    .option('-e, --exclude <patterns...>')
    .option('-i, --ignoreKeys <patterns...>')
    .option('-r, --rules <path>')
    .option('--sync [path]')
    .option('-w, --watch')
    .option('--report-dir <path>')
    .option('--report-retention <days>')
    .option('--override')
    .option('--autoFill')
    .option('--autoDelete')
    .option('--no-preview')
    .parse();


async function loadModule(path: string) {
    const absPath = resolve(process.cwd(), path);
    const mod = await import(pathToFileURL(absPath).href);
    return mod?.default ?? mod;
}

async function run() {
    const opts: any = program.opts();
    const {
        watch,
        sync,
        override,
        autoFill,
        autoDelete,
        preview,
        reportDir,
        reportRetention
    } = opts;

    const syncOverrides: Record<string, any> = {};
    if (override === true) syncOverrides.override = true;
    if (autoFill === true) syncOverrides.autoFill = true;
    if (autoDelete === true) syncOverrides.autoDelete = true;
    if (typeof preview === 'boolean') syncOverrides.preview = preview; // 要保留 false
    if (reportDir || reportRetention !== undefined) {
        opts.report = {
            ...(opts.report ?? {}),
            ...(reportDir ? { dir: reportDir } : {}),
            ...(reportRetention !== undefined ? { retention: Number(reportRetention) } : {}),
        };
    }

    // 1) --sync <path>：先載入檔案，再套 CLI overrides
    if (typeof sync === 'string') {
        const fileSync = await loadModule(sync);
        opts.sync = { ...(fileSync ?? {}), ...syncOverrides };
    } else if (sync === true) {
        // 2) --sync（不帶 path）：啟用 sync（用空物件代表開啟），再套 overrides
        opts.sync = { ...syncOverrides };
    }

    if (opts.rules) {
        const fileRules = await loadModule(opts.rules);
        opts.rules = fileRules;
    }
    const server = await createServer({
        root: process.cwd(),
        configFile: false,
        plugins: [i18nCheckerPlugin(opts)]
    });
    await server.pluginContainer.buildStart({}); // 讓Vite初始化模組系統
    if (!watch || process.env.CI) await server.close();
}

run().catch(err => {
    console.error('[i18n-check] Error:', err.message);
    process.exit(1);
});