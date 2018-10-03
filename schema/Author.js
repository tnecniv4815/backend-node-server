const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    display_name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
});

const Author = mongoose.model('Author', AuthorSchema);
module.exports = Author;