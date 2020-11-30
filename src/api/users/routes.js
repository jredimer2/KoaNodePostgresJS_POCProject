const Router = require('koa-router')
const controller = require('./controller')

const router = new Router()

router.get('/', async ctx => { 
    const users = await controller.getAll()
    console.log('users = ', users)
    ctx.body = users.rows
}
)

module.exports = router