import serveStatic from 'serve-static'
import http from 'http'
import finalHandler from 'finalhandler'
import { writeLine } from './scripts/console.ts'
import liveServer from 'live-server'

const PORT = 3000

async function start() {
    writeLine(`\nServing sewcrates.com on port ${PORT}...`)
    liveServer.start({
        port: PORT,
        root: 'public',
        open: true,
        file: 'index.html',
    })
    // const serve = serveStatic('public/', { index: 'index.html' })
    // const server = http.createServer((req, res) => {
    //     serve(req, res, finalHandler(req, res))
    // })
    // server.listen(PORT)
}

start()