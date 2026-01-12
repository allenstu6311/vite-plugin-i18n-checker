import { UseAIConfig } from "../../sync/types";

export function printFinalErrorSummary({
    status,
    errorRecord,
    lang,
    useAI,
}: {
    status: {
        total: number,
        success: number,
        failed: number,
    },
    errorRecord: Record<string, { pathStack: string, value: string, error: any }[]>;
    lang: string;
    useAI: UseAIConfig;
}) {
    const { total, success, failed } = status;

    console.log('\n──────────────────────────────────────────');
    console.log(`🔴  AI Translation Summary (${lang})`);
    console.log('──────────────────────────────────────────');

    console.log(`Total tasks: ${total}`);
    console.log(`Success:     ${success}`);
    console.log(`Failed:      ${failed}\n`);

    const MAX_DISPLAY = 15; // 🔥 可調整

    for (const key in errorRecord) {
        const errorHint = errorRecord[key][0].error;
        if (!errorHint) continue;

        const items = errorRecord[key];
        const displayItems = items.slice(0, MAX_DISPLAY);
        const remaining = items.length - displayItems.length;

        const provider = useAI.provider;
        console.log(`  Provider: ${provider}`);
        console.log(`  Error type: ${key} (${errorHint.code || 'N/A'})`);
        console.log(`  Message: ${errorHint.message}\n`);

        // 印出前 n 筆
        displayItems.forEach(item => {
            console.log(`  ✖ ${item.pathStack} → "${item.value}"`);
        });

        // 剩餘項目
        if (remaining > 0) {
            console.log(`  ...and ${remaining} more\n`);
        } else {
            console.log('');
        }
        console.log('');
    }
}