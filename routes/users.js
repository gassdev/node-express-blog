const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const { body, validationResult, check } = require('express-validator')

// Bring in User model
let User = require('../models/user')


// Register Form
router.get('/register', (req, res) => {
    res.render('register')
})


// Register Process
router.post('/register',
    // Express Validator Middleware
    body('name')
        .notEmpty()
        .withMessage("Nom requis"),
    body('email')
        .isEmail()
        .withMessage("Email invalide"),
    body('username')
        .notEmpty()
        .withMessage("Pseudo requis"),
    body('password')
        .notEmpty()
        .withMessage("Mot de Passe requis"),
    body('password2')
        .exists('password')
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Mots de passe ne correspondent pas"),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render('register', {
                title: 'Inscription',
                errors: errors.array(),
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                password2: req.body.password2,
            })
        } else {
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        console.log(err)
                    }
                    newUser.password = hash
                    newUser.save((err) => {
                        if (err) {
                            console.log(err)
                            return
                        } else {
                            req.flash('success', 'Inscription terminée, Connectez-vous')
                            res.redirect('/users/login')
                        }
                    })
                })
            })
        }
    }
)


router.get('/login', (req, res) => {
    res.render('login')
})


module.exports = router