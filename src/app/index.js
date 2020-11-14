const Koa = require('koa')
const router = require('routing')
const ResponseTime = require('koa-response-time')
const Morgan = require('koa-morgan')
const bodyParser = require('koa-bodyparser')

const app = new Koa()

app.use(ResponseTime())
app.use(Morgan('combined'))
app.use(bodyParser({ enableTypes: ['json', 'text'] }))
app.use(router.routes())
app.use(async ctx => {
    console.log("Parsed body = " + ctx.request.body)
})

exports.start = async function () {
    try {
        this.server = await app.listen(3000)
    } catch (error) {
        console.log(error)
    }
}