import { join } from 'path'
import { copyFile, readdir  } from 'fs/promises'
import { generateIndex, readPost, writePost, type PostData } from './post.ts'
import { replaceLine, writeLine } from './console.ts'
import { generateDates } from './dates.ts'
import { clearDir } from './util.ts'
import { generateTags } from './tags.ts'
import { ensureDir } from 'fs-extra'

async function latest(posts: PostData[]) {
    const latest = posts
}

function insertSortedPost(posts: PostData[], postData: PostData) {
    for (let i = 0; i < posts.length; i++) {
        if (postData.date < posts[i].date) {
            posts.splice(i, 0, postData)
            return
        }
    }
    posts.push(postData)
}

async function generate() {
    console.log('\n\nGenerating sewcrates.com...\n')

    console.log('Ensuring directories exist...')
    await ensureDir(join('public', 'dates'))
    await ensureDir(join('public', 'posts'))
    await ensureDir(join('public', 'tags'))

    const posts: PostData[] = []
    const files = await readdir('data')
    writeLine(`Reading posts (0 of $(files.length})`)
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        replaceLine(`Reading posts (${i} of ${files.length})`)
        const post = await readPost(join('data', file))
        if (post.type !== 'other' && !post.hidden && !post.locked) {
            insertSortedPost(posts, post)
        }
    }
    replaceLine(`Reading posts (${files.length} of ${files.length})`, true)

    await clearDir(join('public', 'posts'), 'post')

    writeLine(`Writing posts (0 of ${posts.length})`)
    let previous: PostData | undefined
    for (let i = 0; i < posts.length; i++) {
        replaceLine(`Writing posts (${i} of ${posts.length})`)
        writePost(posts[i], previous, posts[i + 1])
        previous = posts[i]
    }
    replaceLine(`Writing posts (${posts.length} of ${posts.length})`, true)

    await generateDates(posts)
    await generateTags(posts)
    await generateIndex(posts)

    const lastPost = posts[posts.length - 1]
    await copyFile(join('public', 'posts', `${lastPost.slug}.html`), join('public', 'index.html'))

    console.log('Finished.\n')
}

generate()