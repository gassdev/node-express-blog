const express = require('express')
const router = express.Router()

const { body, validationResult } = require('express-validator')

// Bring in Article model
let Article = require('../models/article')

// Add Route
router.get('/add', (req, res) => {
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
    body('author')
        .notEmpty()
        .withMessage("Auteur obligatoire"),
    body('body')
        .notEmpty()
        .withMessage("Contenu obligatoire"),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render('add_article', {
                title: 'Ajouter un article',
                errors: errors.array()
            })
        } else {
            let article = new Article()
            article.title = req.body.title
            article.author = req.body.author
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
router.get("/edit/:id", (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        res.render('edit_article', {
            title: "Modifier l'article",
            article
        })
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
    let query = { _id: req.params.id }

    Article.deleteOne(query, function (err) {
        if (err) {
            console.log(err)
        }
        res.send('Success')
    })
})


// Get Single Article
router.get("/:id", (req, res) => {
    Article.findById(req.params.id, (error, article) => {
        res.render('article', {
            article
        })
    })
})


module.exports = router