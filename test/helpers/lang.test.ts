/**
 * 語系工具測試
 * 驗證語系清單解析、規則套用與排除行為
 */
import { I18nCheckerOptions } from "@/config/types";
import { getTotalLang } from "@/helpers/lang";
import fs from "fs";
import os from "os";
import path from "path";
import { describe, expect, it } from "vitest";

function createTempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lang-test-"));
  return {
    dir,
    cleanup: () => fs.rmSync(dir, { recursive: true, force: true }),
  };
}

function writeFile(baseDir: string, relativePath: string, content = "{}") {
  const fullPath = path.join(baseDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf-8");
  return fullPath;
}

function createConfig(
  localesPath: string,
  overrides: Partial<I18nCheckerOptions> = {},
): I18nCheckerOptions {
  return {
    sourceLocale: "zh_CN",
    localesPath,
    extensions: "json",
    failOnError: false,
    applyMode: "serve",
    include: [],
    exclude: [],
    ignoreKeys: [],
    rules: [],
    watch: false,
    report: {
      dir: "report",
      retention: 0,
    },
    ...overrides,
  };
}

describe("語系工具測試", () => {
  it("資料夾模式應回傳第一層資料夾名稱清單", () => {
    const { dir, cleanup } = createTempDir();
    try {
      fs.mkdirSync(path.join(dir, "zh_CN"));
      fs.mkdirSync(path.join(dir, "en_US"));
      fs.mkdirSync(path.join(dir, "zh_TW"));

      const result = getTotalLang({
        localesPath: dir,
        extensions: "json",
        config: createConfig(dir),
      });

      expect(result).toEqual(["en_US", "zh_TW"]);
    } finally {
      cleanup();
    }
  });

  it("檔案模式應該只回傳符合副檔名的檔案", () => {
    const { dir, cleanup } = createTempDir();
    try {
      writeFile(dir, "zh_CN.json");
      writeFile(dir, "en_US.json");
      writeFile(dir, "zh_TW.json");
      writeFile(dir, "readme.md", "# doc");

      const result = getTotalLang({
        localesPath: dir,
        extensions: "json",
        config: createConfig(dir),
      });

      expect(result).toEqual(["en_US.json", "zh_TW.json"]);
    } finally {
      cleanup();
    }
  });

  it("邊境：多層資料夾仍只取第一層語系", () => {
    const { dir, cleanup } = createTempDir();
    try {
      fs.mkdirSync(path.join(dir, "zh_CN"));
      fs.mkdirSync(path.join(dir, "en_US"));
      fs.mkdirSync(path.join(dir, "en_US", "nested", "deep"), {
        recursive: true,
      });

      const result = getTotalLang({
        localesPath: dir,
        extensions: "json",
        config: createConfig(dir),
      });

      expect(result).toEqual(["en_US"]);
    } finally {
      cleanup();
    }
  });

  it("邊境：exclude 字串規則應排除檔案", () => {
    const { dir, cleanup } = createTempDir();
    try {
      writeFile(dir, "zh_CN.json");
      const excludedPath = writeFile(dir, "es_ES.json");

      const result = getTotalLang({
        localesPath: dir,
        extensions: "json",
        config: createConfig(dir, {
          exclude: [excludedPath],
        }),
      });

      expect(result).not.toContain("es_ES.json");
    } finally {
      cleanup();
    }
  });

  it("邊境：exclude 正則規則應排除檔案", () => {
    const { dir, cleanup } = createTempDir();
    try {
      writeFile(dir, "zh_CN.json");
      writeFile(dir, "zh_TW.json");

      const result = getTotalLang({
        localesPath: dir,
        extensions: "json",
        config: createConfig(dir, {
          exclude: [/zh_TW\.json/],
        }),
      });

      expect(result).not.toContain("zh_TW.json");
    } finally {
      cleanup();
    }
  });

  it("include 字串規則應只保留指定檔案", () => {
    const { dir, cleanup } = createTempDir();
    try {
      writeFile(dir, "zh_CN.json");
      const includedPath = writeFile(dir, "en_US.json");
      writeFile(dir, "zh_TW.json");

      const result = getTotalLang({
        localesPath: dir,
        extensions: "json",
        config: createConfig(dir, {
          include: [includedPath],
        }),
      });

      expect(result).toEqual(["en_US.json"]);
    } finally {
      cleanup();
    }
  });

  it("include 正則規則應只保留指定檔案", () => {
    const { dir, cleanup } = createTempDir();
    try {
      writeFile(dir, "zh_CN.json");
      writeFile(dir, "en_US.json");
      writeFile(dir, "zh_TW.json");

      const result = getTotalLang({
        localesPath: dir,
        extensions: "json",
        config: createConfig(dir, {
          include: [/en_US\.json$/],
        }),
      });

      expect(result).toEqual(["en_US.json"]);
    } finally {
      cleanup();
    }
  });

  it("include 與 exclude 同時使用時應以 exclude 覆蓋", () => {
    const { dir, cleanup } = createTempDir();
    try {
      writeFile(dir, "zh_CN.json");
      const includeEnPath = writeFile(dir, "en_US.json");
      const includeZhPath = writeFile(dir, "zh_TW.json");

      const result = getTotalLang({
        localesPath: dir,
        extensions: "json",
        config: createConfig(dir, {
          include: [includeEnPath, includeZhPath],
          exclude: [includeEnPath],
        }),
      });

      expect(result).toEqual(["zh_TW.json"]);
    } finally {
      cleanup();
    }
  });
});
