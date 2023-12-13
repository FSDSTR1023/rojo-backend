const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 3 },
        lastName: { type: String, required: true, trim: true, minlength: 3 },
        email: { type: String, required: true, trim: true, unique: true, lowercase: true },
        password: { type: String, required: true, trim: true, minlength: 3 },
        country: { type: String, required: true, trim: true, minlength: 3},
        description: {type: String, maxlength: 140},
        userName: { type: String, required: true, trim: true, minlength: 3 },
        imageUrl: { type: String },
        videoUrl: { type: String },
        recipes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }],
        favRecipes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        createdAt: { type: Date, default: Date.now }
    },
    {
        timestamps: true,
    });
    
    const User = mongoose.model('User', userSchema);
    
    module.exports = User;