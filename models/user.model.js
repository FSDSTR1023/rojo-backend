const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 3 },
        lastName: { type: String, required: true, trim: true, minlength: 3 },
        email: { type: String, required: true, trim: true, minlength: 3, unique: true },
        password: { type: String, required: true, trim: true, minlength: 3 },
    },
    {
        timestamps: true,
    }
    );

module.exports = mongoose.model('User', userSchema);