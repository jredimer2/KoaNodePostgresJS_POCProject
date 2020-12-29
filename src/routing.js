const { JsonWebTokenError } = require('jsonwebtoken');
const Router = require('koa-router')
const { Pool } = require('pg');
var jwt = require('jsonwebtoken')

const router = Router()
const users = require('api/users/routes')
const merchants = require('api/merchants/routes')
const { createDiscountCode, createPriceRule } = require('./api/shopify/discount');


// protect your route with verifyToken
router.use('/users', verifyToken, users.routes())

router.use('/merchants', merchants.routes()
)

router.post('/posts', verifyToken, async ctx => {

    // jwt.verify(ctx.token, 'secretKey', (err, authData) => {
    //     if (err) {
    //         ctx.status = 403
    //     } else {
    //         ctx.body = {
    //             message: 'Post created',
    //             authData: authData
    //         }
    //     }
    // })


    ctx.body = {
        message: 'Post created',
        authData: ctx.user
    }
})

router.post('/login', async ctx => {
    // Mock user
    // adding merch_id with the token
    const user = {
        id: 1,
        username: 'joe',
        email: 'joe@gmail.com',
        merch_id: '0c6f48b7-7d4b-44ca-bf94-588c588ee30a'
    }

    let token
    try {
        token = jwt.sign({ user: user }, 'secretKey')
        ctx.status = 200,
        ctx.header = {"Access-Control-Allow-Origin": "*"},
        ctx.body = {
            token: token
        }
        console.log(token)
    } catch (error) {
        ctx.status = 403
        console.error(error);
    }
})


router.post('/users', async ctx => {
    ctx.status = 200
    console.log(ctx.request.body)
    WriteLog(ctx.request.body)

}
)

router.get('/dbtest', async ctx => {
    ctx.body = users
}
)


router.post('/price-rule', verifyToken, async ctx => {

    const user = ctx.user || {};
    const merch_id = user.merch_id;
    const price_rule_data = ctx.request.body;

    // find the record with matching merch_id and get the access token and shop from the db row
    const shop = "example.myshopify.com";
    const access_token = "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";

    let priceRule = await createPriceRule({shop, access_token, price_rule_data: price_rule_data});

    ctx.body = {
        message: 'Price Rule created',
        price_rule: priceRule.price_rule
    }
});


router.post('/discount', verifyToken, async ctx => {

    const user = ctx.user || {};
    const merch_id = user.merch_id;
    const { code, price_rule_id } = ctx.request.body;

    if(!(code && price_rule_id)) {
        ctx.body = { 
            message: 'code and price_rule_id are required'
        }
        return;
    }

    // find the record with matching merch_id and get the access token and shop from the db row
    const shop = "example.myshopify.com";
    const access_token = "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";

    let discount = await createDiscountCode({shop, access_token, price_rule_id: price_rule_id, code: code});

    ctx.body = {
        message: 'Discount created',
        discount: discount.discount_code
    }
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
async function verifyToken(ctx, next) {

    const bearerHeader = ctx.req.headers['authorization']
 
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        ctx.token = bearerToken
        
        try {
            // add the decoded token to the ctx object so that we can access it later
            let decoded = jwt.verify(ctx.token, 'secretKey');
            console.log('>>>>>>>>>>>>>> DBSERVER.routes : decoded.user = ', decoded.user)
            ctx.user = decoded.user;
            await next();
        } catch(error) {
            console.error(error);
            ctx.status = 403
        }
    } else {
        //Forbidden
        ctx.status = 403
    }
}

module.exports = router