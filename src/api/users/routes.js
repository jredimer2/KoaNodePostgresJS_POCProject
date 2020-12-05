const Router = require('koa-router')
const controller = require('./controller')

const router = new Router()


router.get('/', async ctx => {

    if (ctx.request.query.merch_id != undefined) {
        if (ctx.request.query.user_id == undefined) {
            const associates = await controller.getByMerchId(ctx.request.query.merch_id)
            ctx.body = associates.rows
        } else {
            const associates = await controller.getByMerchIdUserId(ctx.request.query.merch_id, ctx.request.query.user_id)
            ctx.body = associates.rows
        }
    }
}
)


module.exports = router