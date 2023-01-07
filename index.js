const path = require('path');
const express = require('express');
const port = process.env.PORT || 5000;
const session = require('express-session');
const bodyParser = require('body-parser')
const mysql = require("mysql")
require("dotenv").config()
const app = express();
const {db} = require('./dbServer')

// Enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

db.getConnection( (err, connection)=> {
    if (err) throw (err)
    console.log ("DB connected successful: " + connection.threadId)
 })

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/openia', require('./routes/openaiRoutes'));
app.use('/openia', require('./routes/login'));


app.get('/aa', (req, res) => {
	if (req.session.loggedin) {
		let name = req.session.name;

 		res.send('home', name);
	} else {
		res.send('enviando al login');
	}
});

const server = app.listen(port, () => {
    console.log(`Express is working on port ${port}`);
});
