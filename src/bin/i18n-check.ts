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
    .option('--sync <path>')
    .option('--no-watch')
    .parse();

async function run() {
    const opts: any = program.opts();
    const { watch } = opts;

    // --sync <path>：載入 sync 設定檔（JS/ESM default export）
    if (opts.sync) {
        const absPath = resolve(process.cwd(), opts.sync);
        const mod = await import(pathToFileURL(absPath).href);
        opts.sync = mod?.default ?? mod;
    }
    const server = await createServer({
        root: process.cwd(),
        plugins: [i18nCheckerPlugin(opts)]
    });
    await server.pluginContainer.buildStart({}); // 讓Vite初始化模組系統
    if (!watch || process.env.CI) await server.close();
}

run();