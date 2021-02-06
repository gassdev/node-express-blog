const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

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

// Add Route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
})

// Start Server
app.listen(3000, () => {
    console.log('Server running on http://127.0.0.1:3000')
})