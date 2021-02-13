const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
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

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set Public folder
app.use(express.static(path.join(__dirname, 'public')))

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

// Get Single Article
app.get("/article/:id", (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        res.render('article', {
            article
        })
    })
})

// Add Route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    })
})

// Add submit POST Route
app.post('/articles/add', (req, res) => {
    let article = new Article()
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    article.save((error) => {
        if (error) {
            console.log(error)
            return
        } else {
            res.redirect('/')
        }
    })
})


// Load Edit Form
app.get("/article/edit/:id", (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        res.render('edit_article', {
            title: "Modifier l'article",
            article
        })
    })
})


// Update submit POST Route
app.post('/articles/edit/:id', (req, res) => {
    let article = {}
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    let query = { _id: req.params.id }

    Article.updateOne(query, article, (error) => {
        if (error) {
            console.log(error)
            return
        } else {
            res.redirect('/')
        }
    })
})


app.delete('/article/:id', (req, res) => {
    let query = { _id: req.params.id }

    Article.remove(query, function (err) {
        if (err) {
            console.log(err)
        }
        res.send('Success')
    })
})

// Start Server
app.listen(3000, () => {
    console.log('Server running on http://127.0.0.1:3000')
})