const mongoose = require('mongoose')
const { DIFFICULTY, PREPARATION_TIME, CATEGORIES } = require('../constants/recipe.js')

const Schema = mongoose.Schema

const recipeSchema = new Schema({
  title: { type: String, required: true, trim: true, minlength: 3 },
  ingredients: { type: Array, required: true, trim: true, minlength: 3 },
  preparation: [
    {
      title: { type: String, required: true, trim: true, minlength: 3 },
      description: { type: String, required: true, trim: true, minlength: 3 },
    },
  ],
  difficulty: {
    type: String,
    enum: DIFFICULTY,
    required: true,
    trim: true,
    minlength: 3,
  },
  preparationTime: {
    type: String,
    enum: PREPARATION_TIME,
    required: true,
    trim: true,
    minlength: 3,
  },
  imageUrl: { type: String },
  videoUrl: { type: String },
  categories: {
    type: [{ type: String, enum: CATEGORIES, required: true }],
    default: [],
  },
  opinions: [
    {
      text: { type: String, minlength: 3 },
      rating: { type: Number, min: 1, max: 5 },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

module.exports = mongoose.model('Recipe', recipeSchema)
