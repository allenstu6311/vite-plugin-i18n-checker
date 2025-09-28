import { initConfigManager, setGlobalConfig } from "@/config";
import { initErrorMessageManager, setErrorMsgLang } from "@/error";
import { beforeEach } from "vitest"

beforeEach(() => {
    initConfigManager();
    initErrorMessageManager();
    setErrorMsgLang('zh_CN');

    setGlobalConfig({
        baseLocale: 'zh_CN',
        localesPath: 'locale/test',
        extensions: 'ts',
        outputLang: 'zh_CN',
    });
})