const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, trim: true },
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    passwordConfirm: { type: String, required: true },
    display_name: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;