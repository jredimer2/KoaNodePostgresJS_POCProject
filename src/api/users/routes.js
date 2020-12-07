const Router = require('koa-router')
const controller = require('./controller')

const router = new Router()


router.get('/', async ctx => {

    const merch_id = ctx.user.merch_id;

    // get merch_id
    if ((ctx.user.merch_id != undefined) && (ctx.request.query.merch_id == ctx.user.merch_id)) {
        console.log("merch_id != undefined");
        if (ctx.request.query.user_id == undefined) {
            const associates = await controller.getByMerchId(ctx.request.query.merch_id)
            console.log(associates.rows)
            ctx.body = associates.rows

        } else {
            const associates = await controller.getByMerchIdUserId(ctx.request.query.merch_id, ctx.request.query.user_id)
            ctx.body = associates.rows
        }
    }
    else {
        ctx.body = {}
    }
}
)


module.exports = router