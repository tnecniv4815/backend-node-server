const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: { type: String },
    thumbnail: { type: String },
    posted_at: { type: Date },
    created_at: { type: Date },

    contents: [
        { type: Schema.Types.ObjectId, ref: 'ArticleContent' }
    ]


    // contents: { type: Array, required: true },
    // author_id: { type: Schema.Types.ObjectId, ref: 'Author' },
    // created_at: { type: Date, default: Date.now() },
});

const Article = mongoose.model('Article', ArticleSchema, 'article');
module.exports = Article;