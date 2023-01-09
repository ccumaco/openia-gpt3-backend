const path = require('path');
const express = require('express');
const port = process.env.PORT || 5000;
const session = require('express-session');
const bodyParser = require('body-parser')
const mysql = require("mysql")
require("dotenv").config()
const app = express();
const cors = require('cors')
const {db} = require('./dbServer')

var corsOptions = {
	origin: ['https://leafy-malasada-939f12.netlify.app', 'http://127.0.0.1:5173', 'http://localhost:5173'],
	optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions))


// Enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
	secret: process.env.SECRET,
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

db.getConnection( ( err, connection ) => {
    if (err) throw (err)
    console.log ("DB connected successful: " + connection.threadId)
 })

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/openia', require('./routes/openaiRoutes'));
app.use('/openia', require('./routes/auth'));


const server = app.listen(port, () => {
    console.log(`Express is working on port ${port}`);
});
