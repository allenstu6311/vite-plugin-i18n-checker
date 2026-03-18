import { resetConfigManager, setGlobalConfig } from "@/config";
import { beforeEach } from "vitest";

beforeEach(() => {
    resetConfigManager();
    setGlobalConfig({
        sourceLocale: 'zh_CN',
        localesPath: 'locale',
        extensions: 'ts',
    });
});
