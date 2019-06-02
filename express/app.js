const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');           // Log all HTTP requests to the console
const app = express();
const checkJwt = require('express-jwt');    // Check for access tokens automatically
const bcrypt = require('bcrypt');// Used for hashing passwords!
const path = require('path');
app.use(bodyParser.json());
app.use(morgan('combined'))
/****** Configuration *****/
app.use(bodyParser.json());                 // Make sure all json data is parsed
app.use(morgan('combined'));         // Log all requests to the console



const port = (process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, '../build')));

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://signe:signeskoett12!@user-bbfqf.mongodb.net/test?retryWrites=true&w=majority');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

if (!process.env.JWT_SECRET) {
    console.error('You need to put a secret in the JWT_SECRET env variable!');
    process.exit(1);
}



/****** Middleware *****/

// Additional headers to avoid triggering CORS security errors in the browser
// Read more: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

    // intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        // respond with 200
        console.log("Allowing OPTIONS");
        res.sendStatus(200);
    } else {
        // move on
        next();
    }
});



/****** Mongoose schema *****/
var userSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: Number
});


var Users = mongoose.model('Users', userSchema);




// Open paths that does not need login
let openPaths = [
    '/api/users/authenticate',
    '/api/users/onSignup'

];
// Validate the user using authentication
app.use(
    checkJwt({ secret: process.env.JWT_SECRET }).unless({ path : openPaths})
);
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: err.message });
    }
});



/****** Data *****/
// TODO: Move data to MongoDB using Mongoose
const data = [
    { id: 0, task: "Do laundry", done: false},
    { id: 1, task: "Clean bedroom", done: false},
    { id: 2, task: "Bake cake", done: false},
    { id: 3, task: "Pick up groceries", done: true},
    { id: 4, task: "Post letter", done: false}
];

// TODO: Remove clear text passwords from data!
// TODO: Move data to MongoDB using Mongoose!
// Mock user data for testing! Don't do this in production!



/****** Routes ******/
let tasksRouter = require('./tasks_router')(data);
app.use('/api/tasks', tasksRouter);

let usersRouter = require('./users_router')(Users);
app.use('/api/users', usersRouter);

/****** Error handling ******/
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({msg: 'Something broke!'})
});

/****** Listen ******/
app.listen(port, () => console.log(`API running on port ${port}!`));

