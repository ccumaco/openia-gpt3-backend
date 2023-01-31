const mysql = require("mysql")
require("dotenv").config()
const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

let db;
if (process.env.ENV === 'dev') {
    db = mysql.createPool({
      connectionLimit: 100,
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      port: DB_PORT
   })
} else {
   db = mysql.createPool({
      database: DB_DATABASE,
      user: DB_USER,
      host: DB_HOST,
      password: DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
   })
}

module.exports = { db }