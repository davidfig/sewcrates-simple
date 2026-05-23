import serveStatic from 'serve-static'
import http from 'http'
import finalHandler from 'finalhandler'
import { writeLine } from './scripts/console.ts'

const PORT = 3000

async function start() {
    writeLine(`\nServing sewcrates.com on port ${PORT}...`)
    const serve = serveStatic('public/', { index: 'index.html' })
    const server = http.createServer((req, res) => {
        serve(req, res, finalHandler(req, res))
    })
    server.listen(PORT)
}

start()