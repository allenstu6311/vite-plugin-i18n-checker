let spinner: NodeJS.Timeout | null = null;
let spinnerText = '';

export function startSpinner(text = '處理中') {
    if (spinner !== null) return;

    spinnerText = text;
    const frames = ['◐', '◓', '◑', '◒'];
    let i = 0;

    spinner = setInterval(() => {
        process.stdout.write(`\r${frames[i = ++i % frames.length]} ${spinnerText}    `);
    }, 100);
}

export function updateSpinner(text: string) {
    spinnerText = text;
}

export function stopSpinner(text = '完成') {
    if (spinner !== null) {
        clearInterval(spinner);
        spinner = null;
        process.stdout.write(`\r✔ ${text}                    \n`);
    }
}
