const { JsonWebTokenError } = require('jsonwebtoken');
const Router = require('koa-router')
const { Pool } = require('pg');
var jwt = require('jsonwebtoken')

const router = Router()
const users = require('api/users/routes')
const merchants = require('api/merchants/routes')


router.use('/users', users.routes()
)

router.use('/merchants', merchants.routes()
)

router.post('/posts', verifyToken, async ctx => {

    jwt.verify(ctx.token, 'secretKey', (err, authData) => {
        if (err) {
            ctx.status = 403
        } else {
            ctx.body = {
                message: 'Post created',
                authData: authData
            }
        }
    })
})

router.post('/login', async ctx => {
    // Mock user
    const user = {
        id: 1,
        username: 'joe',
        email: 'joe@gmail.com'
    }

    let token
    try {
        token = jwt.sign({ user: user }, 'secretKey')
        ctx.status = 200
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

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
async function verifyToken(ctx, next) {

    const bearerHeader = ctx.req.headers['authorization']
 
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        ctx.token = bearerToken
        next()
    } else {
        //Forbidden
        ctx.status = 403
    }
}

module.exports = router