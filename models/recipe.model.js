const mongoose = require('mongoose')

const Schema = mongoose.Schema

const difficulty = ['EASY', 'MEDIUM', 'HARD']
const preparationTime = ['FAST', 'MODERATE', 'LONG']
const categories = [
  'Healthy',
  'Gluten Free',
  'Vegan',
  'Vegetarian',
  'High Calories',
  'Low Calories',
  'Lactose Free',
  'Paleo',
  'Keto',
  'High Protein',
  'Quick Meals',
  'High Fiber',
  'Italian',
  'Gourmet',
  'Dinner Parties',
  'French',
  'Special Occasions',
  'Comfort Food',
  'Japanese',
  'Indian',
]

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
    enum: difficulty,
    required: true,
    trim: true,
    minlength: 3,
  },
  preparationTime: {
    type: String,
    enum: preparationTime,
    required: true,
    trim: true,
    minlength: 3,
  },
  imageUrl: { type: String },
  videoUrl: { type: String },
  categories: {
    type: [{ type: String, enum: categories, required: true }],
    default: [],
  },
  opinions: [
    {
      text: { type: String, minlength: 3 },
      rating: { type: Number, min: 1, max: 5 },
      user: { type: String },
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
