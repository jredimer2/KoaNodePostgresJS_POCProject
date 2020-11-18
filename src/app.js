const Koa = require('koa')
const router = require('routing')
const ResponseTime = require('koa-response-time')
const Morgan = require('koa-morgan')
const bodyParser = require('koa-bodyparser')
const dbase = require('database')

const app = new Koa()
const port = 3001

app.use(ResponseTime())
app.use(Morgan('combined'))
app.use(bodyParser({ enableTypes: ['json', 'text'] }))
app.use(router.routes())
app.use(async ctx => {
    console.log("Parsed body = " + ctx.request.body)
})



exports.start = async function () {
    try {

        await dbase.start()
        console.log('Database connected')

        this.server = await app.listen(port)
        console.log(`Server listening on port ${port}`)

    } catch (error) {
        console.log(error)
    }
}

exports.close = async function () {
    await this.server.close()
    console.log('Server closed')
    await dbase.close()
    console.log('Database closed')
}