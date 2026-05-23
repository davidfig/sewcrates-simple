import { readdir, readFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { replaceLine, writeLine } from "./console.ts";

export async function getIndex(): Promise<string> {
    return await readFile(join('scripts', 'index.html'), { encoding: 'utf8'} )
}

export async function clearDir(directory: string, type: string) {
    const files = await readdir(directory)
    const text = `Clearing ${type}`
    writeLine(`${text} (1 of ${files.length})`)
    for (let i in files) {
        replaceLine(`${text} (${i} of ${files.length})`)
        await unlink(join(directory, files[i]))
    }
    replaceLine(`${text} (${files.length} of ${files.length})`, true)
}

