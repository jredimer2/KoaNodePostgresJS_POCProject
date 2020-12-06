const Router = require('koa-router')
const controller = require('./controller')

const router = new Router()


router.get('/', async ctx => {

    console.log({user: ctx.user});
    const merch_id = ctx.user.merch_id;
    console.log({merch_id})

    // get merch_id
    if (merch_id != undefined) {
        console.log("merch_id != undefined");
        if (ctx.request.query.user_id == undefined) {
            const associates = await controller.getByMerchId(merch_id)
            console.log(associates.rows)
            ctx.body = associates.rows

        } else {
            const associates = await controller.getByMerchIdUserId(merch_id, ctx.request.query.user_id)
            ctx.body = associates.rows
        }
    }
}
)


module.exports = router