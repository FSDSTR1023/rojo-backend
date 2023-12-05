const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recetasSchema = new Schema(
    {
        nombre: { type: String, required: true, trim: true, minlength: 3 },
        ingredientes: { type: Array, required: true, trim: true, minlength: 3 },
        preparacion: { type: String, required: true, trim: true, minlength: 3 },
    });

module.exports = mongoose.model('Recetas', recetasSchema);