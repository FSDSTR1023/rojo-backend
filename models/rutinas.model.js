const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rutinasSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 3 },
        lastName: { type: String, required: true, trim: true, minlength: 3 },
        email: { type: String, required: true, trim: true, minlength: 3, unique: true },
        password: { type: String, required: true, trim: true, minlength: 3 },
    },
    );

module.exports = mongoose.model('Rutinas', rutinasSchema);