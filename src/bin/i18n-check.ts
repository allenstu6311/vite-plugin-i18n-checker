#!/usr/bin/env node
import { program } from 'commander';
import { createServer } from 'vite';
import i18nCheckerPlugin from '..'

program
    .option('-s, --sourceLocale <sourceLocale>')
    .option('-l, --localesPath <localesPath>')
    .option('-x, --extensions <extensions>')
    .option('-f, --failOnError')
    .option('-m, --applyMode <applyMode>')
    .option('-e, --exclude <exclude>')
    .option('-i, --ignoreKeys <ignoreKeys>')
    .option('-r, --rules <rules>')
    .option('-t, --errorLocale <errorLocale>')
    .option('--no-watch')
    .parse()

async function run() {
    const { watch } = program.opts();
    const server = await createServer({
        root: process.cwd(),
        plugins: [i18nCheckerPlugin(program.opts())]
    });
    await server.pluginContainer.buildStart({}); // 讓Vite初始化模組系統
    if (!watch) await server.close();
}

run()