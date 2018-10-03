var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    contents: { type: Array, required: true },
    author_id: { type: Schema.Types.ObjectId, ref: 'Author' },
    created_at: { type: Date, default: Date.now() },
});

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;