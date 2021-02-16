const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const { body, validationResult } = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')

dotenv.config()

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
let db = mongoose.connection

// Check connection
db.once('open', () => {
    console.log('DB CONNECTED')
})

// Check for DB errors
db.on('error', (error) => {
    console.log(error)
})


// Init app
const app = express()


// Bring in models
let Article = require('./models/article')

// Load view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set Public folder
app.use(express.static(path.join(__dirname, 'public')))


// Express Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});



// Home Route
app.get('/', (req, res) => {
    let article = Article.find({}, (error, articles) => {
        if (error) {
            console.log(error)
        }
        else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            })
        }
    })
})


// Route files
let articles = require('./routes/articles')
let users = require('./routes/users')
app.use('/articles', articles)
app.use('/users', users)

// Start Server
app.listen(3000, () => {
    console.log('Server running on http://127.0.0.1:3000')
})