import { readFile, writeFile } from "fs/promises"
import * as chrono  from 'chrono-node'
import { join } from "path"
import { getIndex } from "./util.ts"
import { marked } from "marked"
import { top } from "./boilerplate.ts"
import { replaceLine, writeLine } from "./console.ts"

export type PostType = 'musing' | 'cast-of-horribles' | 'inner-tirade' | 'other'

export interface PostData {
    key: number
    title: string
    slug: string
    type: PostType
    date: Date
    created: Date
    modified?: Date
    location: string
    hidden: boolean
    no_front: boolean
    locked: boolean
    width?: number
    height?: number
    tags: string[]

    text: string
}

export async function readPost(filename: string): Promise<PostData> {
    const text = await readFile(filename, { encoding: 'utf8'})

    const split = text.split('---')

    // read yaml block
    const data: PostData = {
        key: -1,
        title: '',
        slug: '',
        type: 'musing',
        date: new Date(),
        created: new Date(),
        modified: undefined,
        location: 'Mercer Island, WA',
        hidden: false,
        no_front: false, 
        locked: false, 
        width: undefined,
        height: undefined,
        tags: [],
        text: ''
    }
    const yaml = split[1]
    const yamlLines = yaml.split('\n')
    for (const line of yamlLines) {
        const trimmed = line.trim()
        if (trimmed === '') continue
        const split = trimmed.split(':')
        const entry = split[0].trim()
        let value = split[1] ? split[1].trim() : ''

        if (entry === 'key') {
            data.key = parseInt(value)
        } else if (entry === 'title') {
            if (value[0] === "'" && value[value.length - 1] === "'") {
                data.title = value.substring(1, value.length - 1)
            } else {
                data.title = value
            }
        } else if (entry === 'slug') {
            data.slug = value
        } else if (entry === 'type') {
            if (value.includes('"')) {
                value = value.replaceAll('"', '')
            }
            if (value === 'musing' || value === 'cast-of-horribles' || value === 'inner-tirade' || value === 'other') {
                data.type = value
            } else {
                throw new Error(`Unknown type ${value}`)
            }
        } else if (entry === 'date' && value && value !== 'null') {
            const date = chrono.parseDate(value)
            if (!date) throw new Error(`Unable to parse date: ${value}`)
            data.date = date
        } else if (entry === 'created') {
            const date = chrono.parseDate(value)
            if (!date) throw new Error(`Unable to parse created: ${value}`)
            data.created = date
        } else if (entry === 'modified') {
            if (value && value !== 'null') {
                const date = chrono.parseDate(value)
                if (!date) throw new Error(`Unable to parse modified: ${value}`)
                data.modified = date
            }
        } else if (entry === 'location') {
            data.location = value
        } else if (entry === 'hidden') {
            data.hidden = value === 'true'
        } else if (entry === 'no_front') {
            data.no_front = value === 'true'
        } else if (entry === 'locked') {
            data.locked = value === 'true'
        } else if (entry === 'width' && value && value !== 'null') {
            data.width = parseInt(value)
        } else if (entry === 'height' && value && value !== 'null') {
            data.height = parseInt(value)
        } else if (entry === 'tags') {
            let type = data.type === 'cast-of-horribles' ? 'Cast of Horribles' : data.type === 'inner-tirade' ? 'Inner Tirade' : 'Musing'
            const tagsWithCommas = type + ',' + value.substring(1, value.length - 1)
            let tags = tagsWithCommas.split(',')
            data.tags = [...new Set(tags.flatMap(tag => {
                const result = tag.trim()
                if (result && result !== '""') {
                    return [result]
                }
                return []
            }))]
        }
    }
    data.text = split[2].trim()

    return data
}

export async function writePost(post: PostData, previous: PostData | undefined, next: PostData | undefined) {
    let index = await getIndex()
    index = index.replace('{{title}}', post.title)
    let body = '<div class="content">'
    body += top()
    if (post.type === 'cast-of-horribles' || post.type === 'inner-tirade') {
        body += `<div class="doodle"><img class="doodle" src="/doodles/${post.key}.png" /></div>`
    }
    body += `<div class="post-title"><a href="/posts">${post.title}</a></div>`
    const format = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', })
    body += `<div class="post-date"><a href="/dates/${post.date.getFullYear()}.html">${format.format(post.date)}</a></div>`
    body += `<div class="post-location">${post.location}</div>`
    if (post.tags.length) {
        body += '<div class="tags">'
        for (const tag of post.tags) {
            body += `<a href="/tags/${tag}.html"><div class="tag">${tag}</div></a>`
        }        
        body += '</div>'
    }
    body += `<div class="post-text">${marked(post.text)}</div>`
    body += '<div class="next-previous">'
    if (previous) {
        body += `<a href="/posts/${previous.slug}.html"><div class="previous">\< ${previous.title}</div></a>`
    } else {
        body += '<div></div>'
    }
    if (next) {
        body += `<a href="/posts/${next.slug}.html"><div class="next">${next.title} \></div></a>`
    }

    body += '</div>'
    index = index.replace('{{body}}', body)
    await writeFile(join('public', 'posts', `${post.slug}.html`), index)
}

export function postIndex(post: PostData): string {
    let s = `<div class="index-entry"><a href="/posts/${post.slug}.html">`
    s += '<div class="thumbnail">'
    if (post.type === 'cast-of-horribles' || post.type === 'inner-tirade') {
        s += `<img src="/doodles/${post.key}.png" />`
    }
    s += '</div>'
    s += `<div class="title">${post.title}</div>`
    const format = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', })
    s += `<div class="date">${format.format(post.date)}</div>`
    s += '</a></div>'
    return s
}

export async function generateIndex(posts: PostData[]) {
    let s = ''
    let index = await getIndex()
    index = index.replace('{{title}}', 'All posts')
    let body = '<div class="content">'
    body += top()
    body += '<div class="index-title">All Posts</div>'
    const text = 'Writing all post index'
    writeLine(`${text} (0 of ${posts.length})`)
    for (let i = posts.length - 1; i >= 0; i--) {
        replaceLine(`${text} (${i} of ${posts.length})`)
        body += postIndex(posts[i])
    }
    replaceLine(`${text} (${posts.length} of ${posts.length})`, true)
    body += '</div>'
    index = index.replace('{{body}}', body)
    await writeFile(join('public', 'posts', 'index.html'), index)
}