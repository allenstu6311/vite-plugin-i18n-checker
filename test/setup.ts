import { initConfigManager, setGlobalConfig } from "@/config";
import { initErrorMessageManager } from "@/error";
import { beforeEach } from "vitest"

beforeEach(() => {
    initConfigManager();
    initErrorMessageManager();

    setGlobalConfig({
        sourceLocale: 'zh_CN',
        localesPath: 'locale/test',
        extensions: 'ts',
        errorLocale: 'zh_CN',
    });
})