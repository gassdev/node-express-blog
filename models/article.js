let mongoose = require('mongoose')

// Article Schema
let articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: [true, "Nom de l'autheur requis"]
    },
    body: {
        type: String,
        required: [true, "Contenu de l'article requis"]
    }
})

let Article = module.exports = mongoose.model('Article', articleSchema)