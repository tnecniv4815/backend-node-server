const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { type: String },
    page_size: { type: Number }
});

const Book = mongoose.model('Book', BookSchema);
module.exports = Book;