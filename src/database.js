const { Pool } = require('pg')
const config = require('configuration')

exports.start = async function () {
    const host = config.get('PGHOST')
    const database = config.get('PGDATABASE')
    const port = config.get('PGPORT')
    const user = config.get('PGUSER')
    const password = config.get('PGPASSWORD')

    this.pool = new Pool({ user, host, database, password, host })
}
 

exports.close = async function () {
    await this.pool.end()
}

exports.query = async function (d, data) {
    return await this.pool.query(d, data)
}
