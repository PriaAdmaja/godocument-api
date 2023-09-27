const { Pool } = require('pg')

const db = new Pool({
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD
})

module.exports = db