const express = require('express')
const router = express.Router()

const { body, validationResult } = require('express-validator')

// Bring in Article model
let Article = require('../models/article')
// Bring in User model
let User = require('../models/user')

// Add Route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_article', {
        title: 'Ajouter un article'
    })
})


// Add submit POST Route
router.post('/add',
    // Express Validator Middleware
    body('title')
        .notEmpty()
        .withMessage("Titre obligatoire"),
    // body('author')
    //     .notEmpty()
    //     .withMessage("Auteur obligatoire"),
    body('body')
        .notEmpty()
        .withMessage("Contenu obligatoire"),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render('add_article', {
                title: 'Ajouter un article',
                errors: errors.array(),
                article_title: req.body.title,
                author: req.user._id,
                body: req.body.body,
            })
        } else {
            let article = new Article()
            article.title = req.body.title
            article.author = req.user._id
            article.body = req.body.body

            article.save((error) => {
                if (error) {
                    console.log(error)
                    return
                } else {
                    req.flash("success", "article ajouté")
                    res.redirect('/')
                }
            })
        }

    }
)


// Load Edit Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        if (article.author != req.user._id) {
            req.flash('danger', "Forbidden")
            res.redirect('/')
        } else {
            res.render('edit_article', {
                title: "Modifier l'article",
                article
            })
        }
    })
})


// Update submit POST Route
router.post('/edit/:id', (req, res) => {
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
            req.flash("success", "article modifié")
            res.redirect('/')
        }
    })
})

// Delete article
router.delete('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send()
    }

    let query = { _id: req.params.id }

    Article.findById(req.params.id, function (err, article) {
        if (article.author != req.user._id) {
            res.status(500).send()
        } else {
            Article.deleteOne(query, function (err) {
                if (err) {
                    console.log(err)
                }
                res.send('Success')
            })
        }
    })
})


// Get Single Article
router.get("/:id", (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        User.findById(article.author, (err, user) => {
            res.render('article', {
                article,
                author: user.name
            })
        })
    })
})


// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        req.flash('danger', "Veuillez vous connecter d'abord")
        res.redirect('/users/login')
    }
}


module.exports = router