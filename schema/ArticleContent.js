var mongoose = require('mongoose');

var ArticleContentSchema = new mongoose.Schema({
    article_id: { type: mongoose.Schema.Types.ObjectId, ref: 'article' },
    type: { type: Number },
    subtitle: { type: String },
    media_url: { type: String },
    content: { type: String },
    created_at: { type: Date },


    // contents: { type: Array, required: true },
    // author_id: { type: Schema.Types.ObjectId, ref: 'Author' },
    // created_at: { type: Date, default: Date.now() },
});

const ArticleContent = mongoose.model('ArticleContent', ArticleContentSchema, 'article_content');
module.exports = ArticleContent;