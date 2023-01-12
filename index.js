const path = require('path');
const express = require('express');
const port = process.env.PORT || 5000;
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const bodyParser = require('body-parser')
const mysql = require("mysql")
require("dotenv").config()
const app = express();
const morgan = require('morgan')
const cors = require('cors')
const {db} = require('./dbServer')

var corsOptions = {
	origin: ['https://incopy.netlify.app', 'http://127.0.0.1:5173', 'http://localhost:5173'],
	optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions))


// Enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'))
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
	resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

db.getConnection( ( err, connection ) => {
    if (err) throw (err)
    console.log ("DB connected successful: " + connection.threadId)
 })


//  sequelize conecct
//  try {
//     sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/openia', require('./routes/openaiRoutes'));
app.use('/openia', require('./routes/auth'));


const server = app.listen(port, () => {
    console.log(`Express is working on port ${port}`);
});
