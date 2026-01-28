import { handleWarning } from "../../errorHandling";
import { SyncCheckResult } from "../../errorHandling/schemas/sync";
import { AIProvider } from "../types";
import { PROVIDER_REGISTRY } from "./provider";

function safeJsonParse(data: any, provider: AIProvider) {
    const output = PROVIDER_REGISTRY[provider]?.extractContent(data) || data;;
    let text = output.trim();
    // 1. 去掉 code block
    text = text.replace(/^```[a-z]*\s*/i, '').replace(/```$/i, '').trim();

    // 2. 如果是單純一行中文（如 測試），自動包成 JSON 結構
    if (!text.startsWith('{') && !text.startsWith('[')) {
        return {
            translations: [text]
        };
    }

    // 3. 嘗試 JSON.parse
    try {
        return JSON.parse(text);
    } catch (err) {
        handleWarning(SyncCheckResult.AI_INVALID_JSON, text.slice(0, 200));
        return { translations: [text] };
    }
}

const getTemplate = (input: string[], lang: string) => `
你是一個極簡主義者（minimalist）翻譯機器。
你的唯一職責是將輸入的 JSON 陣列翻譯成目標語系，並以**純 JSON**格式輸出。

目標語系：${lang}
翻譯方向：將收到的語言轉換成 → ${lang}

**格式規則 (極度嚴格)：**
1. **必須**輸出單一、完整、可被 JSON.parse() 解析的 JSON 物件。
2. **結構必須且只能是**：{"translations":[...]}
3. 你**絕對禁止**輸出任何程式碼區塊標記（\`\`\`）、任何額外文字、解釋、註解、標題或前言後語。
4. **字串內容中只要出現雙引號（"），必須自動跳脫為 \\\"。**
5. 所有換行、tab、反斜線等特殊字元必須遵守 JSON 標準格式（如：\\n、\\t、\\\\）。
6. 翻譯後的陣列長度必須與輸入完全一致，不可增刪任何元素。

要翻譯的 JSON 陣列：
${JSON.stringify(input)}
`;


function createBatchesByChars(
    queue: { pathStack: (string | number)[], value: string }[],
    maxChars: number
): { pathStack: (string | number)[], value: string }[][] {
    const batches = [];
    let currentBatch = [];
    let currentBatchSize = 0;

    for (const item of queue) {
        const itemSize = String(item.value).length;
        // 如果加上這個 item 會超過限制，開始新批次
        if (currentBatchSize + itemSize > maxChars && currentBatch.length > 0) {
            batches.push(currentBatch);
            currentBatch = [];
            currentBatchSize = 0;
        }

        currentBatch.push(item);
        currentBatchSize += itemSize;
    }

    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }

    return batches;
}

export { createBatchesByChars, getTemplate, safeJsonParse };

