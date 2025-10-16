#!/usr/bin/env node
import { program } from 'commander';
import { createServer } from 'vite';
import i18nCheckerPlugin from '..'

program
    .option('-s, --sourceLocale <sourceLocale>')
    .option('-l, --localesPath <localesPath>')
    .option('-e, --extensions <extensions>')
    .option('-f, --failOnError <failOnError>')
    .option('-a, --applyMode <applyMode>')
    .option('-i, --ignoreFiles <ignoreFiles>')
    .option('-k, --ignoreKeys <ignoreKeys>')
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