import fs from 'fs';
import path from 'path';

function parseDateFolder(name: string): Date | null {
    const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(name);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;

    const date = new Date(year, month - 1, day);
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }
    return date;
}

export async function cleanupReports(reportDir: string, retentionDays: number) {
    if (!retentionDays || retentionDays <= 0) return;

    const timePattern = /^\d{2}-\d{2}-\d{2}$/;
    const datePattern = /^\d{4}-\d{1,2}-\d{1,2}$/;
    const timeName = path.basename(reportDir);
    const dateName = path.basename(path.dirname(reportDir));
    const baseDir = (timePattern.test(timeName) && datePattern.test(dateName))
        ? path.dirname(path.dirname(reportDir))
        : reportDir;

    let entries: fs.Dirent[];
    try {
        entries = await fs.promises.readdir(baseDir, { withFileTypes: true });
    } catch {
        return;
    }

    const now = Date.now();
    const maxAgeMs = retentionDays * 24 * 60 * 60 * 1000;

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const date = parseDateFolder(entry.name);
        if (!date) continue;

        if (now - date.getTime() > maxAgeMs) {
            await fs.promises.rm(path.join(baseDir, entry.name), { recursive: true, force: true });
        }
    }
}
