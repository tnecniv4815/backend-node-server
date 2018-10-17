var mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ArticleContentSchema = new Schema({
    article_id: { type: Schema.Types.ObjectId, ref: 'Article' },
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