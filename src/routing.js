const { JsonWebTokenError } = require('jsonwebtoken');
const Router = require('koa-router')
const { Pool } = require('pg');
var jwt = require('jsonwebtoken')

const router = Router()
const users = require('api/users/routes')
const merchants = require('api/merchants/routes')
const { createDiscountCode, createPriceRule } = require('./api/shopify/discount');
const { getCollectionsList} = require('./api/shopify/product');
const axios = require('axios');

const ACCESS_TOKEN = "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";

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
        merch_id: '783792e5-c68b-4337-aab6-71f5d343bb10'
    }

    let token
    try {
        token = jwt.sign({ user: user }, 'secretKey')
        ctx.status = 200,
        ctx.header = {"Access-Control-Allow-Origin": "*"},
        ctx.body = {
            token: token
        }
        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<< /login Returned Token =',token)
    } catch (error) {
        ctx.status = 403
        console.error(error);
    }
})


router.post('/users', async ctx => {
    ctx.status = 200
    console.log('POST /users ctx.request.body = ', ctx.request.body)
    //WriteLog(ctx.request.body)

}
)

router.get('/test', async ctx => {
    console.log('>> /test')

    const shop = "jredstore1.myshopify.com";
    const access_token = ACCESS_TOKEN
    const order_id = "2980033167514"

    var config = {
        method: 'get',
        //url: `https://${shop}/admin/api/2021-01/orders.json?status=any`,
        url: `https://${shop}/admin/api/2021-01/orders/${order_id}.json`,
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': access_token
        },
        data: null
    };

    let data = await axios(config).then(response => response.data);

    console.log('>>>>> data =', data)

    console.log('>>>>> Displaying order field =', data.order)
    //ctx.body = data.order.discount_applications
    ctx.body = data.order
}
)


router.post('/price-rule', verifyToken, async ctx => {

    const user = ctx.user || {};
    const merch_id = user.merch_id;
    const price_rule_data = ctx.request.body;

    console.log('/price-rule   TP-1')

    // find the record with matching merch_id and get the access token and shop from the db row
    const shop = "jredstore1.myshopify.com";
    //const access_token = "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";
    const access_token = ACCESS_TOKEN;
        
    console.log('/price-rule   TP-2')

    let priceRule = await createPriceRule({shop, access_token, price_rule_data: price_rule_data});
    console.log('/price-rule   TP-3')

    ctx.body = {
        message: 'Price Rule created',
        price_rule: priceRule.price_rule
    }
    console.log('/price-rule   TP-4')
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
    const shop = "jredstore1.myshopify.com";
    const access_token = ACCESS_TOKEN;

    let discount = await createDiscountCode({shop, access_token, price_rule_id: price_rule_id, code: code});

    ctx.body = {
        message: 'Discount created',
        discount: discount.discount_code
    }
});


router.get('/collections', async ctx => {
    const user = ctx.user || {};
    const merch_id = user.merch_id;
    const { code, price_rule_id } = ctx.request.body;

    // find the record with matching merch_id and get the access token and shop from the db row
    const shop = "jredstore1.myshopify.com";
    const access_token = ACCESS_TOKEN;

    let collections = await getCollectionsList({shop, access_token});

    ctx.body = collections
    /*
    ctx.body = {
        message: 'Collections List',
        discount: collections.data
    }
    */
}
)


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
            console.log('>>>>>>>>>>>>>> verifyToken successful. decoded.user = ', decoded.user)
            ctx.user = decoded.user;
            await next();
        } catch(error) {
            console.error(error);
            ctx.status = 400
        }
    } else {
        //Forbidden
        ctx.status = 400
    }
}

module.exports = router