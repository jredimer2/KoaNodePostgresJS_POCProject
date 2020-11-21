const { JsonWebTokenError } = require('jsonwebtoken');
const Router = require('koa-router')
const logger = require('logger')
const outfile = 'C:/Logs/outfile.txt'
const { Pool } = require('pg');
var jwt = require('jsonwebtoken')

const router = Router()

//pool.on('error', err => {
//    console.log('Pool Error: ', err);
//});

//async function WriteToDatabase(sql_json) {
//    try {
//        const response = await pool.query(sql_json.query);
//    } catch (err) {
//        console.log('Query Error:', sql_str, err);
//    }
//}


let users = [
    {
        "id": 1,
        "firstname": "John",
        "lastname": "Doe"

    },
    {
        "id": 2,
        "firstname": "Jane",
        "lastname": "Doef"
    }
]


async function WriteLog(msg) {
    await logger(outfile, msg);
}

router.get('/', async ctx => { ctx.status = 200 }
)

router.get('/users', async ctx => {
    ctx.status = 200
    console.log("Displaying all users")
    return { user: 'user1', firstname: 'John', lastname: 'Doe' }
}
)

router.get('/user/:id', async ctx => {
    ctx.status = 200
    ctx.body = {
        userid: ctx.params.id
    }

}
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