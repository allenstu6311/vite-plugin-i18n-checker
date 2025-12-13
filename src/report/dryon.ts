import { createTwoFilesPatch } from "diff";
import { html } from 'diff2html';
import fs from 'fs';
import { getFileName } from "../helpers/path";

function generateDryonReport(diffContent: string) {
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

function getDiffContent(filePath: string, targetFile: string, syncResult: string) {
    const diffContent = createTwoFilesPatch(
        filePath,
        filePath,
        targetFile,
        syncResult,
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

function writeDiffReport(filePath: string, targetFile: string, syncResult: string) {
    const diffContent = getDiffContent(filePath, targetFile, syncResult);
    const diffHtml = generateDryonReport(diffContent);
    fs.writeFileSync(`${getFileName(filePath)}.html`, diffHtml);
}

export {
    writeDiffReport
};
