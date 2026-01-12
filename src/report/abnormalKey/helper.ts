import { ReportType } from "../types";

let spinner: NodeJS.Timeout | null = null;

export function getColor(type: ReportType = 'error') {
    switch (type) {
        case 'warning': return 'yellow';
        case 'error': return 'red';
        case 'success': return 'green';
        case 'info': return 'cyan';
    }
}

export function startSpinner(text = '翻譯中') {
    if (spinner !== null) return;

    const frames = ['◐', '◓', '◑', '◒'];
    let i = 0;

    spinner = setInterval(() => {
        process.stdout.write(`\r${frames[i = ++i % frames.length]} ${text}... `);
    }, 100);
}

export function stopSpinner(text = '完成') {
    if (spinner !== null) {
        clearInterval(spinner);
        spinner = null;
        process.stdout.write(`\r✔ ${text}\n`);
    }
}