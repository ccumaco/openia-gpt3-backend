const { Sequelize } = require('sequelize');
require("dotenv").config()
const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT
let config;
if (process.env.ENV == 'dev') {
    config = {
      host: DB_HOST,
      dialect: 'mysql',
  }
} else {
  config = {
    host: DB_HOST,
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
  }
}

const database = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, config);



module.exports = { database }
