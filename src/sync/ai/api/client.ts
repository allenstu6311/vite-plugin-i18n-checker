import { UseAI } from "../../../config/types";
import { http } from "../../../http/interceptors";

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

const getOpenAIAIResponse = async (input: string[], lang: string, useAI: UseAI) => {
    return http.post<any>(`https://api.openai.com/v1/chat/completions`, {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: getTemplate(input, lang),
            }
        ]
    }, {
        headers: {
            'Authorization': `Bearer ${useAI.apiKey}`,
        },
    }, {
        // retry: 3,
        onError: (error) => {
            // console.log('error', error.response.data);
        }
    });
};

async function getGoogleAIResponse(input: string[], lang: string, useAI: UseAI) {
    return http.post<any>(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${useAI.apiKey}`, {
        contents: [
            {
                parts: [
                    {
                        text: getTemplate(input, lang),
                    }
                ]
            }
        ],
    }, {}, {
        // retry: 3,
        onError: (error) => {
            // console.log('error', error);
        },
        // onSuccess: (res) => {
        //     // console.log('res', res);
        // }
    });
}

export { getGoogleAIResponse, getOpenAIAIResponse };

