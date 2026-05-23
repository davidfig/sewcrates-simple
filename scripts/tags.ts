import { writeFile } from "fs/promises"
import { replaceLine, writeLine } from "./console.ts"
import { postIndex, type PostData } from "./post.ts"
import { clearDir, getIndex } from "./util.ts"
import { join } from "path"
import { top } from "./boilerplate.ts"

type Tags = Record<string, PostData[]>

function insertSorted(tag: PostData[], post: PostData) {
    for (let i = 0; i < tag.length; i++) {
        if (post.date < tag[i].date) {
            tag.splice(i, 0, post)
            return
        }
    }
    tag.push(post)
}

async function writeTags(tags: Tags) {
    await clearDir(join('public', 'tags'), 'tags')
    
    const index = await getIndex()
    const keys = Object.keys(tags)
    const text = 'Writing tag indicies'
    writeLine(`${text} (0 of ${keys.length})`)
    for (let i = keys.length - 1; i >= 0; i--) {
        replaceLine(`${text} (${i} of ${keys.length})`)
        let s = index.replaceAll('{{title}}', `Posts tagged "${keys[i]}"`)
        let body = '<div class="content">'
        body += top()
        body += '<div class="index">'
        const posts = tags[keys[i]];
        for (const post of posts) {
            body += postIndex(post)
        }
        body += '</div>' // index
        body += '</div>' // content
        s = s.replaceAll('{{body}}', body)
        await writeFile(join('public', 'tags', `${keys[i]}.html`), s)
    }
    replaceLine(`${text} (${keys.length} of ${keys.length})`, true)

}

export async function generateTags(posts: PostData[]) {
    // break up the posts by date and sort them
    const tags: Tags = {}

    const text = 'Sorting posts by tag'
    writeLine(`${text} (0 of ${posts.length})`)
    for (let i in posts) {
        const post = posts[i]
        replaceLine(`${text} (${i} of ${posts.length})`)
        const postTags = posts[i].tags
        for (const tag of postTags) {
            if (!tags[tag]) {
                tags[tag] = []
            }
            insertSorted(tags[tag], post)
        }
    }
    replaceLine(`${text} (${posts.length} of ${posts.length})`, true)

    await writeTags(tags)
}
