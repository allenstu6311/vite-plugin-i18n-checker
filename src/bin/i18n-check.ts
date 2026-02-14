#!/usr/bin/env node
import { program } from "commander";
import { resolve } from "path";
import { pathToFileURL } from "url";
import { createServer } from "vite";
import i18nCheckerPlugin from "..";

program
  .option("-s, --sourceLocale <sourceLocale>")
  .option("-p, --localesPath <localesPath>")
  .option("-x, --extensions <extensions>")
  .option("-f, --failOnError")
  .option("-m, --applyMode <applyMode>")
  .option("--include <patterns...>")
  .option("-e, --exclude <patterns...>")
  .option("-i, --ignoreKeys <patterns...>")
  .option("-r, --rules <path>")
  .option("-w, --watch")
  .option("--report-dir <path>")
  .option("--report-retention <days>")
  .parse();

async function loadModule(path: string) {
  const absPath = resolve(process.cwd(), path);
  const mod = await import(pathToFileURL(absPath).href);
  return mod?.default ?? mod;
}

async function run() {
  const opts: any = program.opts();
  const { watch, reportDir, reportRetention } = opts;

  opts.report = {
    ...opts.report,
    dir: reportDir || 'i18CheckerReport',
    retention: reportRetention ?? 7,
  };

  if (opts.rules) {
    const fileRules = await loadModule(opts.rules);
    opts.rules = fileRules;
  }

  const server = await createServer({
    root: process.cwd(),
    plugins: [i18nCheckerPlugin(opts)],
  });
  await server.pluginContainer.buildStart({}); // 讓Vite初始化模組系統
  if (!watch || process.env.CI) await server.close();
}

run().catch((err) => {
  console.error("[i18n-check] Error:", err.message);
  process.exit(1);
});
