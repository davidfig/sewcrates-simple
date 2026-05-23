import { writeFile } from "fs/promises"
import { replaceLine, writeLine } from "./console.ts"
import { postIndex, type PostData } from "./post.ts"
import { clearDir, getIndex } from "./util.ts"
import { join } from "path"
import { button, top } from "./boilerplate.ts"

type Dates = Record<string, PostData[]>

function insertSorted(year: PostData[], post: PostData) {
    for (let i = 0; i < year.length; i++) {
        if (post.date < year[i].date) {
            year.splice(i, 0, post)
            return
        }
    }
    year.push(post)
}

function yearHeader(years: Dates, year: string): string {
    let s = '<div class="years">'
    const keys = Object.keys(years)
    keys.sort((a, b) => b < a ? -1 : b > a ? 1 : 0)
    for (const current of keys) {
        s += button(current, `/dates/${current}.html`, current === year ? ' current' : '')
    }
    s += '</div>'
    return s
}

async function writeDates(years: Dates) {
    await clearDir(join('public', 'dates'), 'dates')
    
    const index = await getIndex()
    const keys = Object.keys(years)
    const text = 'Writing date indicies'
    writeLine(`${text} (0 of ${keys.length})`)
    for (let i = 0; i < keys.length; i++) {
        replaceLine(`${text} (${i} of ${keys.length})`)
        const year = years[keys[i]]
        let s = index.replaceAll('{{title}}', `Posts in ${keys[i]}`)
        let body = '<div class="content">'
        body += top()
        body += yearHeader(years, keys[i])
        body += `<div class="index-title">Posts in ${keys[i]}</div>`
        body += '<div class="index">'
        const posts = years[keys[i]];
        for (const post of posts) {
            body += postIndex(post)
        }
        body += '</div>' // index
        body += '</div>' // content
        s = s.replaceAll('{{body}}', body)
        await writeFile(join('public', 'dates', `${keys[i]}.html`), s)
    }
    replaceLine(`${text} (${keys.length} of ${keys.length})`, true)

}

export async function generateDates(posts: PostData[]) {
    // break up the posts by date and sort them
    const years: Dates = {}

    const text = 'Sorting posts by date'
    writeLine(`${text} (0 of ${posts.length})`)
    for (let i in posts) {
        const post = posts[i]
        replaceLine(`${text} (${i} of ${posts.length})`)
        const year = posts[i].date.getFullYear()
        if (!years[year]) {
            years[year] = []
        }
        insertSorted(years[year], post)
    }
    replaceLine(`${text} (${posts.length} of ${posts.length})`, true)

    await writeDates(years)
}
