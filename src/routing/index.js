const Router = require('koa-router')
const logger = require('logger')
const outfile = 'C:/Logs/outfile.txt'
const { Pool } = require('pg');

const router = Router()

const pool = new Pool({
    user: 'postgres',
    password: 'admin2;',
    host: 'localhost',
    port: 5432,
    database: 'testdb'
});

pool.on('error', err => {
    console.log('Pool Error: ', err);
});

async function WriteToDatabase(sql_json) {
    try {
        const response = await pool.query(sql_json.query);
    } catch (err) {
        console.log('Query Error:', sql_str, err);
    }
}

async function WriteLog(msg)
{
    await logger(outfile, msg);
}

router.get('/', async ctx => { ctx.status = 200 }
)

router.get('/users', async ctx => { 
    ctx.status = 200
    console.log("Displaying all users")
}
)

router.get('/user/:id', async ctx => { 
    ctx.status = 200 
    console.log("User Id = " + ctx.params.id)
}
)

router.post('/users', async ctx => { 
    ctx.status = 200
    console.log(ctx.request.body)
    WriteToDatabase(ctx.request.body)
    
}
)

module.exports = router