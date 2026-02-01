import { createTwoFilesPatch } from "diff";
import { html } from 'diff2html';
import { resolve } from "path";
import { I18nCheckerOptions } from "../../config/types";
import { extractFolderPath, writeFileEnsureDir } from "../../helpers/path";
import { normalizeContent } from "../../utils/normalize";

function renderDiffHtmlTemplate(diffContent: string) {
    const html = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<!-- Make sure to load the highlight.js CSS file before the Diff2Html CSS file -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.1/styles/github.min.css" />
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css" />
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html-ui.min.js"></script>

<body>

   ${diffContent}

</body>

</html>
    
    `;

    return html;
}

function getDiffContent(
    {
        extensions,
        targetFilePath,
        targetFileContent,
        targetFileSyncResult,
    }: {
        extensions: string,
        targetFilePath: string,
        targetFileContent: string,
        targetFileSyncResult: string,
    }
) {
    const { targetContent, targetSyncContent } = normalizeContent(extensions, targetFileContent, targetFileSyncResult);
    const diffContent = createTwoFilesPatch(
        targetFilePath,
        targetFilePath, //因為是同一份文件，所以source和target都是targetFilePath
        targetContent,
        targetSyncContent,
        '',
        '',
        {
            context: 3,
        }
    );

    return html(diffContent, {
        outputFormat: 'side-by-side',
        drawFileList: false,
        matching: 'lines',
    });
}

async function writeDiffReport({
    globalConfig,
    targetFilePath,
    targetFileContent,
    targetFileSyncResult,
}: {
    globalConfig: I18nCheckerOptions,
    targetFilePath: string,
    targetFileContent: string,
    targetFileSyncResult: string,
}) {
    const { extensions, reportPath, sync } = globalConfig;
    const { preview } = sync || {};
    if (!preview) return;

    const diffContent = getDiffContent({
        extensions,
        targetFilePath,
        targetFileContent,
        targetFileSyncResult,
    });

    const diffHtml = renderDiffHtmlTemplate(diffContent);
    const { localesPath } = globalConfig;
    const folderPath = extractFolderPath(targetFilePath, localesPath);

    const url = resolve(reportPath, `preview/${folderPath}.html`);
    await writeFileEnsureDir(url, diffHtml);
}

export {
    writeDiffReport
};

