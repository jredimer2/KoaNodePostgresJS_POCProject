const Router = require('koa-router')
const controller = require('./controller')

const router = new Router()

router.get('/', async ctx => { 
    const merchants = await controller.getAll()
    ctx.body = merchants.rows
}
)

module.exports = router