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

router.post('/posts', async ctx => {
    ctx.body = {
        message: 'Protected POST route'
    }
})

router.post('/login', async ctx =>  {
    // Mock user
    const user = {
        id: 1,
        username: 'joe',
        email: 'joe@gmail.com'
    }

    // Question: somehow ctx.body is not being sent from within this callback.
    jwt.sign({user: user}, 'secretkey', (err, token) => {
        ctx.body = {
            token: token
        }
    })
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

module.exports = router