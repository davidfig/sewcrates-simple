import ansi from 'ansi-escape-sequences'

export function writeLine(text: string) {
    process.stdout.write(text)
}

export function replaceLine(text: string, endLine?: boolean) {
    process.stdout.write(ansi.erase.inLine(1))
    process.stdout.write(ansi.cursor.horizontalAbsolute(0))
    process.stdout.write(text + (endLine ? '\n' : ''))
}