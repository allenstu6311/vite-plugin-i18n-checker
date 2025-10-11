import { initConfigManager, setGlobalConfig } from "@/config";
import { initErrorMessageManager } from "@/error";
import { beforeEach } from "vitest"

beforeEach(() => {
    setGlobalConfig({
        sourceLocale: 'zh_CN',
        localesPath: 'locale',
        extensions: 'ts',
        errorLocale: 'zh_CN',
    });

    initConfigManager();
    initErrorMessageManager();


})