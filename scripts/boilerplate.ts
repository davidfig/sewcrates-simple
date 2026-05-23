export function button(text: string, href: string, extraClass?: string): string {
    return `<a class="button${extraClass ?? ''}" href="${href}">${text}</a>`
}

export function top(): string {
    let s = '<div class="top">'
    s += button('sewcrates.com', '/')
    s += button('about', '/about.html')
    s += '</div>'

    return s
}